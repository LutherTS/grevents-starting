import { fetchUserByUsername } from "@/app/libraries/data/users";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import { User } from "@/app/libraries/definitions/users";
import { Suspense } from "react";

import type { Metadata } from "next";
import {
  ManySentFriendFromContacts,
  ManySentIrlFromContacts,
} from "@/app/components/server/database/contacts";

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username}'s Notifications`,
  };
}

export default async function NotificationsPage({
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
      <H1>Welcome to {user.user_app_wide_name}&apos;s Notifications.</H1>
      <BackToDashboardLink session={session} />
      <PageLink href={`/sign-in`} name={`sign out`} />
      <Suspense
        fallback={
          <>
            <p className="mt-2">Loading...</p>
          </>
        }
      >
        <ManySentFriendFromContacts user={user} />
        <ManySentIrlFromContacts user={user} />
      </Suspense>
      <PageLink href={`/users/${username}/requests`} name={`To requests`} />
    </>
  );
}
