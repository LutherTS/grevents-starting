import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  ManyUserPseudonativeNotIrlCriteria,
  ManyUserPseudonativeIrlCriteria,
  ManyUserCustomCriteria,
} from "@/app/components/server/answers";
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
} from "@/app/components/client/toasts";
import { User } from "@/app/lib/definitions/users";

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

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        {user.user_status_personal_info === "ANSWERUPDATED" && (
          <AnswerValueUpdated user={user} />
        )}
        {user.user_status_personal_info === "ANSWERDELETED" && (
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
        <H1>Welcome to {user.user_app_wide_name}&apos;s Customized Info.</H1>
        <BackToDashboardLink session={session} />
        <Suspense
          fallback={
            <>
              <p className="mt-2">Loading...</p>
            </>
          }
        >
          <ManyUserPseudonativeNotIrlCriteria user={user} />
          <ManyUserPseudonativeIrlCriteria user={user} />
          <ManyUserCustomCriteria user={user} />
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
      </div>
    </main>
  );
}
