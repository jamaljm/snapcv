"use client";

import { useEffect, useState } from "react";

// Below this, a sparse grid reads as "inactive" and hurts more than it helps, so
// we render nothing at all. Recruiters reward density; we only show real momentum.
const MIN_CONTRIBUTIONS = 150;

// On mobile, showing the full year makes each cell tiny. Show the most recent
// ~6 months instead, so cells stay legible and the block still fills the width.
const MOBILE_WEEKS = 26;

// Canonical GitHub-green scale (light theme) to match the light portfolio.
const LEVEL_COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];

type Day = { date: string; count: number; level: number };
type Week = { days: Day[] };
type ActivityData = { totalContributions: number; weeks: Week[] };

// Fixed-size swatch, used only in the legend.
function Swatch({ level }: { level: number }) {
  return (
    <span
      className="h-[10px] w-[10px] rounded-[2px] ring-1 ring-inset ring-black/[0.04]"
      style={{ backgroundColor: LEVEL_COLORS[level] ?? LEVEL_COLORS[0] }}
    />
  );
}

export default function GithubActivity({ username }: { username?: string }) {
  const [data, setData] = useState<ActivityData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Gate: only show a graph strong enough to help — never a barren one.
  if (!data || data.totalContributions < MIN_CONTRIBUTIONS) return null;

  // On mobile, window to the most recent ~6 months for legible cell sizes.
  const weeks = isMobile ? data.weeks.slice(-MOBILE_WEEKS) : data.weeks;

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

        {/* Bordered card matching the portfolio's project cards. Columns flex to
            fill the width and cells stay square, so the grid always fits with no
            horizontal scroll: the full year on desktop, the last 6 months (with
            bigger cells) on mobile. */}
        <div className="mx-auto w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex w-full gap-[2px] sm:gap-[3px]">
            {weeks.map((week, wi) => (
              <div
                key={wi}
                className="flex flex-1 flex-col gap-[2px] sm:gap-[3px]"
              >
                {week.days.map((day, di) => (
                  <span
                    key={di}
                    title={
                      day.date
                        ? `${day.count} contribution${
                            day.count === 1 ? "" : "s"
                          } on ${day.date}`
                        : undefined
                    }
                    className="aspect-square w-full rounded-[2px] ring-1 ring-inset ring-black/[0.04]"
                    style={{
                      backgroundColor:
                        LEVEL_COLORS[day.level] ?? LEVEL_COLORS[0],
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-slate-400">
            <span className="sm:hidden">Last 6 months</span>
            <span className="ml-auto flex items-center gap-1.5">
              <span>Less</span>
              {LEVEL_COLORS.map((_, i) => (
                <Swatch key={i} level={i} />
              ))}
              <span>More</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
