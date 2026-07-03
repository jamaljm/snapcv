"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Github,
  Globe2,
  PencilLine,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const examples = ["torvalds", "gaearon", "addyosmani"];
const conversionSteps = [
  "Public GitHub profile",
  "Project cards",
  "Editable portfolio",
];
const proofPoints: { label: string; Icon: LucideIcon }[] = [
  { label: "No signup needed", Icon: CheckCircle2 },
  { label: "Uses public GitHub data", Icon: Github },
  { label: "Editable after claiming", Icon: Sparkles },
];

export default function TryIndex() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const previewName = useMemo(
    () => value.trim().replace(/^@/, "").replace(/\s+/g, "-"),
    [value]
  );

  const go = (nameFromButton = previewName) => {
    const name = nameFromButton.trim().replace(/^@/, "");
    if (name) router.push(`/try/${encodeURIComponent(name)}`);
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    go();
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white font-urbanist text-neutral-950">
      <section className="relative min-h-screen px-5 pb-12 pt-5 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,white,transparent_82%)]" />
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
          <nav className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-2xl font-semibold tracking-normal text-neutral-950"
            >
              <Image
                src="/logo.png"
                alt="SnapCV"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              Snapcv
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden rounded-full border-2 border-neutral-900 px-5 py-2 text-sm font-semibold transition hover:bg-neutral-950 hover:text-white sm:inline-flex"
              >
                Start from PDF
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-neutral-950 px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:bg-neutral-800"
              >
                Create now
              </Link>
            </div>
          </nav>

          <div className="grid min-h-[calc(100vh-132px)] items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-700 shadow-sm">
                <Github className="h-4 w-4" />
                Live GitHub to portfolio demo
              </div>

              <h1 className="mt-7 max-w-2xl text-5xl font-semibold leading-[1.02] tracking-normal text-neutral-950 sm:text-6xl lg:text-7xl">
                See your SnapCV before you sign up
              </h1>
              <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-neutral-600 sm:text-xl">
                Enter a public GitHub username and SnapCV turns it into a polished
                portfolio preview with projects, skills, links, and an edit mode
                ready to claim.
              </p>

              <form
                onSubmit={submit}
                className="mt-8 flex max-w-xl flex-col gap-3 rounded-[28px] border border-neutral-200 bg-white p-2 shadow-[0_18px_50px_rgba(0,0,0,0.12)] sm:flex-row"
              >
                <label className="flex min-h-14 flex-1 items-center gap-3 rounded-[22px] bg-neutral-50 px-4">
                  <Github className="h-5 w-5 shrink-0 text-neutral-500" />
                  <span className="text-sm font-semibold text-neutral-400">@</span>
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="your-github-username"
                    aria-label="GitHub username"
                    className="h-full min-w-0 flex-1 bg-transparent text-base font-semibold text-neutral-950 outline-none placeholder:text-neutral-400"
                  />
                </label>
                <button
                  type="submit"
                  disabled={!previewName}
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[22px] bg-neutral-950 px-6 text-base font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
                >
                  Preview
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-neutral-500">
                <span>Try an example:</span>
                {examples.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => go(name)}
                    className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
                  >
                    @{name}
                  </button>
                ))}
              </div>

              <div className="mt-9 grid max-w-2xl gap-3 sm:grid-cols-3">
                {conversionSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-neutral-700">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
              <div className="absolute -left-4 top-12 hidden h-24 w-24 rounded-full border border-neutral-200 bg-white shadow-xl lg:block" />
              <div className="relative rounded-[32px] border border-neutral-200 bg-white p-3 shadow-[0_30px_90px_rgba(0,0,0,0.16)]">
                <div className="overflow-hidden rounded-[24px] border border-neutral-200 bg-neutral-50">
                  <div className="flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-neutral-300" />
                      <span className="h-3 w-3 rounded-full bg-neutral-300" />
                      <span className="h-3 w-3 rounded-full bg-neutral-300" />
                    </div>
                    <div className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-500">
                      <Globe2 className="h-3.5 w-3.5" />
                      preview.snapcv.me
                    </div>
                  </div>

                  <div className="grid gap-0 lg:grid-cols-[1fr_220px]">
                    <div className="bg-white p-5 sm:p-7">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="h-14 w-14 rounded-full bg-neutral-950" />
                          <h2 className="mt-5 text-3xl font-semibold leading-tight">
                            Alex Morgan
                          </h2>
                          <p className="mt-2 max-w-sm text-sm font-medium leading-6 text-neutral-500">
                            Full-stack developer building fast product surfaces,
                            clean APIs, and useful developer tools.
                          </p>
                        </div>
                        <div className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-bold">
                          Available
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-2">
                        {["TypeScript", "Next.js", "Node", "Open Source"].map(
                          (skill) => (
                            <span
                              key={skill}
                              className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-700"
                            >
                              {skill}
                            </span>
                          )
                        )}
                      </div>

                      <div className="mt-7 grid gap-3 sm:grid-cols-2">
                        {[
                          ["Realtime portfolio", "12 stars"],
                          ["Resume parser", "8 stars"],
                        ].map(([title, stat]) => (
                          <div
                            key={title}
                            className="rounded-2xl border border-neutral-200 bg-white p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <h3 className="text-sm font-bold">{title}</h3>
                              <span className="text-xs font-semibold text-neutral-400">
                                {stat}
                              </span>
                            </div>
                            <p className="mt-2 text-xs font-medium leading-5 text-neutral-500">
                              Recruiter-ready project summary generated from
                              public repository details.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 bg-neutral-950 p-5 text-white lg:border-l lg:border-t-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">Edit mode</span>
                        <PencilLine className="h-4 w-4" />
                      </div>
                      <div className="mt-5 space-y-3">
                        {[
                          ["Hero intro", "Ready"],
                          ["Projects", "6 imported"],
                          ["Skills", "Synced"],
                          ["Domain", "Claim"],
                        ].map(([label, status]) => (
                          <div
                            key={label}
                            className="rounded-2xl border border-white/10 bg-white/10 p-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-white/70">
                                {label}
                              </span>
                              <span className="text-xs font-bold text-white">
                                {status}
                              </span>
                            </div>
                            <div className="mt-2 h-2 rounded-full bg-white/15">
                              <div className="h-2 w-3/4 rounded-full bg-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => go(previewName || examples[0])}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-neutral-950 transition hover:bg-neutral-100"
                      >
                        <Eye className="h-4 w-4" />
                        Open preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative -mt-6 ml-auto mr-4 flex max-w-sm items-center gap-3 rounded-3xl border border-neutral-200 bg-white p-4 shadow-[0_18px_45px_rgba(0,0,0,0.14)] sm:mr-10">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-950 text-white">
                  <WandSparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-950">
                    Conversion preview
                  </p>
                  <p className="text-xs font-semibold leading-5 text-neutral-500">
                    Claim the preview to save it, edit every section, and publish
                    it on your SnapCV domain.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 border-t border-neutral-200 pt-6 sm:grid-cols-3">
            {proofPoints.map(({ label, Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 text-sm font-bold text-neutral-700"
              >
                <Icon className="h-5 w-5 text-neutral-950" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
