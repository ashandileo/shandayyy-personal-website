export function ResumePreview() {
  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Resume Preview</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Preview of my resume. Click the buttons above to view in full screen or
        download.
      </p>

      <div className="mt-5 overflow-hidden rounded-xl border bg-muted">
        <iframe
          src="/Ashandi_Leonadi_CV_2026.pdf"
          title="Resume - Ashandi Leonadi"
          className="h-[70vh] w-full sm:h-[80vh]"
        />
      </div>

      <p className="mt-4 text-center text-xs text-muted-foreground">
        If the preview doesn&apos;t load, please use the buttons above to view
        or download the resume.
      </p>
    </div>
  );
}
