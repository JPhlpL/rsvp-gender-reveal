import { ImageResponse } from "next/og";
import { EVENT_DATE_DISPLAY, EVENT_HOSTS_LINE, EVENT_TITLE, VENUE_NAME } from "@/utils/constants";

export const alt = "Gender Reveal & Baby Shower of Philip & Vera";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Link-preview card (Messenger, etc.). ImageResponse needs literal colors; they mirror the party-* tokens.
const PINK = "#F7C6D9";
const BLUE = "#BFDDF5";
const INK = "#3A4560";
const INK_SOFT = "#6B7590";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
        <div style={{ display: "flex", width: "50%", height: "100%", background: PINK }} />
        <div style={{ display: "flex", width: "50%", height: "100%", background: BLUE }} />
        <div
          style={{
            position: "absolute",
            inset: 60,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.88)",
            borderRadius: 48,
            color: INK,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 30, letterSpacing: 6, color: INK_SOFT }}>YOU&apos;RE INVITED</div>
          <div style={{ fontSize: 78, fontWeight: 700, marginTop: 14 }}>{EVENT_TITLE}</div>
          <div style={{ fontSize: 44, marginTop: 8, color: INK_SOFT }}>{EVENT_HOSTS_LINE}</div>
          <div style={{ fontSize: 34, marginTop: 34, fontWeight: 600 }}>{EVENT_DATE_DISPLAY}</div>
          <div style={{ fontSize: 30, marginTop: 10, color: INK_SOFT }}>{VENUE_NAME}</div>
        </div>
      </div>
    ),
    size
  );
}
