import type { Metadata } from "next";
import type { ReactNode } from "react";

import { display, mono, ui } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Openteller — Invoices with a payment trail",
  description: "Create crypto invoices and keep a record of the payment.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${ui.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
