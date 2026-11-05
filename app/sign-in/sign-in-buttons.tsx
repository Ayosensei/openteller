"use client";

import { useState } from "react";

import { SpinnerIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";

type Provider = "google" | "github";

export function SignInButtons({ returnTo }: { returnTo: string }) {
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: Provider) {
    setError(null);
    setPendingProvider(provider);

    const result = await authClient.signIn.social({
      provider,
      callbackURL: returnTo,
    });

    if (result.error) {
      setError("We couldn't sign you in. Try again.");
      setPendingProvider(null);
    }
  }

  return (
    <div className="sign-in-actions">
      {error ? <p className="error-banner" role="alert">{error}</p> : null}
      <Button
        variant="secondary"
        isDisabled={pendingProvider !== null}
        isPending={pendingProvider === "google"}
        onPress={() => void signIn("google")}
      >
        {pendingProvider === "google" ? <SpinnerIcon size={16} className="spinner" /> : null}
        Continue with Google
      </Button>
      <Button
        variant="secondary"
        isDisabled={pendingProvider !== null}
        isPending={pendingProvider === "github"}
        onPress={() => void signIn("github")}
      >
        {pendingProvider === "github" ? <SpinnerIcon size={16} className="spinner" /> : null}
        Continue with GitHub
      </Button>
    </div>
  );
}
