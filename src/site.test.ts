import { afterEach, describe, expect, it, vi } from "vitest";
import { isIndexable, siteUrl } from "@/site";

afterEach(() => vi.unstubAllEnvs());

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
