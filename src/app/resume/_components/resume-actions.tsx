import { Eye, Download, FileText } from "lucide-react";

export function ResumeActions() {
  return (
    <div className="relative border-2 border-border bg-card p-6 shadow-[5px_5px_0_var(--border)]">
      <span className="pointer-events-none absolute right-4 top-3 font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
        01 / 02
      </span>

      <div className="flex items-start gap-3.5">
        <span className="flex size-11 shrink-0 items-center justify-center border-2 border-border bg-primary text-white shadow-[2px_2px_0_var(--border)]">
          <FileText className="size-5" strokeWidth={2.5} />
        </span>
        <div>
          <h2 className="text-base font-black uppercase tracking-tight">
            Professional Resume
          </h2>
          <p className="mt-1 font-mono text-[11px] leading-[1.6] text-muted-foreground">
            View or download my latest resume in PDF format.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t-2 border-border pt-4">
        <a
          href="/Ashandi_Leonadi_CV_2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border-2 border-border bg-foreground px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-background shadow-[4px_4px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--border)]"
        >
          <Eye className="size-4" />
          View Online
        </a>
        <a
          href="/Ashandi_Leonadi_CV_2026.pdf"
          download
          className="inline-flex items-center gap-2 border-2 border-border bg-accent px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.08em] text-foreground shadow-[4px_4px_0_var(--border)] transition-transform hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0_var(--border)]"
        >
          <Download className="size-4" />
          Download PDF
        </a>
      </div>
    </div>
  );
}
