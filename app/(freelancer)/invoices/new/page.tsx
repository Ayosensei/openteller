import Link from "next/link";
import { randomUUID } from "node:crypto";

import { TriangleIcon } from "@/components/icons";
import { InvoiceForm } from "@/components/invoice/invoice-form";
import { getCurrentAccount } from "@/lib/auth/current-account";

export const dynamic = "force-dynamic";

export default async function NewInvoicePage() {
  const account = await getCurrentAccount();

  return (
    <main className="app-content">
      <header className="page-header">
        <div>
          <p className="section-label"><TriangleIcon />NEW INVOICE</p>
          <h1>Create an invoice</h1>
        </div>
        <Link className="text-link" href="/invoices">Invoices</Link>
      </header>

      {!account.nearAccountId ? (
        <section className="configuration-blocker" role="status">
          <h2>Receiving account required.</h2>
          <p>A verified NEAR receiving account must be configured before invoices can be created.</p>
        </section>
      ) : (
        <InvoiceForm
          receivingAccount={account.nearAccountId}
          submissionKey={randomUUID()}
        />
      )}
    </main>
  );
}
