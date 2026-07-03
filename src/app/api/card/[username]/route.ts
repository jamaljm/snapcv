import { supabase } from "@/utils/supabase/supabase_service";

// Embeddable SVG portfolio card for a user's GitHub profile README (the viral
// loop: the copied markdown carries the snapcv URL, and the card renders on the
// highest-intent dev surface there is). Served as image/svg+xml with a cache so
// GitHub's image proxy and CDNs can hold it.

export const revalidate = 3600;

// XML-escape untrusted profile text before it goes into the SVG.
function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Truncate to a rough character budget so long text never overflows the card.
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const handle = (username || "").trim().toLowerCase();
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
    const skillLine = clamp(skills.slice(0, 6).join("  ·  "), 58);
    const initials = name
      .split(/\s+/)
      .slice(0, 2)
      .map((w: string) => w[0])
      .join("")
      .toUpperCase();
    const domain = `${handle}.snapcv.me`;

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="460" height="140" viewBox="0 0 460 140" role="img" aria-label="${esc(
      name
    )} on SnapCV">
  <style>
    .f{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif}
  </style>
  <rect x="0.5" y="0.5" width="459" height="139" rx="16" fill="#ffffff" stroke="#e6e8eb"/>
  <circle cx="52" cy="52" r="26" fill="#15171c"/>
  <text x="52" y="52" class="f" font-size="20" font-weight="700" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${esc(
    initials || "·"
  )}</text>
  <text x="94" y="40" class="f" font-size="19" font-weight="700" fill="#15171c">${esc(
    name
  )}</text>
  <text x="94" y="62" class="f" font-size="13" fill="#787e86">${esc(label)}</text>
  ${
    skillLine
      ? `<text x="94" y="84" class="f" font-size="12" fill="#394048">${esc(
          skillLine
        )}</text>`
      : ""
  }
  <line x1="24" y1="104" x2="436" y2="104" stroke="#eff1f3"/>
  <text x="24" y="123" class="f" font-size="12.5" fill="#787e86">${esc(
    domain
  )}</text>
  <text x="436" y="123" class="f" font-size="12.5" font-weight="700" fill="#15171c" text-anchor="end">SnapCV</text>
</svg>`;

    return svgResponse(svg, 3600);
  } catch {
    return svgResponse(EMPTY_SVG, 300);
  }
}
