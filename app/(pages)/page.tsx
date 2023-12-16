import { H1 } from "../components/agnostic/tags";
import { PageLink } from "../components/agnostic/links";

export default async function HomePage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <H1>Welcome to Grevents.</H1>
        <p className="mt-2">Start the demonstration at the link below.</p>
        <PageLink
          href={`/users/LePapier/dashboard`}
          name={`Go to my dashboard`}
        />
      </div>
    </main>
  );
}
