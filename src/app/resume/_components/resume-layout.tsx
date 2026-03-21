"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { Navbar } from "@/app/_components";

export function ResumeLayout({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
    }
  }, [i18n]);

  return (
    <>
      <Navbar activeSection="" />
      {children}
    </>
  );
}
