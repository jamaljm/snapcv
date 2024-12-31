import Hero from "@/components/landingpage/Hero";
import Temp_1 from "@/components/design/temp_1";
import { headers } from "next/headers";
import { UserProfile } from "@/lib/type";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const LANDING_PAGES = ["www", "snapcv", "localhost:3000"] as const;

async function getUser(username: string): Promise<any | null> {
  if (!username) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/getUser`, {
      cache: "no-cache",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }

    const { data, githubData, error } = await response.json();
    if (error) {
      console.error("API error:", error);
      return null;
    }

    return { data, githubData };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

function generateJsonLd(user: UserProfile) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.basics.name,
    url: user.basics.website,
    image: user.basics.avatarUrl,
    description: user.basics.about,
    sameAs: user.basics.profiles.map((profile) => profile.url).filter(Boolean),
    worksFor:
      user.work.length > 0
        ? {
            "@type": "Organization",
            name: user.work[0].name,
          }
        : undefined,
    jobTitle: user.work.length > 0 ? user.work[0].position : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": user.basics.website,
    },
    education: user.education.map((edu) => ({
      "@type": "EducationalOrganization",
      name: edu.institution,
      degree: edu.studyType,
      startDate: edu.startDate,
      endDate: edu.endDate,
    })),
    experience: user.work.map((work) => ({
      "@type": "Organization",
      name: work.name,
      jobTitle: work.position,
      startDate: work.startDate,
      endDate: work.endDate,
    })),
    project: user.projects.projects.map((project) => ({
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
      url: project.website,
    })),
    award: user.hackathons.hackathons.map((hackathon) => ({
      "@type": "Award",
      name: hackathon.title,
      description: hackathon.description,
    })),
  };
}

export default async function IndexPage() {
  const headersList = await headers();
  const pathname = headersList.get("x-current-path")?.split(".")[0] || "";
  if (LANDING_PAGES.includes(pathname as any)) {
    return <Hero />;
  }

  const { data, githubData } = await getUser(pathname);

  if (!data) {
    return <Hero />;
  }
  console.log(data);
  const jsonLd = generateJsonLd(data);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Temp_1 isHome={false} user={data} githubData={githubData} />
    </>
  );
}
