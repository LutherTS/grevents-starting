// import { fetchUserByUsername } from "@/app/lib/data/users";
// import {
//   fetchAllNativeNotIrlQuestions,
//   fetchAllNativeIrlQuestions,
// } from "@/app/lib/data/questions";
// import { notFound } from "next/navigation";
// import { Suspense } from "react";
import { PageLink } from "@/app/components/agnostic/links";

export default async function AddCriteriaStandardizedPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  // const user = await fetchUserByUsername(username);

  // const [allNativeNotIrlQuestions, allNativeIrlQuestions] = await Promise.all([
  //   fetchAllNativeNotIrlQuestions(),
  //   fetchAllNativeIrlQuestions(),
  // ]);

  // if (!user) {
  //   notFound();
  // }

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
        <div className="max-w-prose text-center">
          <h1>Welcome to {username}&apos;s Add Criteria Standardized.</h1>
          {/* <h1 className="font-semibold">
            Welcome to {user.user_app_wide_name}&apos;s Add Criteria
            Standardized.
          </h1> */}
          {/* <Suspense
            fallback={
              <>
                <p className="pt-2">Loading...</p>
              </>
            }
          > */}
          {/* {allNativeNotIrlQuestions.length > 0 && (
            <>
              <p className="pt-2">Select a native question below</p>
              <ol>
                {allNativeNotIrlQuestions.map((nativeNotIrlQuestion) => {
                  return (
                    <li key={nativeNotIrlQuestion.question_id}>
                      <p className="pt-2">
                        {nativeNotIrlQuestion.question_name} / native
                      </p>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
          {allNativeIrlQuestions.length > 0 && (
            <>
              <p className="pt-2">Select a native irl question below</p>
              <ol>
                {allNativeIrlQuestions.map((nativeIrlQuestion) => {
                  return (
                    <li key={nativeIrlQuestion.question_id}>
                      <p className="pt-2">
                        {nativeIrlQuestion.question_name} / native / irl
                      </p>
                    </li>
                  );
                })}
              </ol>
            </>
          )} */}
          {/* </Suspense> */}
          {/* Suspense doesn't work here because I'm fetching from the page and not from server components. It's a decision I had made because I considered that... a form is a client component, therefore it can't be expected to fetch. But that doesn't mean I can't organize on overall component above the form that's actually going to fetch.
          For now I'm choosing to map directly on the page, but eventually I'll do so on the form component once I'll reach the development phase when I'm mutating data. */}
          <PageLink
            href={`/users/${username}/personal-info/standardized`}
            name={"Cancel"}
          />
        </div>
      </main>
    </>
  );
}
