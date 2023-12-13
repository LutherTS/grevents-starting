// import { fetchUserByUsername } from "@/app/lib/data/users";
// import {
//   ManyUserPseudonativeNotIrlCriteria,
//   ManyUserPseudonativeIrlCriteria,
//   ManyUserCustomCriteria,
// } from "@/app/components/server/answers";
// import { notFound } from "next/navigation";
// import { Suspense } from "react";
import { PageLink } from "@/app/components/agnostic/links";

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
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Customized Info.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <Suspense
          fallback={
            <>
              <p className="pt-2">Loading...</p>
            </>
          }
        >
          <ManyUserPseudonativeNotIrlCriteria user={user} />
          <ManyUserPseudonativeIrlCriteria user={user} />
          <ManyUserCustomCriteria user={user} />
        </Suspense> */}
        <PageLink
          href={`/users/${username}/personal-info/customized/modify-criteria`}
          name={"Modify"}
        />
        <PageLink
          href={`/users/${username}/personal-info/customized/add-criteria`}
          name={"Add customized criteria"}
        />
        <PageLink
          href={`/users/${username}/personal-info`}
          name={"To Personal Info"}
        />
        <PageLink
          href={`/users/${username}/personal-info/standardized`}
          name={"To Standardized criteria"}
        />
      </div>
    </main>
  );
}
