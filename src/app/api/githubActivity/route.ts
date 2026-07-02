import { NextResponse } from "next/server";
import { isValidGithubUsername } from "@/lib/github";

// Contribution calendar for the portfolio "Activity" graph. Sourced from a public,
// tokenless GitHub contributions API (jogruber) so it needs no GITHUB_TOKEN to
// keep alive. Any failure returns an empty payload so the client renders nothing.

const EMPTY = { totalContributions: 0, weeks: [] as unknown[] };

// Contributions don't change minute-to-minute; cache for an hour.
export const revalidate = 3600;

type ApiDay = { date: string; count: number; level: number };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = (searchParams.get("username") || "").trim().replace(/^@/, "");
  if (!isValidGithubUsername(username)) return NextResponse.json(EMPTY);

  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
        username
      )}?y=last`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return NextResponse.json(EMPTY);

    const data = await res.json();
    const contributions: ApiDay[] = Array.isArray(data?.contributions)
      ? data.contributions
      : [];
    if (contributions.length === 0) return NextResponse.json(EMPTY);

    const total =
      typeof data?.total?.lastYear === "number"
        ? data.total.lastYear
        : contributions.reduce((sum, d) => sum + (d.count || 0), 0);

    const days = contributions.map((d) => ({
      date: d.date,
      count: d.count || 0,
      level: typeof d.level === "number" ? d.level : 0,
    }));

    // Pad the front so the first column starts on Sunday (GitHub's layout).
    // Pad cells are level 0 with no count, so they never affect the total.
    const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay(); // 0 = Sun
    const padded = [
      ...Array.from({ length: firstDow }, () => ({
        date: "",
        count: 0,
        level: 0,
      })),
      ...days,
    ];

    const weeks: { days: ApiDay[] }[] = [];
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push({ days: padded.slice(i, i + 7) });
    }

    return NextResponse.json({ totalContributions: total, weeks });
  } catch {
    return NextResponse.json(EMPTY);
  }
}
