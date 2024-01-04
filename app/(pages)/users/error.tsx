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
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <h1>Something went wrong. Probably.</h1>
        <p className="mt-2">
          Database calls can be messy sometimes, so it doesn&apos;t hurt to try
          again at least once. (If that fails, go for a hard refresh.)
        </p>
        <PageLink href={`/`} name={`Return home`} />
        <BackButtonForm />
      </div>
    </main>
  );
}
