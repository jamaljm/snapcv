import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://snapcv.me"),
  title: "The best free read.cv & Bento alternative | SnapCV",
  description:
    "read.cv shut down and Bento is next. SnapCV is a free, open-source home for your profile: a hosted portfolio at yourname.snapcv.me, built from your résumé or GitHub.",
  alternates: { canonical: "https://snapcv.me/read-cv-alternative" },
  openGraph: {
    title: "The best free read.cv & Bento alternative | SnapCV",
    description:
      "A free, open-source home for your profile after read.cv and Bento. Hosted portfolio at yourname.snapcv.me.",
    url: "https://snapcv.me/read-cv-alternative",
    type: "article",
  },
};

const CTA = () => (
  <Link
    href="/login"
    className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
  >
    Claim your yourname.snapcv.me
  </Link>
);

export default function Page() {
  return (
    <main className="min-h-screen bg-white font-urbanist text-neutral-900">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <Link href="/snapcv" className="text-sm font-semibold text-neutral-500 hover:text-neutral-900">
          ← SnapCV
        </Link>

        <h1 className="mt-8 text-3xl sm:text-4xl font-bold leading-tight">
          Lost your profile when read.cv shut down? Bento&apos;s next.
        </h1>
        <p className="mt-5 text-lg text-neutral-600 leading-relaxed">
          read.cv closed in May 2025 after the Perplexity acquisition, and
          Bento.me is shutting down in February 2026. If you had a clean personal
          page on either, you need a new home. Ideally one that won&apos;t
          disappear the next time it gets bought.
        </p>
        <p className="mt-4 text-lg text-neutral-600 leading-relaxed">
          SnapCV is that home. It&apos;s <strong>free</strong> and{" "}
          <strong>open source</strong>, so there&apos;s no paywall and no company
          that can pull the plug on your page. You get a hosted portfolio at{" "}
          <span className="font-semibold">yourname.snapcv.me</span> and a clean
          résumé view, and you can edit every word.
        </p>

        <div className="mt-8">
          <CTA />
        </div>

        <h2 className="mt-16 text-2xl font-bold">Why people move to SnapCV</h2>
        <ul className="mt-5 space-y-4 text-neutral-700">
          <li>
            <strong>You own it.</strong> The whole thing is open source (AGPL),
            and you can self-host it whenever you want. Your profile isn&apos;t
            hostage to a startup&apos;s roadmap.
          </li>
          <li>
            <strong>Start from what you already have.</strong> Upload a résumé PDF
            or type your GitHub username, and you get a real page in seconds. No
            blank canvas.
          </li>
          <li>
            <strong>It looks like a person made it.</strong> Clean, monochrome, no
            template smell. The opposite of the AI-generated look recruiters are
            tired of.
          </li>
          <li>
            <strong>A memorable URL.</strong> Every portfolio lives at{" "}
            <span className="font-semibold">yourname.snapcv.me</span>, so it&apos;s
            easy to drop in a bio, a DM, or an application.
          </li>
        </ul>

        <h2 className="mt-16 text-2xl font-bold">Moving over takes about a minute</h2>
        <ol className="mt-5 space-y-3 text-neutral-700 list-decimal pl-5">
          <li>Sign in with Google and pick your name. That becomes your URL.</li>
          <li>Upload your résumé PDF, or enter your GitHub username.</li>
          <li>Tweak anything, hit save, and your page is live.</li>
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
