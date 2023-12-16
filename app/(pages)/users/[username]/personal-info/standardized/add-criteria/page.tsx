import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  fetchAllNativeNotIrlQuestions,
  fetchAllNativeIrlQuestions,
} from "@/app/lib/data/questions";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import { PageLink } from "@/app/components/agnostic/links";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username}'s Add Criteria Standardized`,
  };
}

export default async function AddCriteriaStandardizedPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  const user = await fetchUserByUsername(username);

  const [allNativeNotIrlQuestions, allNativeIrlQuestions] = await Promise.all([
    fetchAllNativeNotIrlQuestions(),
    fetchAllNativeIrlQuestions(),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
        <div className="max-w-prose text-center">
          <H1>
            Welcome to {user.user_app_wide_name}&apos;s Add Criteria
            Standardized.
          </H1>
          <PageLink
            href={`/users/${username}/dashboard`}
            name={`back to dashboard`}
          />
          {allNativeNotIrlQuestions.length > 0 && (
            <>
              <p className="mt-2 font-semibold text-zinc-500">
                Select a native question below
              </p>
              <ol>
                {allNativeNotIrlQuestions.map((nativeNotIrlQuestion) => {
                  return (
                    <li key={nativeNotIrlQuestion.question_id}>
                      <p className="mt-2">
                        <span className="font-semibold">
                          {nativeNotIrlQuestion.question_name}
                        </span>{" "}
                        / native
                      </p>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
          {allNativeIrlQuestions.length > 0 && (
            <>
              <p className="mt-2 font-semibold text-zinc-500">
                Select a native irl question below
              </p>
              <ol>
                {allNativeIrlQuestions.map((nativeIrlQuestion) => {
                  return (
                    <li key={nativeIrlQuestion.question_id}>
                      <p className="mt-2">
                        <span className="font-semibold">
                          {nativeIrlQuestion.question_name}
                        </span>{" "}
                        / native / irl
                      </p>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
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
