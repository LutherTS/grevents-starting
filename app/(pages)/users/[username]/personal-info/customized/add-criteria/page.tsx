import { fetchUserByUsername } from "@/app/lib/data/users";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import { PageLink } from "@/app/components/agnostic/links";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username}'s Add Criteria Customized`,
  };
}

export default async function AddCriteriaCustomizedPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
        <div className="max-w-prose text-center">
          <H1>
            Welcome to {user.user_app_wide_name}&apos;s Add Criteria Customized.
          </H1>
          <PageLink
            href={`/users/${username}/dashboard`}
            name={`back to dashboard`}
          />
          <PageLink
            href={`/users/${username}/personal-info/customized`}
            name={"Cancel"}
          />
        </div>
      </main>
    </>
  );
}
