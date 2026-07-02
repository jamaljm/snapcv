import type { MetadataRoute } from "next";
import { supabase } from "@/utils/supabase/supabase_service";

// Rebuild hourly so newly published portfolios enter the sitemap.
export const revalidate = 3600;

const BASE = "https://snapcv.me";

// A valid DNS label / subdomain: lowercase alphanumeric + hyphens, 1–63 chars,
// no leading/trailing hyphen. Excludes usernames with spaces, dots, slashes, or
// full URLs (legacy/garbage data) that caused Google Search Console errors.
function isValidSubdomain(name: string): boolean {
  return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(name);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/read-cv-alternative`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/login`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/signup`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Every published portfolio is its own indexable landing page — this is the
  // compounding SEO asset. Wrapped so a DB hiccup never breaks the sitemap.
  let portfolios: MetadataRoute.Sitemap = [];
  try {
    const { data } = await supabase
      .from("users")
      .select("userName, updatedAt")
      .not("userName", "is", null)
      .limit(10000);

    portfolios = (data || [])
      .map((u: { userName?: string | null; updatedAt?: string | null }) => ({
        name: (u.userName || "").trim().toLowerCase(),
        updatedAt: u.updatedAt,
      }))
      .filter((u) => isValidSubdomain(u.name))
      .map((u) => ({
        url: `https://${u.name}.snapcv.me`,
        lastModified: u.updatedAt || undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error("sitemap: failed to load portfolios", error);
  }

  return [...staticEntries, ...portfolios];
}
