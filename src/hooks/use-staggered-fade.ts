"use client";

import { useEffect, useRef } from "react";

/**
 * Observes a container and adds `is-visible` class to each child
 * `.stagger-item` with an incremental delay when the container
 * scrolls into view.
 */
export function useStaggeredFade(delayMs = 100) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const items =
            container.querySelectorAll<HTMLElement>(".stagger-item");
          items.forEach((item, i) => {
            item.style.animationDelay = `${i * delayMs}ms`;
            item.classList.add("is-visible");
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [delayMs]);

  return ref;
}
