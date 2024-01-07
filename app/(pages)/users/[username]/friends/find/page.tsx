import {
  fetchUserByUsername,
  // findOtherUserByFriendCodeAgainstUser,
} from "@/app/libraries/data/users";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import { User } from "@/app/libraries/definitions/users";
import { FriendCodeInputForm } from "@/app/components/client/forms";

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
    title: `${username}'s Find Contacts`,
  };
}

export default async function FindContactsPage({
  params,
  searchParams,
}: {
  params: {
    username: string;
  };
  searchParams: {
    friendcode?: string;
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
  // const friendCode = searchParams?.friendcode || "";
  const user = await fetchUserByUsername(username);
  // const friendCodeUser = await findOtherUserByFriendCodeAgainstUser(
  //   friendCode,
  //   user,
  // );

  if (!user) {
    notFound();
  }

  // updated demo behavior
  session.user = user;
  // because this and all /users/[username] pages except /users/[username]/profile pages are to be all only accessible to their own user

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <H1>Welcome to {user.user_app_wide_name}&apos;s Find Contacts.</H1>
        <BackToDashboardLink session={session} />
        <p className="mt-2">
          Find a user by their friend code.
          {/* (Temporarily friendcode in searchParams.) */}
        </p>
        <FriendCodeInputForm user={user} />
        {/* {friendCode !== "" && (
          <>
            {friendCodeUser ? (
              <p className="mt-2 font-semibold">friendcode: {friendCode}</p>
            ) : (
              <p className="mt-2">No other user found with this friend code.</p>
            )}
          </>
        )}
        {friendCodeUser && (
          <>
            <p className="mt-2">Here&apos;s the user you&apos;re looking for</p>
            <p className="mt-2 font-semibold">
              {friendCodeUser.user_app_wide_name} /{" "}
              {friendCodeUser.user_username} / {friendCodeUser.user_friend_code}
            </p>
          </>
        )} */}
        <PageLink href={`/users/${username}/friends`} name={`See friends`} />
        <PageLink href={`/users/${username}/previews`} name={`See previews`} />
        <PageLink href={`/sign-in`} name={`sign out`} />
      </div>
    </main>
  );
}
