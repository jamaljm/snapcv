import { NextResponse } from "next/server";

const GH = "https://api.github.com";
const token = process.env.GITHUB_TOKEN;

function ghHeaders() {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "snapcv",
  };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
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

/**
 * Turn a GitHub username into a portfolio-ready UserProfile.
 * Fills what GitHub knows (basics, projects from top repos, skills from
 * languages); leaves work/education/etc. empty for the editor. The lowest-
 * friction way to create a portfolio — no résumé required.
 */
export async function POST(request: Request) {
  let username = "";
  try {
    const body = await request.json();
    username = String(body?.username || "").trim().replace(/^@/, "");
  } catch {
    /* ignore */
  }

  if (!username || !/^[a-zA-Z0-9-]{1,39}$/.test(username)) {
    return NextResponse.json({ error: "Provide a valid GitHub username." }, { status: 400 });
  }

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${GH}/users/${username}`, { headers: ghHeaders(), cache: "no-store" }),
      fetch(`${GH}/users/${username}/repos?per_page=100&sort=updated`, {
        headers: ghHeaders(),
        cache: "no-store",
      }),
    ]);

    if (userRes.status === 404) {
      return NextResponse.json({ error: `GitHub user "${username}" not found.` }, { status: 404 });
    }
    if (!userRes.ok) {
      return NextResponse.json({ error: "GitHub request failed." }, { status: 502 });
    }

    const user: GhUser = await userRes.json();
    const repos: GhRepo[] = reposRes.ok ? await reposRes.json() : [];

    // Top non-fork, non-archived repos by stars → projects.
    const topRepos = repos
      .filter((r) => !r.fork && !r.archived)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6);

    // Languages across those repos → skills.
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
        ? { username: user.twitter_username, url: `https://x.com/${user.twitter_username}`, network: "X" }
        : { username: "", url: "", network: "X" },
      website ? { username: "", url: website, network: "Website" } : null,
    ].filter(Boolean);

    const resumeJson = {
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
        projects: topRepos.map((r) => ({
          title: r.name,
          description: r.description || "",
          website: r.homepage || "",
          source: r.html_url,
          duration: "",
          technologies: r.language ? [r.language] : [],
          highlights: [],
          image: "",
        })),
      },
      languages: [],
      interests: [],
      references: [],
    };

    return NextResponse.json({ data: resumeJson });
  } catch (error) {
    console.error("githubToProfile error:", error);
    return NextResponse.json({ error: "Failed to build profile from GitHub." }, { status: 500 });
  }
}
