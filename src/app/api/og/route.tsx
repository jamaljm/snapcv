import { ImageResponse } from "next/og";

export const runtime = "edge";

// Load a Google font as a TTF ArrayBuffer for Satori/ImageResponse. Subsetting
// to `text` keeps it small and forces a truetype response.
async function loadFont(weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Urbanist:wght@${weight}&text=${encodeURIComponent(
      text
    )}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src:\s*url\(([^)]+)\)\s*format\('(truetype|opentype)'\)/);
    if (!src) return null;
    const res = await fetch(src[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

// Dynamic Open Graph card for a portfolio. Kept intentionally monochrome
// (white + black) to match SnapCV's sleek résumé/portfolio look — no new colors.
// Uses the SnapCV brand font (Urbanist), with a graceful fallback.
// Params are passed from generateMetadata so this route does no data fetching.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = (searchParams.get("name") || "").slice(0, 60) || "SnapCV";
  const label = (searchParams.get("label") || "").slice(0, 80);
  const user = (searchParams.get("user") || "").slice(0, 40);
  const avatar = searchParams.get("avatar") || "";
  const openToWork = searchParams.get("open") === "1";

  const initial = (name.trim()[0] || "S").toUpperCase();

  // Glyphs used on the card — subset the font to exactly these.
  const boldText = name + initial;
  const regularText =
    label + `${user}.snapcv.me` + "Made with SnapCVOpen to work" +
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-·@ ";
  const [bold, regular] = await Promise.all([
    loadFont(700, boldText),
    loadFont(500, regularText),
  ]);

  const fonts = [
    bold && { name: "Urbanist", data: bold, weight: 700 as const, style: "normal" as const },
    regular && { name: "Urbanist", data: regular, weight: 500 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 700 | 500; style: "normal" }[];

  const fontFamily = fonts.length ? "Urbanist, sans-serif" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px 80px",
          fontFamily,
          color: "#111111",
        }}
      >
        {/* top: avatar + name + label */}
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              width={168}
              height={168}
              style={{
                width: "168px",
                height: "168px",
                flexShrink: 0,
                borderRadius: "28px",
                objectFit: "cover",
                border: "1px solid #e5e5e5",
              }}
            />
          ) : (
            <div
              style={{
                width: "168px",
                height: "168px",
                flexShrink: 0,
                borderRadius: "28px",
                background: "#111111",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "84px",
                fontWeight: 700,
              }}
            >
              {initial}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: "76px", fontWeight: 700, lineHeight: 1.05 }}>
              {name}
            </div>
            {label ? (
              <div style={{ fontSize: "34px", color: "#555555", marginTop: "14px" }}>
                {label}
              </div>
            ) : null}
            {openToWork ? (
              <div
                style={{
                  marginTop: "22px",
                  alignSelf: "flex-start",
                  border: "2px solid #111111",
                  borderRadius: "999px",
                  padding: "6px 18px",
                  fontSize: "24px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Open to work
              </div>
            ) : null}
          </div>
        </div>

        {/* bottom: url + wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "2px solid #111111",
            paddingTop: "28px",
            fontSize: "30px",
          }}
        >
          <div style={{ fontWeight: 600 }}>
            {user ? `${user}.snapcv.me` : "snapcv.me"}
          </div>
          <div style={{ color: "#777777" }}>Made with SnapCV</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts: fonts.length ? fonts : undefined }
  );
}
