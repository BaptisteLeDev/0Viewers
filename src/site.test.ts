import { afterEach, describe, expect, it, vi } from "vitest";
import { isIndexable, jsonLd, siteUrl } from "@/site";

afterEach(() => vi.unstubAllEnvs());

describe("jsonLd", () => {
  it("cannot close its script tag from untrusted text", () => {
    const out = jsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(JSON.parse(out)).toEqual({ "@context": "https://schema.org", name: "</script><script>alert(1)</script>" });
  });
});

describe("siteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL without trailing slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://0viewers.fr/");
    expect(siteUrl()).toBe("https://0viewers.fr");
  });
  it("falls back to the Vercel production host", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "0viewers.vercel.app");
    expect(siteUrl()).toBe("https://0viewers.vercel.app");
  });
  it("falls back to localhost", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    expect(siteUrl()).toBe("http://localhost:3000");
  });
});

describe("isIndexable", () => {
  it("is false only on Vercel previews", () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isIndexable()).toBe(false);
  });
  it("is true in production and outside Vercel (CI, Lighthouse)", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isIndexable()).toBe(true);
    vi.stubEnv("VERCEL_ENV", "");
    expect(isIndexable()).toBe(true);
  });
});

describe("robots", () => {
  it("names AI crawlers explicitly, api stays closed", async () => {
    vi.stubEnv("VERCEL_ENV", "production");
    const { default: robots } = await import("@/app/robots");
    const { rules } = robots();
    const named = (Array.isArray(rules) ? rules : [rules]).flatMap((r) => r.userAgent ?? []).flat();
    expect(named).toEqual(expect.arrayContaining(["GPTBot", "ClaudeBot", "PerplexityBot"]));
    expect(JSON.stringify(rules)).toContain("/api/");
  });
});
