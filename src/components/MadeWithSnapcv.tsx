import Link from "next/link";

/**
 * Subtle "Made with SnapCV" badge shown on hosted portfolios (the referral loop).
 * Monochrome and understated so it matches the sleek portfolio design and never
 * competes with the user's own content. `?ref=badge` lets us attribute signups.
 */
export default function MadeWithSnapcv() {
  return (
    <div className="w-full flex justify-center py-10">
      <Link
        href="https://snapcv.me?ref=badge"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
        Made with <span className="font-semibold text-gray-900">SnapCV</span>
      </Link>
    </div>
  );
}
