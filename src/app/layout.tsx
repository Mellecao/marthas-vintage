import type { Metadata } from "next";
import {
  Diplomata,
  Geist,
  Poltawski_Nowy,
  Suravaram,
} from "next/font/google";
import { LogoLoader } from "@/components/logo-loader";
import { MACOS_SAFARI_BOOTSTRAP } from "@/lib/browser";
import "./globals.css";
import "./vintage-details.css";

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000"),
  ),
  title: "Martha's Vintage | Bastrop, Texas",
  description:
    "A personal collection of vintage clothing, textiles, accessories and beautiful oddities.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Martha's Vintage",
    title: "Martha's Vintage | Bastrop, Texas",
    description:
      "A personal collection of vintage clothing, textiles, accessories and beautiful oddities.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Martha's Vintage | Bastrop, Texas",
    description:
      "A personal collection of vintage clothing, textiles, accessories and beautiful oddities.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${diplomata.variable} ${poltawski.variable} ${suravaram.variable}`}
    >
      <head>
        <script
          id="macos-safari-mode"
          dangerouslySetInnerHTML={{ __html: MACOS_SAFARI_BOOTSTRAP }}
        />
      </head>
      <body>
        <LogoLoader />
        {children}
      </body>
    </html>
  );
}
