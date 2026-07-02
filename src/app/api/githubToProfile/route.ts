import { NextResponse } from "next/server";
import { fetchGithubProfile } from "@/lib/github";

// Turn a GitHub username into a portfolio-ready profile (the create flow uses
// this). Logic lives in @/lib/github so the /try preview page can reuse it.
export async function POST(request: Request) {
  let username = "";
  try {
    const body = await request.json();
    username = String(body?.username || "");
  } catch {
    /* ignore */
  }

  const result = await fetchGithubProfile(username);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ data: result.data });
}
