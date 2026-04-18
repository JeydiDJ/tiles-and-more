import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} link preview`;
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  const hostname = new URL(siteConfig.url).hostname;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #231f20 0%, #231f20 45%, #ed2325 100%)",
          color: "#fffaf5",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top left, rgba(255,255,255,0.14), transparent 28%), radial-gradient(circle at 85% 18%, rgba(255,255,255,0.1), transparent 22%)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: -120,
            top: -80,
            width: 360,
            height: 360,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.08)",
            filter: "blur(16px)",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 9999,
                background: "#ed2325",
                border: "6px solid rgba(255,255,255,0.18)",
              }}
            />
            <div
              style={{
                fontSize: 28,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(255,250,245,0.76)",
              }}
            >
              Tiles & More
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 20,
              maxWidth: 860,
            }}
          >
            <div
              style={{
                fontSize: 74,
                lineHeight: 1.02,
                fontWeight: 700,
                letterSpacing: "-0.05em",
              }}
            >
              Tile, surface, and sanitary solutions built for real projects.
            </div>
            <div
              style={{
                fontSize: 32,
                lineHeight: 1.35,
                color: "rgba(255,250,245,0.82)",
              }}
            >
              Catalog-ready selections and finished-project inspiration for residential and commercial spaces in
              Central Luzon.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 24,
              color: "rgba(255,250,245,0.72)",
            }}
          >
            <div>{siteConfig.address}</div>
            <div>{hostname}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
