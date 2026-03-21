"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { useActiveSection } from "@/hooks";
import { SECTION_IDS } from "@/data/navigation";
import {
  Navbar,
  HeroSection,
  ExperienceSection,
  ProjectsSection,
  ContactSection,
  Footer,
  ScrollToTop,
} from "@/app/_components";

export default function Home() {
  const activeSection = useActiveSection(SECTION_IDS);
  const { i18n } = useTranslation();

  // Restore saved language preference after hydration to avoid SSR mismatch
  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  return (
    <>
      <Navbar activeSection={activeSection} />
      <main className="flex-1">
        <HeroSection />
        <ExperienceSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
