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
    role: "Senior Frontend Developer",
    company: "Tech Startup Inc.",
    location: "Jakarta, Indonesia",
    period: "Jan 2023 — Present",
    descriptionCount: 3,
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "React Query", "Figma"],
  },
  {
    role: "Frontend Developer",
    company: "Digital Agency Co.",
    location: "Jakarta, Indonesia",
    period: "Jun 2021 — Dec 2022",
    descriptionCount: 3,
    skills: ["React", "JavaScript", "SCSS", "Redux", "GraphQL", "Storybook"],
  },
  {
    role: "Junior Frontend Developer",
    company: "Software House Ltd.",
    location: "Bandung, Indonesia",
    period: "Aug 2019 — May 2021",
    descriptionCount: 3,
    skills: ["React", "Vue.js", "CSS", "Jest", "Git", "Jira"],
  },
];
