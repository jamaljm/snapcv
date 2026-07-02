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

function Cell({ level, title }: { level: number; title?: string }) {
  return (
    <span
      title={title}
      className="block h-[9px] w-[9px] rounded-[2px] ring-1 ring-inset ring-black/[0.04]"
      style={{ backgroundColor: LEVEL_COLORS[level] ?? LEVEL_COLORS[0] }}
    />
  );
}

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
      <div className="w-full space-y-6 py-1">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="inline-block rounded-xl border bg-none px-3 py-1 text-sm font-medium text-black">
            Activity
          </div>
          <h2 className="text-xl font-bold tracking-tighter sm:text-2xl">
            {data.totalContributions.toLocaleString()} contributions this year
          </h2>
        </div>

        {/* Bordered card so the grid reads as a deliberate block that matches the
            portfolio's project cards, rather than a loose graphic. */}
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="overflow-x-auto pb-1">
            <div className="mx-auto flex w-fit gap-[2px]">
              {data.weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.days.map((day, di) => (
                    <Cell
                      key={di}
                      level={day.level}
                      title={
                        day.date
                          ? `${day.count} contribution${
                              day.count === 1 ? "" : "s"
                            } on ${day.date}`
                          : undefined
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end gap-1.5 text-[11px] text-slate-400">
            <span>Less</span>
            {LEVEL_COLORS.map((_, i) => (
              <Cell key={i} level={i} />
            ))}
            <span>More</span>
          </div>
        </div>
      </div>
    </section>
  );
}
