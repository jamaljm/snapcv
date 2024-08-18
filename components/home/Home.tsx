"use client";

import {
  Button,
  Chip,
  DateRangePicker,
  Input,
  Kbd,
  Radio,
  RadioGroup,
  Snippet,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import React, {
  ChangeEvent,
  KeyboardEvent,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import Link from "next/link";
import { User, SocialLinks } from "@/lib/type";
import { supabase } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { useCommonContext } from "@/Common_context";
import imageCompression from "browser-image-compression";
import { useToast } from "@/components/ui/use-toast";
import { reservedWords } from "@/lib/type";
import Temp1 from "@/components/design/temp_1";
import { useRouter } from "next/navigation";

const tailwindColors = [
  { name: "red", value: "#ef4444" },
  { name: "green", value: "#10b981" },
  { name: "white", value: "#fff" },
  { name: "blue", value: "#3b82f6" },
  { name: "yellow", value: "#f59e0b" },
  { name: "purple", value: "#8b5cf6" },
  { name: "pink", value: "#ec4899" },
  { name: "indigo", value: "#6366f1" },
  { name: "gray", value: "#6b7280" },
  { name: "orange", value: "#f97316" },
  { name: "teal", value: "#14b8a6" },
  { name: "cyan", value: "#06b6d4" },
  { name: "lime", value: "#84cc16" },
  { name: "emerald", value: "#10b981" },
  { name: "fuchsia", value: "#d946ef" },
  { name: "rose", value: "#f43f5e" },
  { name: "violet", value: "#8b5cf6" },
  { name: "sky", value: "#0ea5e9" },
];
const tailwindColors100: Record<ThemeColor, string> = {
  red: "#fee2e2",
  green: "#d1fae5",
  white: "#ffffff",
  blue: "#dbeafe",
  yellow: "#fef9c3",
  purple: "#f3e8ff",
  pink: "#fce7f3",
  indigo: "#e0e7ff",
  gray: "#f3f4f6",
  orange: "#ffedd5",
  teal: "#ccfbf1",
  cyan: "#cffafe",
  lime: "#ecfccb",
  emerald: "#d1fae5",
  fuchsia: "#fae8ff",
  rose: "#ffe4e6",
  violet: "#f3e8ff",
  sky: "#e0f2fe",
};
type ThemeColor =
  | "red"
  | "green"
  | "white"
  | "blue"
  | "yellow"
  | "purple"
  | "pink"
  | "indigo"
  | "gray"
  | "orange"
  | "teal"
  | "cyan"
  | "lime"
  | "emerald"
  | "fuchsia"
  | "rose"
  | "violet"
  | "sky";

const initialUserState: User = {
  userId: "",
  fullName: "",
  userName: "",
  roll: "",
  about: "",
  email: "",
  phone: "",
  skills: [],
  resumeLink: "",
  buttonText: "",
  avatarUrl: "",
  themeColor: "" as ThemeColor,
  contact: {
    GitHub: "",
    LinkedIn: "",
    X: "",
    Youtube: "",
    dribbble: "",
  },
  workExperience: [
    {
      company: "",
      title: "",
      logoUrl: "",
      start: "",
      end: "",
      description: "",
      link: "",
    },
  ],
  education: [
    {
      school: "",
      degree: "",
      logoUrl: "",
      start: "",
      end: "",
      link: "",
    },
  ],
  hackathonDescription: "",
  projects: [
    {
      title: "",
      href: "",
      dates: "",
      description: "",
      technologies: [],
      links: {
        website: "",
        source: "",
      },
      image: "",
    },
  ],
  projectDescription: "",
  hackathons: [
    {
      title: "",
      dates: "",
      location: "",
      description: "",
      image: "",
      win: "",
      links: {
        website: "",
        github: "",
      },
    },
  ],
};

// Define the types of photos
type PhotoTypes =
  | "profilePhoto"
  | "workExperienceLogo"
  | "educationLogo"
  | "projectImage"
  | "hackathonLogo";

// Define the upload status type with index tracking
type IndexedUploadStatus = {
  [key: string]: "idle" | "uploading" | "uploaded";
};

// Initial upload status state
const initialUploadStatus: IndexedUploadStatus = {
  "profilePhoto-0": "idle",
  // Other statuses will be added dynamically
};

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Error during image compression:", error);
    throw error;
  }
};
const socialMediaImages: { [key: string]: string } = {
  GitHub: "/icon/github.png",
  LinkedIn: "/icon/linkedin.png",
  X: "/icon/twitter.png",
  Youtube: "/icon/youtube.png",
  dribbble: "/icon/dribbble.png",
  // Add more as needed
  default: "/icon/dribbble.png", // Default icon URL
};

export default function Home() {
  const { userData } = useCommonContext();
  const [inputValue, setInputValue] = useState("");
  const [inputValueProject, setInputValueProject] = useState("");
  const [selectedSection, setSelectedSection] = useState("general-info");
  const manualScroll = useRef(false);
  const [demo, setDemo] = useState(false);
  const [uploadStatus, setUploadStatus] =
    useState<IndexedUploadStatus>(initialUploadStatus);
  const [user, setUser] = useState<User>(initialUserState);
  const [initialUser, setInitialUser] = useState<User>(initialUserState);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false); // Track unsaved changes
  const [slugError, setSlugError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Already taken!");
  const [isAvailable, setIsAvailable] = useState(false);
  const isError = slugError || isChecking;
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("User")
        .select("*")
        .eq("userId", userData?.user.id);

      if (error || data.length === 0) {
        console.error("Error fetching user data:", error);
        router.push("/create");
      } else {
        if (data && data.length > 0) {
          setUser(JSON.parse(JSON.stringify(data[0]))); // Deep clone
          setInitialUser(JSON.parse(JSON.stringify(data[0]))); // Deep clone
          setIsLoading(false);
        }
      }
    };
    if (userData?.user.id) fetchUserData();
  }, [userData]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const markAsEdited = () => {
    setHasUnsavedChanges(true);
  };

  const handleNestedFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    category: keyof User,
    index: number,
    field: string
  ) => {
    const { value } = e.target;
    markAsEdited();
    setUser((prevUser) => {
      const updatedCategory = (prevUser[category] as any[]).map((item, i) => {
        if (i === index) {
          const fieldParts = field.split(".");
          if (fieldParts.length > 1) {
            // For nested fields like "links.website"
            const [nestedField, subField] = fieldParts;
            return {
              ...item,
              [nestedField]: {
                ...item[nestedField],
                [subField]: value,
              },
            };
          }
          return { ...item, [field]: value };
        }
        return item;
      });
      return { ...prevUser, [category]: updatedCategory };
    });
  };

  const uploadImageAndGetUrl = async (
    file: File,
    path: string
  ): Promise<string | null> => {
    try {
      const fileExtension = file.name.split(".").pop();
      if (!fileExtension) {
        throw new Error("File extension not found");
      }

      const filename = `${path}/${file.name.replace(/ /g, "-")}`;
      const compressedFile = await compressImage(file);

      const { data, error } = await supabase.storage
        .from("snapcv")
        .upload(filename, compressedFile, {
          upsert: true,
        });

      if (error) {
        console.error("Upload error:", error);
        return null;
      }

      if (data) {
        const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/snapcv/${data.path}`;
        return fileUrl;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error in uploadImageAndGetUrl:", error);
      return null;
    }
  };

  const handleFileUpload = async (
    file: File,
    type: PhotoTypes,
    index: number
  ) => {
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    const path = `user/${userData?.user.id}/${type}_${randomNumber}`;

    // Set the upload status to uploading
    setUploadStatus((prevStatus) => ({
      ...prevStatus,
      [`${type}-${index}`]: "uploading",
    }));
    console.log("hiiiiiiiiZ");
    const fileUrl = await uploadImageAndGetUrl(file, path);

    if (fileUrl) {
      console.log("File uploaded successfully:", fileUrl);
      markAsEdited();
      switch (type) {
        case "profilePhoto":
          setUser((prevUser) => ({ ...prevUser, avatarUrl: fileUrl }));
          break;
        case "workExperienceLogo":
          setUser((prevUser) => ({
            ...prevUser,
            workExperience: prevUser.workExperience.map((exp, idx) =>
              idx === index ? { ...exp, logoUrl: fileUrl } : exp
            ),
          }));
          break;
        case "educationLogo":
          setUser((prevUser) => ({
            ...prevUser,
            education: prevUser.education.map((edu, idx) =>
              idx === index ? { ...edu, logoUrl: fileUrl } : edu
            ),
          }));
          break;
        case "projectImage":
          setUser((prevUser) => ({
            ...prevUser,
            projects: prevUser.projects.map((proj, idx) =>
              idx === index ? { ...proj, image: fileUrl } : proj
            ),
          }));
          break;
        case "hackathonLogo":
          setUser((prevUser) => ({
            ...prevUser,
            hackathons: prevUser.hackathons.map((hack, idx) =>
              idx === index ? { ...hack, image: fileUrl } : hack
            ),
          }));
          break;
        default:
          break;
      }

      // Set the upload status to uploaded
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [`${type}-${index}`]: "uploaded",
      }));

      // Reset the upload status to idle after 2 seconds
      setTimeout(() => {
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [`${type}-${index}`]: "idle",
        }));
      }, 2000);
    } else {
      // Handle upload failure
      console.error("File upload failed");

      // Reset the upload status to idle
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [`${type}-${index}`]: "idle",
      }));
    }
  };

  const setNestedProperty = (obj: any, path: string, value: any) => {
    const keys = path.split(".");
    const lastKey = keys.pop();
    const deepClone = JSON.parse(JSON.stringify(obj)); // Deep clone

    let temp = deepClone;
    keys.forEach((key) => {
      if (!temp[key]) {
        temp[key] = {};
      }
      temp = temp[key];
    });

    if (lastKey) {
      temp[lastKey] = value;
    }

    return deepClone;
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    if (name === "userName") {
      if (value.includes(" ")) {
        // Show an alert when there is a space
        alert("Spaces are not allowed in the username.");
        return; // Stop further processing
      }

      // Update state if no spaces
      setUser((prevUser) =>
        setNestedProperty(prevUser, name, value.toLowerCase())
      );
    } else {
      setUser((prevUser) => setNestedProperty(prevUser, name, value));
    }
  };

  const handleSkillClose = (skillToRemove: string) => {
    markAsEdited();
    setUser((prevUser) => {
      const updatedSkills = prevUser.skills.filter(
        (skill) => skill !== skillToRemove
      );
      return {
        ...prevUser,
        skills:
          updatedSkills.length === 0 ? initialUserState.skills : updatedSkills,
      };
    });
  };

  const handleSkillInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    markAsEdited();
    setInputValue(event.target.value);
  };

  const handleSkillInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      markAsEdited();
      setUser((prevUser) => ({
        ...prevUser,
        skills: [...prevUser.skills, inputValue.trim()],
      }));
      setInputValue("");
    }
  };
  const handleTechnologyClose = (
    projectIndex: number,
    techToRemove: string
  ) => {
    console.log(projectIndex, techToRemove);
    markAsEdited();
    setUser((prevUser) => {
      const updatedProjects = [...prevUser.projects];
      const updatedTechnologies = updatedProjects[
        projectIndex
      ].technologies.filter((tech) => tech !== techToRemove);
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        technologies: updatedTechnologies,
      };
      return {
        ...prevUser,
        projects: updatedProjects,
      };
    });
  };

  const handleTechnologyInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
    inputValue: string
  ) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      markAsEdited();
      setUser((prevUser) => {
        const updatedProjects = [...prevUser.projects];
        updatedProjects[index] = {
          ...updatedProjects[index],
          technologies: [
            ...updatedProjects[index].technologies,
            inputValue.trim(),
          ],
        };
        return {
          ...prevUser,
          projects: updatedProjects,
        };
      });
      setInputValueProject("");
    }
  };

  const [file, setFile] = useState<File | null>(null);

  type DeleteType = "hackathons" | "workExperience" | "education" | "projects";

  const deleteItemByIndex = (
    type: DeleteType,
    index: number,
    setState: React.Dispatch<React.SetStateAction<User>>
  ) => {
    setState((prevUser) => {
      const updatedUser = { ...prevUser };

      switch (type) {
        case "hackathons":
          updatedUser.hackathons = updatedUser.hackathons.filter(
            (_, i) => i !== index
          );
          break;
        case "workExperience":
          updatedUser.workExperience = updatedUser.workExperience.filter(
            (_, i) => i !== index
          );
          break;
        case "education":
          updatedUser.education = updatedUser.education.filter(
            (_, i) => i !== index
          );
          break;
        case "projects":
          updatedUser.projects = updatedUser.projects.filter(
            (_, i) => i !== index
          );
          break;
        default:
          console.error("Invalid type specified");
          return prevUser;
      }

      return updatedUser;
    });
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  console.log(selectedSection);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (manualScroll.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("Intersecting:", entry.target.id); // Debugging
            setSelectedSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    const sectionIds = [
      "general-info",
      "work-experience",
      "education",
      "project",
      "hackathon",
      "social-links",
    ];

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) {
        observer.observe(section);
      } else {
        console.warn(`Section with id ${id} not found`); // Debugging
      }
    });

    return () => {
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  const handleRadioChange = (event: any) => {
    const value = event.target.value;
    setSelectedSection(value);
    const section = document.getElementById(value);
    if (section) {
      manualScroll.current = true;
      section.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        manualScroll.current = false;
      }, 1000); // Adjust the timeout based on scroll duration
    }
  };

  const addWorkExperience = () => {
    markAsEdited();
    setUser((prevUser) => ({
      ...prevUser,
      workExperience: [
        ...prevUser.workExperience,
        {
          company: "",
          title: "",
          logoUrl: "",
          start: "",
          end: "",
          description: "",
          link: "",
        },
      ],
    }));
  };

  const addEducation = () => {
    markAsEdited();
    setUser((prevUser) => ({
      ...prevUser,
      education: [
        ...prevUser.education,
        {
          school: "",
          degree: "",
          logoUrl: "",
          start: "",
          end: "",
          link: "",
        },
      ],
    }));
  };

  const addProject = () => {
    markAsEdited();
    setUser((prevUser) => ({
      ...prevUser,
      projects: [
        ...prevUser.projects,
        {
          title: "",
          href: "",
          dates: "",
          description: "",
          technologies: [],
          links: {
            website: "",
            source: "",
          },
          image: "",
        },
      ],
    }));
  };

  const addHackathon = () => {
    markAsEdited();
    setUser((prevUser) => ({
      ...prevUser,
      hackathons: [
        ...prevUser.hackathons,
        {
          title: "",
          dates: "",
          location: "",
          description: "",
          image: "",
          win: "",
          links: {
            website: "",
            github: "",
          },
        },
      ],
    }));
  };
  const generateUpdateObject = (newData: User, initialData: User) => {
    const updateObject: { [key: string]: any } = {};
    console.log(newData, "newData");
    console.log(initialData, "initialData");

    // Helper function to add https:// if missing
    const ensureHttps = (url: string) => {
      if (url && !url.startsWith("https://") && !url.startsWith("http://")) {
        return "https://" + url;
      }
      return url;
    };

    // Ensure URLs in contact, education, projects, and hackathons have https://
    const updateUrls = (data: User) => {
      // Update contact URLs
      Object.keys(data.contact).forEach((key) => {
        data.contact[key as keyof SocialLinks] = ensureHttps(
          data.contact[key as keyof SocialLinks]
        );
      });

      // Update education links
      data.education.forEach((edu) => {
        edu.link = ensureHttps(edu.link);
      });

      // Update project links
      data.projects.forEach((project) => {
        project.links.website = ensureHttps(project.links.website);
        project.links.source = ensureHttps(project.links.source);
      });

      // Update hackathon links
      data.hackathons.forEach((hackathon) => {
        hackathon.links.website = ensureHttps(hackathon.links.website);
        hackathon.links.github = ensureHttps(hackathon.links.github);
      });
    };

    // Ensure newData URLs are correct
    updateUrls(newData);

    // Helper function to compare objects recursively
    const compareObjects = (
      newObj: { [x: string]: any },
      oldObj: { [x: string]: any }
    ) => {
      Object.keys(newObj).forEach((key) => {
        if (key === "contact") {
          // Special handling for 'contact'
          if (JSON.stringify(newObj[key]) !== JSON.stringify(oldObj[key])) {
            updateObject[key] = newObj[key];
          }
        } else if (
          typeof newObj[key] === "object" &&
          !Array.isArray(newObj[key]) &&
          newObj[key] !== null
        ) {
          // Instead of comparing nested objects recursively, compare the top-level key directly
          if (JSON.stringify(newObj[key]) !== JSON.stringify(oldObj[key])) {
            updateObject[key] = newObj[key];
          }
        } else if (Array.isArray(newObj[key])) {
          // For arrays, compare length and content
          if (JSON.stringify(newObj[key]) !== JSON.stringify(oldObj[key])) {
            updateObject[key] = newObj[key];
          }
        } else if (newObj[key] !== oldObj[key]) {
          updateObject[key] = newObj[key];
        }
      });
    };

    // Compare top-level properties
    compareObjects(newData, initialData);

    return updateObject;
  };

  const handleSaveChanges = async () => {
    console.log("Saving changes...");
    const userUpdates = generateUpdateObject(user, initialUser);

    let userUpdateSuccess = true;

    console.log(userUpdates, "update");

    if (Object.keys(userUpdates).length > 0) {
      const { data, error } = await supabase
        .from("User")
        .update(userUpdates)
        .eq("userId", userData?.user.id);

      if (error) {
        console.error("Error updating user data:", error);
        userUpdateSuccess = false;
      } else {
        setHasUnsavedChanges(false); // Reset unsaved changes state
        setInitialUser(JSON.parse(JSON.stringify(user))); // Deep clone user to initialUser
        toast({
          title: "Changes saved successfully!",
          description: (
            <div className="rounded-xl py-3 font-dmSans">
              <Link
                target="_blank"
                href={`/${user.userName}`}
                className="bg-green-100 border  border-slate-100 text-slate-950 font-semibold px-4 py-2 rounded-xl  cursor-pointer hover:bg-green-200 hover:text-slate-700"
              >
                Visit your snapcv
              </Link>
            </div>
          ),
        });
        console.log("User data updated successfully:", data);
      }
    }

    if (userUpdateSuccess) {
      console.log("All changes saved successfully");
    } else {
      console.log("Some changes failed to save");
    }
  };

  const checkSlugUnique = async (slug: string): Promise<boolean> => {
    if (slug === initialUser.userName) {
      return true;
    }
    if (reservedWords.includes(slug.toLowerCase())) {
      return false;
    }

    const { data, error } = await supabase
      .from("User")
      .select("userName")
      .eq("userName", slug);

    if (error) {
      console.error("Error checking slug:", error);
      return false;
    }

    return data.length === 0;
  };

  const handleBlur = async () => {
    setIsChecking(true);
    const isUnique = await checkSlugUnique(user.userName);
    setIsChecking(false);
    if (user.userName === "") {
      setIsAvailable(false);
    }
    if (isUnique && user.userName !== "") {
      setIsAvailable(isUnique);
    }
    setSlugError(!isUnique);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner color="default" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5  font-dmSans  w-full h-full">
      <div className="col-span-1 hidden sm:block  border-r h-full p-12">
        <RadioGroup
          color="secondary"
          className="font-medium sticky top-12 border-l text-gray-400"
          defaultValue="general-info"
          value={selectedSection}
          onChange={handleRadioChange}
        >
          <Link href="#general-info">
            <Radio className="bg-white mb-8 p-0 -ml-2.5" value="general-info">
              General Info
            </Radio>
          </Link>
          <Link href="#work-experience">
            <Radio
              className="bg-white mb-8 p-0 -ml-2.5"
              value="work-experience"
            >
              Work Experience
            </Radio>
          </Link>
          <Link href="#education">
            <Radio className="bg-white mb-8 p-0 -ml-2.5" value="education">
              Education
            </Radio>
          </Link>
          <Link href="#project">
            <Radio className="bg-white mb-8 p-0 -ml-2.5" value="project">
              Projects
            </Radio>
          </Link>
          <Link href="#hackathon">
            <Radio className="bg-white mb-8 p-0 -ml-2.5" value="hackathon">
              Hackathons
            </Radio>
          </Link>
          <Link href="#social-links">
            <Radio className="bg-white p-0 -ml-2.5" value="social-links">
              Social Links
            </Radio>
          </Link>
        </RadioGroup>
      </div>
      <div
        className={`col-span-5 sm:col-span-2 sm:block border-r h-full ${
          demo ? "hidden" : "block"
        }`}
      >
        <div className="py-6 px-6 border-b block sm:hidden">
          {" "}
          <Snippet
            variant="bordered"
            classNames={{
              base: "rounded-xl border py-[.23rem] ",
              pre: "font-dmSans font-medium",
              symbol: "hidden",
            }}
            className="flex font-dmSans  sm:hidden"
          >
            {`https://${user.userName}.snapcv.me`}
          </Snippet>
        </div>
        <div className="px-8">
          <div
            id="general-info"
            className="flex flex-col pt-6 sm:pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">General Info</h2>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Profile photo</p>
              <div className="flex max-w-xs w-full justify-start  gap-2 items-center flex-row flex-wrap">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    className="w-12 h-12 sm:h-12 sm:w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center  bg-slate-100 rounded-xl">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-slate-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                      />
                    </svg>
                  </div>
                )}

                <label className=" flex flex-row gap-2 text-slate-400 cursor-pointer shadow-xs justify-center items-center  flex-1 px-3 h-12 border-black/20 rounded-xl border-dashed border border-black bg-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-4 text-slate-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                    />
                  </svg>
                  {uploadStatus["profilePhoto-0"] === "idle" &&
                    "Upload profile image"}
                  {uploadStatus["profilePhoto-0"] === "uploading" &&
                    "Uploading..."}
                  {uploadStatus["profilePhoto-0"] === "uploaded" &&
                    "Profile image uploaded"}
                  <input
                    onChange={(event) => {
                      // setIsError(false);
                      if (event.target.files) {
                        handleFileUpload(
                          event.target.files[0],
                          "profilePhoto",
                          0
                        );
                      }
                    }}
                    type="file"
                    className="  w-full hidden  font-body font-light text-black/80 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-gray-700 hover:file:bg-slate-400"
                  />
                </label>
              </div>
            </div>{" "}
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Full name</p>
              <Input
                type="text"
                variant="bordered"
                value={user.fullName}
                onChange={handleInputChange}
                name="fullName"
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>{" "}
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">User name</p>
              <Input
                type="text"
                variant="bordered"
                value={user.userName}
                onChange={handleInputChange}
                name="userName"
                isInvalid={isError}
                errorMessage={errorMessage}
                onBlur={handleBlur}
                className="max-w-xs flex  text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
                endContent={
                  <div className="pointer-events-none pl-2 w-full  gap-7 flex items-between">
                    <span className="text-default-600 font-semibold text-sm">
                      .snapcv.me
                    </span>
                    {isAvailable && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-green-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    )}
                  </div>
                }
                pattern="[^ ]+" // Pattern to disallow spaces
                title="Spaces are not allowed" // Title to show when invalid
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Your roll</p>
              <Input
                type="text"
                variant="bordered"
                defaultValue="Product designer"
                value={user.roll}
                onChange={handleInputChange}
                name="roll"
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">About</p>
              <Textarea
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your description"
                value={user.about}
                onChange={handleInputChange}
                name="about"
                defaultValue="NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components."
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Skills</p>
              <div className="flex max-w-xs w-full flex-col justify-start items-start gap-3">
                <Input
                  type="text"
                  labelPlacement="inside"
                  placeholder="Add your skills"
                  description=" Press Enter to add a new skill"
                  variant="bordered"
                  value={inputValue}
                  onChange={handleSkillInputChange}
                  onKeyDown={handleSkillInputKeyDown}
                  classNames={{
                    inputWrapper: "border-1 shadow-none",
                  }}
                  endContent={
                    <Kbd className="font-dmSans text-xs" keys={["enter"]}>
                      Enter
                    </Kbd>
                  }
                  className=" text-xs max-w-xs flex-wrap"
                />
                <div className="w-full  flex flex-wrap gap-1 max-w-xs">
                  {user.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      onClose={() => handleSkillClose(skill)}
                      variant="flat"
                      classNames={{
                        closeButton: "text-gray-500 z-10",
                        base: "bg-gray-50",
                      }}
                      className="flex mt-1 mb-1  items-center bg-none text-xs rounded-full border-1 border-gray-200 pl-2 "
                    >
                      {skill}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Contact mail</p>
              <Input
                type="email"
                variant="bordered"
                value={user.email}
                onChange={handleInputChange}
                name="email"
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Resume Link</p>
              <Input
                type="url"
                variant="bordered"
                value={user.resumeLink}
                onChange={handleInputChange}
                name="resumeLink"
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Button Text</p>
              <Input
                type="text"
                variant="bordered"
                value={user.buttonText}
                onChange={handleInputChange}
                name="buttonText"
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Theme color</p>
              <div className="flex flex-wrap max-w-xs gap-4">
                {tailwindColors.map((color) => (
                  <div
                    key={color.name}
                    style={{
                      backgroundColor: color.value,
                      border:
                        user.themeColor === color.name
                          ? ".1rem solid black"
                          : "",
                    }}
                    className={`w-5 h-5 rounded-full cursor-pointer ${
                      color.name === "white" ? "border border-slate-400" : ""
                    } `}
                    onClick={() =>
                      setUser((prevUser) => ({
                        ...prevUser,
                        themeColor: color.name,
                      }))
                    }
                  ></div>
                ))}
              </div>
            </div>
          </div>{" "}
          <div
            id="work-experience"
            className="flex min-h-screen flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Work expirience</h2>
            {user.workExperience &&
              user.workExperience.length > 0 &&
              user.workExperience.map((experience, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  {" "}
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("workExperience", index, setUser)
                      }
                      aria-label={`Delete workExperience ${index}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.05">Company logo</p>
                    <div className="flex max-w-xs w-full justify-start gap-2 items-center flex-row flex-wrap">
                      {experience.logoUrl ? (
                        <img
                          src={experience.logoUrl}
                          alt="Company Logo"
                          className="w-12 h-12 sm:h-12 sm:w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-slate-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                            />
                          </svg>
                        </div>
                      )}
                      <label className=" flex flex-row gap-2 text-slate-400 cursor-pointer shadow-xs justify-center items-center  flex-1 px-3 h-12 border-black/20 rounded-xl border-dashed border border-black bg-white">
                        <input
                          onChange={(event) => {
                            if (event.target.files) {
                              handleFileUpload(
                                event.target.files[0],
                                "workExperienceLogo",
                                index
                              );
                            }
                          }}
                          type="file"
                          className="  w-full hidden  font-body font-light text-black/80 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-gray-700 hover:file:bg-slate-400"

                          // {...getInputProps()}
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4 text-slate-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        {uploadStatus[`workExperienceLogo-${index}`] ===
                          "idle" && "Click to upload "}
                        {uploadStatus[`workExperienceLogo-${index}`] ===
                          "uploading" && "Uploading..."}
                        {uploadStatus[`workExperienceLogo-${index}`] ===
                          "uploaded" && "Logo  uploaded"}
                        {!uploadStatus[`workExperienceLogo-${index}`] &&
                          "Click to upload "}
                      </label>
                    </div>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.05">Company name</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={experience.company}
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "workExperience",
                          index,
                          "company"
                        )
                      }
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.05">Role</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={experience.title}
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "workExperience",
                          index,
                          "title"
                        )
                      }
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Period </p>
                    <div className="max-w-xs flex gap-2 text-gray-600">
                      {" "}
                      <Input
                        classNames={{
                          inputWrapper: "border-1 shadow-none",
                        }}
                        placeholder="Start eg: April 2020"
                        onChange={(e) =>
                          handleNestedFieldChange(
                            e,
                            "workExperience",
                            index,
                            "start"
                          )
                        }
                        value={experience.start}
                        variant="bordered"
                        className="max-w-xs text-gray-600"
                        // value={[experience.start, experience.end]}
                      />
                      <Input
                        classNames={{
                          inputWrapper: "border-1 shadow-none",
                        }}
                        placeholder="end"
                        onChange={(e) =>
                          handleNestedFieldChange(
                            e,
                            "workExperience",
                            index,
                            "end"
                          )
                        }
                        value={experience.end}
                        variant="bordered"
                        className="max-w-xs text-gray-600"
                        // value={[experience.start, experience.end]}
                      />
                    </div>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Description</p>
                    <Textarea
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Enter your description"
                      value={experience.description}
                      className="max-w-xs text-gray-600"
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "workExperience",
                          index,
                          "description"
                        )
                      }
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.05">Company Link</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={experience.link}
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "workExperience",
                          index,
                          "link"
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            <Button
              variant="bordered"
              onClick={addWorkExperience}
              className="border bg-none flex justify-center items-center gap-1 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Work
            </Button>
          </div>
          <div
            id="education"
            className="flex flex-col  pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Education</h2>
            {user.education &&
              user.education.length > 0 &&
              user.education.map((edu, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  {" "}
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("education", index, setUser)
                      }
                      aria-label={`Delete education ${index}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">College logo</p>
                    <div className="flex max-w-xs w-full justify-start gap-2 items-center flex-row flex-wrap">
                      {edu.logoUrl ? (
                        <img
                          src={edu.logoUrl}
                          alt="College Logo"
                          className="w-12 h-12 sm:h-12 sm:w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-slate-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                            />
                          </svg>
                        </div>
                      )}

                      <label className=" flex flex-row gap-2 text-slate-400 cursor-pointer shadow-xs justify-center items-center  flex-1 px-3 h-12 border-black/20 rounded-xl border-dashed border border-black bg-white">
                        <input
                          onChange={(event) => {
                            if (event.target.files) {
                              handleFileUpload(
                                event.target.files[0],
                                "educationLogo",
                                index
                              );
                            }
                          }}
                          type="file"
                          className="  w-full hidden  font-body font-light text-black/80 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-gray-700 hover:file:bg-slate-400"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4 text-slate-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        {uploadStatus[`educationLogo-${index}`] === "idle" &&
                          "Click to upload "}
                        {uploadStatus[`educationLogo-${index}`] ===
                          "uploading" && "Uploading..."}
                        {uploadStatus[`educationLogo-${index}`] ===
                          "uploaded" && "Logo  uploaded"}
                        {!uploadStatus[`educationLogo-${index}`] &&
                          "Click to upload "}{" "}
                      </label>
                    </div>
                  </div>{" "}
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">College name</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={edu.school}
                      onChange={(e) =>
                        handleNestedFieldChange(e, "education", index, "school")
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Degree</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={edu.degree}
                      onChange={(e) =>
                        handleNestedFieldChange(e, "education", index, "degree")
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>{" "}
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Period</p>
                    <div className="max-w-xs flex gap-2 text-gray-600">
                      {" "}
                      <Input
                        classNames={{
                          inputWrapper: "border-1 shadow-none",
                        }}
                        placeholder="Start eg: April 2020"
                        onChange={(e) =>
                          handleNestedFieldChange(
                            e,
                            "education",
                            index,
                            "start"
                          )
                        }
                        value={edu.start}
                        variant="bordered"
                        className="max-w-xs text-gray-600"
                        // value={[experience.start, experience.end]}
                      />
                      <Input
                        classNames={{
                          inputWrapper: "border-1 shadow-none",
                        }}
                        placeholder="end"
                        onChange={(e) =>
                          handleNestedFieldChange(e, "education", index, "end")
                        }
                        value={edu.end}
                        variant="bordered"
                        className="max-w-xs text-gray-600"
                        // value={[experience.start, experience.end]}
                      />
                    </div>
                  </div>
                </div>
              ))}
            <Button
              variant="bordered"
              onClick={addEducation}
              className="border bg-none flex justify-center items-center gap-1 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Education
            </Button>
          </div>
          <div
            id="project"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Projects</h2>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-0.5">Project description</p>
              <Textarea
                type="text"
                variant="bordered"
                value={user.projectDescription}
                onChange={handleInputChange}
                name="projectDescription"
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            {user.projects &&
              user.projects.length > 0 &&
              user.projects.map((project, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  {" "}
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("projects", index, setUser)
                      }
                      aria-label={`Delete projects ${index}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.05">Project Image</p>
                    <div className="flex max-w-xs w-full justify-start gap-2 items-center flex-row flex-wrap">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt="Project Image"
                          className="w-12 h-12 sm:h-12 sm:w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-slate-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z"
                            />
                          </svg>
                        </div>
                      )}

                      <label className="flex flex-row gap-2 text-slate-400 cursor-pointer shadow-xs justify-center items-center flex-1 px-3 h-12 border-black/20 rounded-xl border-dashed border border-black bg-white">
                        <input
                          onChange={(event) => {
                            if (event.target.files) {
                              handleFileUpload(
                                event.target.files[0],
                                "projectImage",
                                index
                              );
                            }
                          }}
                          type="file"
                          className="  w-full hidden  font-body font-light text-black/80 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-gray-700 hover:file:bg-slate-400"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4 text-slate-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        {uploadStatus[`projectImage-${index}`] === "idle" &&
                          "Click to upload "}
                        {uploadStatus[`projectImage-${index}`] ===
                          "uploading" && "Uploading..."}
                        {uploadStatus[`projectImage-${index}`] === "uploaded" &&
                          "Logo  uploaded"}
                        {!uploadStatus[`projectImage-${index}`] &&
                          "Click to upload "}{" "}
                      </label>
                    </div>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Project name</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={project.title}
                      onChange={(e) =>
                        handleNestedFieldChange(e, "projects", index, "title")
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Period</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={project.dates}
                      onChange={(e) =>
                        handleNestedFieldChange(e, "projects", index, "dates")
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Description</p>
                    <Textarea
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Enter your description"
                      value={project.description}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "projects",
                          index,
                          "description"
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Stack</p>
                    <div className="flex max-w-xs w-full flex-col justify-start items-start gap-3">
                      <Input
                        type="text"
                        labelPlacement="inside"
                        placeholder="Add a technology"
                        description=" Press Enter to add a new technology"
                        variant="bordered"
                        value={inputValueProject}
                        onChange={(event) =>
                          setInputValueProject(event.target.value)
                        }
                        onKeyDown={(event) =>
                          handleTechnologyInputKeyDown(
                            event,
                            index,
                            inputValueProject
                          )
                        }
                        classNames={{
                          inputWrapper: "border-1 shadow-none",
                        }}
                        endContent={
                          <Kbd className="font-dmSans text-xs" keys={["enter"]}>
                            Enter
                          </Kbd>
                        }
                        className=" text-xs max-w-xs flex-wrap"
                      />
                      <div className="w-full  flex flex-wrap gap-1 max-w-xs">
                        {project.technologies.map((tech) => (
                          <Chip
                            key={index}
                            onClose={() => handleTechnologyClose(index, tech)}
                            variant="flat"
                            classNames={{
                              closeButton: "text-gray-500 z-10",
                              base: "bg-gray-50",
                            }}
                            className="flex mt-1 mb-1  items-center bg-none text-xs rounded-full border-1 border-gray-200 pl-2 "
                          >
                            {tech}
                          </Chip>
                        ))}
                      </div>
                    </div>{" "}
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Website link</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={project.links.website}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "projects",
                          index,
                          "links.website"
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Source Link</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={project.links.source}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "projects",
                          index,
                          "links.source"
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                </div>
              ))}
            <Button
              variant="bordered"
              onClick={addProject}
              className="border bg-none flex justify-center items-center gap-1 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Project
            </Button>
          </div>{" "}
          <div
            id="hackathon"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Hackathons</h2>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-0.5">Hackathon Description</p>
              <Textarea
                type="text"
                variant="bordered"
                value={user.hackathonDescription}
                onChange={handleInputChange}
                name="hackathonDescription"
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            {user.hackathons &&
              user.hackathons.length > 0 &&
              user.hackathons.map((hackathon, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("hackathons", index, setUser)
                      }
                      aria-label={`Delete hackathon ${index}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 text-red-400"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.5">Hackathon logo</p>
                    <div className="flex max-w-xs w-full justify-start gap-2 items-center flex-row flex-wrap">
                      {hackathon.image ? (
                        <img
                          src={hackathon.image}
                          alt="Company Logo"
                          className="w-12 h-12 sm:h-12 sm:w-12 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-slate-400"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                            />
                          </svg>
                        </div>
                      )}{" "}
                      <label className="flex flex-row gap-2 text-slate-400 cursor-pointer shadow-xs justify-center items-center flex-1 px-3 h-12 border-black/20 rounded-xl border-dashed border border-black bg-white">
                        <input
                          onChange={(event) => {
                            event.preventDefault();

                            if (event.target.files) {
                              handleFileUpload(
                                event.target.files[0],
                                "hackathonLogo",
                                index
                              );
                            }
                          }}
                          type="file"
                          className="  w-full hidden  font-body font-light text-black/80 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-gray-700 hover:file:bg-slate-400"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4 text-slate-400"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                          />
                        </svg>
                        {uploadStatus[`hackathonLogo-${index}`] === "idle" &&
                          "Click to upload "}
                        {uploadStatus[`hackathonLogo-${index}`] ===
                          "uploading" && "Uploading..."}
                        {uploadStatus[`hackathonLogo-${index}`] ===
                          "uploaded" && "Logo  uploaded"}
                        {!uploadStatus[`hackathonLogo-${index}`] &&
                          "Click to upload "}{" "}
                        <input
                          type="file"
                          className="w-full hidden font-body font-light text-black/80 text-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-200 file:text-gray-700 hover:file:bg-slate-400"
                        />
                      </label>
                    </div>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.5">Hackathon name</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={hackathon.title}
                      onChange={(e) =>
                        handleNestedFieldChange(e, "hackathons", index, "title")
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.5">Location</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={hackathon.location}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "hackathons",
                          index,
                          "location"
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.5">Date</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={hackathon.dates}
                      onChange={(e) =>
                        handleNestedFieldChange(e, "hackathons", index, "dates")
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.5">Description</p>
                    <Textarea
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Enter your description"
                      value={hackathon.description}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "hackathons",
                          index,
                          "description"
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.5">Website link</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={hackathon.links.website}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "hackathons",
                          index,
                          "links.website"
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.5">Source Link</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={hackathon.links.github}
                      onChange={(e) =>
                        handleNestedFieldChange(
                          e,
                          "hackathons",
                          index,
                          "links.github"
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                </div>
              ))}
            <Button
              variant="bordered"
              onClick={addHackathon}
              className="border bg-none flex justify-center items-center gap-1 text-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5 text-gray-700"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              Add Hackathon
            </Button>
          </div>
          <div
            id="social-links"
            className="flex flex-col pb-6 pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Social Links</h2>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-0.5">LinkedIn</p>
              <Input
                type="text"
                variant="bordered"
                value={user.contact.LinkedIn}
                onChange={handleInputChange}
                name="contact.LinkedIn"
                className="max-w-xs text-gray-600"
                startContent={
                  <img
                    src="/icon/linkedin.png"
                    className="w-6 h-6 opacity-70"
                    alt="LinkedIn"
                  />
                }
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-0.5">GitHub</p>
              <Input
                type="text"
                variant="bordered"
                value={user.contact.GitHub}
                onChange={handleInputChange}
                name="contact.GitHub"
                className="max-w-xs text-gray-600"
                startContent={
                  <img
                    src="/icon/github.png"
                    className="w-6 h-6 opacity-70"
                    alt="GitHub"
                  />
                }
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-0.5">Twitter</p>
              <Input
                type="text"
                variant="bordered"
                value={user.contact.X}
                onChange={handleInputChange}
                name="contact.X"
                className="max-w-xs text-gray-600"
                startContent={
                  <img
                    src="/icon/twitter.png"
                    className="w-5 h-5 opacity-70"
                    alt="Twitter"
                  />
                }
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-0.5">YouTube</p>
              <Input
                type="text"
                variant="bordered"
                value={user.contact.Youtube}
                onChange={handleInputChange}
                name="contact.Youtube"
                className="max-w-xs text-gray-600"
                startContent={
                  <img
                    src="/icon/youtube.png"
                    className="w-5 h-5 opacity-70"
                    alt="YouTube"
                  />
                }
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-0.5">Dribbble</p>
              <Input
                type="text"
                variant="bordered"
                value={user.contact.dribbble}
                onChange={handleInputChange}
                name="contact.dribbble"
                className="max-w-xs text-gray-600"
                startContent={
                  <img
                    src="/icon/dribbble.png"
                    className="w-5 h-5 opacity-70"
                    alt="Dribbble"
                  />
                }
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
          </div>
        </div>
        <div className=" w-full z-50 flex gap-5 bg-white p-4 px-10 sticky bottom-0">
          <Link
            target="_blank"
            href={`https://${user.userName}.snapcv.me`}
            className="w-full rounded-xl sm:flex hidden border font-medium text-sm  justify-center items-center  bg-neutral-50"
          >
            View live
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </Link>
          <Button
            onClick={() => setDemo(true)}
            className="w-full flex sm:hidden border font-medium text-sm  justify-center items-center  bg-neutral-50"
          >
            See demo{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </Button>
          <Button
            onClick={handleSaveChanges}
            className="bg-gradient-to-r from-slate-900/90 to-slate-800 w-full text-white text-sm justify-center flex items-center rounded-xl font-medium py-2 px-4 "
          >
            Save changes
          </Button>
        </div>
      </div>
      <div
        className={`col-span-5  sm:col-span-2 sm:block h-full ${
          demo ? "block" : "hidden"
        }`}
      >
        <Temp1 user={user} />

        <div className=" w-full z-50 flex gap-5 sm:hidden bg-white p-4 px-10 fixed bottom-0">
          <Button
            onClick={() => setDemo(false)}
            className="w-full flex sm:hidden border font-medium text-sm  justify-center items-center  bg-neutral-50"
          >
            Back to Edit
          </Button>
          <Button className="bg-gradient-to-r from-slate-900/90 to-slate-800 w-full text-white text-sm justify-center flex items-center rounded-xl font-medium py-2 px-4 ">
            Save changes{" "}
          </Button>
        </div>
      </div>
    </div>
  );
}
