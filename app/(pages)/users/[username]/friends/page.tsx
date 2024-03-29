import { fetchUserByUsername } from "@/app/libraries/data/users";
import {
  ManyIrlFriends,
  ManyNotIrlFriends,
} from "@/app/components/server/database/contacts";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import { User } from "@/app/libraries/definitions/users";

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
    title: `${username}'s Friends`,
  };
}

export default async function FriendsPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const session: { [K in "user"]: User } = {
    // “me” // default demo behavior
    user: {
      user_id: "2640aaf6-20b5-497c-b980-fbee374830c2",
      user_state: "LIVE",
      user_status_title: "NONE",
      user_status_dashboard: "NONE",
      user_status_personal_info: "NONE",
      user_username: "LePapier",
      user_app_wide_name: "“me”",
      user_friend_code: "fsa7hyt3g58x",
      user_has_temporary_password: false,
      user_created_at: "2023-12-09T05:59:58.074Z",
      user_updated_at: "2023-12-09T05:59:58.074Z",
    },
  };

  const username = params.username;
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  // updated demo behavior
  session.user = user;
  // because this and all /users/[username] pages except /users/[username]/profile pages are to be all only accessible to their own user

  return (
    <>
      <H1>Welcome to {user.user_app_wide_name}&apos;s Friends.</H1>
      <BackToDashboardLink session={session} />
      <PageLink href={`/sign-in`} name={`sign out`} />
      <Suspense
        fallback={
          <>
            <p className="mt-2">Loading...</p>
          </>
        }
      >
        {/* <div className="mb-2 mt-2 grid grid-cols-2 gap-8"> */}
        {/* <div className="mt-2 flex h-full min-h-48 flex-col items-center justify-center rounded-lg bg-slate-50"> */}
        <ManyNotIrlFriends user={user} />
        {/* </div> */}
        {/* <div className="mt-2 flex h-full min-h-48 flex-col items-center justify-center rounded-lg bg-slate-50"> */}
        <ManyIrlFriends user={user} />
        {/* </div> */}
        {/* </div> */}
      </Suspense>
      <PageLink href={`/users/${username}/blocks`} name={`See blocked users`} />
      <PageLink
        href={`/users/${username}/friends/find`}
        name={`Search for contacts`}
      />
    </>
  );
}
