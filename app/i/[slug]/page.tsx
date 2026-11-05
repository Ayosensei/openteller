import { notFound } from "next/navigation";

import { TriangleIcon } from "@/components/icons";
import { invoiceRepository } from "@/lib/invoices/drizzle-repository";
import { formatUsdcMinor } from "@/lib/money/invoice";

export const dynamic = "force-dynamic";

export default async function PublicInvoicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invoice = await invoiceRepository.findPublicBySlug(slug);
  if (!invoice || invoice.status === "void") notFound();

  return (
    <main className="client-shell">
      <header className="client-bar"><span className="wordmark">openteller</span></header>
      <section className="client-invoice">
        <p className="section-label"><TriangleIcon />INVOICE {invoice.invoiceNumber}</p>
        <h1>{invoice.clientName}</h1>
        <p className="client-lead">Invoice payable to {invoice.recipientNearAccount}.</p>

        <div className="public-invoice-card">
          <dl>
            <div><dt>Issued</dt><dd><time dateTime={invoice.issuedAt}>{invoice.issuedAt}</time></dd></div>
            <div><dt>Due</dt><dd><time dateTime={invoice.dueAt}>{invoice.dueAt}</time></dd></div>
            {invoice.items.map((item) => (
              <div key={item.id}><dt>{item.description}</dt><dd>{formatUsdcMinor(item.lineTotalMinor)} USDC</dd></div>
            ))}
            <div className="public-invoice-total"><dt>Total</dt><dd>{formatUsdcMinor(invoice.totalMinor)} USDC</dd></div>
          </dl>
        </div>

        <section className="payment-notice" role="status">
          <h2>Payment is not enabled yet.</h2>
          <p>This invoice is real and stored, but no payment instructions or transaction proof have been issued.</p>
        </section>
      </section>
    </main>
  );
}
