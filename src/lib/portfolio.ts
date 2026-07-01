import type { UserProfile } from "@/lib/type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/** Subdomains that render the marketing site instead of a user portfolio. */
export const LANDING_PAGES = ["www", "snapcv", "localhost:3000"] as const;

export interface PortfolioResult {
  data: UserProfile;
  githubData: unknown;
}

/**
 * Fetch a user's portfolio by username (subdomain) from the API layer.
 * Returns null for empty usernames, HTTP/API errors, or network failures.
 */
export async function getPortfolio(
  username: string
): Promise<PortfolioResult | null> {
  if (!username) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/getUser`, {
      cache: "no-cache",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }

    const { data, githubData, error } = await response.json();
    if (error) {
      console.error("API error:", error);
      return null;
    }

    return { data, githubData };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

/** Resolve the portfolio username from the middleware-provided host header. */
export function getSubdomain(host: string | null): string {
  return host?.split(".")[0] || "";
}

/** Build schema.org Person JSON-LD for a portfolio (used across / and /resume). */
export function generateJsonLd(user: UserProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.basics.name,
    url: user.basics.website,
    image: user.basics.avatarUrl,
    description: user.basics.about,
    sameAs: user.basics.profiles.map((profile) => profile.url).filter(Boolean),
    worksFor:
      user.work.length > 0
        ? {
            "@type": "Organization",
            name: user.work[0].name,
          }
        : undefined,
    jobTitle: user.work.length > 0 ? user.work[0].position : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": user.basics.website,
    },
    education: user.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.institution,
      degree: edu.studyType,
      startDate: edu.startDate,
      endDate: edu.endDate,
    })),
    experience: user.work.map((work) => ({
      "@type": "Organization",
      name: work.name,
      jobTitle: work.position,
      startDate: work.startDate,
      endDate: work.endDate,
    })),
    project: user.projects.projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url: project.website,
    })),
    award: user.hackathons.hackathons.map((hackathon) => ({
      "@type": "Award",
      name: hackathon.title,
      description: hackathon.description,
    })),
  };
}
