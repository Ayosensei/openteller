export const MAX_INVOICE_MINOR = 100_000_000n;

export class InvoiceValueError extends Error {}

export function parseUsdcMinor(value: string): bigint {
  if (!/^(0|[1-9]\d{0,6})(\.\d{1,2})?$/.test(value)) {
    throw new InvoiceValueError("Enter a valid USDC amount with at most two decimal places.");
  }

  const [whole, fraction = ""] = value.split(".");
  const minor = BigInt(whole) * 100n + BigInt(fraction.padEnd(2, "0"));

  if (minor <= 0n) throw new InvoiceValueError("Unit price must be greater than zero.");
  if (minor > MAX_INVOICE_MINOR) throw new InvoiceValueError("Unit price cannot exceed 1,000,000 USDC.");
  return minor;
}

export function parseQuantity(value: string): { value: bigint; scale: number } {
  if (!/^(0|[1-9]\d*)(\.\d{1,3})?$/.test(value)) {
    throw new InvoiceValueError("Enter a quantity with at most three decimal places.");
  }

  const [whole, fraction = ""] = value.split(".");
  const scaled = BigInt(`${whole}${fraction}`);
  if (scaled <= 0n) throw new InvoiceValueError("Quantity must be greater than zero.");
  return { value: scaled, scale: fraction.length };
}

export function calculateLineMinor(
  quantityValue: bigint,
  quantityScale: number,
  unitPriceMinor: bigint,
): bigint {
  const divisor = 10n ** BigInt(quantityScale);
  const numerator = quantityValue * unitPriceMinor;

  if (numerator % divisor !== 0n) {
    throw new InvoiceValueError("Quantity and unit price must produce an exact cent total.");
  }

  return numerator / divisor;
}

export function formatUsdcMinor(minor: bigint): string {
  const whole = minor / 100n;
  const fraction = (minor % 100n).toString().padStart(2, "0");
  return `${whole.toLocaleString("en-US")}.${fraction}`;
}
