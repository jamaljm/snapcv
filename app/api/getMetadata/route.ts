import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase_service";

export async function POST(request: Request) {
  const { username } = await request.json();
console.log(username);
  const { data, error } = await supabase
    .from("User")
    .select("fullName, userName, about, avatarUrl")
    .eq("userName", username)
    .single();

  console.log(data);

  return NextResponse.json({ data, error }, { status: 200 });
}
