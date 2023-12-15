import {
  fetchUserByUsername,
  findOtherUserByFriendCodeAgainstUser,
} from "@/app/lib/data/users";
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
  const username = params.username;
  const friendCode = searchParams?.friendcode || "";
  const user = await fetchUserByUsername(username);
  const friendCodeUser = await findOtherUserByFriendCodeAgainstUser(
    friendCode,
    user,
  );

  if (!user) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Find Contacts.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <p className="mt-2">
          Find a user by their friend code. (Temporarily friendcode in
          searchParams.)
        </p>
        {friendCode !== "" && (
          <>
            {friendCodeUser ? (
              <p className="mt-2">friendcode: {friendCode}</p>
            ) : (
              <p className="mt-2">No other user found with this friend code.</p>
            )}
          </>
        )}
        {friendCodeUser && (
          <>
            <p className="mt-2">Here&apos;s the user you&apos;re looking for</p>
            <p className="mt-2">
              {friendCodeUser.user_app_wide_name} /{" "}
              {friendCodeUser.user_username} / {friendCodeUser.user_friend_code}
            </p>
          </>
        )}
        <PageLink href={`/users/${username}/friends`} name={`See friends`} />
        <PageLink href={`/users/${username}/previews`} name={`See previews`} />
      </div>
    </main>
  );
}
