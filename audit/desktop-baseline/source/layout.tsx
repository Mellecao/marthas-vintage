import type { Metadata } from "next";
import {
  Diplomata,
  Geist,
  Poltawski_Nowy,
  Suravaram,
} from "next/font/google";
import { LogoLoader } from "@/components/logo-loader";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const diplomata = Diplomata({
  variable: "--font-diplomata",
  weight: "400",
  subsets: ["latin"],
});

const poltawski = Poltawski_Nowy({
  variable: "--font-poltawski",
  weight: "400",
  subsets: ["latin"],
});

const suravaram = Suravaram({
  variable: "--font-suravaram",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Martha's Vintage | Bastrop, Texas",
  description:
    "A personal collection of vintage clothing, textiles, accessories and beautiful oddities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${diplomata.variable} ${poltawski.variable} ${suravaram.variable}`}
    >
      <body>
        <LogoLoader />
        {children}
      </body>
    </html>
  );
}
