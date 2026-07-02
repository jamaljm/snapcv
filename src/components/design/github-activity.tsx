"use client";

import { useEffect, useState } from "react";

// Below this, a sparse grid reads as "inactive" and hurts more than it helps, so
// we render nothing at all. Recruiters reward density; we only show real momentum.
const MIN_CONTRIBUTIONS = 150;

// Canonical GitHub-green scale (light theme) to match the light portfolio.
const LEVEL_COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

type Day = { date: string; count: number; level: number };
type Week = { days: Day[] };
type ActivityData = { totalContributions: number; weeks: Week[] };

export default function GithubActivity({ username }: { username?: string }) {
  const [data, setData] = useState<ActivityData | null>(null);

  useEffect(() => {
    if (!username) return;
    let alive = true;
    fetch(`/api/githubActivity?username=${encodeURIComponent(username)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d: ActivityData | null) => {
        if (alive && d) setData(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [username]);

  // Gate: only show a graph strong enough to help — never a barren one.
  if (!data || data.totalContributions < MIN_CONTRIBUTIONS) return null;

  return (
    <section id="activity" className="p-6">
      <div className="space-y-8 w-full py-1">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block border rounded-xl bg-none text-black font-medium px-3 py-1 text-sm">
              Activity
            </div>
            <h2 className="text-xl font-bold tracking-tighter sm:text-2xl">
              {data.totalContributions.toLocaleString()} contributions this year
            </h2>
          </div>
        </div>
        <div className="mx-auto w-fit max-w-full overflow-x-auto">
          <div className="flex gap-[3px]">
            {data.weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {week.days.map((day, di) => (
                  <div
                    key={di}
                    className="h-[10px] w-[10px] rounded-[2px]"
                    style={{
                      backgroundColor:
                        LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0],
                    }}
                    title={`${day.count} contribution${
                      day.count === 1 ? "" : "s"
                    } on ${day.date}`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-end gap-1 text-xs text-slate-500">
            <span>Less</span>
            {LEVEL_COLORS.map((c, i) => (
              <span
                key={i}
                className="h-[10px] w-[10px] rounded-[2px]"
                style={{ backgroundColor: c }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
