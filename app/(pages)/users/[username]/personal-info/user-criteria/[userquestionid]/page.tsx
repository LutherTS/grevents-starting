import { fetchUserByUsername } from "@/app/lib/data/users";
import { fetchCustomUserQuestionByIDAndUser } from "@/app/lib/data/userquestions";
import { findAnswerByUserQuestionAndUser } from "@/app/lib/data/answers";
import { OneCriteria } from "@/app/components/server/answers";
import { ManyFriends } from "@/app/components/server/contacts";
import { ManyUserQuestionFriends } from "@/app/components/server/userquestionfriends";
import { notFound } from "next/navigation";
import { Suspense } from "react";
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
  const username = params.username;
  const userQuestionId = params.userquestionid;

  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

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
          <H1>
            Welcome to {user.user_app_wide_name}&apos;s &quot;
            {userQuestion.question_name}&quot; User Criteria.
          </H1>
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
            <OneCriteria answer={userQuestionAnswer} />
            <ManyFriends user={user} />
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
