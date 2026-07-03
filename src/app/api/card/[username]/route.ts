import { supabase } from "@/utils/supabase/supabase_service";

// Embeddable SVG portfolio card for a user's GitHub profile README (the viral
// loop: the copied markdown carries the snapcv URL, and the card renders on the
// highest-intent dev surface there is). Served as image/svg+xml, cached for
// GitHub's image proxy / CDNs.
//
// Theme: ?theme=dark serves the dark palette, otherwise light. GitHub has removed
// every way to auto-switch an EXTERNAL image by the viewer's theme (<picture>
// sources aren't camo-proxied, #gh-dark-mode-only is deprecated, and
// prefers-color-scheme is ignored inside <img>-embedded SVGs), so the user picks a
// fixed variant on the badge page. The dark card is the default recommendation:
// it reads as premium on a dark README and intentional on a light one.

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

// CSS rules mapping each class to a palette's colors.
function rules(p: Palette): string {
  return `.cbg{fill:${p.card};stroke:${p.border}}.cav{fill:${p.avatarBg}}.cai{fill:${p.avatarText}}.cnm{fill:${p.name}}.cro{fill:${p.role}}.csk{fill:${p.skills}}.cdv{stroke:${p.divider}}.cdm{fill:${p.domain}}.cbr{fill:${p.brand}}`;
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
  themeStyle: string,
  name: string,
  label: string,
  skillLine: string,
  initials: string,
  domain: string
): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="140" viewBox="0 0 460 140" role="img" aria-label="${esc(
    name
  )} on SnapCV">
  <style>.f{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}${themeStyle}</style>
  <rect class="cbg" x="0.75" y="0.75" width="458.5" height="138.5" rx="18" stroke-width="1.5"/>
  <circle class="cav" cx="53" cy="55" r="27"/>
  <text class="cai f" x="53" y="55" font-size="20" font-weight="700" text-anchor="middle" dominant-baseline="central">${esc(
    initials || "·"
  )}</text>
  <text class="cnm f" x="98" y="42" font-size="19.5" font-weight="700" letter-spacing="-0.2">${esc(
    name
  )}</text>
  <text class="cro f" x="98" y="64" font-size="13">${esc(label)}</text>
  ${
    skillLine
      ? `<text class="csk f" x="98" y="86" font-size="12">${esc(skillLine)}</text>`
      : ""
  }
  <line class="cdv" x1="24" y1="106" x2="436" y2="106"/>
  <text class="cdm f" x="24" y="124" font-size="12.5">${esc(domain)}</text>
  <text class="cbr f" x="436" y="124" font-size="12.5" font-weight="700" text-anchor="end">SnapCV</text>
</svg>`;
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const handle = (username || "").trim().toLowerCase();
  const themeParam = new URL(req.url).searchParams.get("theme");
  const themeStyle = themeParam === "dark" ? rules(DARK) : rules(LIGHT);

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
      buildCard(themeStyle, name, label, skillLine, initials, `${handle}.snapcv.me`),
      3600
    );
  } catch {
    return svgResponse(EMPTY_SVG, 300);
  }
}
