import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase_service";

export async function POST(request: Request) {
  const { username } = await request.json();
  const { data, error } = await supabase
    .from("users")
    .select("resumeJson")
    .eq("userName", username)
    .single();

  return NextResponse.json(
    { resumeJson: data?.resumeJson, error },
    { status: 200 }
  );
}
