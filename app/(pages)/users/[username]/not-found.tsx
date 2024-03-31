import { PageLink } from "@/app/components/agnostic/links";
import { BackButtonForm } from "@/app/components/client/forms";

export default function UserNotFound() {
  return (
    <>
      <p className="mt-2">Could not find requested user.</p>
      <PageLink href={`/`} name={`Return home`} />
      <BackButtonForm />
    </>
  );
}
