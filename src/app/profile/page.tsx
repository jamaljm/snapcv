"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client";
import { useCommonContext } from "@/Common_context";
import withAuth from "@/utils/authProtect";
import { Spinner } from "@nextui-org/react";

function ProfilePage() {
  const { userData, logout } = useCommonContext();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const sessionUser = userData?.user;
  const meta = sessionUser?.user_metadata ?? {};
  const name: string =
    meta.full_name || meta.name || sessionUser?.email || "Your account";
  const avatar: string = meta.avatar_url || meta.picture || "";
  const email: string = sessionUser?.email || "";

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!sessionUser?.id) return;
      try {
        const { data } = await supabase
          .from("users")
          .select("userName")
          .eq("userId", sessionUser.id)
          .single();
        if (active) setUserName(data?.userName ?? null);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [sessionUser?.id]);

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner color="default" />
      </div>
    );
  }

  const portfolioUrl = userName ? `https://${userName}.snapcv.me` : null;

  return (
    <main className="min-h-screen w-full flex flex-col items-center bg-neutral-50 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/snapcv"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <img src="/logo.png" className="h-7" alt="SnapCV logo" /> Snapcv
          </Link>
          <Link
            href="/home"
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            Dashboard
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
          <div className="flex items-center gap-4">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile photo"
                className="w-16 h-16 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-neutral-200 flex items-center justify-center text-2xl font-semibold text-neutral-500">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-neutral-900 truncate">
                {name}
              </h1>
              {email && (
                <p className="text-sm text-neutral-500 truncate">{email}</p>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 px-4 py-3">
              <span className="text-sm text-neutral-500">Portfolio</span>
              {portfolioUrl ? (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline truncate"
                >
                  {userName}.snapcv.me
                </a>
              ) : (
                <span className="text-sm text-neutral-400">Not created yet</span>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/home"
              className="flex-1 text-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Open editor
            </Link>
            {portfolioUrl && (
              <a
                href={portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                View live
              </a>
            )}
          </div>

          <button
            onClick={logout}
            className="mt-4 w-full rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Log out
          </button>
        </div>
      </div>
    </main>
  );
}

export default withAuth(ProfilePage);
