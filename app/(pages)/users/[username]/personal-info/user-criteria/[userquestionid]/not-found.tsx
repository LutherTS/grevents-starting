import { PageLink } from "@/app/components/agnostic/links";
import { BackButton } from "@/app/components/client/buttons";

export default function UserQuestionNotFound() {
  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center p-8">
        <div className="max-w-prose text-center">
          <p className="mt-2">
            Could not find requested user, user question or answer.
          </p>
          <PageLink href={`/`} name={`Return home`} />
          <BackButton />
        </div>
      </main>
    </>
  );
}
