import { describe, expect, it } from "vitest";

import {
  calculateLineMinor,
  formatUsdcMinor,
  InvoiceValueError,
  parseQuantity,
  parseUsdcMinor,
} from "./invoice";

describe("invoice money", () => {
  it("parses USDC without floating point arithmetic", () => {
    expect(parseUsdcMinor("1250.05")).toBe(125005n);
    expect(formatUsdcMinor(125005n)).toBe("1,250.05");
  });

  it("accepts quantities with at most three decimal places", () => {
    expect(parseQuantity("1.125")).toEqual({ value: 1125n, scale: 3 });
    expect(() => parseQuantity("1.1255")).toThrow(InvoiceValueError);
  });

  it("calculates exact-cent line totals", () => {
    expect(calculateLineMinor(15n, 1, 10000n)).toBe(15000n);
    expect(() => calculateLineMinor(15n, 1, 1099n)).toThrow(
      "Quantity and unit price must produce an exact cent total.",
    );
  });

  it("enforces the approved maximum", () => {
    expect(parseUsdcMinor("1000000.00")).toBe(100000000n);
    expect(() => parseUsdcMinor("1000000.01")).toThrow(InvoiceValueError);
  });
});
