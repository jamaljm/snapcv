import { NextResponse } from "next/server";
import { isValidGithubUsername } from "@/lib/github";

// Returns a GitHub user's contribution calendar (the day-by-day grid) for the
// portfolio "Activity" graph. The day-level data is only available via GitHub's
// GraphQL API, which requires a token. Any failure (no token, bad user, rate
// limit) returns an empty payload so the client simply renders nothing.

const GITHUB_API_URL = "https://api.github.com/graphql";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// GitHub's contributionLevel enum → 0–4 intensity for our green scale.
const LEVEL: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

const EMPTY = { totalContributions: 0, weeks: [] as unknown[] };

// Contributions don't change minute-to-minute; cache for an hour.
export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") || "").trim().replace(/^@/, "");

  if (!isValidGithubUsername(username) || !GITHUB_TOKEN) {
    return NextResponse.json(EMPTY);
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GITHUB_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return NextResponse.json(EMPTY);

    const json = await res.json();
    const cal =
      json?.data?.user?.contributionsCollection?.contributionCalendar;
    if (!cal) return NextResponse.json(EMPTY);

    type GhDay = {
      date: string;
      contributionCount: number;
      contributionLevel: string;
    };
    const weeks = (cal.weeks || []).map(
      (w: { contributionDays?: GhDay[] }) => ({
        days: (w.contributionDays || []).map((d: GhDay) => ({
          date: d.date,
          count: d.contributionCount,
          level: LEVEL[d.contributionLevel] ?? 0,
        })),
      })
    );

    return NextResponse.json({
      totalContributions: cal.totalContributions || 0,
      weeks,
    });
  } catch {
    return NextResponse.json(EMPTY);
  }
}
