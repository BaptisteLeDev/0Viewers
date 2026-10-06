import type { NextConfig } from "next";

// No script-src: a nonce needs dynamic rendering, pages stay static
// (ADR 0002). These directives cost nothing and block framing/injection.
const CSP = "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'";

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
];

const config: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      { source: "/jeux", destination: "/categories", permanent: true },
      { source: "/jeux/:slug", destination: "/categories/:slug", permanent: true },
    ];
  },
};

export default config;
