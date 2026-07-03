import { supabase } from "@/utils/supabase/supabase_service";

// Embeddable SVG portfolio card for a user's GitHub profile README (the viral
// loop: the copied markdown carries the snapcv URL, and the card renders on the
// highest-intent dev surface there is). Served as image/svg+xml with a cache so
// GitHub's image proxy and CDNs can hold it. Supports ?theme=dark so a <picture>
// element can swap it to match the viewer's GitHub theme.

export const revalidate = 3600;

type Palette = {
  card: string;
  border: string;
  avatarBg: string;
  avatarText: string;
  name: string;
  role: string;
  skills: string;
  divider: string;
  domain: string;
  brand: string;
};

// Monochrome palettes. Light matches the portfolio; dark matches GitHub's dark UI
// so the card melts into a dark README instead of glaring white.
const LIGHT: Palette = {
  card: "#ffffff",
  border: "#e8eaed",
  avatarBg: "#15171c",
  avatarText: "#ffffff",
  name: "#15171c",
  role: "#6b7280",
  skills: "#4b5563",
  divider: "#eef0f2",
  domain: "#9aa0a8",
  brand: "#15171c",
};
const DARK: Palette = {
  card: "#0d1117",
  border: "#272d36",
  avatarBg: "#f0f3f6",
  avatarText: "#0d1117",
  name: "#f0f3f6",
  role: "#9198a1",
  skills: "#b6bec8",
  divider: "#21262d",
  domain: "#6e7681",
  brand: "#f0f3f6",
};

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp(s: string, max: number): string {
  const t = (s || "").trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

const EMPTY_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="140"></svg>`;

function svgResponse(svg: string, maxAge: number) {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": `public, max-age=0, s-maxage=${maxAge}, stale-while-revalidate=86400`,
    },
  });
}

function buildCard(
  p: Palette,
  name: string,
  label: string,
  skillLine: string,
  initials: string,
  domain: string
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="140" viewBox="0 0 460 140" role="img" aria-label="${esc(
    name
  )} on SnapCV">
  <style>.f{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}</style>
  <rect x="0.75" y="0.75" width="458.5" height="138.5" rx="18" fill="${
    p.card
  }" stroke="${p.border}" stroke-width="1.5"/>
  <circle cx="53" cy="55" r="27" fill="${p.avatarBg}"/>
  <text x="53" y="55" class="f" font-size="20" font-weight="700" fill="${
    p.avatarText
  }" text-anchor="middle" dominant-baseline="central">${esc(
    initials || "·"
  )}</text>
  <text x="98" y="42" class="f" font-size="19.5" font-weight="700" fill="${
    p.name
  }" letter-spacing="-0.2">${esc(name)}</text>
  <text x="98" y="64" class="f" font-size="13" fill="${p.role}">${esc(
    label
  )}</text>
  ${
    skillLine
      ? `<text x="98" y="86" class="f" font-size="12" fill="${p.skills}">${esc(
          skillLine
        )}</text>`
      : ""
  }
  <line x1="24" y1="106" x2="436" y2="106" stroke="${p.divider}"/>
  <text x="24" y="124" class="f" font-size="12.5" fill="${p.domain}">${esc(
    domain
  )}</text>
  <text x="436" y="124" class="f" font-size="12.5" font-weight="700" fill="${
    p.brand
  }" text-anchor="end">SnapCV</text>
</svg>`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const handle = (username || "").trim().toLowerCase();
  const theme =
    new URL(req.url).searchParams.get("theme") === "dark" ? DARK : LIGHT;

  if (!/^[a-z0-9-]{1,63}$/.test(handle)) {
    return svgResponse(EMPTY_SVG, 60);
  }

  try {
    const { data } = await supabase
      .from("users")
      .select("resumeJson")
      .eq("userName", handle)
      .single();

    const r = data?.resumeJson;
    if (!r?.basics?.name) return svgResponse(EMPTY_SVG, 300);

    const name = clamp(r.basics.name, 30);
    const label = clamp(r.basics.label || "Developer", 42);
    const skills: string[] = Array.isArray(r.basics.skills)
      ? r.basics.skills.filter((s: unknown) => typeof s === "string" && s.trim())
      : [];
    const skillLine = clamp(skills.slice(0, 6).join("  ·  "), 56);
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((w: string) => w[0])
      .join("")
      .toUpperCase();

    return svgResponse(
      buildCard(theme, name, label, skillLine, initials, `${handle}.snapcv.me`),
      3600
    );
  } catch {
    return svgResponse(EMPTY_SVG, 300);
  }
}
