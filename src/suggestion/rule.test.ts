import { describe, expect, it } from "vitest";
import { MAX_LENGTH, parseSuggestion } from "@/suggestion/rule";

describe("parseSuggestion", () => {
  it("accepts a known kind and trims the text", () => {
    expect(parseSuggestion("bug", "  Le bouton suivant ne marche pas  ")).toEqual({ kind: "bug", body: "Le bouton suivant ne marche pas" });
  });

  it("rejects unknown kinds, including prototype keys", () => {
    expect(parseSuggestion("admin", "Une idée assez longue")).toHaveProperty("error");
    expect(parseSuggestion("toString", "Une idée assez longue")).toHaveProperty("error");
  });

  it("rejects text too short once trimmed, too long, or missing", () => {
    expect(parseSuggestion("algo", "   court   ")).toHaveProperty("error");
    expect(parseSuggestion("algo", "x".repeat(MAX_LENGTH + 1))).toHaveProperty("error");
    expect(parseSuggestion("algo", null)).toHaveProperty("error");
  });
});
