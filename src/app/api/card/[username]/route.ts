import { supabase } from "@/utils/supabase/supabase_service";

// Embeddable SVG cards for a GitHub profile README (the viral loop: the copied
// markdown carries the snapcv URL, and the card renders on the highest-intent dev
// surface there is). Two styles:
//   default          a clean monochrome portfolio card (?theme=dark|light)
//   ?style=terminal  a neofetch/terminal-style stats card (dark, monospace)
// GitHub can't auto-switch external images by viewer theme, so the badge page lets
// the user pick a fixed variant.

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

// ---- Terminal / neofetch style ----

async function fetchContribTotal(handle: string): Promise<number> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
        handle
      )}?y=last`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return 0;
    const d = await res.json();
    return typeof d?.total?.lastYear === "number" ? d.total.lastYear : 0;
  } catch {
    return 0;
  }
}

const T = {
  bg: "#0d1117",
  border: "#21262d",
  title: "#8b949e",
  name: "#e6edf3",
  dim: "#6e7681",
  dots: "#30363d",
  label: "#e3b341",
  text: "#c9d1d9",
  link: "#79c0ff",
  green: "#3fb950",
  head: "#8b949e",
};

function tRow(
  x: number,
  y: number,
  label: string,
  value: string,
  color: string,
  padTo = 14
): string {
  const dots = ".".repeat(Math.max(2, padTo - label.length));
  return `<text x="${x}" y="${y}" class="m" font-size="13"><tspan fill="${
    T.label
  }">${esc(label)}</tspan><tspan fill="${T.dots}"> ${dots}</tspan><tspan fill="${color}"> ${esc(
    value
  )}</tspan></text>`;
}

function tHead(x: number, y: number, label: string, width = 40): string {
  return `<text x="${x}" y="${y}" class="m" font-size="13" fill="${
    T.head
  }">── ${esc(label)} ${"─".repeat(Math.max(2, width - label.length))}</text>`;
}

// Public GitHub stats (repos, stars, followers) via unauthenticated REST. Cached,
// so the 60/hr shared-IP limit is not a problem. Graceful zeros on any failure.
async function fetchGithubStats(
  handle: string
): Promise<{ repos: number; stars: number; followers: number }> {
  try {
    const h = { Accept: "application/vnd.github+json" };
    const [u, rp] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(handle)}`, {
        headers: h,
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${encodeURIComponent(handle)}/repos?per_page=100`,
        { headers: h, next: { revalidate: 3600 } }
      ),
    ]);
    const user = u.ok ? await u.json() : {};
    const repos = rp.ok ? await rp.json() : [];
    const stars = Array.isArray(repos)
      ? repos.reduce(
          (s: number, r: { stargazers_count?: number }) =>
            s + (r.stargazers_count || 0),
          0
        )
      : 0;
    return {
      repos: user.public_repos || 0,
      followers: user.followers || 0,
      stars,
    };
  } catch {
    return { repos: 0, stars: 0, followers: 0 };
  }
}

type TData = {
  name: string;
  handle: string;
  label: string;
  loc: string;
  langs: string;
  project: string;
  contrib: number;
  email: string;
  github: string;
  linkedin: string;
};

function buildTerminal(
  d: TData,
  stats: { repos: number; stars: number; followers: number }
): string {
  const W = 560;
  const RX = 34;
  const pad = 14;

  const info: [string, string, string][] = [
    ["Portfolio", `${d.handle}.snapcv.me`, T.link],
  ];
  if (d.label) info.push(["Role", clamp(d.label, 40), T.text]);
  if (d.loc) info.push(["Location", clamp(d.loc, 40), T.text]);
  if (d.langs) info.push(["Stack", clamp(d.langs, 42), T.text]);
  if (d.project) info.push(["Focus", clamp(d.project, 40), T.text]);

  const ghStats: [string, string, string][] = [];
  if (stats.repos) ghStats.push(["Repos", String(stats.repos), T.green]);
  if (stats.stars) ghStats.push(["Stars", String(stats.stars), T.green]);
  if (stats.followers)
    ghStats.push(["Followers", String(stats.followers), T.green]);
  if (d.contrib > 0)
    ghStats.push(["Contributions", `${d.contrib.toLocaleString()} last yr`, T.green]);

  const contact: [string, string, string][] = [];
  if (d.email) contact.push(["Email", clamp(d.email, 40), T.link]);
  if (d.github) contact.push(["GitHub", clamp(d.github, 40), T.link]);
  if (d.linkedin) contact.push(["LinkedIn", clamp(d.linkedin, 40), T.link]);

  let y = 120;
  const step = 23;
  let body = "";
  for (const [l, v, c] of info) {
    body += tRow(RX, y, l, v, c, pad);
    y += step;
  }
  if (ghStats.length) {
    y += 7;
    body += tHead(RX, y, "github stats", 40);
    y += step;
    for (const [l, v, c] of ghStats) {
      body += tRow(RX, y, l, v, c, pad);
      y += step;
    }
  }
  if (contact.length) {
    y += 7;
    body += tHead(RX, y, "contact", 40);
    y += step;
    for (const [l, v, c] of contact) {
      body += tRow(RX, y, l, v, c, pad);
      y += step;
    }
  }
  const height = Math.round(y + 6);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${height}" viewBox="0 0 ${W} ${height}" role="img" aria-label="${esc(
    d.name
  )} on SnapCV">
  <style>.m{font-family:ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,'Liberation Mono',monospace}</style>
  <rect x="0.75" y="0.75" width="${W - 1.5}" height="${
    height - 1.5
  }" rx="12" fill="${T.bg}" stroke="${T.border}" stroke-width="1.5"/>
  <circle cx="26" cy="28" r="5.5" fill="#ff5f56"/>
  <circle cx="44" cy="28" r="5.5" fill="#ffbd2e"/>
  <circle cx="62" cy="28" r="5.5" fill="#27c93f"/>
  <text x="86" y="32" class="m" font-size="12.5" fill="${T.title}">${esc(
    d.handle
  )} — snapcv</text>
  <line x1="0" y1="50" x2="${W}" y2="50" stroke="${T.border}"/>
  <text x="${RX}" y="90" class="m" font-size="18" font-weight="700" fill="${
    T.name
  }">${esc(clamp(d.name, 28))}<tspan fill="${T.dim}" font-weight="400"> @snapcv</tspan></text>
  <line x1="${RX}" y1="104" x2="${W - 24}" y2="104" stroke="${T.border}"/>
  ${body}
  <text x="${W - 26}" y="${height - 16}" class="m" font-size="11" fill="${
    T.dim
  }" text-anchor="end">made with snapcv.me</text>
</svg>`;
}

function ghHandleFrom(
  profiles: { network?: string; url?: string; username?: string }[],
  fallback: string
): string {
  const gh = (profiles || []).find(
    (p) => p.network?.toLowerCase() === "github" || /github\.com\//i.test(p.url || "")
  );
  return (
    gh?.username?.trim() ||
    gh?.url?.match(/github\.com\/([A-Za-z0-9-]+)/i)?.[1] ||
    fallback
  ).replace(/^@/, "");
}

function linkedinHandleFrom(
  profiles: { network?: string; url?: string; username?: string }[]
): string {
  const li = (profiles || []).find(
    (p) =>
      p.network?.toLowerCase() === "linkedin" || /linkedin\.com/i.test(p.url || "")
  );
  if (!li) return "";
  return (
    li.username?.trim() ||
    li.url
      ?.replace(/^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/i, "")
      .replace(/\/+$/, "") ||
    ""
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const handle = (username || "").trim().toLowerCase();
  const url = new URL(req.url);
  const themeParam = url.searchParams.get("theme");
  const style = url.searchParams.get("style");
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

    if (style === "terminal") {
      const profiles = r.basics.profiles || [];
      const github = ghHandleFrom(profiles, handle);
      const [contrib, stats] = await Promise.all([
        fetchContribTotal(github),
        fetchGithubStats(github),
      ]);
      const loc = [r.basics.location?.city, r.basics.location?.countryCode]
        .filter(Boolean)
        .join(", ");
      const langs = (Array.isArray(r.basics.skills) ? r.basics.skills : [])
        .filter((s: unknown) => typeof s === "string" && s.trim())
        .slice(0, 6)
        .join(", ");
      return svgResponse(
        buildTerminal(
          {
            name: r.basics.name,
            handle,
            label: r.basics.label || "Developer",
            loc,
            langs,
            project: r.projects?.projects?.[0]?.title || "",
            contrib,
            email: r.basics.email || "",
            github,
            linkedin: linkedinHandleFrom(profiles),
          },
          stats
        ),
        3600
      );
    }

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
