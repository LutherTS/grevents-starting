import { PageLink } from "@/app/components/agnostic/links";
import { BackButtonForm } from "@/app/components/client/forms";

export default function UserQuestionNotFound() {
  return (
    <>
      <p className="mt-2">
        Could not find requested user, user question or answer.
      </p>
      <PageLink href={`/`} name={`Return home`} />
      <BackButtonForm />
    </>
  );
}
