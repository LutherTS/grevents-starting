import { fetchUserByUsername } from "@/app/lib/data/users";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import {
  PageLink,
  PageLinkWithChildren,
} from "@/app/components/agnostic/links";
import {
  UserAppWideNameUpdated,
  UserFriendCodeUpdated,
  UserWelcomeBackToGrevents,
  UserWelcomeToGrevents,
} from "@/app/components/client/toasts";
import {
  countSentFriendToContactsByUser,
  countSentIrlToContactsByUser,
  countSentFriendFromContactsByUser,
  countSentIrlFromContactsByUser,
} from "@/app/lib/data/contacts";
/* import { User } from "@/app/lib/definitions/users"; */

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
    title: `${username}'s Dashboard`,
  };
}

export default async function DashboardPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  /* const session: { [K in "user"]: User } = {
    // “me”
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
  }; */

  const username = params.username;
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  /* Aborting. Numbers on dashboard are too stressful.
  BUT. I could replace this by colors. And I did. */
  const sentFriendToContactsCount = Number(
    await countSentFriendToContactsByUser(user),
  );
  const sentIrlToContactsCount = Number(
    await countSentIrlToContactsByUser(user),
  );
  const sentToContactsCount =
    sentFriendToContactsCount + sentIrlToContactsCount;

  const sentFriendFromContactsCount = Number(
    await countSentFriendFromContactsByUser(user),
  );
  const sentIrlFromContactsCount = Number(
    await countSentIrlFromContactsByUser(user),
  );
  const sentFromContactsCount =
    sentFriendFromContactsCount + sentIrlFromContactsCount;

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        {user.user_status_title === "WELCOMETOGREVENTS" && (
          <UserWelcomeToGrevents user={user} />
        )}
        {user.user_status_title === "WELCOMEBACKTOGREVENTS" && (
          <UserWelcomeBackToGrevents user={user} />
        )}
        {user.user_status_dashboard === "APPWIDENAMEUPDATED" && (
          <UserAppWideNameUpdated user={user} />
        )}
        {user.user_status_dashboard === "FRIENDCODEUPDATED" && (
          <UserFriendCodeUpdated user={user} />
        )}
        <H1>Welcome to {user.user_app_wide_name}&apos;s Dashboard.</H1>
        <PageLinkWithChildren
          href={`/users/${username}/dashboard/modify-app-wide-name`}
        >
          <p>App-wide name *</p>
        </PageLinkWithChildren>
        <p className="mt-2">{user.user_app_wide_name}</p>
        <PageLink
          href={`/users/${username}/personal-info`}
          name={`More personal info`}
        />
        <PageLink href={`/users/${username}/friends`} name={`My friends`} />
        {/* <PageLink href={`/users/${username}/requests`} name={`My requests`} />
        <PageLink
          href={`/users/${username}/notifications`}
          name={`My notifications`}
        /> */}
        {/* <PageLinkWithChildren href={`/users/${username}/requests`}>
          <p>
            My requests
            {sentToContactsCount > 0 && <> ({sentToContactsCount})</>}
          </p>
        </PageLinkWithChildren>
        <PageLinkWithChildren href={`/users/${username}/notifications`}>
          <p>
            My notifications
            {sentFromContactsCount > 0 && <> ({sentFromContactsCount})</>}
          </p>
        </PageLinkWithChildren> */}
        <PageLinkWithChildren
          href={`/users/${username}/requests`}
          specifiedClassName={
            sentToContactsCount > 0
              ? "mt-2 inline-block text-teal-500 underline hover:text-teal-400 dark:hover:text-teal-600"
              : undefined
          }
        >
          <p>My requests</p>
        </PageLinkWithChildren>
        <PageLinkWithChildren
          href={`/users/${username}/notifications`}
          specifiedClassName={
            sentFromContactsCount > 0
              ? "mt-2 inline-block text-cyan-500 underline hover:text-cyan-400 dark:hover:text-cyan-600"
              : undefined
          }
        >
          <p>My notifications</p>
        </PageLinkWithChildren>
        <PageLink href={`/`} name={`Return home`} />
      </div>
    </main>
  );
}
