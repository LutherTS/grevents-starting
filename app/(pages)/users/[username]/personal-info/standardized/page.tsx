// import { fetchUserByUsername } from "@/app/lib/data/users";
// import {
//   UserNativeIrlAnswers,
//   UserNativeNotIrlAnswers,
// } from "@/app/ui/components/answers";
import Link from "next/link";
// import { notFound } from "next/navigation";

export default async function Stardardized({
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
    <main className="min-h-screen p-8 w-full flex justify-center items-center">
      <div className="text-center max-w-prose">
        <h1>Welcome to {username}&apos;s Standardized Info.</h1>
        {/* <h1>Welcome to {user.user_app_wide_name}&apos;s Standardized Info.</h1> */}
        {/* <UserNativeNotIrlAnswers user={user} /> */}
        {/* <UserNativeIrlAnswers user={user} /> */}
        <div>
          <Link
            href={`/users/${username}/personal-info/customized`}
            className="underline inline-block pt-2"
          >
            To Customized criteria
          </Link>
        </div>
        <div>
          <Link
            href={`/users/${username}/personal-info`}
            className="underline inline-block pt-2"
          >
            To Personal Info
          </Link>
        </div>
      </div>
    </main>
  );
}
