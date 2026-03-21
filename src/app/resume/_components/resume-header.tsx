import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ResumeHeader() {
  return (
    <>
      {/* Back link */}
      <div className="mx-auto max-w-3xl px-6 pt-8">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/" />}
          className="rounded-full text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </Button>
      </div>

      {/* Title */}
      <div className="mx-auto max-w-3xl px-6 pt-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Resume
        </h1>
        <p className="mt-3 text-muted-foreground">
          Download or view my professional resume to learn more about my
          experience and skills.
        </p>
      </div>
    </>
  );
}
