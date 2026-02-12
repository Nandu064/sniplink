import { ImageResponse } from "next/og";
import { APP_NAME } from "@/lib/constants";

export const runtime = "edge";
export const alt = APP_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.02em",
          }}
        >
          {APP_NAME}
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.8)",
            marginTop: 16,
          }}
        >
          Shorten Links. Track Clicks. Grow Faster.
        </div>
      </div>
    ),
    { ...size }
  );
}
