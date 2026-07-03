import Link from "next/link";
import type { Metadata } from "next";
import CopySnippet from "./copy-snippet";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `Add your SnapCV badge to your GitHub README`,
    description: `Drop a live portfolio card into @${username}'s GitHub profile README. Updates itself, links to ${username}.snapcv.me.`,
    robots: { index: false, follow: true },
  };
}

export default async function BadgePage({ params }: Props) {
  const { username } = await params;
  const handle = (username || "").trim().toLowerCase();
  const base = "https://www.snapcv.me";
  const lightCard = `${base}/api/card/${handle}`;
  const darkCard = `${base}/api/card/${handle}?theme=dark`;
  const portfolioUrl = `https://${handle}.snapcv.me`;
  // A <picture> so GitHub swaps the card to match the viewer's light/dark theme.
  const snippet = `<a href="${portfolioUrl}"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="${darkCard}">
  <img src="${lightCard}" alt="My SnapCV portfolio" width="460">
</picture></a>`;

  return (
    <main className="min-h-screen bg-white font-urbanist text-neutral-900">
      <div className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
        <Link
          href="/snapcv"
          className="text-sm font-semibold text-neutral-500 hover:text-neutral-900"
        >
          ← SnapCV
        </Link>

        <h1 className="mt-8 text-3xl font-bold leading-tight sm:text-4xl">
          Put your portfolio on your GitHub profile
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Recruiters and other devs land on your GitHub profile. This card sits at
          the top of it, links to your portfolio, and stays in sync. One line of
          markdown.
        </p>

        {/* Live previews: light and dark, so it's clear the card adapts. */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/card/${handle}`}
              alt={`${handle} on SnapCV, light`}
              width={460}
              height={140}
              className="mx-auto w-full max-w-[380px]"
            />
            <p className="mt-3 text-center text-xs text-neutral-400">Light mode</p>
          </div>
          <div className="rounded-2xl border border-neutral-800 bg-[#0d1117] p-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/card/${handle}?theme=dark`}
              alt={`${handle} on SnapCV, dark`}
              width={460}
              height={140}
              className="mx-auto w-full max-w-[380px]"
            />
            <p className="mt-3 text-center text-xs text-neutral-500">Dark mode</p>
          </div>
        </div>

        <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Copy this into your README
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          It automatically switches between light and dark to match whoever is
          viewing your profile.
        </p>
        <div className="mt-3">
          <CopySnippet snippet={snippet} />
        </div>

        <ol className="mt-8 space-y-3 list-decimal pl-5 text-neutral-700">
          <li>
            Open the special repo named after your username (
            <span className="font-semibold">
              github.com/{handle}/{handle}
            </span>
            ). Create it if you don&apos;t have one, with a README.
          </li>
          <li>Paste the line above at the top of the README and commit.</li>
          <li>Your profile now shows a clean card that links to your portfolio.</li>
        </ol>

        <div className="mt-10">
          <Link
            href={`/try/${handle}`}
            className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            See your portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
