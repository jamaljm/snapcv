import Link from "next/link";
import type { Metadata } from "next";
import { fetchGithubProfile } from "@/lib/github";
import Temp_1 from "@/components/design/temp_1";
import type { UserProfile } from "@/lib/type";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} on SnapCV (preview)`,
    description: `A live portfolio preview for @${username}, built from their public GitHub. Claim your own at yourname.snapcv.me, free.`,
    // Previews are throwaway; keep them out of the index.
    robots: { index: false, follow: true },
  };
}

export default async function TryPreviewPage({ params }: Props) {
  const { username } = await params;
  const result = await fetchGithubProfile(username);

  if (!result.ok) {
    return (
      <main className="min-h-screen bg-white font-urbanist text-neutral-900 flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold">Couldn&apos;t build a preview</h1>
          <p className="mt-3 text-neutral-600">
            We couldn&apos;t find public GitHub data for{" "}
            <span className="font-semibold">@{username}</span>. Check the username,
            or start from your résumé instead.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Get started
          </Link>
        </div>
      </main>
    );
  }

  // Give the preview a real accent so the template renders fully.
  const profile = {
    ...(result.data as unknown as UserProfile),
    meta: {
      ...(result.data as unknown as UserProfile).meta,
      portfolioColor: "gray",
    },
  } as UserProfile;

  // Readiness nudge: how many projects have a live demo link. Makes the preview
  // feel like a scored, improvable asset (recruiters reward live demos).
  const projects = profile.projects?.projects || [];
  const withDemo = projects.filter((p) => p.website && p.website.trim()).length;
  const nudge =
    projects.length > 0 && withDemo < projects.length
      ? `${withDemo}/${projects.length} projects have a live demo — add links to rank higher`
      : null;

  return (
    <>
      {/* Preview bar: this is the "see it before you sign in" hook. */}
      <div className="no-print sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-2.5 text-sm font-urbanist">
          <span className="text-neutral-600">
            Preview built from{" "}
            <span className="font-semibold text-neutral-900">@{username}</span>
            &apos;s GitHub
          </span>
          <Link
            href="/login"
            className="whitespace-nowrap rounded-lg bg-neutral-900 px-3.5 py-1.5 font-semibold text-white hover:bg-neutral-800"
          >
            Claim yours, free
          </Link>
        </div>
        {nudge && (
          <div className="mx-auto max-w-4xl px-4 pb-2 text-xs text-neutral-500 font-urbanist">
            {nudge}
          </div>
        )}
      </div>
      <Temp_1 user={profile} />
    </>
  );
}
