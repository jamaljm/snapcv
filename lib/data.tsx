import { User } from "@/lib/type";
import { supabase } from "@/utils/supabase/client";
import axios from "axios";

async function getPageData(href: string): Promise<User | null> {
  
  
  if (href === "www") {
    return null;
  }

  try {
    //call axios to get data from server

    const response = await axios.post("/api/getUser", { username: href });

    // Extract the user data and error from the response
    const { data: userData, error: userError } = response.data;

    if (userError) {
      console.error("Supabase error:", userError);
      return null;
    }
console.log("userData", userData);
    return userData;
  } catch (error) {
    console.error("An error occurred while fetching the user data:", error);
    return null;
  }
}

export { getPageData };
