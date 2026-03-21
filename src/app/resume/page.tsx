import type { Metadata } from "next";
import { ResumeLayout, ResumeHeader, ResumeActions, ResumePreview } from "./_components";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "View or download the resume of Ashandi Leonadi — Frontend Developer specializing in React, Next.js, and TypeScript.",
  alternates: {
    canonical: "https://ashandileonadi.vercel.app/resume",
  },
};

export default function ResumePage() {
  return (
    <div className="min-h-dvh bg-background">
      <ResumeLayout>
        <ResumeHeader />
        <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
          <ResumeActions />
          <ResumePreview />
        </main>
      </ResumeLayout>
    </div>
  );
}
