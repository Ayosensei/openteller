import "server-only";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/lib/db/server";
import { invoiceItems, invoices } from "@/lib/db/schema";
import type { Invoice, InvoiceItem, InvoiceStatus } from "@/lib/domain/invoice";

import type { InvoiceListItem, InvoiceRepository } from "./repository";

export class DrizzleInvoiceRepository implements InvoiceRepository {
  async listOwned(ownerId: string): Promise<readonly InvoiceListItem[]> {
    const rows = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        clientName: invoices.clientName,
        dueAt: invoices.dueAt,
        totalMinor: invoices.totalMinor,
        currency: invoices.currency,
        status: invoices.status,
      })
      .from(invoices)
      .where(eq(invoices.ownerId, ownerId))
      .orderBy(desc(invoices.issuedAt), desc(invoices.createdAt));

    return rows.map((row) => ({
      ...row,
      currency: "USDC" as const,
      status: row.status as InvoiceStatus,
    }));
  }

  async findOwnedById(ownerId: string, invoiceId: string): Promise<Invoice | null> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(and(eq(invoices.id, invoiceId), eq(invoices.ownerId, ownerId)))
      .limit(1);

    if (!invoice) return null;

    return this.hydrateInvoice(invoice);
  }

  async findPublicBySlug(publicSlug: string): Promise<Invoice | null> {
    const [invoice] = await db
      .select()
      .from(invoices)
      .where(eq(invoices.publicSlug, publicSlug))
      .limit(1);

    if (!invoice) return null;

    return this.hydrateInvoice(invoice);
  }

  private async hydrateInvoice(invoice: typeof invoices.$inferSelect): Promise<Invoice> {
    const invoiceId = invoice.id;

    const itemRows = await db
      .select()
      .from(invoiceItems)
      .where(eq(invoiceItems.invoiceId, invoiceId))
      .orderBy(invoiceItems.position);

    const items: InvoiceItem[] = itemRows.map((item) => ({
      id: item.id,
      position: item.position,
      description: item.description,
      quantityValue: item.quantityValue,
      quantityScale: item.quantityScale,
      unitPriceMinor: item.unitPriceMinor,
      lineTotalMinor: item.lineTotalMinor,
    }));

    return {
      id: invoice.id,
      ownerId: invoice.ownerId,
      publicSlug: invoice.publicSlug,
      invoiceNumber: invoice.invoiceNumber,
      clientName: invoice.clientName,
      issuedAt: invoice.issuedAt,
      dueAt: invoice.dueAt,
      notes: invoice.notes,
      currency: "USDC",
      totalMinor: invoice.totalMinor,
      recipientNearAccount: invoice.recipientNearAccount,
      status: invoice.status as InvoiceStatus,
      items,
    };
  }
}

export const invoiceRepository = new DrizzleInvoiceRepository();
