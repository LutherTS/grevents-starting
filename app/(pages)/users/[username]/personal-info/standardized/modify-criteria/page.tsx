import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  ManyUserNativeNotIrlCriteria,
  ManyUserNativeIrlCriteria,
} from "@/app/components/server/answers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLink } from "@/app/components/agnostic/links";

export default async function ModifyCriteriaStandardizedPage({
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
        {/* <h1>Welcome to {username}&apos;s Modify Criteria Standardized.</h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        /> */}
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Modify Criteria
          Standardized.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <Suspense
          fallback={
            <>
              <p className="mt-2">Loading...</p>
            </>
          }
        >
          <ManyUserNativeNotIrlCriteria user={user} />
          <ManyUserNativeIrlCriteria user={user} />
        </Suspense>
        <PageLink
          href={`/users/${username}/personal-info/standardized`}
          name={"Cancel"}
        />
      </div>
    </main>
  );
}
