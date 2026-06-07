"use client";

import { useState, useEffect, useCallback } from "react";

function calcProgress() {
  if (typeof window === "undefined") return 0;
  const el = document.documentElement;
  const scrolled = el.scrollTop || document.body.scrollTop;
  const total = el.scrollHeight - el.clientHeight;
  return total > 0 ? Math.min(100, Math.round((scrolled / total) * 100)) : 0;
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  const onScroll = useCallback(() => {
    setProgress(calcProgress());
  }, []);

  useEffect(() => {
    setProgress(calcProgress());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  const visible = progress > 2 && progress < 99;

  return (
    <>
      {/* Top progress bar — sits just below the fixed navbar (64px) */}
      <div
        aria-hidden
        className="fixed left-0 z-40 h-[3px] bg-primary transition-none"
        style={{
          top: "64px",
          width: `${progress}%`,
        }}
      />

      {/* Floating percentage badge */}
      <div
        aria-label={`${progress}% letto`}
        className={`fixed bottom-20 right-6 z-40 flex items-center gap-2 border-[1.5px] border-border bg-card px-2.5 py-1.5 shadow-sm transition-all duration-300 ${
          visible
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0"
        }`}
      >
        {/* Mini bar inside badge */}
        <div className="relative h-[3px] w-10 bg-muted overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-primary transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-mono text-[10px] font-bold tabular-nums text-muted-foreground">
          {String(progress).padStart(2, "0")}
          <span className="text-primary">%</span>
        </span>
      </div>
    </>
  );
}
