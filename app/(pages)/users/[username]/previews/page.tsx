// import { fetchUserByUsername } from "@/app/lib/data/users";
// import { notFound } from "next/navigation";
import { PageLink } from "@/app/components/agnostic/links";

export default async function PreviewsPage({
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
        <h1>Welcome to {username}&apos;s Previews.</h1>
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Previews.
        </h1> */}
        <PageLink
          href={`/users/${username}/previews/none`}
          name={`To "none" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/friend`}
          name={`To "friend" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/irl`}
          name={`To "irl" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/i-am-blocking`}
          name={`To "i-am-blocking" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/has-me-blocked`}
          name={`To "has-me-blocked" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/blocking-blocked`}
          name={`To "blocking-blocked" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/queried`}
          name={`To queried previews`}
        />
        <PageLink
          href={`/users/${username}/friends/find`}
          name={`Search for contacts`}
        />
      </div>
    </main>
  );
}
