import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase_service";

export async function POST(request: Request) {
  const { username } = await request.json();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("userName", username)
    .single();
  console.log(data);
  return NextResponse.json(
    { data: data?.resumeJson, githubData: data?.githubWrap, error },
    { status: 200 }
  );
}
