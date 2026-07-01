import Hero from "@/components/landingpage/Hero";
import { headers } from "next/headers";
import ResumeTemplate from "@/components/design/resume_template";
import PrintResumeButton from "@/components/PrintResumeButton";
import {
  LANDING_PAGES,
  getPortfolio,
  getSubdomain,
  generateJsonLd,
} from "@/lib/portfolio";

export default async function IndexPage() {
  const headersList = await headers();
  const pathname = getSubdomain(headersList.get("x-current-path"));

  if (LANDING_PAGES.includes(pathname as (typeof LANDING_PAGES)[number])) {
    return <Hero />;
  }

  const result = await getPortfolio(pathname);

  if (!result?.data) {
    return <Hero />;
  }

  const jsonLd = generateJsonLd(result.data);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ResumeTemplate profile={result.data} />
      <PrintResumeButton />
    </>
  );
}
