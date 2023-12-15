import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  ManyWhoIAmBlocking,
  ManyWhoHaveMeBlocked,
} from "@/app/components/server/contacts";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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
    title: `${username}'s Blocks`,
  };
}

export default async function BlocksPage({
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
        {/* <h1>Welcome to {username}&apos;s Blocks.</h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <p className="mt-2">Blocked users</p>
        <p className="mt-2">Users that have me blocked</p>
        <p className="mt-2">
          If you&apos;ve blocked each other, the other user may appear in both
          Blocked users and Users that have me blocked.
        </p> */}
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Blocks.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <Suspense
          fallback={
            <>
              <p className="mt-2">Loading...</p>
            </>
          }
        >
          <ManyWhoIAmBlocking user={user} />
          <ManyWhoHaveMeBlocked user={user} />
        </Suspense>
        <p className="mt-2">
          If you&apos;ve blocked each other, the other user may appear in both
          Blocked users and Users that have me blocked.
        </p>
        <PageLink href={`/users/${username}/friends`} name={`See friends`} />
      </div>
    </main>
  );
}
