

type SocialLink = {
  url: string;
  icon: JSX.Element; // Assuming Icons are React components
};

type Contact = {
  email: string;
  tel: string;
  social: {
    GitHub: SocialLink;
    LinkedIn: SocialLink;
    X: SocialLink;
    Youtube: SocialLink;
  };
};

type WorkExperience = {
  company: string;
  href: string;
  badges: string[];
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  description: string;
};

type Education = {
  school: string;
  href: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
};

type ProjectLink = {
  type: string;
  href: string;
  icon: JSX.Element; // Assuming Icons are React components
};

type Project = {
  title: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  image: string;
  video: string;
};

type HackathonLink = {
  title: string;
  icon: JSX.Element; // Assuming Icons are React components
  href: string;
};

type Hackathon = {
  title: string;
  dates: string;
  location: string;
  description: string;
  image: string;
  mlh?: string;
  win?: string;
  links: HackathonLink[];
};

type Data = {
  name: string;
  initials: string;
  url: string;
  location: string;
  locationLink: string;
  description: string;
  summary: string;
  avatarUrl: string;
  skills: string[];
  contact: Contact;
  work: WorkExperience[];
  education: Education[];
  projects: Project[];
  hackathons: Hackathon[];
};
