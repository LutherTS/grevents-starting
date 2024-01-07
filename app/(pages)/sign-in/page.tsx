import { PageLink } from "@/app/components/agnostic/links";
import { H1 } from "@/app/components/agnostic/tags";

export default async function SignInPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <H1>Welcome to the Sign-In Page.</H1>
        <PageLink href={`/sign-up`} name={`To sign up`} />
      </div>
    </main>
  );
}
