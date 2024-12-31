import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);

  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${requestUrl.origin}/auth/callback` },
  });

  return NextResponse.json({ data }, { status: 200 });
}
