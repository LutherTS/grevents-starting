import { fetchUserByUsername } from "@/app/lib/data/users";
import { notFound } from "next/navigation";
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
    title: `${username}'s Modify App-Wide Name`,
  };
}

export default async function ModifyAppWideNamePage({
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
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Modify App-Wide Name.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <p className="mt-2">App-wide name *</p>
        <p className="mt-2">{user.user_app_wide_name}</p>
        <p className="mt-2">Generate a new friend code</p>
        <p className="mt-2">You’ll see it change on your Personal info page.</p>
        <PageLink href={`/users/${username}/dashboard`} name={`Cancel`} />
      </div>
    </main>
  );
}
