export type SocialLinks = {
  GitHub: string;
  LinkedIn: string;
  X: string;
  Youtube: string;
  dribbble: string;
};

type WorkExperience = {
  company: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  description: string;
  link: string;
};

type Education = {
  school: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
  link: string;
};

type ProjectLink = {
  website: string;
  source: string;
};

export type Project = {
  title: string;
  href: string;
  dates: string;
  description: string;
  technologies: string[];
  links: ProjectLink;
  image: string;
};

type HackathonLink = {
  website: string;
  github: string;
};

export type Hackathon = {
  title: string;
  dates: string;
  location: string;
  description: string;
  image: string;
  win?: string;
  links: HackathonLink;
};

export type User = {
  userId: string;
  fullName: string;
  userName: string;
  roll: string;
  email: string;
  phone: string;
  about: string;
  skills: string[];
  resumeLink: string;
  buttonText: string;
  themeColor: string;
  avatarUrl: string;
  contact: SocialLinks;
  workExperience: WorkExperience[];
  education: Education[];
  hackathonDescription: string;
  projects: Project[];
  projectDescription: string;
  hackathons: Hackathon[];
};

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
