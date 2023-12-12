// import { fetchUserByUsername } from "@/app/lib/data/users";
// import { notFound } from "next/navigation";
import { PageLink } from "@/app/components/agnostic/links";

export default async function BlockingPreviewPage({
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
        <h1>Welcome to {username}&apos;s I Am Blocking Preview.</h1>
        <p className="pt-2 font-semibold text-red-500">
          YOU CAN NO LONGER ACCESS ANY OF THE INFORMATION OF{" "}
          {username.toUpperCase()} ACROSS THE ENTIRE APPLICATION, FUTURE COMMON
          GROUPS AND FUTURE COMMON EVENTS INCLUDED.
        </p>
        <p className="pt-2">Block them back</p>
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s I Am Blocking Preview.
        </h1>
        <p className="pt-2 font-semibold text-red-500">
          YOU CAN NO LONGER ACCESS ANY OF THE INFORMATION OF{" "}
          {username.toUpperCase()} ACROSS THE ENTIRE APPLICATION, FUTURE COMMON
          GROUPS AND FUTURE COMMON EVENTS INCLUDED.
        </p>
        <p className="pt-2">Block them back</p> */}
        <PageLink href={`/users/${username}/previews`} name={"To Previews"} />
      </div>
    </main>
  );
}