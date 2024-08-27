import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase_service";

export async function POST(request: Request) {
  const { username } = await request.json();
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("userName", username)
    .limit(1);

  return NextResponse.json({ data, error }, { status: 200 });
}
