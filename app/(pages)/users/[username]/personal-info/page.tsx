import { fetchUserByUsername } from "@/app/libraries/data/users";
import { ManyUserPinnedCriteria } from "@/app/components/server/database/answers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import { RevalidateButtonForm } from "@/app/components/client/forms";
import {
  AnswerValueDeleted,
  AnswerValueUpdated,
  UserQuestionPinned,
  UserQuestionUnpinned,
} from "@/app/components/client/toasts";
import { User } from "@/app/libraries/definitions/users";

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
    title: `${username}'s Personal Info`,
  };
}

export default async function PersonalInfoPage({
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
    <>
      {(user.user_status_personal_info === "CUSTOMIZEDANSWERUPDATED" ||
        user.user_status_personal_info === "STANDARDIZEDANSWERUPDATED") && (
        <AnswerValueUpdated user={user} />
      )}
      {(user.user_status_personal_info === "CUSTOMIZEDANSWERUPDATED" ||
        user.user_status_personal_info === "STANDARDIZEDANSWERUPDATED") && (
        <AnswerValueDeleted user={user} />
      )}
      {user.user_status_personal_info === "CRITERIAPINNED" && (
        <UserQuestionPinned user={user} />
      )}
      {user.user_status_personal_info === "CRITERIAUNPINNED" && (
        <UserQuestionUnpinned user={user} />
      )}
      <H1>Welcome to {user.user_app_wide_name}&apos;s Personal Info.</H1>
      <BackToDashboardLink session={session} />
      <PageLink href={`/sign-in`} name={`sign out`} />
      <p className="mt-2">{user.user_username}</p>
      <p className="mt-2">{user.user_friend_code}</p>
      <Suspense
        fallback={
          <>
            <p className="mt-2">Loading...</p>
          </>
        }
      >
        <ManyUserPinnedCriteria user={user} />
      </Suspense>
      <PageLink
        href={`/users/${username}/personal-info/standardized`}
        name={"To Standardized criteria"}
      />
      <PageLink
        href={`/users/${username}/personal-info/customized`}
        name={"To Customized criteria"}
      />
      <RevalidateButtonForm />
    </>
  );
}
