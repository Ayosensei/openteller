import Link from "next/link";
import type { ReactNode } from "react";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { getCurrentAccount } from "@/lib/auth/current-account";

export const dynamic = "force-dynamic";

export default async function FreelancerLayout({ children }: { children: ReactNode }) {
  const account = await getCurrentAccount();

  return (
    <div className="app-shell">
      <header className="app-bar">
        <Link className="wordmark" href="/invoices">openteller</Link>
        <nav className="app-nav" aria-label="Freelancer navigation">
          <Link href="/invoices">Invoices</Link>
          <Link href="/exports">Exports</Link>
        </nav>
        <div className="account-controls">
          <span className="identity-chip" title={account.identity}>{account.identity}</span>
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
