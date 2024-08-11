import { User } from "@/lib/type";
import { supabase } from "@/utils/supabase/client";

async function getPageData(href: string): Promise<User | null> {
  if (typeof window === "undefined") {
    return null; // Return early if window is not defined (e.g., server-side rendering)
  }

  const { host } = window.location;
  const isDev = host.includes("localhost");
  const splitHost = host.split(".");

  const isSubdomain =
    (!isDev && splitHost.length === 3) || (isDev && splitHost.length === 2);
  if (!isSubdomain) {
    return null;
  }

  const page = splitHost[0];
  if (page === "www") {
    return null;
  }

  try {
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("userName", page)
      .single();

    if (userError) {
      console.error("Supabase error:", userError);
      return null;
    }

    return userData;
  } catch (error) {
    console.error("An error occurred while fetching the user data:", error);
    return null;
  }
}

export { getPageData };
