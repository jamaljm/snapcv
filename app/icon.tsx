import { ImageResponse } from "next/og";
import { headers } from "next/headers";
import { supabase } from "@/utils/supabase/supabase_service";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png"; // Change to "image/jpeg" if needed

async function getUser(snapcv: string): Promise<any | null> {
  try {
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("userName, avatarUrl")
      .eq("userName", snapcv)
      .single();

    if (userError) {
      return null;
    }
    return userData;
  } catch (error) {
    console.error("An error occurred while fetching the user details:", error);
    return null;
  }
}

// Fetch image utility function
async function fetchImage(src: string): Promise<Buffer> {
  const res = await fetch(src);
  if (!res.ok) {
    throw new Error(`Failed to fetch image from ${src}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

// Image generation
export default async function Icon() {
  const headersList = headers();
  const userName = headersList.get("x-forwarded-host")?.split(".")[0];
  const isDev = userName?.includes("localhost");
  console.log("userName", userName);

  // Return the placeholder image immediately
  const placeholderResponse = new ImageResponse(
    (
      <img
        src="https://www.snapcv.me/logo_icon2.png"
        alt="SnapCV Logo"
        style={{ height: 32, width: 32 }}
      />
    ),
    {
      ...size,
      headers: {
        "Content-Type": contentType,
      },
    }
  );

  // Proceed with fetching the avatar
  let imageBuffer: Buffer;

  try {
    if (userName === "www" || userName === "snapcv" || isDev) {
      console.log("fetching default image");
      imageBuffer = await fetchImage("https://www.snapcv.me/logo_icon2.png");
    } else {
      const user = await getUser(userName || "");
      console.log("user", user);
      if (user && user.avatarUrl) {
        imageBuffer = await fetchImage(user.avatarUrl);
        return new ImageResponse(
          (
            <img
              src={user.avatarUrl}
              alt={userName}
              style={{
                height: 32,
                width: 32,
                borderRadius: "50%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          ),
          {
            ...size,
            headers: {
              "Content-Type": contentType,
            },
          }
        );
      } else {
        return new ImageResponse(
          (
            <div
              style={{
                fontSize: 24,
                background: "white",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "black",
              }}
            >
              {userName ? userName.charAt(0).toUpperCase() : "U"}
            </div>
          ),
          {
            ...size,
          }
        );
      }
    }
  } catch (error) {
    console.error("Failed to load image:", error);
    return placeholderResponse; // Return the placeholder image in case of error
  }

  return placeholderResponse; // Return the placeholder image while loading
}
