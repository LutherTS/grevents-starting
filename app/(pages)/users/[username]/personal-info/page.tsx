// import { fetchUserByUsername } from "@/app/lib/data/users";
// import { PinnedAnswers } from "@/app/ui/components/answers";
// import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PersonalInfoPage({
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
        <h1>Welcome to {username}&apos;s Personal Info.</h1>
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Personal Info.
        </h1>
        <PinnedAnswers user={user} /> */}
        <div>
          <Link
            href={`/users/${username}/personal-info/standardized`}
            className="inline-block pt-2 underline"
          >
            To all standardized criteria
          </Link>
        </div>
        <div>
          <Link
            href={`/users/${username}/personal-info/customized`}
            className="inline-block pt-2 underline"
          >
            To all customized criteria
          </Link>
        </div>
      </div>
    </main>
  );
}
