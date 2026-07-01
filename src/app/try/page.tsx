"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function TryIndex() {
  const [value, setValue] = useState("");
  const router = useRouter();

  const go = () => {
    const name = value.trim().replace(/^@/, "");
    if (name) router.push(`/try/${encodeURIComponent(name)}`);
  };

  return (
    <main className="min-h-screen bg-white font-urbanist text-neutral-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <Link
          href="/snapcv"
          className="text-sm font-semibold text-neutral-500 hover:text-neutral-900"
        >
          ← SnapCV
        </Link>
        <h1 className="mt-8 text-3xl font-bold leading-tight">
          See your portfolio before you sign up
        </h1>
        <p className="mt-3 text-neutral-600">
          Type your GitHub username and we&apos;ll build a live preview from your
          public profile. No account needed.
        </p>

        <div className="mt-6 flex gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") go();
            }}
            placeholder="your-github-username"
            className="flex-1 rounded-xl border border-neutral-300 px-4 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
          <button
            onClick={go}
            className="rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
          >
            Preview
          </button>
        </div>

        <p className="mt-4 text-sm text-neutral-400">
          Prefer a résumé?{" "}
          <Link href="/login" className="underline hover:text-neutral-700">
            Start from a PDF
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
