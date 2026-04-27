export interface ExperienceStyle {
  color: string;
  initials: string;
  lightBg: string;
  isLightInitials?: boolean;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  descriptionCount: number;
  skills: string[];
  website?: string;
}

export const EXPERIENCES: Experience[] = [
  {
    role: "Product Software Engineer (Fullstack)",
    company: "MapTrack",
    location: "Remote, Full-time",
    period: "Jan 2025 — Present",
    descriptionCount: 3,
    skills: ["Next.js", "TypeScript", "Supabase", "OpenAI", "TanStack DB", "Amazon DynamoDB"],
    website: "https://maptrack.com",
  },
  {
    role: "Frontend Web/Mobile Engineer",
    company: "Happy5",
    location: "Remote, Full-time",
    period: "Mar 2021 — Dec 2025",
    descriptionCount: 9,
    skills: ["React", "React Native", "TypeScript", "Tailwind CSS", "Cypress", "Storybook", "Amplitude"],
    website: "https://www.happy5.co/",
  },
  {
    role: "Frontend Web Engineer",
    company: "Kodegiri",
    location: "Remote, Freelance",
    period: "Mar 2024 — Jun 2024",
    descriptionCount: 4,
    skills: ["React.js", "TypeScript", "Tailwind CSS", "Ant Design"],
  },
  {
    role: "Frontend Web Engineer",
    company: "Rakamin Academy",
    location: "Remote, Freelance",
    period: "Mar 2022 — Apr 2022",
    descriptionCount: 5,
    skills: ["React.js", "React Query", "Styled Components"],
  },
  {
    role: "Frontend Web Engineer",
    company: "Smarteschool",
    location: "Remote, Freelance",
    period: "Jul 2021 — Feb 2022",
    descriptionCount: 6,
    skills: ["Next.js", "Bootstrap", "React"],
  },
  {
    role: "Frontend Web Engineer (Intern)",
    company: "Happy5",
    location: "Remote, Intern",
    period: "May 2020 — Mar 2021",
    descriptionCount: 4,
    skills: ["React", "Cypress", "@react-pdf/renderer"],
    website: "https://www.happy5.co/",
  },
];

// Indexed by EXPERIENCES position so the two Happy5 entries get different colors.
export const EXPERIENCE_STYLES: ExperienceStyle[] = [
  { color: "var(--primary)",         lightBg: "color-mix(in oklch, var(--primary) 8%, transparent)",   initials: "MT" },
  { color: "var(--secondary)",       lightBg: "color-mix(in oklch, var(--secondary) 8%, transparent)", initials: "H5" },
  { color: "var(--accent)",          lightBg: "color-mix(in oklch, var(--accent) 10%, transparent)",   initials: "KG", isLightInitials: true },
  { color: "oklch(0.45 0.14 190)",   lightBg: "color-mix(in oklch, oklch(0.45 0.14 190) 8%, transparent)", initials: "RA" },
  { color: "oklch(0.5 0.18 290)",    lightBg: "color-mix(in oklch, oklch(0.5 0.18 290) 8%, transparent)",  initials: "SS" },
  { color: "oklch(0.75 0.18 29)",    lightBg: "color-mix(in oklch, oklch(0.75 0.18 29) 8%, transparent)",  initials: "H5", isLightInitials: true },
];
