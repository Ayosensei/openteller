import "server-only";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { db } from "@/lib/db/server";
import { accounts } from "@/lib/db/schema";

import { auth } from "./server";

export interface CurrentAccount {
  id: string;
  authSubject: string;
  nearAccountId: string | null;
  identity: string;
}

export async function getCurrentAccount(): Promise<CurrentAccount> {
  const { data: session } = await auth.getSession();

  if (!session?.user) redirect("/sign-in");

  const authSubject = session.user.id;
  const [created] = await db
    .insert(accounts)
    .values({ authSubject })
    .onConflictDoNothing({ target: accounts.authSubject })
    .returning();

  const account =
    created ??
    (await db.query.accounts.findFirst({
      where: eq(accounts.authSubject, authSubject),
    }));

  if (!account) throw new Error("Unable to initialize the authenticated account");

  return {
    id: account.id,
    authSubject,
    nearAccountId: account.nearAccountId,
    identity: session.user.email ?? session.user.name ?? "Signed in",
  };
}
