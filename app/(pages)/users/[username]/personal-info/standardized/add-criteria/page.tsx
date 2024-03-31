import { fetchUserByUsername } from "@/app/libraries/data/users";
import {
  fetchAllUnansweredNativeNotIrlQuestions,
  fetchAllUnansweredNativeIrlQuestions,
} from "@/app/libraries/data/questions";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import { User } from "@/app/libraries/definitions/users";
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

  const [allNativeUnansweredNotIrlQuestions, allNativeUnansweredIrlQuestions] =
    await Promise.all([
      fetchAllUnansweredNativeNotIrlQuestions(user),
      fetchAllUnansweredNativeIrlQuestions(user),
    ]);

  if (!user) {
    notFound();
  }

  // updated demo behavior
  session.user = user;
  // because this and all /users/[username] pages except /users/[username]/profile pages are to be all only accessible to their own user

  return (
    <>
      <H1>
        Welcome to {user.user_app_wide_name}&apos;s Add Criteria Standardized.
      </H1>
      <BackToDashboardLink session={session} />
      <PageLink href={`/sign-in`} name={`sign out`} />
      <NativeNotIrlAnswerForm
        allNativeNotIrlQuestions={allNativeUnansweredNotIrlQuestions}
        user={user}
      />
      <NativeIrlAnswerForm
        allNativeIrlQuestions={allNativeUnansweredIrlQuestions}
        user={user}
      />
      <PageLink
        href={`/users/${username}/personal-info/standardized`}
        name={"Cancel"}
      />
    </>
  );
}
