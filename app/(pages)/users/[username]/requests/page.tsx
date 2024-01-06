import { fetchUserByUsername } from "@/app/lib/data/users";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink } from "@/app/components/agnostic/links";
import { User } from "@/app/lib/definitions/users";
import {
  countSentFriendToContactsByUser,
  countSentIrlToContactsByUser,
  findSentFriendToContactsByUser,
  findSentIrlToContactsByUser,
} from "@/app/lib/data/contacts";

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
    title: `${username}'s Requests`,
  };
}

export default async function RequestsPage({
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

  // const sentFriendToContacts = await findSentFriendToContactsByUser(user);
  // // console.log(sentFriendToContacts);
  // const sentIrlToContacts = await findSentIrlToContactsByUser(user);
  // // console.log(sentIrlToContacts);

  const [
    sentFriendToContacts,
    sentIrlToContacts,
    sentFriendToContactsCount,
    sentIrlToContactsCount,
  ] = await Promise.all([
    findSentFriendToContactsByUser(user),
    findSentIrlToContactsByUser(user),
    countSentFriendToContactsByUser(user),
    countSentIrlToContactsByUser(user),
  ]);
  console.log(sentFriendToContacts);
  console.log(sentIrlToContacts);
  console.log(sentFriendToContactsCount);
  console.log(sentIrlToContactsCount);

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <H1>Welcome to {user.user_app_wide_name}&apos;s Requests.</H1>
        <BackToDashboardLink session={session} />
      </div>
    </main>
  );
}
