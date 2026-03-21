"use client";

import { useState, useEffect } from "react";

export function useDarkMode() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark =
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (prefersDark) {
      root.classList.add("dark");
    }
    // Use RAF to batch the state update after DOM mutation
    requestAnimationFrame(() => setDark(prefersDark));
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !dark;
    setDark(next);
    root.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return { dark, toggle };
}
