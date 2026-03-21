export interface Experience {
  role: string;
  company: string;
  location: string;
  period: string;
  descriptionCount: number;
  skills: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    role: "Product Software Engineer (Fullstack)",
    company: "MapTrack",
    location: "Remote, Full-time",
    period: "Jan 2025 — Present",
    descriptionCount: 3,
    skills: ["Next.js", "TypeScript", "Supabase", "OpenAI", "TanStack DB", "Amazon DynamoDB"],
  },
  {
    role: "Frontend Web/Mobile Engineer",
    company: "Happy5",
    location: "Remote, Full-time",
    period: "Mar 2021 — Dec 2025",
    descriptionCount: 9,
    skills: ["React", "React Native", "TypeScript", "Tailwind CSS", "Cypress", "Storybook", "Amplitude"],
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
  },
];
