import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  ManyUserPseudonativeNotIrlCriteria,
  ManyUserPseudonativeIrlCriteria,
} from "@/app/components/server/answers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLink } from "@/app/components/agnostic/links";

export default async function ModifyCriteriaCustomizedPage({
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
        {/* <h1>Welcome to {username}&apos;s Modify Criteria Customized.</h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <p className="pt-2">
          (Custom criteria have their own dynamic modify page directly available
          from the parent Customized criteria page.)
        </p> */}
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Modify Criteria
          Customized.
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
        </Suspense>
        <p className="pt-2">
          (Custom criteria have their own dynamic modify page directly available
          from the parent Customized criteria page.)
        </p>
        <PageLink
          href={`/users/${username}/personal-info/customized`}
          name={"Cancel"}
        />
      </div>
    </main>
  );
}
