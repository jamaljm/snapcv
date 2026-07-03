"use client";

import { useState } from "react";

export default function CopySnippet({ snippet }: { snippet: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(snippet).then(done).catch(() => {});
    } else {
      const ta = document.createElement("textarea");
      ta.value = snippet;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {}
      document.body.removeChild(ta);
      done();
    }
  };
  return (
    <div className="flex items-stretch gap-2">
      <pre className="flex-1 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs text-neutral-800">
        {snippet}
      </pre>
      <button
        type="button"
        onClick={copy}
        className={`shrink-0 rounded-xl px-4 text-sm font-semibold text-white ${
          copied ? "bg-green-600" : "bg-neutral-900 hover:bg-neutral-800"
        }`}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
