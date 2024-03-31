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
  return (
    <>
      <h1>Something went wrong. Probably.</h1>
      <p className="mt-2">
        Database calls can be messy sometimes, so it doesn&apos;t hurt to try
        again at least once. (If that fails, go for a hard refresh.)
      </p>
      <PageLink href={`/`} name={`Return home`} />
      <BackButtonForm />
    </>
  );
}
