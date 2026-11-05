"use server";

import { randomBytes } from "node:crypto";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentAccount } from "@/lib/auth/current-account";
import { db } from "@/lib/db/server";
import { invoiceEvents, invoiceItems, invoices } from "@/lib/db/schema";
import {
  calculateLineMinor,
  InvoiceValueError,
  MAX_INVOICE_MINOR,
  parseQuantity,
  parseUsdcMinor,
} from "@/lib/money/invoice";

export interface InvoiceFormState {
  errors: Record<string, string>;
  message?: string;
}

export const initialInvoiceFormState: InvoiceFormState = { errors: {} };

function readString(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
}

export async function createInvoice(
  _previous: InvoiceFormState,
  formData: FormData,
): Promise<InvoiceFormState> {
  const account = await getCurrentAccount();
  const errors: Record<string, string> = {};
  const clientName = readString(formData, "clientName");
  const issuedAt = readString(formData, "issuedAt");
  const dueAt = readString(formData, "dueAt");
  const notes = readString(formData, "notes");
  const submissionKey = readString(formData, "submissionKey");
  const itemCount = Number(readString(formData, "itemCount"));

  if (!clientName || clientName.length > 120) errors.clientName = "Enter a client name up to 120 characters.";
  if (!isIsoDate(issuedAt)) errors.issuedAt = "Enter a valid issue date.";
  if (!isIsoDate(dueAt)) errors.dueAt = "Enter a valid due date.";
  if (isIsoDate(issuedAt) && isIsoDate(dueAt) && issuedAt > dueAt) errors.dueAt = "Due date cannot be before the issue date.";
  if (notes.length > 500) errors.notes = "Notes cannot exceed 500 characters.";
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionKey)) {
    errors.form = "Refresh the page and try again.";
  }
  if (!Number.isInteger(itemCount) || itemCount < 1 || itemCount > 20) errors.form = "Include between 1 and 20 line items.";
  if (!account.nearAccountId) errors.form = "A verified receiving account is required.";

  const parsedItems: Array<{
    position: number;
    description: string;
    quantityValue: bigint;
    quantityScale: number;
    unitPriceMinor: bigint;
    lineTotalMinor: bigint;
  }> = [];
  let totalMinor = 0n;

  if (Number.isInteger(itemCount) && itemCount >= 1 && itemCount <= 20) {
    for (let index = 0; index < itemCount; index += 1) {
      const description = readString(formData, `items.${index}.description`);
      const quantityRaw = readString(formData, `items.${index}.quantity`);
      const priceRaw = readString(formData, `items.${index}.unitPrice`);

      if (!description || description.length > 200) {
        errors[`items.${index}.description`] = "Enter a description up to 200 characters.";
      }

      try {
        const quantity = parseQuantity(quantityRaw);
        const unitPriceMinor = parseUsdcMinor(priceRaw);
        const lineTotalMinor = calculateLineMinor(quantity.value, quantity.scale, unitPriceMinor);
        totalMinor += lineTotalMinor;
        parsedItems.push({
          position: index,
          description,
          quantityValue: quantity.value,
          quantityScale: quantity.scale,
          unitPriceMinor,
          lineTotalMinor,
        });
      } catch (error) {
        const message = error instanceof InvoiceValueError ? error.message : "Enter a valid line item.";
        errors[`items.${index}.amount`] = message;
      }
    }
  }

  if (totalMinor <= 0n) errors.form = errors.form ?? "Invoice total must be greater than zero.";
  if (totalMinor > MAX_INVOICE_MINOR) errors.form = "Invoice total cannot exceed 1,000,000 USDC.";

  if (Object.keys(errors).length > 0) {
    return { errors, message: "Check the highlighted fields and try again." };
  }

  const invoiceNumber = `OT-${new Date().getUTCFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`;
  const publicSlug = randomBytes(24).toString("base64url");

  const invoiceId = await db.transaction(async (transaction) => {
    const [created] = await transaction
      .insert(invoices)
      .values({
        ownerId: account.id,
        submissionKey,
        publicSlug,
        invoiceNumber,
        clientName,
        issuedAt,
        dueAt,
        notes: notes || null,
        totalMinor,
        recipientNearAccount: account.nearAccountId!,
      })
      .onConflictDoNothing({
        target: [invoices.ownerId, invoices.submissionKey],
      })
      .returning({ id: invoices.id });

    if (!created) {
      const existing = await transaction.query.invoices.findFirst({
        columns: { id: true },
        where: and(
          eq(invoices.ownerId, account.id),
          eq(invoices.submissionKey, submissionKey),
        ),
      });
      if (!existing) throw new Error("Unable to resolve invoice submission");
      return existing.id;
    }

    await transaction.insert(invoiceItems).values(
      parsedItems.map((item) => ({ ...item, invoiceId: created.id })),
    );
    await transaction.insert(invoiceEvents).values({
      invoiceId: created.id,
      eventType: "invoice_created",
      occurredAt: new Date(),
      source: "app",
      sourceEventKey: `invoice-created:${created.id}`,
      metadata: {},
    });

    return created.id;
  });

  revalidatePath("/invoices");
  redirect(`/invoices/${invoiceId}`);
}
