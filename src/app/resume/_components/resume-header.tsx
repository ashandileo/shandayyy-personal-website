export function ResumeHeader() {
  return (
    <div className="mx-auto max-w-3xl px-6 pt-24 text-center">
      <span className="mb-4 inline-flex items-center gap-2 border-2 border-secondary bg-card px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-secondary shadow-[2px_2px_0_var(--border)]">
        <svg
          aria-hidden
          width="11"
          height="13"
          viewBox="0 0 14 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 1H3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4z" />
          <polyline points="9 1 9 4 12 4" />
          <line x1="9" y1="8" x2="5" y2="8" />
          <line x1="9" y1="11" x2="5" y2="11" />
        </svg>
        Document
      </span>
      <h1 className="text-4xl font-black uppercase leading-[0.92] tracking-[-2px] sm:text-5xl">
        My{" "}
        <span className="underline decoration-primary decoration-[5px] underline-offset-[6px]">
          Resume
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-md font-mono text-[12px] leading-[1.65] text-muted-foreground">
        Download or view my professional resume to learn more about my
        experience and skills.
      </p>
    </div>
  );
}
