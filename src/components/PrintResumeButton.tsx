"use client";

// A floating "Download PDF" button on the résumé page. Uses the browser's
// print-to-PDF (no dependency), and the print stylesheet in globals.css isolates
// #resume-template so the output is a clean, single résumé document.
export default function PrintResumeButton() {
  return (
    <button
      onClick={() => window.print()}
      aria-label="Download résumé as PDF"
      className="no-print fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="size-4"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
        />
      </svg>
      Download PDF
    </button>
  );
}
