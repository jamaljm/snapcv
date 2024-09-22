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
  Tabs,
  Tab,
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
import {
  UserProfile,
  IndexedUploadStatus,
  PhotoTypes,
  reservedWords,
} from "@/lib/type";
import { supabase } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { useCommonContext } from "@/Common_context";
import imageCompression from "browser-image-compression";
import { useToast } from "@/components/ui/use-toast";
import Temp1 from "@/components/design/temp_1";
import { useRouter } from "next/navigation";
import { tailwindColors } from "@/lib/utils";
import { initialUserState } from "@/lib/utils";
import ResumeTemplate from "../ResumeTemplate";
import Download from "../resume/Download";

const initialUploadStatus: IndexedUploadStatus = {
  "profilePhoto-0": "idle",
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
  default: "/icon/dribbble.png",
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
  const [user, setUser] = useState<UserProfile>(initialUserState);
  const [initialUser, setInitialUser] = useState<UserProfile>(initialUserState);
  const [isLoading, setIsLoading] = useState(false);
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
        .from("users")
        .select("*")
        .eq("userName", "jamalpp");
      console.log(data, error, "dbdfb");

      if (error || data.length === 0) {
        console.error("Error fetching user data:", error);
      } else {
        if (data && data.length > 0) {
          setUser(JSON.parse(JSON.stringify(data[0].resumeJson))); // Deep clone
          setInitialUser(JSON.parse(JSON.stringify(data[0].resumeJson))); // Deep clone
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

  const handleInputChange = (
    key: string,
    index: number = -1,
    subKey: string = "",
    value: string
  ) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser };
      const keys = key.split(".");
      let current: any = newUser;

      // Navigate through nested objects
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      if (index === -1) {
        // Handle non-array fields
        if (subKey) {
          current[lastKey][subKey] = value;
        } else {
          current[lastKey] = value;
        }
      } else {
        // Handle array fields
        if (!Array.isArray(current[lastKey])) {
          current[lastKey] = [];
        }
        if (!current[lastKey][index]) {
          current[lastKey][index] = {};
        }
        if (subKey) {
          current[lastKey][index][subKey] = value;
        } else {
          current[lastKey][index] = value;
        }
      }

      return newUser;
    });

    markAsEdited();
  };

  console.log(user, "user");

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
            workExperience: prevUser.work.map((exp, idx) =>
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
            projects: {
              ...prevUser.projects,
              projects: prevUser.projects.projects.map(
                (proj: any, idx: number) =>
                  idx === index ? { ...proj, image: fileUrl } : proj
              ),
            },
          }));
          break;
        case "hackathonLogo":
          setUser((prevUser) => ({
            ...prevUser,
            hackathons: {
              ...prevUser.hackathons,
              hackathons: prevUser.hackathons.hackathons.map((hack, idx) =>
                idx === index ? { ...hack, image: fileUrl } : hack
              ),
            },
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

  const handleSkillClose = (skillName: string, keywordToRemove: string) => {
    markAsEdited();
    setUser((prevUser) => {
      const updatedSkills = prevUser.skills.map((skill) => {
        if (skill.name === skillName) {
          const updatedKeywords = skill.keywords.filter(
            (keyword) => keyword !== keywordToRemove
          );
          return {
            ...skill,
            keywords: updatedKeywords,
          };
        }
        return skill;
      });

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

  const handleSkillInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    skillName: string
  ) => {
    if (event.key === "Enter" && skillName.trim() !== "") {
      markAsEdited();
      setUser((prevUser) => {
        // Check if the skill already exists
        const existingSkillIndex = prevUser.skills.findIndex(
          (skill) => skill.name === skillName.trim()
        );

        let updatedSkills;
        if (existingSkillIndex > -1) {
          // Update existing skill by adding a new keyword
          updatedSkills = prevUser.skills.map((skill, index) => {
            if (index === existingSkillIndex) {
              return {
                ...skill,
                keywords: [
                  ...skill.keywords,
                  inputValue.trim(), // Assuming inputValue is the new keyword
                ],
              };
            }
            return skill;
          });
        } else {
          // Add new skill if it doesn't exist
          updatedSkills = [
            ...prevUser.skills,
            {
              name: skillName.trim(),
              keywords: [], // Initialize with empty keywords
            },
          ];
        }

        return {
          ...prevUser,
          skills: updatedSkills,
        };
      });
      setInputValue(""); // Clear the input after adding
    }
  };

  const handleTechnologyClose = (
    projectIndex: number,
    techToRemove: string
  ) => {
    console.log(projectIndex, techToRemove);
    markAsEdited();

    setUser((prevUser) => {
      const updatedProjects = [...prevUser.projects.projects]; // Accessing the nested projects array
      const updatedTechnologies = updatedProjects[
        projectIndex
      ].technologies.filter((tech) => tech !== techToRemove);

      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        technologies: updatedTechnologies,
      };

      return {
        ...prevUser,
        projects: {
          ...prevUser.projects,
          projects: updatedProjects, // Properly update the nested projects array
        },
      };
    });
  };

  const handleSocialProfileChange = (
    network: string,
    value: string,
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>
  ) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser };
      const profileIndex = newUser.basics.profiles.findIndex(
        (profile) => profile.network === network
      );

      if (profileIndex !== -1) {
        // Update existing profile
        newUser.basics.profiles[profileIndex].url = value;
      } else {
        // Add new profile
        newUser.basics.profiles.push({
          network: network,
          url: value,
          username: "",
        });
      }

      return newUser;
    });

    markAsEdited();
  };

  const handleTechnologyInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
    inputValue: string
  ) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      markAsEdited();

      setUser((prevUser) => {
        const updatedProjects = [...prevUser.projects.projects];
        updatedProjects[index] = {
          ...updatedProjects[index],
          technologies: [
            ...updatedProjects[index].technologies,
            inputValue.trim(),
          ],
        };

        return {
          ...prevUser,
          projects: {
            ...prevUser.projects,
            projects: updatedProjects,
          },
        };
      });
      setInputValueProject("");
    }
  };

  const [file, setFile] = useState<File | null>(null);

  type DeleteType = "hackathons" | "workExperience" | "education" | "projects";

  const deleteItemByIndex = (
    path: string,
    index: number,
    setState: React.Dispatch<React.SetStateAction<UserProfile>>
  ) => {
    setState((prevUser) => {
      const newUser = { ...prevUser };
      const keys = path.split(".");
      let current: any = newUser;

      // Navigate to the parent of the target array
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          console.error(`Invalid path: ${path}`);
          return prevUser;
        }
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      if (Array.isArray(current[lastKey])) {
        current[lastKey] = current[lastKey].filter(
          (_: any, i: number) => i !== index
        );
      } else {
        console.error(`${lastKey} is not an array`);
        return prevUser;
      }

      return newUser;
    });

    markAsEdited();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
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
  Tabs,
  Tab,
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
import {
  UserProfile,
  IndexedUploadStatus,
  PhotoTypes,
  reservedWords,
} from "@/lib/type";
import { supabase } from "@/utils/supabase/client";
import { cn } from "@/lib/utils";
import { useCommonContext } from "@/Common_context";
import imageCompression from "browser-image-compression";
import { useToast } from "@/components/ui/use-toast";
import Temp1 from "@/components/design/temp_1";
import { useRouter } from "next/navigation";
import { tailwindColors } from "@/lib/utils";
import { initialUserState } from "@/lib/utils";
import ResumeTemplate from "../ResumeTemplate";
import Download from "../resume/Download";

const initialUploadStatus: IndexedUploadStatus = {
  "profilePhoto-0": "idle",
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
  default: "/icon/dribbble.png",
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
  const [user, setUser] = useState<UserProfile>(initialUserState);
  const [initialUser, setInitialUser] = useState<UserProfile>(initialUserState);
  const [isLoading, setIsLoading] = useState(false);
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
        .from("users")
        .select("*")
        .eq("userName", "jamalpp");
      console.log(data, error, "dbdfb");

      if (error || data.length === 0) {
        console.error("Error fetching user data:", error);
      } else {
        if (data && data.length > 0) {
          setUser(JSON.parse(JSON.stringify(data[0].resumeJson))); // Deep clone
          setInitialUser(JSON.parse(JSON.stringify(data[0].resumeJson))); // Deep clone
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

  const handleInputChange = (
    key: string,
    index: number = -1,
    subKey: string = "",
    value: string
  ) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser };
      const keys = key.split(".");
      let current: any = newUser;

      // Navigate through nested objects
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      if (index === -1) {
        // Handle non-array fields
        if (subKey) {
          current[lastKey][subKey] = value;
        } else {
          current[lastKey] = value;
        }
      } else {
        // Handle array fields
        if (!Array.isArray(current[lastKey])) {
          current[lastKey] = [];
        }
        if (!current[lastKey][index]) {
          current[lastKey][index] = {};
        }
        if (subKey) {
          current[lastKey][index][subKey] = value;
        } else {
          current[lastKey][index] = value;
        }
      }

      return newUser;
    });

    markAsEdited();
  };

  console.log(user, "user");

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
            workExperience: prevUser.work.map((exp, idx) =>
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
            projects: {
              ...prevUser.projects,
              projects: prevUser.projects.projects.map(
                (proj: any, idx: number) =>
                  idx === index ? { ...proj, image: fileUrl } : proj
              ),
            },
          }));
          break;
        case "hackathonLogo":
          setUser((prevUser) => ({
            ...prevUser,
            hackathons: {
              ...prevUser.hackathons,
              hackathons: prevUser.hackathons.hackathons.map((hack, idx) =>
                idx === index ? { ...hack, image: fileUrl } : hack
              ),
            },
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

  const handleSkillClose = (skillName: string, keywordToRemove: string) => {
    markAsEdited();
    setUser((prevUser) => {
      const updatedSkills = prevUser.skills.map((skill) => {
        if (skill.name === skillName) {
          const updatedKeywords = skill.keywords.filter(
            (keyword) => keyword !== keywordToRemove
          );
          return {
            ...skill,
            keywords: updatedKeywords,
          };
        }
        return skill;
      });

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

  const handleSkillInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    skillName: string
  ) => {
    if (event.key === "Enter" && skillName.trim() !== "") {
      markAsEdited();
      setUser((prevUser) => {
        // Check if the skill already exists
        const existingSkillIndex = prevUser.skills.findIndex(
          (skill) => skill.name === skillName.trim()
        );

        let updatedSkills;
        if (existingSkillIndex > -1) {
          // Update existing skill by adding a new keyword
          updatedSkills = prevUser.skills.map((skill, index) => {
            if (index === existingSkillIndex) {
              return {
                ...skill,
                keywords: [
                  ...skill.keywords,
                  inputValue.trim(), // Assuming inputValue is the new keyword
                ],
              };
            }
            return skill;
          });
        } else {
          // Add new skill if it doesn't exist
          updatedSkills = [
            ...prevUser.skills,
            {
              name: skillName.trim(),
              keywords: [], // Initialize with empty keywords
            },
          ];
        }

        return {
          ...prevUser,
          skills: updatedSkills,
        };
      });
      setInputValue(""); // Clear the input after adding
    }
  };

  const handleTechnologyClose = (
    projectIndex: number,
    techToRemove: string
  ) => {
    console.log(projectIndex, techToRemove);
    markAsEdited();

    setUser((prevUser) => {
      const updatedProjects = [...prevUser.projects.projects]; // Accessing the nested projects array
      const updatedTechnologies = updatedProjects[
        projectIndex
      ].technologies.filter((tech) => tech !== techToRemove);

      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        technologies: updatedTechnologies,
      };

      return {
        ...prevUser,
        projects: {
          ...prevUser.projects,
          projects: updatedProjects, // Properly update the nested projects array
        },
      };
    });
  };

  const handleSocialProfileChange = (
    network: string,
    value: string,
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>
  ) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser };
      const profileIndex = newUser.basics.profiles.findIndex(
        (profile) => profile.network === network
      );

      if (profileIndex !== -1) {
        // Update existing profile
        newUser.basics.profiles[profileIndex].url = value;
      } else {
        // Add new profile
        newUser.basics.profiles.push({
          network: network,
          url: value,
          username: "",
        });
      }

      return newUser;
    });

    markAsEdited();
  };

  const handleTechnologyInputKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
    inputValue: string
  ) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      markAsEdited();

      setUser((prevUser) => {
        const updatedProjects = [...prevUser.projects.projects];
        updatedProjects[index] = {
          ...updatedProjects[index],
          technologies: [
            ...updatedProjects[index].technologies,
            inputValue.trim(),
          ],
        };

        return {
          ...prevUser,
          projects: {
            ...prevUser.projects,
            projects: updatedProjects,
          },
        };
      });
      setInputValueProject("");
    }
  };

  const [file, setFile] = useState<File | null>(null);

  type DeleteType = "hackathons" | "workExperience" | "education" | "projects";

  const deleteItemByIndex = (
    path: string,
    index: number,
    setState: React.Dispatch<React.SetStateAction<UserProfile>>
  ) => {
    setState((prevUser) => {
      const newUser = { ...prevUser };
      const keys = path.split(".");
      let current: any = newUser;

      // Navigate to the parent of the target array
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          console.error(`Invalid path: ${path}`);
          return prevUser;
        }
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      if (Array.isArray(current[lastKey])) {
        current[lastKey] = current[lastKey].filter(
          (_: any, i: number) => i !== index
        );
      } else {
        console.error(`${lastKey} is not an array`);
        return prevUser;
      }

      return newUser;
    });

    markAsEdited();
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
      { threshold: 0.3 }
    );

    const sectionIds = [
      "general-info",
      "work-experience",
      "education",
      "project",
      "hackathon",
      "social-links",
      "awards",
      "certificates",
      "publications",
      "skills",
      "interests",
      "references",
      "languages",
      "volunteer",
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
  type AddItemFunction = () => void;

  const createAddItemFunctions = (): Record<string, AddItemFunction> => {
    const itemTemplates = {
      work: {
        summary: "",
        website: "",
        name: "",
        location: "",
        position: "",
        startDate: "",
        endDate: "",
        logo: "",
        highlights: [],
      },
      education: {
        endDate: "",
        startDate: "",
        area: "",
        studyType: "",
        institution: "",
        url: "",
        logo: "",
        score: "",
        courses: [""],
      },

      certificates: {
        name: "",
        date: "",
        issuer: "",
        url: "",
      },
      skills: {
        name: "",
        keywords: [""],
      },
      awards: {
        title: "",
        awarder: "",
        date: "",
        summary: "",
      },
      publications: {
        name: "",
        publisher: "",
        releaseDate: "",
        url: "",
        summary: "",
      },
      volunteer: {
        organization: "",
        position: "",
        url: "",
        startDate: "",
        summary: "",
        highlights: [""],
      },
      languages: {
        language: "",
        fluency: "",
      },
      interests: {
        name: "",
        keywords: [""],
      },
      references: {
        reference: "",
        name: "",
      },
    };

    return Object.entries(itemTemplates).reduce((acc, [key, template]) => {
      acc[`add${key.charAt(0).toUpperCase() + key.slice(1)}`] = () => {
        addItemToArray(key, template, setUser);
      };
      return acc;
    }, {} as Record<string, AddItemFunction>);
  };

  const {
    addWork,
    addEducation,
    addCertificates,
    addSkills,
    addAwards,
    addPublications,
    addVolunteer,
    addLanguages,
    addInterests,
    addReferences,
  } = createAddItemFunctions();

  const addItemToArray = (
    path: string,
    newItem: any,
    setUser: React.Dispatch<React.SetStateAction<UserProfile>>
  ) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser };
      const keys = path.split(".");
      let current: any = newUser;

      // Navigate to the parent of the target array
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }

      const lastKey = keys[keys.length - 1];

      if (Array.isArray(current[lastKey])) {
        current[lastKey] = [...current[lastKey], newItem];
      } else if (
        typeof current[lastKey] === "object" &&
        current[lastKey] !== null
      ) {
        // Handle nested objects like projects and hackathons
        if (!Array.isArray(current[lastKey][lastKey])) {
          current[lastKey][lastKey] = [];
        }
        current[lastKey][lastKey] = [...current[lastKey][lastKey], newItem];
      } else {
        console.error(`${lastKey} is not an array or a valid object`);
        return prevUser;
      }

      return newUser;
    });

    markAsEdited();
  };

  // ... existing code ...

  const addProjects = () => {
    setUser((prevUser) => {
      const newProject = {
        title: "",
        description: "",
        website: "",
        duration: "",
        technologies: [],
        highlights: [],
        image: "",
        source: "",
      };
      return {
        ...prevUser,
        projects: {
          ...prevUser.projects,
          projects: [...prevUser.projects.projects, newProject],
        },
      };
    });
    markAsEdited();
  };

  const addHackathons = () => {
    setUser((prevUser) => {
      const newHackathon = {
        title: "",
        dates: "",
        location: "",
        description: "",
        image: "",
        win: "",
        url: "",
      };
      return {
        ...prevUser,
        hackathons: {
          ...prevUser.hackathons,
          hackathons: [...prevUser.hackathons.hackathons, newHackathon],
        },
      };
    });
    markAsEdited();
  };

  // ... rest of the existing code ...

  const handleSaveChanges = async () => {
    console.log("Saving changes...");

    let userUpdateSuccess = true;

    if (Object.keys(user).length > 0) {
      const { data, error } = await supabase
        .from("User")
        .update(user)
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
                href={`https://${user.meta.userName}.snapcv.me`}
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
    if (slug === initialUser.meta.userName) {
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
    const isUnique = await checkSlugUnique(user.meta.userName);
    setIsChecking(false);
    if (user.meta.userName === "") {
      setIsAvailable(false);
    }
    if (isUnique && user.meta.userName !== "") {
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

  const sections = [
    { id: "general-info", label: "General Info" },
    { id: "work-experience", label: "Work Experience" },
    { id: "education", label: "Education" },
    { id: "project", label: "Projects" },
    { id: "hackathon", label: "Hackathons" },
    { id: "awards", label: "Awards" },
    { id: "certificates", label: "Certificates" },
    { id: "publications", label: "Publications" },
    { id: "skills", label: "Skills" },
    { id: "interests", label: "Interests" },
    { id: "references", label: "References" },
    { id: "languages", label: "Languages" },
    { id: "volunteer", label: "Volunteer" },
    { id: "social-links", label: "Social Links" },
  ];

  const RadioLink = ({
    id,
    label,
    isLast,
  }: {
    id: string;
    label: string;
    isLast: boolean;
  }) => (
    <Link href={`#${id}`}>
      <Radio
        className={`bg-white  p-0 -ml-2.5 ${!isLast ? "mb-6" : ""}`}
        value={id}
        size="md"
      >
        {label}
      </Radio>
    </Link>
  );

  return (
    <div className="grid grid-cols-5  font-dmSans  w-full h-full">
      <div className="col-span-1  hidden sm:block  border-r h-full p-12">
        <RadioGroup
          color="secondary"
          className="font-medium sticky  top-12 border-l text-gray-400"
          defaultValue="general-info"
          value={selectedSection}
          onChange={handleRadioChange}
        >
          {sections.map((section, index) => (
            <RadioLink
              key={section.id}
              id={section.id}
              label={section.label}
              isLast={index === sections.length - 1}
            />
          ))}
        </RadioGroup>
      </div>
      <div
        className={`col-span-5 sm:col-span-2 sm:block border-r h-full ${
          demo ? "hidden" : "block"
        }`}
      >
        <div className="flex w-full justify-center items-center p-6 border-b">
          <Download profile={user} />
          <Link className="w-full bg-slate-100 text-slate-950 font-semibold px-4 py-2 rounded-xl  cursor-pointer hover:bg-green-200 hover:text-slate-700" href={`https://${user.meta.userName}.snapcv.me`}>
            View Portfolio
          </Link>
        </div>
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
            {`https://${user.meta.userName}.snapcv.me`}
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
                {user.basics.avatarUrl ? (
                  <img
                    src={user.basics.avatarUrl}
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
                value={user.basics.name}
                onChange={(e) =>
                  handleInputChange("basics.name", -1, "", e.target.value)
                }
                name="basics.name"
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
                value={user.meta.userName}
                onChange={(e) =>
                  handleInputChange("meta.userName", -1, "", e.target.value)
                }
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
              <p className="pt-.05">Your role</p>
              <Input
                type="text"
                variant="bordered"
                defaultValue="Product designer"
                value={user.basics.label}
                onChange={(e) =>
                  handleInputChange("basics.label", -1, "", e.target.value)
                }
                name="role"
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
                value={user.basics.about}
                onChange={(e) =>
                  handleInputChange("basics.about", -1, "", e.target.value)
                }
                name="about"
                defaultValue="NextUI is a React UI library that provides a set of accessible, reusable, and beautiful components."
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            {/* <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Skills</p>
              <div className="flex max-w-xs w-full flex-col justify-start items-start gap-3">
                <Input
                  type="text"
                  labelPlacement="inside"
                  placeholder="Add your skills"
                  description=" Press Enter to add a new skill"
                  variant="bordered"
                  value={inputValue}
                  onChange={(e) => handleSkillInputChange(e.target.value)}
                  onKeyDown={(event) =>
                    handleSkillInputKeyDown(event, inputValue)
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
                  {user.basics..map((skill, index) => (
                    <Chip
                      key={index}
                      onClose={(event) => handleSkillClose(event, skill)}
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
            </div> */}
            <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
              <p className="pt-.05">Contact mail</p>
              <Input
                type="email"
                variant="bordered"
                value={user.basics.email}
                onChange={(e) =>
                  handleInputChange("basics.email", -1, "", e.target.value)
                }
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
                value={user.basics.resumeUrl}
                onChange={(e) =>
                  handleInputChange("basics.resumeUrl", -1, "", e.target.value)
                }
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
                value={user.meta.buttonText}
                onChange={(e) =>
                  handleInputChange("meta.buttonText", -1, "", e.target.value)
                }
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
                        user.meta.portfolioColor === color.name
                          ? ".1rem solid black"
                          : "",
                    }}
                    className={`w-5 h-5 rounded-full cursor-pointer ${
                      color.name === "white" ? "border border-slate-400" : ""
                    } `}
                    onClick={() =>
                      setUser((prevUser) => ({
                        ...prevUser,
                        meta: {
                          ...prevUser.meta,
                          portfolioColor: color.name,
                        },
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
            {user.work &&
              user.work.length > 0 &&
              user.work.map((experience, index) => (
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
                      {experience.logo ? (
                        <img
                          src={experience.logo}
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
                      value={experience.name}
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange("work", index, "name", e.target.value)
                      }
                      placeholder="Company name"
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-0.05">Role</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={experience.position}
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "work",
                          index,
                          "position",
                          e.target.value
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(
                            "work",
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        value={experience.startDate}
                        variant="bordered"
                        className="max-w-xs text-gray-600"
                        // value={[experience.start, experience.end]}
                      />
                      <Input
                        classNames={{
                          inputWrapper: "border-1 shadow-none",
                        }}
                        placeholder="end"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(
                            "work",
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        value={experience.endDate}
                        variant="bordered"
                        className="max-w-xs text-gray-600"
                        // value={[experience.start, experience.end]}
                      />
                    </div>
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Summary</p>
                    <Textarea
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="Enter your description"
                      value={experience.summary}
                      className="max-w-xs text-gray-600"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "work",
                          index,
                          "summary",
                          e.target.value
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
                      value={experience.website}
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "work",
                          index,
                          "website",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            <Button
              variant="bordered"
              onClick={addWork}
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
              Add Experience
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
                      {edu.logo ? (
                        <img
                          src={edu.logo}
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
                      value={edu.institution}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "education",
                          index,
                          "institution",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Area of Study</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={edu.area}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "education",
                          index,
                          "area",
                          e.target.value
                        )
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
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(
                            "education",
                            index,
                            "startDate",
                            e.target.value
                          )
                        }
                        value={edu.startDate}
                        variant="bordered"
                        className="max-w-xs text-gray-600"
                        // value={[experience.start, experience.end]}
                      />
                      <Input
                        classNames={{
                          inputWrapper: "border-1 shadow-none",
                        }}
                        placeholder="end"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange(
                            "education",
                            index,
                            "endDate",
                            e.target.value
                          )
                        }
                        value={edu.endDate}
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
                value={user.projects.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(
                    "projects",
                    0,
                    "description",
                    e.target.value
                  )
                }
                name="projects.description"
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            {user.projects &&
              user.projects.projects.length > 0 &&
              user.projects.projects.map((project, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  {" "}
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("projects.projects", index, setUser)
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "projects",
                          index,
                          "name",
                          e.target.value
                        )
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
                      value={project.duration}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "projects",
                          index,
                          "duration",
                          e.target.value
                        )
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "projects",
                          index,
                          "description",
                          e.target.value
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
                        // onKeyDown={(event) =>
                        //   handleTechnologyInputKeyDown(
                        //     event,
                        //     index,
                        //     inputValueProject,
                        //     "projects"
                        //   )
                        // }
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
                      value={project.website}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "projects",
                          index,
                          "website",
                          e.target.value
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
                      value={project.source}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "projects",
                          index,
                          "source",
                          e.target.value
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
              onClick={addProjects}
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
                value={user.hackathons.description}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(
                    "hackathons",
                    0,
                    "description",
                    e.target.value
                  )
                }
                className="max-w-xs text-gray-600"
                classNames={{
                  inputWrapper: "border-1 shadow-none",
                }}
              />
            </div>
            {user.hackathons &&
              user.hackathons.hackathons.length > 0 &&
              user.hackathons.hackathons.map((hackathon, index) => (
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "hackathons",
                          index,
                          "title",
                          e.target.value
                        )
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "hackathons",
                          index,
                          "location",
                          e.target.value
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "hackathons",
                          index,
                          "dates",
                          e.target.value
                        )
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "hackathons",
                          index,
                          "description",
                          e.target.value
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
                      value={hackathon.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "hackathons",
                          index,
                          "links.website",
                          e.target.value
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
              onClick={addHackathons}
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
          {/* Awards Section */}
          <div
            id="awards"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Awards</h2>
            {user.awards &&
              user.awards.length > 0 &&
              user.awards.map((award, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("awards", index, setUser)
                      }
                      aria-label={`Delete award ${index}`}
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
                    <p className="pt-.05">Award Title</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={award.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "awards",
                          index,
                          "title",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Awarder</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={award.awarder}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "awards",
                          index,
                          "awarder",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Date</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={award.date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "awards",
                          index,
                          "date",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Summary</p>
                    <Textarea
                      variant="bordered"
                      value={award.summary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "awards",
                          index,
                          "summary",
                          e.target.value
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
              onClick={addAwards}
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
              Add Award
            </Button>
          </div>
          {/* Certificates Section */}
          <div
            id="certificates"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Certificates</h2>
            {user.certificates &&
              user.certificates.length > 0 &&
              user.certificates.map((certificate, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("certificates", index, setUser)
                      }
                      aria-label={`Delete certificate ${index}`}
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
                    <p className="pt-.05">Certificate Name</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={certificate.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "certificates",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Issuer</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={certificate.issuer}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "certificates",
                          index,
                          "issuer",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Date</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={certificate.date}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "certificates",
                          index,
                          "date",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">URL</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={certificate.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "certificates",
                          index,
                          "url",
                          e.target.value
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
              onClick={addCertificates}
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
              Add Certificate
            </Button>
          </div>
          {/* Skills Section */}
          <div
            id="skills"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Skills</h2>
            {user.skills &&
              user.skills.length > 0 &&
              user.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("skills", index, setUser)
                      }
                      aria-label={`Delete skill ${index}`}
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
                    <p className="pt-.05">Skill Name</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={skill.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "skills",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Keywords</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={skill.keywords.join(", ")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "skills",
                          index,
                          "keywords",
                          e.target.value
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
              onClick={addSkills}
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
              Add Skill
            </Button>
          </div>
          {/* Publications Section */}
          <div
            id="publications"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Publications</h2>
            {user.publications &&
              user.publications.length > 0 &&
              user.publications.map((publication, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("publications", index, setUser)
                      }
                      aria-label={`Delete publication ${index}`}
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
                    <p className="pt-.05">Publication Name</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={publication.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "publications",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Publisher</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={publication.publisher}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "publications",
                          index,
                          "publisher",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Release Date</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={publication.releaseDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "publications",
                          index,
                          "releaseDate",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">URL</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={publication.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "publications",
                          index,
                          "url",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Summary</p>
                    <Textarea
                      variant="bordered"
                      value={publication.summary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "publications",
                          index,
                          "summary",
                          e.target.value
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
              onClick={addPublications}
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
              Add Publication
            </Button>
          </div>
          {/* Languages Section */}
          <div
            id="languages"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Languages</h2>
            {user.languages &&
              user.languages.length > 0 &&
              user.languages.map((language, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("languages", index, setUser)
                      }
                      aria-label={`Delete language ${index}`}
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
                    <p className="pt-.05">Language</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={language.language}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "languages",
                          index,
                          "language",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Fluency</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={language.fluency}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "languages",
                          index,
                          "fluency",
                          e.target.value
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
              onClick={addLanguages}
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
              Add Language
            </Button>
          </div>
          {/* Volunteer Section */}
          <div
            id="volunteer"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Volunteer Work</h2>
            {user.volunteer &&
              user.volunteer.length > 0 &&
              user.volunteer.map((work, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("volunteer", index, setUser)
                      }
                      aria-label={`Delete volunteer work ${index}`}
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
                    <p className="pt-.05">Organization</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={work.organization}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "volunteer",
                          index,
                          "organization",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Position</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={work.position}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "volunteer",
                          index,
                          "position",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">URL</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={work.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "volunteer",
                          index,
                          "url",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Start Date</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={work.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "volunteer",
                          index,
                          "startDate",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Summary</p>
                    <Textarea
                      variant="bordered"
                      value={work.summary}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "volunteer",
                          index,
                          "summary",
                          e.target.value
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
              onClick={addVolunteer}
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
              Add Volunteer Work
            </Button>
          </div>
          {/* Interests Section */}
          <div
            id="interests"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">Interests</h2>
            {user.interests &&
              user.interests.length > 0 &&
              user.interests.map((interest, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("interests", index, setUser)
                      }
                      aria-label={`Delete interest ${index}`}
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
                    <p className="pt-.05">Interest Name</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={interest.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "interests",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Keywords</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={interest.keywords.join(", ")}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "interests",
                          index,
                          "keywords",
                          e.target.value
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
              onClick={addInterests}
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
              Add Interest
            </Button>
          </div>
          {/* References Section */}
          <div
            id="references"
            className="flex flex-col pt-11 justify-center items-start gap-4"
          >
            <h2 className="font-semibold text-lg mb-4">References</h2>
            {user.references &&
              user.references.length > 0 &&
              user.references.map((reference, index) => (
                <div
                  key={index}
                  className="flex flex-col w-full gap-4 border rounded-xl p-5"
                >
                  <div className="w-full flex justify-end">
                    <button
                      onClick={() =>
                        deleteItemByIndex("references", index, setUser)
                      }
                      aria-label={`Delete reference ${index}`}
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
                    <p className="pt-.05">Name</p>
                    <Input
                      type="text"
                      variant="bordered"
                      value={reference.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "references",
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="max-w-xs text-gray-600"
                      classNames={{
                        inputWrapper: "border-1 shadow-none",
                      }}
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-2 sm:gap-0 w-full justify-between text-sm items-start">
                    <p className="pt-.05">Reference</p>
                    <Textarea
                      variant="bordered"
                      value={reference.reference}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(
                          "references",
                          index,
                          "reference",
                          e.target.value
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
              onClick={addReferences}
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
              Add Reference
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
                value={
                  user.basics.profiles.find(
                    (profile) => profile.network === "LinkedIn"
                  )?.url || ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSocialProfileChange("LinkedIn", e.target.value, setUser)
                }
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
                value={
                  user.basics.profiles.find(
                    (profile) => profile.network === "GitHub"
                  )?.url || ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSocialProfileChange("GitHub", e.target.value, setUser)
                }
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
                value={
                  user.basics.profiles.find(
                    (profile) => profile.network === "X"
                  )?.url || ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSocialProfileChange("X", e.target.value, setUser)
                }
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
                value={
                  user.basics.profiles.find(
                    (profile) => profile.network === "Youtube"
                  )?.url || ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSocialProfileChange("Youtube", e.target.value, setUser)
                }
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
                value={
                  user.basics.profiles.find(
                    (profile) => profile.network === "Dribbble"
                  )?.url || ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSocialProfileChange("Dribbble", e.target.value, setUser)
                }
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
            href={`https://${user.meta.userName}.snapcv.me`}
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
        <Tabs
          color="secondary"
          aria-label="Template Options"
          className="w-full  p-6 border-b"
          fullWidth
        >
          <Tab key="template1" className="p-0" title="Portfolio">
            <Temp1 user={user} />
          </Tab>
          <Tab key="template2" className="p-0" title="Resume">
            <ResumeTemplate profile={user} />
          </Tab>
        </Tabs>

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
