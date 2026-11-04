export type InvoiceStatus =
  | "open"
  | "pending"
  | "paid"
  | "underpaid"
  | "refunded"
  | "void";

export interface InvoiceItem {
  id: string;
  position: number;
  description: string;
  quantityValue: bigint;
  quantityScale: number;
  unitPriceMinor: bigint;
  lineTotalMinor: bigint;
}

export interface Invoice {
  id: string;
  ownerId: string;
  publicSlug: string;
  invoiceNumber: string;
  clientName: string;
  issuedAt: string;
  dueAt: string;
  notes: string | null;
  currency: "USDC";
  totalMinor: bigint;
  recipientNearAccount: string;
  status: InvoiceStatus;
  items: readonly InvoiceItem[];
}
