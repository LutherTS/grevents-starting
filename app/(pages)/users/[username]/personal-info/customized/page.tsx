import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  UserPseudonativeNotIrlAnswers,
  UserPseudonativeIrlAnswers,
  UserCustomAnswers,
} from "@/app/ui/components/answers";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function CustomizedPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen px-8 py-32 w-full flex justify-center items-center">
      <div className="text-center max-w-prose">
        <h1>Welcome to {username}&apos;s Customized Info.</h1>
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Customized Info.
        </h1>
        <UserPseudonativeNotIrlAnswers user={user} />
        <UserPseudonativeIrlAnswers user={user} />
        <UserCustomAnswers user={user} /> */}
        <div>
          <Link
            href={`/users/${username}/personal-info/standardized`}
            className="underline inline-block pt-2"
          >
            To Standardized criteria
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
