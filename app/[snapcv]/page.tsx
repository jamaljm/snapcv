import { User } from "@/lib/type";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Temp_1 from "@/components/design/temp_1";

async function getUSer(snapcv: string): Promise<User | null> {
  const supabase = createClient();

  try {
    const { data: userData, error: userError } = await supabase
      .from("User")
      .select("*")
      .eq("userName", snapcv)
      .single();

    if (userError) {
      notFound();
    }
    const user: User = {
      userId: userData.userId,
      fullName: userData.fullName,
      userName: userData.userName,
      roll: userData.roll,
      about: userData.about,
      skills: userData.skills,
      resumeLink: userData.resumeLink,
      buttonText: userData.buttonText,
      avatarUrl: userData.avatarUrl,
      themeColor: userData.themeColor,
      email: userData.email,
      phone: userData.phone,
      contact: {
        GitHub: userData.contact.GitHub,
        LinkedIn: userData.contact.LinkedIn,
        X: userData.contact.X,
        Youtube: userData.contact.Youtube,
        dribbble: userData.contact.dribbble,
      },
      workExperience: userData.workExperience || [],
      education: userData.education || [],
      hackathonDescription: userData.hackathonDescription,
      projects: userData.projectsData || [],
      projectDescription: userData.projectDescription,
      hackathons: userData.hackathons || [],
    };

    return user;
  } catch (error) {
    console.error("An error occurred while fetching the shop details:", error);
    return null; // Return null if there's an error in the fetch process
  }
}

export default async function page({ params }: { params: { snapcv: string } }) {
  const user: User | null = await getUSer(params.snapcv);
  if (!user) {
    return null; // or handle the null case accordingly
  }

  return (
    <>
      <Temp_1 user={user} />
    </>
  );
}
