import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { createClient } from "@/utils/supabase/server";
import { User } from "@/lib/type";
import { notFound } from "next/navigation";

async function getUSer(snapcv: string): Promise<any | null> {
  const supabase = createClient();
  try {
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("fullName, userName, about, avatarUrl")
      .eq("userName", snapcv)
      .single();

    if (userError) {
      notFound();
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

export async function generateMetadata({
  params,
}: {
  params: { snapcv: string };
}): Promise<Metadata> {
  const user: User | null = await getUSer(params.snapcv);

  if (!user) {
    const defaultTitle = "Shop Not Found";
    const defaultDescription =
      "The shop you are looking for could not be found.";

    return {
      title: defaultTitle,
      description: defaultDescription,
      openGraph: {
        title: defaultTitle,
        description: defaultDescription,
        images: [],
      },
    };
  }

  return {
    metadataBase: new URL(`https://${user.userName}.snapcv.me`),
    title: user.fullName,
    description: user.about,
    openGraph: {
      title: `${user.fullName}`,
      description: user.about,
      url: `https:///${user.userName}.snapcv.me`,
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
  return (
    <section
      className={cn(
        "min-h-screen bg-background font-dmSans antialiased mx-auto"
      )}
    >
      {children}
    </section>
  );
}
