"use client";

import { PageLink } from "@/app/components/agnostic/links";
import { BackButtonForm } from "@/app/components/client/forms";
import { Main, Wrapper } from "./components/agnostic/wrappers";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <Main>
          <Wrapper>
            <h1>Something definitely went wrong.</h1>
            <p className="mt-2">
              You should never see this page. In fact, I didn&apos;t bother to
              see it myself. If you do see it, and if I do see it... then
              everything failed.
            </p>
            <PageLink href={`/`} name={`Return home`} />
            <BackButtonForm />
          </Wrapper>
        </Main>
      </body>
    </html>
  );
}
