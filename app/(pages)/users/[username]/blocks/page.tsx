// import { fetchUserByUsername } from "@/app/lib/data/users";
// import {
//   ManyWhoIAmBlocking,
//   ManyWhoHaveMeBlocked,
// } from "@/app/components/server/contacts";
// import { notFound } from "next/navigation";
// import { Suspense } from "react";
import { PageLink } from "@/app/components/agnostic/links";

export default async function BlocksPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  // const user = await fetchUserByUsername(username);

  // if (!user) {
  //   notFound();
  // }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <h1>Welcome to {username}&apos;s Blocks.</h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <p className="pt-2">Blocked users</p>
        <p className="pt-2">Users that have me blocked</p>
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Blocks.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <Suspense
          fallback={
            <>
              <p className="pt-2">Loading...</p>
            </>
          }
        >
          <ManyWhoIAmBlocking user={user} />
          <ManyWhoHaveMeBlocked user={user} />
        </Suspense>
        <PageLink href={`/users/${username}/friends`} name={`See friends`} />
        <p className="pt-2">
          If you&apos;ve blocked each other, the other user may appear in both
          Blocked users and Users that have me blocked.
        </p> */}
      </div>
    </main>
  );
}
