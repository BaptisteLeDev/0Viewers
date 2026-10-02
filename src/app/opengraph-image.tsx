import { ImageResponse } from "next/og";

export const alt = "0Viewers, les streamers français à 0 viewer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#0a0a0a", color: "#fff" }}>
        <div style={{ fontSize: 120, color: "#ff58e4" }}>0Viewers</div>
        <div style={{ fontSize: 48, marginTop: 24 }}>Soyez le premier spectateur.</div>
        <div style={{ fontSize: 32, marginTop: 16, color: "#18a0fb" }}>Streamers Twitch français en live à 0 viewer</div>
      </div>
    ),
    size,
  );
}
