export function safeReturnTo(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/invoices";
  }

  try {
    const parsed = new URL(value, "https://openteller.invalid");
    if (parsed.origin !== "https://openteller.invalid") return "/invoices";
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return "/invoices";
  }
}
