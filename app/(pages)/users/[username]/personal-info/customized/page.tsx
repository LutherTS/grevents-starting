// import { fetchUserByUsername } from "@/app/lib/data/users";
// import {
//   UserPseudonativeNotIrlAnswers,
//   UserPseudonativeIrlAnswers,
//   UserCustomAnswers,
// } from "@/app/ui/components/answers";
// import { notFound } from "next/navigation";
import { PageLink } from "@/app/ui/components/links";

export default async function CustomizedPage({
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
        <h1>Welcome to {username}&apos;s Customized Info.</h1>
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Customized Info.
        </h1>
        <UserPseudonativeNotIrlAnswers user={user} />
        <UserPseudonativeIrlAnswers user={user} />
        <UserCustomAnswers user={user} /> */}
        <PageLink
          href={`/users/${username}/personal-info/standardized`}
          name={"To Standardized criteria"}
        />
        <PageLink
          href={`/users/${username}/personal-info`}
          name={"To Personal Info"}
        />
      </div>
    </main>
  );
}
