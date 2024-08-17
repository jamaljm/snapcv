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
      .select("fullName, userName, about, avatarUrl")
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
    };

    return user;
  } catch (error) {
    console.error("An error occurred while fetching the shop details:", error);
    return null; // Return null if there's an error in the fetch process
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = headers();
  const userName = headersList.get("x-forwarded-host")?.split(".")[0];
  const isDev = userName?.includes("localhost");
  if (userName === "www" || isDev) {
    return {
      metadataBase: new URL("https://snapcv.me"),
      title: "SnapCV - Create and Share Beautiful CVs Effortlessly",
      description:
        "SnapCV is a short CV creator that allows you to easily share your CV across DMs and social media platforms. Create stunning CVs with beautiful templates. Ideal for job seekers, professionals, and students.",
      openGraph: {
        title: "SnapCV - Create and Share Beautiful CVs Effortlessly",
        description:
          "SnapCV is a short CV creator that allows you to easily share your CV across DMs and social media platforms. Create stunning CVs with beautiful templates. Ideal for job seekers, professionals, and students.",
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
        title: "SnapCV - Create and Share Beautiful CVs Effortlessly",
        card: "summary_large_image",
      },
      verification: {
        google: "",
        yandex: "",
      },
      keywords: [
        "CV creator",
        "short CV",
        "beautiful CV templates",
        "CV sharing",
        "DM CV sharing",
        "social media CV",
        "job seekers",
        "professional CV",
        "student CV",
        "easy CV creation",
        "stunning CV designs",
        "online CV tool",
      ],
    };
  }
  const user: User | null = await getUSer(userName || "");
  if (!user) {
    return {
      metadataBase: new URL("https://snapcv.me"),
      title: "SnapCV - Create and Share Beautiful CVs Effortlessly",
      description:
        "SnapCV is a short CV creator that allows you to easily share your CV across DMs and social media platforms. Create stunning CVs with beautiful templates. Ideal for job seekers, professionals, and students.",
      openGraph: {
        title: "SnapCV - Create and Share Beautiful CVs Effortlessly",
        description:
          "SnapCV is a short CV creator that allows you to easily share your CV across DMs and social media platforms. Create stunning CVs with beautiful templates. Ideal for job seekers, professionals, and students.",
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
        title: "SnapCV - Create and Share Beautiful CVs Effortlessly",
        card: "summary_large_image",
      },
      verification: {
        google: "",
        yandex: "",
      },
      keywords: [
        "CV creator",
        "short CV",
        "beautiful CV templates",
        "CV sharing",
        "DM CV sharing",
        "social media CV",
        "job seekers",
        "professional CV",
        "student CV",
        "easy CV creation",
        "stunning CV designs",
        "online CV tool",
      ],
    };
  }

  return {
    metadataBase: new URL(`https://${user.userName}.snapcv.me`),
    title: user.fullName,
    description: user.about,
    icons: user.avatarUrl,
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
