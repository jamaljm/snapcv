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
// Structured data for a portfolio. Emitted as a ProfilePage wrapping a Person
// (Google's recommended pattern for profile pages) using only valid schema.org
// properties, so search + AI answer engines (AEO/GEO) can understand and cite the
// person. The canonical URL is the snapcv portfolio, not the user's external site.
export function generateJsonLd(user: UserProfile) {
  const canonical = `https://${user.meta.userName}.snapcv.me`;
  const orUndef = <T,>(arr: T[]): T[] | undefined =>
    arr.length ? arr : undefined;

  // Socials + personal site, plus the canonical portfolio, as the entity's
  // corroborating identities.
  const sameAs = [
    ...(user.basics.profiles || []).map((p) => p.url).filter(Boolean),
    user.basics.website,
  ].filter(Boolean);

  // knowsAbout is a strong AEO signal for "what is this person expert in".
  const knowsAbout = [
    ...(user.basics.skills || []),
    ...(user.skills || []).flatMap((s) => s.keywords || []),
  ]
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean);

  const person = {
    "@type": "Person",
    "@id": `${canonical}/#person`,
    name: user.basics.name,
    url: canonical,
    image: user.basics.avatarUrl || undefined,
    description: user.basics.about || undefined,
    jobTitle: user.basics.label || user.work?.[0]?.position || undefined,
    email: user.basics.email ? `mailto:${user.basics.email}` : undefined,
    address: user.basics.location?.city
      ? {
          "@type": "PostalAddress",
          addressLocality: user.basics.location.city,
          addressCountry: user.basics.location.countryCode || undefined,
        }
      : undefined,
    sameAs: orUndef(sameAs),
    worksFor: user.work?.[0]?.name
      ? { "@type": "Organization", name: user.work[0].name }
      : undefined,
    alumniOf: orUndef(
      (user.education || [])
        .filter((edu) => edu.institution?.trim())
        .map((edu) => ({
          "@type": "EducationalOrganization",
          name: edu.institution,
        }))
    ),
    knowsAbout: orUndef([...new Set(knowsAbout)]),
  };

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": canonical,
    url: canonical,
    mainEntity: person,
  };
}
