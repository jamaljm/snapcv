export const reservedWords = [
  "about",
  "api",
  "auth",
  "profile",
  "home",
  "login",
  "signup",
  "logout",
  "settings",
  "dashboard",
  "admin",
  "register",
  "forgot-password",
  "reset-password",
  "verify-email",
  "verify",
  "change-password",
  "account",
  "users",
  "roles",
  "permissions",
  "password-reset",
  "user",
  "profile-settings",
  "welcome",
  "posts",
  "articles",
  "news",
  "blogs",
  "events",
  "gallery",
  "media",
  "resources",
  "faq",
  "terms",
  "privacy",
  "feedback",
  "contact",
  "support",
  "tickets",
  "help",
  "updates",
  "notifications",
  "shop",
  "cart",
  "checkout",
  "order",
  "invoice",
  "products",
  "product",
  "categories",
  "reviews",
  "discounts",
  "coupons",
  "wishlist",
  "payment",
  "shipping",
  "returns",
  "orders",
  "transactions",
  "manage",
  "system",
  "config",
  "logs",
  "audit",
  "reports",
  "analytics",
  "monitoring",
  "maintenance",
  "backup",
  "restore",
  "upgrade",
  "docs",
  "swagger",
  "graphql",
  "endpoint",
  "webhooks",
  "integration",
  "hooks",
  "dev",
  "testing",
  "sandbox",
  "search",
  "subscribe",
  "unsubscribe",
  "unregister",
  "activate",
  "deactivate",
  "status",
  "subscription",
];

// Metadata for UserProfile
export type Meta = {
  resumeTheme: string;
  portfolioTheme: string;
  portfolioColor: string;
  userName: string;
  buttonText: string;
};

// Location type used in basics
export type Location = {
  city: string;
  countryCode: string;
};

// Social Profiles type used in basics
export type Profile = {
  username: string;
  url: string;
  network: string;
};

// Basics information
export type Basics = {
  name: string;
  phone: string;
  label: string;
  avatarUrl: string;
  about: string;
  website: string;
  resumeUrl: string;
  email: string;
  location: Location;
  profiles: Profile[];
};

// Certificates
export type Certificate = {
  name: string;
  date: string;
  issuer: string;
  url: string;
};

// Education details
export type Education = {
  endDate: string;
  startDate: string;
  area: string;
  studyType: string;
  institution: string;
  url: string;
  logo: string;
  score: string;
  courses: string[];
};

// Skills
export type Skill = {
  name: string;
  keywords: string[];
};

// Awards
export type Award = {
  title: string;
  awarder: string;
  date: string;
  summary: string;
};

// Hackathon details within the hackathons array
export type HackathonDetail = {
  title: string;
  dates: string;
  location: string;
  description: string;
  image: string;
  win: string;
  url: string;
};

// Hackathons
export type Hackathon = {
  description: string;
  hackathons: HackathonDetail[];
};

// Publications
export type Publication = {
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary: string;
};

// Volunteer experience
export type Volunteer = {
  organization: string;
  position: string;
  url: string;
  startDate: string;
  summary: string;
  highlights: string[];
};

// Work experience
export type Work = {
  summary: string;
  website: string;
  name: string;
  location: string;
  position: string;
  startDate: string;
  endDate: string;
  logo: string;
  highlights: string[];
};

// Project details within the projects array
export type ProjectDetail = {
  title: string;
  description: string;
  website: string;
  source: string;
  duration: string;
  technologies: string[];
  highlights: string[];
  image: string;
};

// Projects
export type Project = {
  description: string;
  projects: ProjectDetail[];
};

// Languages
export type Language = {
  language: string;
  fluency: string;
};

// Interests
export type Interest = {
  name: string;
  keywords: string[];
};

// References
export type Reference = {
  reference: string;
  name: string;
};

// Complete UserProfile
export interface UserProfile {
  meta: Meta;
  basics: Basics;
  certificates?: Certificate[];
  education: Education[];
  skills: Skill[];
  awards?: Award[];
  hackathons: Hackathon;
  publications: Publication[];
  volunteer: Volunteer[];
  work: Work[];
  projects: Project;
  languages?: Language[];
  interests: Interest[];
  references: Reference[];
}

export type ThemeColor =
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

export type PhotoTypes =
  | "profilePhoto"
  | "workExperienceLogo"
  | "educationLogo"
  | "projectImage"
  | "hackathonLogo";

export type IndexedUploadStatus = {
  [key: string]: "idle" | "uploading" | "uploaded";
};
