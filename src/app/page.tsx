import Hero from "@/components/landingpage/Hero";
import Temp_1 from "@/components/design/temp_1";
import { headers } from "next/headers";
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
    // Brand entity data so Google associates snapcv.me with "SnapCV" (helps the
    // branded search vs. same-name competitors) and flags it as a free tool.
    const brandJsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://snapcv.me/#organization",
          name: "SnapCV",
          url: "https://snapcv.me",
          logo: "https://www.snapcv.me/logo_icon2.png",
          sameAs: ["https://github.com/jamaljm/snapcv"],
          description:
            "Free, open-source tool that turns your résumé into a hosted portfolio at yourname.snapcv.me.",
        },
        {
          "@type": "WebSite",
          "@id": "https://snapcv.me/#website",
          url: "https://snapcv.me",
          name: "SnapCV",
          publisher: { "@id": "https://snapcv.me/#organization" },
        },
        {
          "@type": "SoftwareApplication",
          name: "SnapCV",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: "https://snapcv.me",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
      ],
    };
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
        />
        <Hero />
      </>
    );
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
      <Temp_1 user={result.data} />
    </>
  );
}
