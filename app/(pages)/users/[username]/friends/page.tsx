// import { fetchUserByUsername } from "@/app/lib/data/users";
// import { notFound } from "next/navigation";
import { PageLink } from "@/app/components/agnostic/links";

export default async function FriendsPage({
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
        <h1>Welcome to {username}&apos;s Friends.</h1>
        <p className="pt-2">Friends (not upgraded to irl)</p>
        <p className="pt-2">Upgraded to irl</p>
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Friends.
        </h1> */}
        <PageLink
          href={`/users/${username}/blocks`}
          name={`See blocked users`}
        />
        <PageLink
          href={`/users/${username}/friends/find`}
          name={`Search for contacts`}
        />
      </div>
    </main>
  );
}