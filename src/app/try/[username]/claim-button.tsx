"use client";

import { useRouter } from "next/navigation";

// Carries the previewed GitHub username through signup so claiming saves THIS
// portfolio (not a blank one). Stored in localStorage because it has to survive
// the Google OAuth round-trip; /create reads and clears it on arrival.
export default function ClaimButton({
  username,
  className,
  children,
}: {
  username: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const claim = () => {
    try {
      if (username) localStorage.setItem("snapcv_prefill_github", username);
    } catch {}
    // /create is auth-guarded: logged-out users get sent to login, and the OAuth
    // callback returns to /create, where the prefill is applied.
    router.push("/create");
  };
  return (
    <button type="button" onClick={claim} className={className}>
      {children}
    </button>
  );
}
