import type { Metadata, Viewport } from "next";
import { Iceland, Share_Tech_Mono } from "next/font/google";
import { Header } from "@/ui/Header";
import { SITE_DESCRIPTION, SITE_NAME, isIndexable, siteUrl } from "@/site";
import "./globals.css";

const heading = Iceland({ weight: "400", subsets: ["latin"], variable: "--font-heading", display: "swap" });
const mono = Share_Tech_Mono({ weight: "400", subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${SITE_NAME}, les streamers français à 0 viewer`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fr_FR", siteName: SITE_NAME, url: "/" },
  twitter: { card: "summary_large_image" },
  robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

export const viewport: Viewport = { themeColor: "#0a0a0a" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${heading.variable} ${mono.variable}`}>
      <body>
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        <Header />
        <main id="contenu">{children}</main>
      </body>
    </html>
  );
}
