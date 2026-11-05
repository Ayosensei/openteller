import type { Invoice, InvoiceStatus } from "@/lib/domain/invoice";

export interface InvoiceListItem {
  id: string;
  invoiceNumber: string;
  clientName: string;
  dueAt: string;
  totalMinor: bigint;
  currency: "USDC";
  status: InvoiceStatus;
}

export interface InvoiceRepository {
  findOwnedById(ownerId: string, invoiceId: string): Promise<Invoice | null>;
  findPublicBySlug(publicSlug: string): Promise<Invoice | null>;
  listOwned(ownerId: string): Promise<readonly InvoiceListItem[]>;
}
