import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  cacheComponents: true,
  async redirects() {
    return [
      { source: "/jeux", destination: "/categories", permanent: true },
      { source: "/jeux/:slug", destination: "/categories/:slug", permanent: true },
    ];
  },
};

export default config;
