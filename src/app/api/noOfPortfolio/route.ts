import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabase_service";

export async function GET() {
  const { count, error } = await supabase
    .from("users")
    .select("*", { count: 'exact', head: true });

  return NextResponse.json({ count, error }, { status: 200 });
}
