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
    <div className="relative min-h-dvh overflow-hidden bg-background">
      {/* Decorative shapes */}
      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ top: 120, left: 60, width: 90, height: 90, opacity: 0.45 }}
        viewBox="0 0 90 90"
      >
        <g
          stroke="oklch(0.5687 0.1498 151.9380)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        >
          <line x1="45" y1="6" x2="45" y2="84" />
          <line x1="6" y1="45" x2="84" y2="45" />
          <line x1="18" y1="18" x2="72" y2="72" />
          <line x1="72" y1="18" x2="18" y2="72" />
        </g>
      </svg>

      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ top: 140, right: 80, width: 100, height: 60, opacity: 0.5 }}
        viewBox="0 0 100 60"
      >
        <path
          d="M6 30 C26 8,52 52,72 30 C84 16,90 40,94 30"
          fill="none"
          stroke="oklch(0.6088 0.2498 29.2339)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <polyline
          points="86,18 96,30 86,42"
          fill="none"
          stroke="oklch(0.6088 0.2498 29.2339)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ bottom: 200, left: 60, width: 60, height: 60, opacity: 0.4 }}
        viewBox="0 0 60 60"
      >
        <rect
          x="6"
          y="6"
          width="48"
          height="48"
          fill="none"
          stroke="oklch(0.7721 0.1727 64.1585)"
          strokeWidth="3.5"
          transform="rotate(20 30 30)"
        />
      </svg>

      <svg
        aria-hidden
        className="pointer-events-none absolute"
        style={{ bottom: 240, right: 60, width: 60, height: 60, opacity: 0.3 }}
        viewBox="0 0 60 60"
      >
        <g fill="oklch(0.1759 0.0275 161.2531)">
          <circle cx="8" cy="8" r="3" />
          <circle cx="30" cy="8" r="3" />
          <circle cx="52" cy="8" r="3" />
          <circle cx="8" cy="30" r="3" />
          <circle cx="30" cy="30" r="3" />
          <circle cx="52" cy="30" r="3" />
          <circle cx="8" cy="52" r="3" />
          <circle cx="30" cy="52" r="3" />
          <circle cx="52" cy="52" r="3" />
        </g>
      </svg>

      <ResumeLayout>
        <ResumeHeader />
        <main className="relative z-[2] mx-auto max-w-3xl space-y-5 px-6 py-10">
          <ResumeActions />
          <ResumePreview />
        </main>
      </ResumeLayout>
    </div>
  );
}
