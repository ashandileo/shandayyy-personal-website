export interface Project {
  title: string;
  index: number;
  images: string[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  gradient: string;
}

export const PROJECTS: Project[] = [
  {
    title: "E-Commerce Platform",
    index: 0,
    images: ["/projects/ecommerce-1.svg", "/projects/ecommerce-2.svg"],
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Stripe", "Prisma"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
    gradient: "from-indigo-500/20 via-purple-500/10 to-transparent",
  },
  {
    title: "Task Management App",
    index: 1,
    images: ["/projects/taskapp-1.svg", "/projects/taskapp-2.svg"],
    techStack: ["React", "Node.js", "Socket.io", "PostgreSQL", "Docker"],
    liveUrl: "https://example.com",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
  {
    title: "Portfolio Generator",
    index: 2,
    images: ["/projects/portfolio-1.svg", "/projects/portfolio-2.svg"],
    techStack: ["TypeScript", "Node.js", "EJS", "Tailwind CSS"],
    repoUrl: "https://github.com",
    gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
  },
  {
    title: "Weather Dashboard",
    index: 3,
    images: ["/projects/weather-1.svg", "/projects/weather-2.svg"],
    techStack: ["React", "Chart.js", "OpenWeatherMap API", "Geolocation API"],
    liveUrl: "https://example.com",
    repoUrl: "https://github.com",
    gradient: "from-sky-500/20 via-blue-500/10 to-transparent",
  },
];
