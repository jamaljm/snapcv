import Hero from "@/components/landingpage/Hero";
import Temp_1 from "@/components/design/temp_1";
import { headers } from "next/headers";
import Script from "next/script";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getUser(pathname: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/getUser`, {
      next: { revalidate: 60 },
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: pathname }),
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      return null;
    }

    const { data, error } = await response.json();
    if (error) {
      console.error("API error:", error);
      return null;
    }
    return data[0];
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function IndexPage() {
  const pathname = headers().get("x-current-path")?.split(".")[0] || "";

  if (["www", "snapcv", "localhost:3000"].includes(pathname)) {
    return <Hero />;
  }

  const user = await getUser(pathname);

  let jsonLd = null;
  if (user) {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: user.fullName,
      url: `https://${user.userName}.snapcv.me`,
      image: user.avatarUrl,
      description: user.about,
      sameAs: [
        user.contact?.LinkedIn || "",
        user.contact?.X || "",
        user.contact?.GitHub || "",
        user.contact?.Youtube || "",
        user.contact?.dribbble || "",
      ].filter(Boolean),
      worksFor: {
        "@type": "Organization",
        name: user.roll,
      },
      jobTitle: user.roll,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://${user.userName}.snapcv.me`,
      },
      education: user.education?.map((edu: any) => ({
        "@type": "EducationalOrganization",
        name: edu.institution,
        degree: edu.degree,
        startDate: edu.startDate,
        endDate: edu.endDate,
      })),
      experience: user.workExperience?.map((work: any) => ({
        "@type": "Organization",
        name: work.company,
        jobTitle: work.position,
        startDate: work.startDate,
        endDate: work.endDate,
      })),
      project: user.projects?.map((project: any) => ({
        "@type": "CreativeWork",
        name: project.title,
        description: project.description,
        url: project.link,
      })),
      award: user.hackathons?.map((hackathon: any) => ({
        "@type": "Award",
        name: hackathon.title,
        description: hackathon.description,
      })),
    };
  }
  if (user) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Temp_1 user={user} />
      </>
    );
  }

  return <Hero />;
}
