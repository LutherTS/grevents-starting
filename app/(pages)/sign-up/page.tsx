import { PageLink } from "@/app/components/agnostic/links";
import { H1 } from "@/app/components/agnostic/tags";
import { SignUpForm } from "@/app/components/client/forms";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignUpPage() {
  return (
    <>
      <H1>Welcome to the Sign Up Page.</H1>
      <SignUpForm />
      <PageLink href={`/sign-in`} name={`To sign in`} />
      <PageLink href={`/`} name={`Return home`} />
    </>
  );
}
