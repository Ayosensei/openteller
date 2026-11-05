import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { TriangleIcon } from "@/components/icons";
import { CopyLink } from "@/components/invoice/copy-link";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { db } from "@/lib/db/server";
import { invoiceEvents } from "@/lib/db/schema";
import { invoiceRepository } from "@/lib/invoices/drizzle-repository";
import { formatUsdcMinor } from "@/lib/money/invoice";

export const dynamic = "force-dynamic";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, account] = await Promise.all([params, getCurrentAccount()]);
  const invoice = await invoiceRepository.findOwnedById(account.id, id);
  if (!invoice) notFound();

  const events = await db
    .select()
    .from(invoiceEvents)
    .where(eq(invoiceEvents.invoiceId, invoice.id))
    .orderBy(invoiceEvents.occurredAt);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL is required");
  const publicUrl = `${appUrl.replace(/\/$/, "")}/i/${invoice.publicSlug}`;

  return (
    <main className="app-content">
      <header className="page-header">
        <div>
          <p className="section-label"><TriangleIcon />{invoice.invoiceNumber}</p>
          <h1>{invoice.clientName}</h1>
        </div>
        <span className={`status-pill status-pill--${invoice.status}`}>{invoice.status}</span>
      </header>

      <section className="invoice-proof-slab" aria-label="Payment proof status">
        <div>
          <span className="proof-label">INVOICE AMOUNT</span>
          <strong className="proof-amount">{formatUsdcMinor(invoice.totalMinor)}</strong>
          <span className="proof-unit">USDC</span>
        </div>
        <div className="proof-rule" aria-hidden="true" />
        <div>
          <span className="proof-label">PAYMENT STATUS</span>
          <strong className="proof-empty">No payment yet</strong>
          <span className="proof-unit">No received amount or transaction evidence recorded.</span>
        </div>
      </section>

      <section className="share-section" aria-labelledby="share-title">
        <h2 id="share-title">Public invoice link</h2>
        <CopyLink value={publicUrl} />
      </section>

      <div className="invoice-detail-grid">
        <section className="event-tape" aria-labelledby="trail-title">
          <p className="section-label"><TriangleIcon />PAYMENT TRAIL</p>
          <h2 id="trail-title">Recorded events</h2>
          <ol>
            {events.map((event) => (
              <li key={event.id}>
                <span>Invoice created</span>
                <time dateTime={event.occurredAt.toISOString()}>{event.occurredAt.toISOString()}</time>
              </li>
            ))}
          </ol>
        </section>

        <aside className="invoice-summary invoice-summary--detail">
          <p className="section-label">INVOICE SUMMARY</p>
          <dl>
            {invoice.items.map((item) => (
              <div key={item.id}><dt>{item.description}</dt><dd>{formatUsdcMinor(item.lineTotalMinor)} USDC</dd></div>
            ))}
            <div><dt>Total</dt><dd>{formatUsdcMinor(invoice.totalMinor)} USDC</dd></div>
            <div><dt>Due</dt><dd><time dateTime={invoice.dueAt}>{invoice.dueAt}</time></dd></div>
            <div><dt>Receives to</dt><dd>{invoice.recipientNearAccount}</dd></div>
          </dl>
        </aside>
      </div>
    </main>
  );
}
