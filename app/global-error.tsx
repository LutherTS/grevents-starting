"use client";

import { PageLink } from "@/app/components/agnostic/links";
import { BackButtonForm } from "@/app/components/client/forms";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error);
  console.log(reset);

  return (
    <html>
      <body>
        <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
          <div className="max-w-prose text-center">
            <h1>Something definitely went wrong.</h1>
            <p className="mt-2">
              You should never see this page. In fact, I didn&apos;t bother to
              see it myself. If you do see it, and if I do see it... then
              everything failed.
            </p>
            <PageLink href={`/`} name={`Return home`} />
            <BackButtonForm />
          </div>
        </main>
      </body>
    </html>
  );
}
