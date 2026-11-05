"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

export function CopyLink({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="copy-field">
      <input aria-label="Public invoice link" readOnly value={value} />
      <Button onPress={() => void copy()}>{copied ? "Copied" : "Copy link"}</Button>
    </div>
  );
}
