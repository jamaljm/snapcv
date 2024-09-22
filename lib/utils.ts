import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeColor, UserProfile } from "./type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const tailwindColors = [
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
export const tailwindColors100: Record<ThemeColor, string> = {
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

export const initialUserState: UserProfile = {
  meta: {
    resumeTheme: "",
    portfolioTheme: "",
    portfolioColor: "",
    userName: "",
    buttonText: "",
  },
  basics: {
    name: "",
    phone: "",
    label: "",
    avatarUrl: "",
    about: "",
    website: "",
    resumeUrl: "",
    email: "",
    location: {
      city: "",
      countryCode: "",
    },
    profiles: [
      {
        username: "",
        url: "",
        network: "LinkedIn",
      },
      {
        username: "",
        url: "",
        network: "X",
      },
      {
        username: "",
        url: "",
        network: "GitHub",
      },
      {
        username: "",
        url: "",
        network: "Youtube",
      },
      {
        username: "",
        url: "",
        network: "Dribbble",
      },
    ],
  },
  certificates: [
    {
      name: "",
      date: "",
      issuer: "",
      url: "",
    },
  ],
  education: [
    {
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
  ],
  skills: [
    {
      name: "",
      keywords: [""],
    },
  ],
  awards: [
    {
      title: "",
      awarder: "",
      date: "",
      summary: "",
    },
  ],
  hackathons: {
    description: "",
    hackathons: [
      {
        title: "",
        dates: "",
        location: "",
        description: "",
        image: "",
        win: "",
        url: "",
      },
    ],
  },
  publications: [
    {
      name: "",
      publisher: "",
      releaseDate: "",
      url: "",
      summary: "",
    },
  ],
  volunteer: [
    {
      organization: "",
      position: "",
      url: "",
      startDate: "",
      summary: "",
      highlights: [""],
    },
  ],
  work: [
    {
      summary: "",
      website: "",
      name: "",
      location: "",
      position: "",
      startDate: "",
      endDate: "",
      logo: "",
      highlights: [""],
    },
  ],
  projects: {
    description: "",
    projects: [
      {
        name: "",
        description: "",
        website: "",
        duration: "",
        technologies: [""],
        highlights: [""],
        image: "",
        source: "",
      },
    ],
  },
  languages: [
    {
      language: "",
      fluency: "",
    },
  ],
  interests: [
    {
      name: "",
      keywords: [""],
    },
  ],
  references: [
    {
      reference: "",
      name: "",
    },
  ],
};
