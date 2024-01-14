import { fetchUserByUsername } from "@/app/libraries/data/users";
import {
  ManyUserPseudonativeNotIrlCriteria,
  ManyUserPseudonativeIrlCriteria,
  ManyUserCustomCriteria,
} from "@/app/components/server/database/answers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import {
  AnswerValueUpdated,
  AnswerValueDeleted,
  UserQuestionUppedToIrl,
  UserQuestionDownedToIrl,
  UserPseudonativeCriteriaNotIrlAdded,
  UserPseudonativeCriteriaIrlAdded,
  UserCustomCriteriaAdded,
} from "@/app/components/client/toasts";
import { User } from "@/app/libraries/definitions/users";
import { RevalidateButtonForm } from "@/app/components/client/forms";
import {
  ANSWERS_PINNED_BY_USER_LIMIT,
  countUserPinnedAnswers,
} from "@/app/libraries/data/answers";

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
    title: `${username}'s Customized Info`,
  };
}

export default async function CustomizedPage({
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

  if (!user) {
    notFound();
  }

  // updated demo behavior
  session.user = user;
  // because this and all /users/[username] pages except /users/[username]/profile pages are to be all only accessible to their own user

  const pinnedAnswerCount = await countUserPinnedAnswers(user.user_id);
  // console.log(pinnedAnswerCount);

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        {/* {user.user_status_personal_info === "ANSWERUPDATED" && (
          <AnswerValueUpdated user={user} />
        )}
        {user.user_status_personal_info === "ANSWERDELETED" && (
          <AnswerValueDeleted user={user} />
        )} */}
        {user.user_status_personal_info === "CUSTOMIZEDANSWERUPDATED" && (
          <AnswerValueUpdated user={user} />
        )}
        {user.user_status_personal_info === "CUSTOMIZEDANSWERDELETED" && (
          <AnswerValueDeleted user={user} />
        )}
        {user.user_status_personal_info ===
          "PSEUDONATIVECRITERIAUPPEDTOIRL" && (
          <UserQuestionUppedToIrl user={user} />
        )}
        {user.user_status_personal_info ===
          "PSEUDONATIVECRITERIADOWNEDFROMIRL" && (
          <UserQuestionDownedToIrl user={user} />
        )}
        {user.user_status_personal_info ===
          "PSEUDONATIVECRITERIANOTIRLADDED" && (
          <UserPseudonativeCriteriaNotIrlAdded user={user} />
        )}
        {user.user_status_personal_info === "PSEUDONATIVECRITERIAIRLADDED" && (
          <UserPseudonativeCriteriaIrlAdded user={user} />
        )}
        {user.user_status_personal_info === "CUSTOMCRITERIAADDED" && (
          <UserCustomCriteriaAdded user={user} />
        )}
        {pinnedAnswerCount >= ANSWERS_PINNED_BY_USER_LIMIT && (
          <p className="mb-2 cursor-default text-orange-500">
            You can&apos;t pin more than 16 of your own criteria.
          </p>
        )}
        <H1>Welcome to {user.user_app_wide_name}&apos;s Customized Info.</H1>
        <BackToDashboardLink session={session} />
        <PageLink href={`/sign-in`} name={`sign out`} />
        <Suspense
          fallback={
            <>
              <p className="mt-2">Loading...</p>
            </>
          }
        >
          <ManyUserPseudonativeNotIrlCriteria
            user={user}
            pinnedAnswerCount={pinnedAnswerCount}
          />
          <ManyUserPseudonativeIrlCriteria
            user={user}
            pinnedAnswerCount={pinnedAnswerCount}
          />
          <ManyUserCustomCriteria
            user={user}
            pinnedAnswerCount={pinnedAnswerCount}
          />
        </Suspense>
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
        <RevalidateButtonForm />
      </div>
    </main>
  );
}
