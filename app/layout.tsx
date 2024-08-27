import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import "./globals.css";
import {
  Roboto,
  Sora,
  Urbanist,
  DM_Sans,
  Manrope,
  Outfit,
} from "next/font/google";
import { headers } from "next/headers";
import { Providers } from "./providers";
import { CommonContextProvider } from "@/Common_context";
import { Toaster } from "@/components/ui/toaster";
import { redirect } from "next/navigation";
import { supabase } from "@/utils/supabase/supabase_service";
import { User } from "@/lib/type";
import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const robotoFont = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const soraFont = Sora({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sora",
});

const urbanistFont = Urbanist({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-urbanist",
});

const DM_SansFont = DM_Sans({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

const ManropeFont = Manrope({
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

const OutfitFont = Outfit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

async function getUSer(snapcv: string): Promise<any | null> {
  try {
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select(
        "fullName, userName,roll, about, avatarUrl,education,workExperience"
      )
      .eq("userName", snapcv)
      .single();

    if (userError) {
      redirect("https://snapcv.me");
    }
    const user: any = {
      fullName: userData.fullName,
      userName: userData.userName,
      about: userData.about,
      avatarUrl: userData.avatarUrl,
      education: userData.education,
      workExperience: userData.workExperience,
      roll: userData.roll,
    };

    return user;
  } catch (error) {
    console.error("An error occurred while fetching the shop details:", error);
    return null; // Return null if there's an error in the fetch process
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const userName = headersList.get("x-forwarded-host")?.split(".")[0] ?? "";
  const isDev = userName?.includes("localhost");

  if (userName === "www" || isDev) {
    return {
      metadataBase: new URL("https://snapcv.me"),
      title: "SnapCV - Create Stunning Portfolios and CVs that Get You Hired",
      description:
        "SnapCV is your ultimate tool to instantly transform your resume into a beautiful, shareable portfolio. Ideal for job seekers, professionals, and students. Share your professional journey across DMs and social media with customizable templates designed to impress.",
      openGraph: {
        title: "SnapCV - Create Stunning Portfolios and CVs that Get You Hired",
        description:
          "Instantly create and share stunning portfolios and CVs with SnapCV. Effortlessly convert your resume into a professional portfolio that stands out. Perfect for job seekers, professionals, and students.",
        url: "https://snapcv.me",
        siteName: "SnapCV",
        locale: "en_US",
        type: "website",
        images: "/logo_icon.png",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      twitter: {
        title: "SnapCV - Create Stunning Portfolios and CVs Instantly",
        card: "summary_large_image",
      },
      verification: {
        google: "",
        yandex: "",
      },
      keywords: [
        "CV creator",
        "online portfolio maker",
        "instant CV creator",
        "portfolio templates",
        "share CV online",
        "DM CV sharing",
        "social media portfolio",
        "professional portfolio",
        "job seekers portfolio",
        "student CV builder",
        "customizable CV templates",
        "beautiful CV designs",
        "resume to portfolio",
        "digital portfolio",
        "impress employers",
        "easy CV creation",
        "stunning CV designs",
        "online CV tool",
        "get hired faster",
        "CV for LinkedIn",
        "social media resume",
        "free CV builder",
      ],
    };
  }
  const user: User | null = await getUSer(userName || "");
  if (!user) {
    return {
      metadataBase: new URL("https://snapcv.me"),
      title: "SnapCV - Create Stunning Portfolios and CVs that Get You Hired",
      description:
        "SnapCV is your ultimate tool to instantly transform your resume into a beautiful, shareable portfolio. Ideal for job seekers, professionals, and students. Share your professional journey across DMs and social media with customizable templates designed to impress.",
      openGraph: {
        title: "SnapCV - Create Stunning Portfolios and CVs that Get You Hired",
        description:
          "Instantly create and share stunning portfolios and CVs with SnapCV. Effortlessly convert your resume into a professional portfolio that stands out. Perfect for job seekers, professionals, and students.",
        url: "https://snapcv.me",
        siteName: "SnapCV",
        locale: "en_US",
        type: "website",
        images: "/logo_icon.png",
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      twitter: {
        title: "SnapCV - Create Stunning Portfolios and CVs Instantly",
        card: "summary_large_image",
      },
      verification: {
        google: "",
        yandex: "",
      },
      keywords: [
        "CV creator",
        "online portfolio maker",
        "instant CV creator",
        "portfolio templates",
        "share CV online",
        "DM CV sharing",
        "social media portfolio",
        "professional portfolio",
        "job seekers portfolio",
        "student CV builder",
        "customizable CV templates",
        "beautiful CV designs",
        "resume to portfolio",
        "digital portfolio",
        "impress employers",
        "easy CV creation",
        "stunning CV designs",
        "online CV tool",
        "get hired faster",
        "CV for LinkedIn",
        "social media resume",
        "free CV builder",
      ],
    };
  }

  return {
    metadataBase: new URL(`https://${user.userName}.snapcv.me`),
    title: user.fullName + "- Portfolio",
    description:
      user.fullName +
      ", " +
      user.roll +
      ". " +
      user.about +
      (user.education.length > 0
        ? ` Educated at ${
            user.education.length > 1 ? "institutions such as " : ""
          }${user.education
            .map(
              (edu: any) => edu.school + " where they earned a " + edu.degree
            )
            .join(", ")}.`
        : "") +
      (user.workExperience.length > 0
        ? ` Their professional journey includes significant contributions ${
            user.workExperience.length > 1
              ? "at various organizations including "
              : "at "
          }${user.workExperience
            .map((exp: any) => exp.company + " as a " + exp.title)
            .join(", ")}.`
        : ""),
    openGraph: {
      title: `${user.fullName}`,
      description: user.about,
      url: `https://${user.userName}.snapcv.me`,
      siteName: `${user.userName}`,
      locale: "en_US",
      type: "website",
      images: `${user.avatarUrl}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    twitter: {
      title: `${user.fullName}`,
      card: "summary_large_image",
    },
    verification: {
      google: "",
      yandex: "",
    },
    keywords: [
      `${user.fullName} resume`,
      `${user.fullName} CV`,
      `${user.fullName} snapcv`,
      `${user.fullName} profile`,
      `${user.fullName} portfolio`,
      `${user.fullName} online portfolio`,
      `${user.fullName} digital portfolio`,
      `${user.fullName} personal portfolio`,
      `${user.fullName} professional portfolio`,
      `${user.fullName} online resume`,
      `${user.fullName} digital resume`,
      `${user.fullName} work experience`,
      `${user.fullName} education`,
      `${user.fullName} career`,
      `${user.fullName} job history`,
      `${user.fullName} employment`,
      `${user.fullName} achievements`,
      `${user.fullName} qualifications`,
      `${user.fullName} skills`,
      `${user.fullName} expertise`,
      `${user.fullName} projects`,
      `${user.fullName} certifications`,
      `${user.userName} resume`,
      `${user.userName} CV`,
      `${user.userName}`,
      `${user.fullName}`,
      `${user.userName} snapcv`,
      `${user.userName} profile`,
      `${user.userName} portfolio`,
      `${user.userName} online portfolio`,
      `${user.userName} digital portfolio`,
      `${user.userName} personal portfolio`,
      `${user.userName} professional portfolio`,
      `${user.userName} online resume`,
      `${user.education.map((edu: any) => edu.school).join(", ")} alumni`,
      `${user.education.map((edu: any) => edu.school).join(", ")} graduate`,
      `${user.workExperience
        .map((exp: any) => exp.company)
        .join(", ")} employee`,
      `${user.workExperience.map((exp: any) => exp.company).join(", ")} job`,
      `${user.workExperience.map((exp: any) => exp.title).join(", ")} role`,
      `${user.workExperience
        .map((exp: any) => exp.title)
        .join(", ")} experience`,
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVariables = ` ${robotoFont.variable} ${soraFont.variable} ${urbanistFont.variable} ${DM_SansFont.variable} ${ManropeFont.variable} ${OutfitFont.variable}`;
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="font-dmSans">
        <GoogleAnalytics gaId="G-3VBBZ01RDS" />{" "}
        <GoogleTagManager gtmId="GTM-P92GBK9P" />
        <CommonContextProvider>
          <ThemeProvider attribute="class" defaultTheme="light">
            <TooltipProvider delayDuration={0}>
              <Providers>
                {children} <Analytics />
              </Providers>
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </CommonContextProvider>
      </body>
    </html>
  );
}
