export interface ExperienceStyle {
  color: string;
  initials: string;
  lightBg: string;
  isLightInitials?: boolean;
}

export interface Experience {
  slug: string;
  role: string;
  company: string;
  location: string;
  period: string;
  skills: string[];
  website?: string;
  style: ExperienceStyle;
}

export const EXPERIENCES: Experience[] = [
  {
    slug: "maptrack-fullstack",
    role: "Product Software Engineer (Fullstack)",
    company: "MapTrack",
    location: "Remote, Full-time",
    period: "Jan 2025 — Present",
    skills: ["Next.js", "TypeScript", "Supabase", "OpenAI", "TanStack DB"],
    website: "https://maptrack.com",
    style: {
      color: "var(--primary)",
      lightBg: "color-mix(in oklch, var(--primary) 8%, transparent)",
      initials: "MT",
    },
  },
  {
    slug: "happy5-fullstack",
    role: "Frontend Web/Mobile Engineer",
    company: "Happy5",
    location: "Remote, Full-time",
    period: "Mar 2021 — Dec 2025",
    skills: ["React", "React Native", "TypeScript", "Tailwind CSS", "Cypress", "Storybook", "Amplitude"],
    website: "https://www.happy5.co/",
    style: {
      color: "var(--secondary)",
      lightBg: "color-mix(in oklch, var(--secondary) 8%, transparent)",
      initials: "H5",
    },
  },
  {
    slug: "kodegiri",
    role: "Frontend Web Engineer",
    company: "Kodegiri",
    location: "Remote, Freelance",
    period: "Mar 2024 — Jun 2024",
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Ant Design"],
    style: {
      color: "var(--accent)",
      lightBg: "color-mix(in oklch, var(--accent) 10%, transparent)",
      initials: "KG",
      isLightInitials: true,
    },
  },
  {
    slug: "rakamin",
    role: "Frontend Web Engineer",
    company: "Rakamin Academy",
    location: "Remote, Freelance",
    period: "Mar 2022 — Apr 2022",
    skills: ["React.js", "React Query", "Styled Components"],
    style: {
      color: "oklch(0.45 0.14 190)",
      lightBg: "color-mix(in oklch, oklch(0.45 0.14 190) 8%, transparent)",
      initials: "RA",
    },
  },
  {
    slug: "smarteschool",
    role: "Frontend Web Engineer",
    company: "Smarteschool",
    location: "Remote, Freelance",
    period: "Jul 2021 — Feb 2022",
    skills: ["Next.js", "Bootstrap", "React"],
    style: {
      color: "oklch(0.5 0.18 290)",
      lightBg: "color-mix(in oklch, oklch(0.5 0.18 290) 8%, transparent)",
      initials: "SS",
    },
  },
  {
    slug: "happy5-intern",
    role: "Frontend Web Engineer (Intern)",
    company: "Happy5",
    location: "Remote, Intern",
    period: "May 2020 — Mar 2021",
    skills: ["React", "Cypress", "@react-pdf/renderer"],
    website: "https://www.happy5.co/",
    style: {
      color: "oklch(0.75 0.18 29)",
      lightBg: "color-mix(in oklch, oklch(0.75 0.18 29) 8%, transparent)",
      initials: "H5",
      isLightInitials: true,
    },
  },
];
