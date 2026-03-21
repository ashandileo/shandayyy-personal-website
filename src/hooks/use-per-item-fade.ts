"use client";

import { useEffect, useRef } from "react";

/**
 * Observes each `.stagger-item` child individually.
 * Each item fades in only when it enters the viewport.
 */
export function usePerItemFade() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>(".stagger-item");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return ref;
}
