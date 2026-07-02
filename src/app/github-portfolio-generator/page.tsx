import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://snapcv.me"),
  title: "Free GitHub Portfolio Generator | SnapCV",
  description:
    "Turn your GitHub username into a recruiter-ready portfolio in seconds. SnapCV ranks your best repos, writes a plain-English line for each, and hosts it at yourname.snapcv.me. Free and open source.",
  alternates: { canonical: "https://snapcv.me/github-portfolio-generator" },
  openGraph: {
    title: "Free GitHub Portfolio Generator | SnapCV",
    description:
      "Turn your GitHub username into a recruiter-ready portfolio in seconds. Free and open source.",
    url: "https://snapcv.me/github-portfolio-generator",
    type: "article",
  },
};

const CTA = () => (
  <Link
    href="/try"
    className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
  >
    See your portfolio, no signup
  </Link>
);

export default function Page() {
  return (
    <main className="min-h-screen bg-white font-urbanist text-neutral-900">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <Link
          href="/snapcv"
          className="text-sm font-semibold text-neutral-500 hover:text-neutral-900"
        >
          ← SnapCV
        </Link>

        <h1 className="mt-8 text-3xl sm:text-4xl font-bold leading-tight">
          Turn your GitHub into a portfolio recruiters actually read
        </h1>
        <p className="mt-5 text-lg text-neutral-600 leading-relaxed">
          A recruiter opens your GitHub, spends about 90 seconds, and moves on.
          The problem is what they see: repos with no README, no description, and
          no live link. The work is good. Nobody wrote the part that explains it.
        </p>
        <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
          SnapCV fixes that. Type your GitHub username and it builds you a hosted
          portfolio at <span className="font-semibold">yourname.snapcv.me</span>:
          your best repos ranked, a short plain-English line written for each one
          (what it does and the stack), your contribution graph, and a clean
          résumé view. It&apos;s <strong>free</strong> and{" "}
          <strong>open source</strong>.
        </p>

        <div className="mt-8">
          <CTA />
        </div>

        <h2 className="mt-16 text-2xl font-bold">
          Why it beats a plain GitHub link
        </h2>
        <ul className="mt-5 space-y-4 text-neutral-700">
          <li>
            <strong>Your projects get explained.</strong> Each top repo gets a
            short, honest description a non-engineer recruiter can follow, plus
            the real tech stack. No writing READMEs.
          </li>
          <li>
            <strong>Proof of work up front.</strong> Your contribution graph shows
            you ship consistently, right on the page.
          </li>
          <li>
            <strong>It looks like a person made it.</strong> Clean and monochrome,
            not the AI-generated template look recruiters are tired of.
          </li>
          <li>
            <strong>A link you can send anywhere.</strong> yourname.snapcv.me
            drops cleanly into an application, a DM, or your bio.
          </li>
        </ul>

        <h2 className="mt-16 text-2xl font-bold">How it works</h2>
        <ol className="mt-5 space-y-3 text-neutral-700 list-decimal pl-5">
          <li>Enter your GitHub username and see a live preview, no account needed.</li>
          <li>Claim your name, which becomes your URL.</li>
          <li>Edit anything you want, hit save, and your page is live.</li>
        </ol>

        <div className="mt-10">
          <CTA />
        </div>
      </div>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto max-w-2xl px-6 py-8 text-sm text-neutral-400">
          SnapCV is free and open source on{" "}
          <a
            href="https://github.com/jamaljm/snapcv"
            className="underline hover:text-neutral-700"
          >
            GitHub
          </a>
          .
        </div>
      </footer>
    </main>
  );
}
