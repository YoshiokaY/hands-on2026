import { ImageResponse } from "next/og";

// OG画像のメタ情報（Next.js のファイル規約）
export const alt = "Japan Weather Forecast — Next.js × shadcn/ui × Vercel Hands-on";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// マップの地方カラー（japan-map.tsx と対応）
const REGION_COLORS = [
  "#0284c7",
  "#0d9488",
  "#4f46e5",
  "#059669",
  "#d97706",
  "#db2777",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
];

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "80px",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* マップを想起させる色付きパーツ列 */}
      <div style={{ display: "flex", gap: "14px", marginBottom: "48px" }}>
        {REGION_COLORS.map((color) => (
          <div
            key={color}
            style={{
              width: "96px",
              height: "64px",
              borderRadius: "16px",
              backgroundColor: color,
              transform: "skewX(-12deg)",
            }}
          />
        ))}
      </div>

      <div
        style={{
          fontSize: "76px",
          fontWeight: 800,
          color: "#0f172a",
          lineHeight: 1.1,
        }}
      >
        Japan Weather Forecast
      </div>
      <div style={{ fontSize: "34px", color: "#475569", marginTop: "24px" }}>
        Next.js × shadcn/ui × Vercel — Deploy & CI/CD Hands-on
      </div>
    </div>,
    { ...size }
  );
}
