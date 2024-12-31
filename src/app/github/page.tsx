import GithubCard2 from "@/components/github_wrap/github-card";

import Hero from "@/components/landingpage/Hero";
import Temp_1 from "@/components/design/temp_1";
import { headers } from "next/headers";
import { UserProfile } from "@/lib/type";
import GithubCard from "@/components/github_wrap_portfolio/github-card";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LANDING_PAGES = ["www", "snapcv", "localhost:3000"] as const;

async function getUser(username: string): Promise<any | null> {
  if (!username) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/getGithubWrap`, {
      cache: "no-cache",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }

    const { githubData, error } = await response.json();
    if (error) {
      console.error("API error:", error);
      return null;
    }

    return githubData;
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function IndexPage() {
  const headersList = await headers();
  const pathname = headersList.get("x-current-path")?.split(".")[0] || "";
  if (LANDING_PAGES.includes(pathname as any)) {
    return <Hero />;
  }

  const githubData = await getUser(pathname);

  if (!githubData) {
    return <Hero />;
  }
  return (
    <div className="min-h-screen bg-gray-900 p-8 flex items-center justify-center">
      <div className="max-w-7xl mx-auto">
        <>
          <div className="sm:hidden block">
            <GithubCard data={githubData} />
          </div>
          <div className="hidden sm:block">
            <GithubCard2 data={githubData} />
          </div>
        </>
      </div>
    </div>
  );
}
