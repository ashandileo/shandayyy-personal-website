import type { Metadata } from "next";
import { AllProjects } from "./_components/all-projects";

export const metadata: Metadata = {
  title: "All Projects",
  description:
    "A complete list of projects by Ashandi Leonadi — frontend, fullstack, and AI-powered apps built with React, Next.js, and TypeScript.",
  alternates: {
    canonical: "https://ashandileonadi.vercel.app/projects",
  },
};

export default function ProjectsPage() {
  return <AllProjects />;
}
