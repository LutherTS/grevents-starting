import { fetchUserByUsername } from "@/app/libraries/data/users";
import { fetchCustomUserQuestionByIDAndUser } from "@/app/libraries/data/userquestions";
import { findAnswerByUserQuestionAndUser } from "@/app/libraries/data/answers";
import { ManyFriendsAddable } from "@/app/components/server/database/contacts";
import { ManyUserQuestionFriends } from "@/app/components/server/database/userquestionfriends";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import { User } from "@/app/libraries/definitions/users";
import {
  UserQuestionFriendCreated,
  UserQuestionFriendDeleted,
} from "@/app/components/client/toasts";
import { OneCriteriaModify } from "@/app/components/agnostic/database/answers";

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
    title: `${username}'s User Criteria`,
  };
}

export default async function UserQuestionPage({
  params,
}: {
  params: {
    username: string;
    userquestionid: string;
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
  const userQuestionId = params.userquestionid;

  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  // updated demo behavior
  session.user = user;
  // because this and all /users/[username] pages except /users/[username]/profile pages are to be all only accessible to their own user

  const userQuestion = await fetchCustomUserQuestionByIDAndUser(
    userQuestionId,
    user,
  );

  if (!userQuestion) {
    notFound();
  }

  const userQuestionAnswer = await findAnswerByUserQuestionAndUser(
    userQuestion,
    user,
  );

  if (!userQuestionAnswer) {
    notFound();
  }

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
        <div className="max-w-prose text-center">
          {user.user_status_personal_info === "USERQUESTIONFRIENDADDED" && (
            <UserQuestionFriendCreated user={user} />
          )}
          {user.user_status_personal_info === "USERQUESTIONFRIENDDELETED" && (
            <UserQuestionFriendDeleted user={user} />
          )}
          <H1>
            Welcome to {user.user_app_wide_name}&apos;s &quot;
            {userQuestion.question_name}&quot; User Criteria.
          </H1>
          <BackToDashboardLink session={session} />
          <PageLink href={`/sign-in`} name={`sign out`} />
          <Suspense
            fallback={
              <>
                <p className="mt-2">Loading...</p>
              </>
            }
          >
            <OneCriteriaModify
              answer={userQuestionAnswer}
              personalView={true}
            />
            <ManyFriendsAddable user={user} userQuestion={userQuestion} />
            <ManyUserQuestionFriends userQuestion={userQuestion} />
          </Suspense>
          <PageLink
            href={`/users/${username}/personal-info/customized`}
            name={"To Customized criteria"}
          />
          <PageLink
            href={`/users/${username}/personal-info`}
            name={"To Personal Info"}
          />
        </div>
      </main>
    </>
  );
}
