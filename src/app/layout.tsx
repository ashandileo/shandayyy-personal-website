import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://ashandileonadi.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ashandi Leonadi | Frontend Developer",
    template: "%s | Ashandi Leonadi",
  },
  description:
    "Personal portfolio of Ashandi Leonadi — Frontend Developer specializing in React, Next.js, and TypeScript. Building modern, performant web experiences.",
  keywords: [
    "Ashandi Leonadi",
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Web Developer",
    "Portfolio",
    "Indonesia",
  ],
  authors: [{ name: "Ashandi Leonadi", url: SITE_URL }],
  creator: "Ashandi Leonadi",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "id_ID",
    url: SITE_URL,
    siteName: "Ashandi Leonadi",
    title: "Ashandi Leonadi | Frontend Developer",
    description:
      "Frontend Developer specializing in React, Next.js, and TypeScript. Building modern, performant web experiences.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashandi Leonadi | Frontend Developer",
    description:
      "Frontend Developer specializing in React, Next.js, and TypeScript. Building modern, performant web experiences.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ashandi Leonadi",
  url: SITE_URL,
  jobTitle: "Frontend Developer",
  email: "ashandileonadi@gmail.com",
  sameAs: [
    "https://www.github.com/ashandileo",
    "https://www.linkedin.com/in/ashandi-leonadi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col scroll-smooth">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
