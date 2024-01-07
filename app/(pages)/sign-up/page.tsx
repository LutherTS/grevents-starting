import { PageLink } from "@/app/components/agnostic/links";
import { H1 } from "@/app/components/agnostic/tags";
import { SignUpForm } from "@/app/components/client/forms";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignUpPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <H1>Welcome to the Sign Up Page.</H1>
        <SignUpForm />
        <PageLink href={`/sign-in`} name={`To sign in`} />
      </div>
    </main>
  );
}
