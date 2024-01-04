import { PageLink } from "@/app/components/agnostic/links";
import { BackButtonForm } from "@/app/components/client/forms";

export default function UserNotFound() {
  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center p-8">
        <div className="max-w-prose text-center">
          <p className="mt-2">Could not find requested user.</p>
          <PageLink href={`/`} name={`Return home`} />
          <BackButtonForm />
        </div>
      </main>
    </>
  );
}
