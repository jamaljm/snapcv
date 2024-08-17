import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase_service";

export async function POST(request: Request) {
  const { slug } = await request.json();

  const { data, error } = await supabase
    .from("User")
    .select("userName")
    .eq("userName", slug);

  return NextResponse.json({ data, error }, { status: 200 });
}
