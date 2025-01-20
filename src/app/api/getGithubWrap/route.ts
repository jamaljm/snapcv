import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase_service";

export async function POST(request: Request) {
  const { username } = await request.json();
  const { data, error } = await supabase
    .from("users")
    .select("githubWrap")
    .eq("userName", username)
    .single();
  return NextResponse.json(
    { githubData: data?.githubWrap, error },
    { status: 200 }
  );
}
