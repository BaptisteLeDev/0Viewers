import type { Metadata, Viewport } from "next";
import { Geist, Iceland, Share_Tech_Mono } from "next/font/google";
import { Backdrop } from "@/ui/Backdrop";
import { Header } from "@/ui/Header";
import { SITE_DESCRIPTION, SITE_NAME, isIndexable, siteUrl } from "@/site";
import "./globals.css";

const display = Iceland({ weight: "400", subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Geist({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Share_Tech_Mono({ weight: "400", subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });

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

export const viewport: Viewport = { themeColor: "#050508" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a href="#contenu" className="skip-link">Aller au contenu</a>
        <Backdrop />
        <Header />
        <main id="contenu">{children}</main>
        <footer className="site-footer">
          <p className="container">
            Formes : <a href="https://coolshap.es" target="_blank" rel="noopener noreferrer">Coolshapes<span className="visually-hidden"> (nouvel onglet)</span></a> par realvjy
          </p>
        </footer>
      </body>
    </html>
  );
}
