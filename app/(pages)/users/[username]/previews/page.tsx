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
    title: `${username}'s Previews`,
  };
}

export default async function PreviewsPage({
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
          Welcome to {user.user_app_wide_name}&apos;s Previews.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <PageLink
          href={`/users/${username}/previews/none`}
          name={`To "none" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/friend`}
          name={`To "friend" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/irl`}
          name={`To "irl" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/i-am-blocking`}
          name={`To "i-am-blocking" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/has-me-blocked`}
          name={`To "has-me-blocked" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/blocking-blocked`}
          name={`To "blocking-blocked" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/queried`}
          name={`To queried previews`}
        />
        <PageLink
          href={`/users/${username}/friends/find`}
          name={`Search for contacts`}
        />
      </div>
    </main>
  );
}
