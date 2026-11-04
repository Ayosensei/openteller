import {
  Bricolage_Grotesque,
  Instrument_Sans,
  Martian_Mono,
} from "next/font/google";

export const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const ui = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-ui",
  display: "swap",
});

export const mono = Martian_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
