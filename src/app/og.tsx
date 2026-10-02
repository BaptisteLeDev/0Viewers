import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

// literal paths: file tracing must see them for the dynamic category route
const assets = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/Iceland-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/Geist-Bold.ttf")),
  readFile(join(process.cwd(), "src/app/icon.svg"), "base64"),
]);

const BG = "#050508";
const PINK = "#ff58e4";
const BLUE = "#18a0fb";
const YELLOW = "#ffd749";
const BRAND = `linear-gradient(90deg, ${BLUE}, ${PINK}, ${YELLOW})`;

export type OgCard = {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
  art?: string;
};

// satori lays out inline children as flex items: one span per word wraps.
// Highlight stays one span so its gradient runs across it.
function Title({ title, highlight }: Pick<OgCard, "title" | "highlight">) {
  const [before, after = ""] = title.split(highlight);
  const words = (text: string) => text.split(" ").filter(Boolean).map((w) => ({ w, hl: false }));
  const all = [...words(before), { w: highlight, hl: true }, ...words(after)];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", fontSize: title.length > 48 ? 68 : 80, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
      {all.map(({ w, hl }, i) => (
        <span
          key={i}
          style={hl ? { marginRight: 18, whiteSpace: "nowrap", backgroundImage: BRAND, backgroundClip: "text", color: "transparent" } : { marginRight: 18 }}
        >
          {w}
        </span>
      ))}
    </div>
  );
}

export async function ogImage({ eyebrow, title, highlight, subtitle, art }: OgCard) {
  const [iceland, geist, icon] = await assets;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          background: BG,
          backgroundImage: [
            "radial-gradient(ellipse 60% 70% at 85% 110%, rgba(255,88,228,0.35), transparent 70%)",
            "radial-gradient(ellipse 60% 70% at 0% 0%, rgba(24,160,251,0.28), transparent 70%)",
            "radial-gradient(ellipse 40% 40% at 100% 0%, rgba(255,215,73,0.14), transparent 70%)",
          ].join(", "),
          color: "#fff",
          fontFamily: "Geist",
        }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 10, backgroundImage: BRAND }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- satori renders plain img only */}
            <img src={`data:image/svg+xml;base64,${icon}`} width={64} height={64} alt="" />
            <span style={{ fontFamily: "Iceland", fontSize: 64 }}>0Viewers</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 24px",
              borderRadius: 999,
              border: "2px solid rgba(255,88,228,0.5)",
              background: "rgba(8,8,16,0.7)",
              fontSize: 26,
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 999, background: "#ef4444" }} />
            EN DIRECT
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 56 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 20 }}>
            <span style={{ fontFamily: "Iceland", fontSize: 34, color: BLUE, letterSpacing: "0.08em", textTransform: "uppercase" }}>{eyebrow}</span>
            <Title title={title} highlight={highlight} />
          </div>
          {art && (
            // eslint-disable-next-line @next/next/no-img-element -- satori renders plain img only
            <img
              src={art}
              width={228}
              height={304}
              alt=""
              style={{ borderRadius: 16, border: `3px solid ${PINK}`, boxShadow: "0 0 48px rgba(255,88,228,0.45)" }}
            />
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 30 }}>
          <span style={{ color: "#b3b3b3" }}>{subtitle}</span>
          <span style={{ padding: "8px 26px", borderRadius: 999, background: YELLOW, color: BG }}>0 spectateur</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Iceland", data: iceland, weight: 400, style: "normal" },
        { name: "Geist", data: geist, weight: 700, style: "normal" },
      ],
    },
  );
}
