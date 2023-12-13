// import { fetchUserByUsername } from "@/app/lib/data/users";
// import { notFound } from "next/navigation";
import { PageLink } from "@/app/components/agnostic/links";

export default async function BlockedPreviewPage({
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
        <h1>Welcome to {username}&apos;s Has Me Blocked Preview.</h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <p className="pt-2 font-semibold">
          {username.toUpperCase()} CAN NO LONGER ACCESS ANY OF YOUR INFORMATION
          ACROSS THE ENTIRE APPLICATION, FUTURE COMMON GROUPS AND FUTURE COMMON
          EVENTS INCLUDED.
        </p>
        <p className="pt-2">Unblock</p>
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Has Me Blocked Preview.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <p className="pt-2 font-semibold">
          {username.toUpperCase()} CAN NO LONGER ACCESS ANY OF YOUR INFORMATION
          ACROSS THE ENTIRE APPLICATION, FUTURE COMMON GROUPS AND FUTURE COMMON
          EVENTS INCLUDED.
        </p>
        <p className="pt-2">Unblock</p> */}
        <PageLink href={`/users/${username}/previews`} name={"To Previews"} />
      </div>
    </main>
  );
}
