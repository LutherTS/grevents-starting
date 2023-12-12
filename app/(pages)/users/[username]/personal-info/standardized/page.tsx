import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  ManyUserNativeNotIrlCriteria,
  ManyUserNativeIrlCriteria,
} from "@/app/components/server/answers";
import { notFound } from "next/navigation";
import { PageLink } from "@/app/components/agnostic/links";

export default async function StardardizedPage({
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
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        {/* <h1>Welcome to {username}&apos;s Standardized Info.</h1> */}
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Standardized Info.
        </h1>
        <ManyUserNativeNotIrlCriteria user={user} />
        <ManyUserNativeIrlCriteria user={user} />
        <PageLink
          href={`/users/${username}/personal-info/standardized/modify-criteria`}
          name={"Modify"}
        />
        <PageLink
          href={`/users/${username}/personal-info/standardized/add-criteria`}
          name={"Add standardized criteria"}
        />
        <PageLink
          href={`/users/${username}/personal-info`}
          name={"To Personal Info"}
        />
        <PageLink
          href={`/users/${username}/personal-info/customized`}
          name={"To Customized criteria"}
        />
      </div>
    </main>
  );
}
