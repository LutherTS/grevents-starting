import { PageLink } from "@/app/components/agnostic/links";
import { H1 } from "@/app/components/agnostic/tags";
import { SignInForm } from "@/app/components/client/forms";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignInPage() {
  return (
    <>
      <H1>Welcome to the Sign In Page.</H1>
      <SignInForm />
      <PageLink href={`/sign-up`} name={`To sign up`} />
      <PageLink href={`/`} name={`Return home`} />
    </>
  );
}
