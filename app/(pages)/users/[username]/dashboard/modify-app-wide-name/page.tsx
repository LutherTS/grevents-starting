import { fetchUserByUsername } from "@/app/libraries/data/users";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import {
  UserAppWideNameModifyForm,
  UserDeactivateForm,
  UserFriendCodeUpdateForm,
  UserReactivateForm,
} from "@/app/components/client/forms";
import { User } from "@/app/libraries/definitions/users";

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
    title: `${username}'s Modify App-Wide Name`,
  };
}

export default async function ModifyAppWideNamePage({
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
      {/* <Main> */}
      {/* <Wrapper> */}
      <H1>Welcome to {user.user_app_wide_name}&apos;s Modify App-Wide Name.</H1>
      <BackToDashboardLink session={session} />
      <PageLink href={`/sign-in`} name={`sign out`} />
      <UserAppWideNameModifyForm user={user} />
      <UserFriendCodeUpdateForm user={user} />
      <p className="mt-2">
        You&apos;ll see it changed on your Personal info page.
      </p>
      {user.user_state === "LIVE" && (
        <>
          <UserDeactivateForm user={user} />
          <p className="mt-2">
            All other users will no longer be able to see your profile.
          </p>
        </>
      )}
      {user.user_state === "DEACTIVATED" && (
        <>
          <UserReactivateForm user={user} />
          <p className="mt-2">Reallow your friends to access your profile.</p>
        </>
      )}
      <PageLink href={`/users/${username}/dashboard`} name={`Cancel`} />
      {/* </Wrapper> */}
      {/* </Main> */}
    </>
  );
}
