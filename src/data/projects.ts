export interface Project {
  title: string;
  index: number;
  images: string[];
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  gradient: string;
}

export function isVideo(src: string) {
  return /\.(mp4|webm|ogg)$/i.test(src);
}

export const PROJECTS: Project[] = [
  {
    title: "MapTrack",
    index: 0,
    images: [
      "/projects/maptrack/maptrack-1.png",
      "/projects/maptrack/maptrack-2.mp4",
      "/projects/maptrack/maptrack-3.avif",
      "/projects/maptrack/maptrack-4.mp4",
      "/projects/maptrack/maptack-5.mp4",
      "/projects/maptrack/maptrack-6.mp4",
      "/projects/maptrack/maptrack-7.mp4",
      "/projects/maptrack/maptrack-8.avif",
      "/projects/maptrack/maptrack-9.mp4",
      "/projects/maptrack/maptrack-10.mp4",
    ],
    techStack: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "Headless UI",
      "Supabase",
      "OpenAI",
      "React Hook Form",
      "TanStack Query",
      "TanStack DB",
      "Playwright",
    ],
    liveUrl: "https://maptrack.com",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
  },
  {
    title: "Happy5",
    index: 1,
    images: [
      "/projects/happy5/happy5-4.webp",
      "/projects/happy5/happy5-2.webp",
      "/projects/happy5/happy5-3.webp",
      "/projects/happy5/happy5-1.png",
    ],
    techStack: [
      "React.js",
      "TypeScript",
      "Tailwind CSS",
      "Tanstack Query",
      "Zustand",
      "Cypress",
    ],
    liveUrl: "https://www.happy5.co/",
    gradient: "from-blue-500/20 via-indigo-500/10 to-transparent",
  },
  {
    title: "Echo Test",
    index: 2,
    images: [
      "/projects/echo-test/echo-test-5.png",
      "/projects/echo-test/echo-test-4.png",
      "/projects/echo-test/echo-test-3.webp",
      "/projects/echo-test/echo-test-6.png",
      "/projects/echo-test/echo-test-10.png",
      "/projects/echo-test/echo-test-11.png",
      "/projects/echo-test/echo-test-12.png",
      "/projects/echo-test/echo-test-13.png",
      "/projects/echo-test/echo-test-14.png",
      "/projects/echo-test/echo-test-15.png",
      "/projects/echo-test/echo-test-16.png",
    ],
    techStack: [
      "React.js",
      "Next.js",
      "Supabase",
      "TanStack Query",
      "OpenAI",
      "Mistral AI",
      "Tailwind CSS",
      "Shadcn",
    ],
    liveUrl: "https://echotest.vercel.app/",
    gradient: "from-violet-500/20 via-purple-500/10 to-transparent",
  },
  {
    title: "GoMovies",
    index: 3,
    images: [
      "/projects/gomovies/gomovies-1.png",
      "/projects/gomovies/gomovies-2.png",
      "/projects/gomovies/gomovies-3.png",
      "/projects/gomovies/gomovies-4.png",
    ],
    techStack: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "React Query",
      "TMDb API",
      "Axios",
      "Zustand",
    ],
    liveUrl: "https://movie-app-lemon-sigma.vercel.app/",
    repoUrl: "https://github.com/ashandileo/MovieApp",
    gradient: "from-rose-500/20 via-red-500/10 to-transparent",
  },
  {
    title: "Journal",
    index: 4,
    images: [
      "/projects/journal/journal-5.png",
      "/projects/journal/journal-6.png",
      "/projects/journal/journal-4.png",
      "/projects/journal/journal-3.png",
      "/projects/journal/journal-2.png",
      "/projects/journal/journal-1.png",
      "/projects/journal/journal-6.mp4",
    ],
    techStack: [
      "React.js",
      "Ionic Capacitor",
      "Supabase",
      "TanStack Query",
      "TypeScript",
      "Tailwind CSS",
    ],
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    repoUrl: "https://github.com/ashandileo/my-journal-app",
  },
];
