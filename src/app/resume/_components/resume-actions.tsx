import { Eye, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResumeActions() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <FileText className="mt-0.5 size-5 text-primary" />
        <div>
          <h2 className="text-lg font-semibold">Professional Resume</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            View or download my latest resume in PDF format.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Button
          nativeButton={false}
          className="rounded-full px-5"
          render={
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
            />
          }
        >
          <Eye className="size-4" />
          View Online
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          className="rounded-full px-5"
          render={<a href="/resume.pdf" download />}
        >
          <Download className="size-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
