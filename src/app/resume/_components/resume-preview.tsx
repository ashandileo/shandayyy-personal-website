export function ResumePreview() {
  return (
    <div className="relative border-2 border-border bg-card shadow-[5px_5px_0_var(--border)]">
      <span className="pointer-events-none absolute right-4 top-3 z-[2] font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        02 / 02
      </span>

      {/* Header strip */}
      <div
        className="flex items-center justify-between gap-4 border-b-2 border-border px-5 py-4"
        style={{ background: "color-mix(in oklch, var(--accent) 10%, transparent)" }}
      >
        <div>
          <h2 className="text-[14px] font-black uppercase tracking-tight">
            Resume Preview
          </h2>
          <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
            Ashandi_Leonadi_CV_2026.pdf
          </p>
        </div>
        <span className="border-2 border-border bg-card px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.05em] text-accent shadow-[2px_2px_0_var(--border)]">
          PDF · 1 PAGE
        </span>
      </div>

      {/* iframe */}
      <div className="m-4 overflow-hidden border-2 border-border bg-muted">
        <iframe
          src="/Ashandi_Leonadi_CV_2026.pdf"
          title="Resume - Ashandi Leonadi"
          className="h-[70vh] w-full sm:h-[80vh]"
        />
      </div>

      {/* Footer strip */}
      <div className="border-t-2 border-border bg-muted px-5 py-3 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground">
        ↑ If preview doesn&apos;t load, use the buttons above to view or download
      </div>
    </div>
  );
}
