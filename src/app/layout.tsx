import type { Metadata, Viewport } from "next";
import { Geist, Iceland, Share_Tech_Mono } from "next/font/google";
import { Footer } from "@/ui/Footer";
import { Header } from "@/ui/Header";
import { SITE_DESCRIPTION, SITE_NAME, isIndexable, jsonLd, siteUrl } from "@/site";
import "./globals.css";

const display = Iceland({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Geist({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Share_Tech_Mono({ weight: "400", subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${SITE_NAME}, les streamers français à 0 spectateur`, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "fr_FR", siteName: SITE_NAME },
  twitter: { card: "summary_large_image" },
  robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
};

const siteLd = jsonLd({
  "@graph": [
    { "@type": "Organization", "@id": `${siteUrl()}/#org`, name: SITE_NAME, url: siteUrl(), logo: `${siteUrl()}/icon.svg` },
    { "@type": "WebSite", name: SITE_NAME, url: siteUrl(), description: SITE_DESCRIPTION, inLanguage: "fr-FR", publisher: { "@id": `${siteUrl()}/#org` } },
  ],
});

export const viewport: Viewport = { themeColor: "#050508" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteLd }} />
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        <Header />
        <main id="contenu">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
