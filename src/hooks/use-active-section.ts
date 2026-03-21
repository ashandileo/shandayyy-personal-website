"use client";

import { useState, useEffect, useCallback } from "react";

export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0]);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;

    // If at the very bottom, activate the last section
    if (scrollY + viewportHeight >= docHeight - 2) {
      setActive(sectionIds[sectionIds.length - 1]);
      return;
    }

    // Find the section whose top is closest to (but not far below) the viewport top
    const offset = viewportHeight * 0.3;
    let current = sectionIds[0];

    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;

      const top = el.getBoundingClientRect().top + scrollY;
      if (scrollY + offset >= top) {
        current = id;
      }
    }

    setActive(current);
  }, [sectionIds]);

  useEffect(() => {
    // Use requestAnimationFrame to defer the initial call outside the effect's synchronous phase
    const raf = requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return active;
}
