import axios from "axios";
import { UserProfile } from "./type";

async function getPageData(href: string): Promise<UserProfile | null> {
  
  
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
     return userData;
  } catch (error) {
    console.error("An error occurred while fetching the user data:", error);
    return null;
  }
}

export { getPageData };
