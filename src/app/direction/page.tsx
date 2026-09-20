import type { Metadata } from "next";
import { AuthoredWorldPage } from "@/components/authored-world/authored-world-page";

export const metadata: Metadata = {
  title: "Martha's Vintage — New Direction",
  description: "A private preview of the new Martha's Vintage visual direction.",
  robots: { index: false, follow: false },
};

export default function DirectionPage() {
  return <AuthoredWorldPage />;
}
