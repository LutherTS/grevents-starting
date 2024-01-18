import { fetchUserByUsername } from "@/app/libraries/data/users";
import {
  ManyUserNativeNotIrlCriteria,
  ManyUserNativeIrlCriteria,
} from "@/app/components/server/database/answers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import {
  AnswerValueUpdated,
  AnswerValueDeleted,
  UserNativeCriteriaNotIrlAdded,
  UserNativeCriteriaIrlAdded,
  UserCriteriaHidden,
  UserCriteriaRevealed,
} from "@/app/components/client/toasts";
import { User } from "@/app/libraries/definitions/users";
import { RevalidateButtonForm } from "@/app/components/client/forms";
import {
  ANSWERS_PINNED_BY_USER_LIMIT,
  countUserPinnedAnswers,
} from "@/app/libraries/data/answers";

import type { Metadata } from "next";
import { Main, Wrapper } from "@/app/components/agnostic/wrappers";

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username}'s Standardized Info`,
  };
}

export default async function StardardizedPage({
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
    <Main>
      <Wrapper>
        {user.user_status_personal_info === "STANDARDIZEDANSWERUPDATED" && (
          <AnswerValueUpdated user={user} />
        )}
        {user.user_status_personal_info === "STANDARDIZEDANSWERDELETED" && (
          <AnswerValueDeleted user={user} />
        )}
        {user.user_status_personal_info === "NATIVECRITERIANOTIRLADDED" && (
          <UserNativeCriteriaNotIrlAdded user={user} />
        )}
        {user.user_status_personal_info === "NATIVECRITERIAIRLADDED" && (
          <UserNativeCriteriaIrlAdded user={user} />
        )}
        {user.user_status_personal_info === "CRITERIAHIDDEN" && (
          <UserCriteriaHidden user={user} />
        )}
        {user.user_status_personal_info === "CRITERIAREVEALED" && (
          <UserCriteriaRevealed user={user} />
        )}
        {pinnedAnswerCount >= ANSWERS_PINNED_BY_USER_LIMIT && (
          <p className="mb-2 cursor-default text-orange-500">
            You can&apos;t pin more than 16 of your own criteria.
          </p>
        )}
        <H1>Welcome to {user.user_app_wide_name}&apos;s Standardized Info.</H1>
        <BackToDashboardLink session={session} />
        <PageLink href={`/sign-in`} name={`sign out`} />
        <Suspense
          fallback={
            <>
              <p className="mt-2">Loading...</p>
            </>
          }
        >
          <ManyUserNativeNotIrlCriteria
            user={user}
            pinnedAnswerCount={pinnedAnswerCount}
          />
          <ManyUserNativeIrlCriteria
            user={user}
            pinnedAnswerCount={pinnedAnswerCount}
          />
        </Suspense>
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
        <RevalidateButtonForm />
      </Wrapper>
    </Main>
  );
}
