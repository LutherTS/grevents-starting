import {
  fetchUserByUsername,
  findUserByFriendCode,
} from "@/app/lib/data/users";
import { notFound } from "next/navigation";
import { PageLink } from "@/app/components/agnostic/links";

export default async function FindFriendsPage({
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
  const friendCodeUser = await findUserByFriendCode(friendCode);

  if (!user) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <h1>Welcome to {username}&apos;s Find Friends.</h1>
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Find Friends.
        </h1> */}
        {friendCode !== "" && (
          <>
            {friendCodeUser ? (
              <p className="pt-2">friendcode: {friendCode}</p>
            ) : (
              <p className="pt-2">No user found with this friend code.</p>
            )}
          </>
        )}
        {friendCodeUser && (
          <>
            <p className="pt-2">Here&apos;s the user you&apos;re looking for</p>
            <p className="pt-2">
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
