import { ImageResponse } from "next/og"

export const alt = "Eagle Eye — Monitoring Przetargów Szkoleniowych"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Static OG card rendered by Satori. Kept to system fonts (Inter/system-ui
// fallback chain) so we don't ship a font binary. Colors mirror the dark
// landing palette — #0EA5E9 accent on near-black.
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "linear-gradient(135deg, #09090b 0%, #0c1117 55%, #0b1e2a 100%)",
          color: "#fafafa",
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "rgba(14, 165, 233, 0.14)",
              border: "1px solid rgba(14, 165, 233, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0EA5E9",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            EE
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#e4e4e7",
            }}
          >
            Eagle Eye
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.035em",
              color: "#fafafa",
              maxWidth: 960,
            }}
          >
            Monitoring przetargów szkoleniowych
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a1a1aa",
              letterSpacing: "-0.01em",
              maxWidth: 960,
            }}
          >
            BZP · TED · BUR · KFS — z AI scoringiem i kalkulatorem oferty.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(63, 63, 70, 0.6)",
            paddingTop: 24,
          }}
        >
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {["4 mld PLN rynku", "Alerty na żywo", "AI scoring"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 16px",
                  borderRadius: 999,
                  border: "1px solid rgba(14, 165, 233, 0.35)",
                  background: "rgba(14, 165, 233, 0.08)",
                  color: "#7dd3fc",
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#71717a",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            eagle-eye.hatedapps.pl
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
