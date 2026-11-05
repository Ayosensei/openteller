import Link from "next/link";

import { TriangleIcon } from "@/components/icons";
import { InvoiceList } from "@/components/invoice/invoice-list";
import { getCurrentAccount } from "@/lib/auth/current-account";
import { invoiceRepository } from "@/lib/invoices/drizzle-repository";
import { formatUsdcMinor } from "@/lib/money/invoice";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const account = await getCurrentAccount();
  const rows = await invoiceRepository.listOwned(account.id);

  return (
    <main className="app-content">
      <header className="page-header">
        <div>
          <p className="section-label"><TriangleIcon />INVOICES</p>
          <h1>Invoices</h1>
        </div>
        <Link className="button" href="/invoices/new">New invoice</Link>
      </header>

      {rows.length === 0 ? (
        <section className="empty-state">
          <h2>No invoices yet.</h2>
          <p>Create your first invoice to get a shareable payment link.</p>
          <Link className="button" href="/invoices/new">New invoice</Link>
        </section>
      ) : (
        <InvoiceList
          rows={rows.map((invoice) => ({
            id: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientName,
            dueAt: invoice.dueAt,
            status: invoice.status,
            amount: `${formatUsdcMinor(invoice.totalMinor)} USDC`,
          }))}
        />
      )}
    </main>
  );
}
