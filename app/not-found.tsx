import { PageLink } from "./components/agnostic/links";
import { H1 } from "./components/agnostic/tags";

export default function PageNotFound() {
  return (
    <>
      {/* <main className="flex min-h-screen w-full items-center justify-center p-8"> */}
      {/* <div className="max-w-prose text-center"> */}
      <H1>Oops.</H1>
      <p className="mt-2">
        This page doesn&apos;t exist. Or perhaps it doesn&apos;t exist yet.
      </p>
      <PageLink href={`/`} name={`Return home`} />
      {/* </div> */}
      {/* </main> */}
    </>
  );
}
