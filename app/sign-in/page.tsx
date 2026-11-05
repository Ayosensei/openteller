import { redirect } from "next/navigation";

import { TriangleIcon } from "@/components/icons";
import { auth } from "@/lib/auth/server";
import { safeReturnTo } from "@/lib/auth/return-to";

import { SignInButtons } from "./sign-in-buttons";

export const dynamic = "force-dynamic";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const [{ data: session }, params] = await Promise.all([
    auth.getSession(),
    searchParams,
  ]);
  const returnTo = safeReturnTo(params.returnTo);

  if (session?.user) redirect(returnTo);

  return (
    <main className="auth-shell">
      <header className="landing-bar">
        <span className="wordmark">openteller</span>
      </header>
      <section className="sign-in-panel" aria-labelledby="sign-in-title">
        <p className="section-label"><TriangleIcon />FREELANCER ACCESS</p>
        <h1 id="sign-in-title">Sign in to manage invoices.</h1>
        <p className="sign-in-lead">Use Google or GitHub to continue.</p>
        <SignInButtons returnTo={returnTo} />
        <p className="sign-in-note">Clients do not need an account to pay an invoice.</p>
      </section>
    </main>
  );
}
