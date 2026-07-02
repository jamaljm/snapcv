// Shared GitHub → UserProfile logic, used by /api/githubToProfile (the create
// flow) and the /try preview page. Public GitHub data only.

const GH = "https://api.github.com";
const token = process.env.GITHUB_TOKEN;

function ghHeaders(useToken: boolean): Record<string, string> {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "snapcv",
  };
  if (useToken && token) h.Authorization = `Bearer ${token}`;
  return h;
}

// If a token is set but rejected (401) or throttled (403), retry unauthenticated
// so public data still loads when the token is bad.
async function ghFetch(url: string): Promise<Response> {
  let res = await fetch(url, { headers: ghHeaders(true), cache: "no-store" });
  if (token && (res.status === 401 || res.status === 403)) {
    res = await fetch(url, { headers: ghHeaders(false), cache: "no-store" });
  }
  return res;
}

type GhUser = {
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  blog: string | null;
  location: string | null;
  email: string | null;
  twitter_username: string | null;
  html_url: string;
};

type GhRepo = {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  updated_at: string;
};

export function isValidGithubUsername(name: string): boolean {
  return /^[a-zA-Z0-9-]{1,39}$/.test(name);
}

export type GithubProfileResult =
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; status: number; error: string };

// Fetch a repo's README as raw text (best-effort, capped), with the same
// invalid-token → unauthenticated fallback as ghFetch.
async function fetchReadmeRaw(login: string, repo: string): Promise<string> {
  const url = `${GH}/repos/${login}/${repo}/readme`;
  const hdrs = (useToken: boolean) => ({
    ...ghHeaders(useToken),
    Accept: "application/vnd.github.raw",
  });
  try {
    let res = await fetch(url, { headers: hdrs(true), cache: "no-store" });
    if (token && (res.status === 401 || res.status === 403)) {
      res = await fetch(url, { headers: hdrs(false), cache: "no-store" });
    }
    if (!res.ok) return "";
    return (await res.text()).slice(0, 1500);
  } catch {
    return "";
  }
}

type RepoCard = { description: string; technologies: string[] };

// Ask the backend to write recruiter-legible cards for the top repos (uses the
// OpenAI key that lives on the backend). Best-effort: on any failure we fall
// back to the raw repo description, so the portfolio still renders.
async function enrichWithCards(
  login: string,
  topRepos: GhRepo[]
): Promise<Map<string, RepoCard>> {
  const out = new Map<string, RepoCard>();
  const backend = process.env.NEXT_PUBLIC_BACKEND;
  if (!backend || topRepos.length === 0) return out;

  try {
    const repos = await Promise.all(
      topRepos.map(async (r) => ({
        name: r.name,
        description: r.description || "",
        language: r.language || "",
        readme: await fetchReadmeRaw(login, r.name),
      }))
    );
    const res = await fetch(`${backend}/github-cards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repos }),
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) return out;
    const json = await res.json();
    for (const card of json?.cards || []) {
      if (card?.name) {
        out.set(String(card.name), {
          description: String(card.description || ""),
          technologies: Array.isArray(card.technologies)
            ? card.technologies.map(String)
            : [],
        });
      }
    }
  } catch (error) {
    console.error("enrichWithCards failed:", error);
  }
  return out;
}

/** Turn a GitHub username into a portfolio-ready UserProfile-shaped object. */
export async function fetchGithubProfile(
  usernameRaw: string
): Promise<GithubProfileResult> {
  const username = String(usernameRaw || "").trim().replace(/^@/, "");
  if (!isValidGithubUsername(username)) {
    return { ok: false, status: 400, error: "Provide a valid GitHub username." };
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      ghFetch(`${GH}/users/${username}`),
      ghFetch(`${GH}/users/${username}/repos?per_page=100&sort=updated`),
    ]);

    if (userRes.status === 404) {
      return { ok: false, status: 404, error: `GitHub user "${username}" not found.` };
    }
    if (!userRes.ok) {
      return { ok: false, status: 502, error: "GitHub request failed." };
    }

    const user: GhUser = await userRes.json();
    const repos: GhRepo[] = reposRes.ok ? await reposRes.json() : [];

    const topRepos = repos
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    const langCounts = new Map<string, number>();
    for (const r of repos) {
      if (r.language) langCounts.set(r.language, (langCounts.get(r.language) || 0) + 1);
    }
    const languages = [...langCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name]) => name);

    const website =
      user.blog && user.blog.trim()
        ? user.blog.startsWith("http")
          ? user.blog
          : `https://${user.blog}`
        : "";

    const profiles = [
      { username: user.login, url: user.html_url, network: "GitHub" },
      user.twitter_username
        ? {
            username: user.twitter_username,
            url: `https://x.com/${user.twitter_username}`,
            network: "X",
          }
        : { username: "", url: "", network: "X" },
      website ? { username: "", url: website, network: "Website" } : null,
    ].filter(Boolean);

    // AI-written recruiter cards for the top repos (best-effort).
    const cards = await enrichWithCards(user.login, topRepos);

    const data = {
      meta: {
        resumeTheme: "",
        portfolioTheme: "",
        portfolioColor: "",
        userName: user.login.toLowerCase(),
        buttonText: "Get in touch",
        avatarUrl: user.avatar_url,
      },
      basics: {
        name: user.name || user.login,
        phone: "",
        label: user.bio?.split("\n")[0]?.slice(0, 80) || "Developer",
        avatarUrl: user.avatar_url,
        about: user.bio || "",
        website,
        resumeUrl: "",
        email: user.email || "",
        location: { city: user.location || "", countryCode: "" },
        profiles,
        skills: languages,
      },
      certificates: [],
      education: [],
      skills: languages.length ? [{ name: "Languages & Tools", keywords: languages }] : [],
      awards: [],
      hackathons: { description: "", hackathons: [] },
      publications: [],
      volunteer: [],
      work: [],
      projects: {
        description: "",
        projects: topRepos.map((r) => {
          const card = cards.get(r.name);
          return {
            title: r.name,
            description: card?.description || r.description || "",
            website: r.homepage || "",
            source: r.html_url,
            duration: "",
            technologies:
              card && card.technologies.length
                ? card.technologies
                : r.language
                ? [r.language]
                : [],
            highlights: [],
            image: "",
          };
        }),
      },
      languages: [],
      interests: [],
      references: [],
    };

    return { ok: true, data };
  } catch (error) {
    console.error("fetchGithubProfile error:", error);
    return { ok: false, status: 500, error: "Failed to build profile from GitHub." };
  }
}
