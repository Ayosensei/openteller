"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

export function SignOutButton() {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function signOut() {
    setPending(true);
    const result = await authClient.signOut();
    if (!result.error) {
      router.push("/");
      router.refresh();
    }
    else setPending(false);
  }

  return (
    <Button variant="ghost" isDisabled={pending} isPending={pending} onPress={() => void signOut()}>
      Sign out
    </Button>
  );
}
