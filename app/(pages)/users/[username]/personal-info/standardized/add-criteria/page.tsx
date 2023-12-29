import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  fetchAllNativeNotIrlQuestions,
  fetchAllNativeIrlQuestions,
} from "@/app/lib/data/questions";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import { User } from "@/app/lib/definitions/users";
import {
  NativeIrlAnswerForm,
  NativeNotIrlAnswerForm,
} from "@/app/components/client/forms";

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
  const session: { [K in "user"]: User } = {
    // “me” // default demo behavior
    user: {
      user_id: "2640aaf6-20b5-497c-b980-fbee374830c2",
      user_state: "LIVE",
      user_status_title: "NONE",
      user_status_dashboard: "NONE",
      user_status_personal_info: "NONE",
      user_username: "LePapier",
      user_app_wide_name: "“me”",
      user_friend_code: "fsa7hyt3g58x",
      user_has_temporary_password: false,
      user_created_at: "2023-12-09T05:59:58.074Z",
      user_updated_at: "2023-12-09T05:59:58.074Z",
    },
  };

  const username = params.username;
  const user = await fetchUserByUsername(username);

  const [allNativeNotIrlQuestions, allNativeIrlQuestions] = await Promise.all([
    fetchAllNativeNotIrlQuestions(),
    fetchAllNativeIrlQuestions(),
  ]);

  if (!user) {
    notFound();
  }

  // updated demo behavior
  session.user = user;
  // because this and all /users/[username] pages except /users/[username]/profile pages are to be all only accessible to their own user

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
        <div className="max-w-prose text-center">
          <H1>
            Welcome to {user.user_app_wide_name}&apos;s Add Criteria
            Standardized.
          </H1>
          <BackToDashboardLink session={session} />
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
          <NativeNotIrlAnswerForm
            allNativeNotIrlQuestions={allNativeNotIrlQuestions}
            user={user}
          />
          <NativeIrlAnswerForm
            allNativeIrlQuestions={allNativeIrlQuestions}
            user={user}
          />
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
