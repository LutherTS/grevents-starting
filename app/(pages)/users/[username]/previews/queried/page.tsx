import { fetchUserByUsername } from "@/app/libraries/data/users";
import { gatherContactByUserAndUsername } from "@/app/libraries/data/contacts";
import { notFound } from "next/navigation";
// import { ManyContacts } from "@/app/components/server/contacts"; // No longer concording with the expected user experience.
import { Suspense } from "react";
import { ManyRelationCombinations } from "@/app/components/agnostic/lists";
import {
  defineGatheredRelCombo,
  relationCombinations,
} from "@/app/libraries/utilities/relcombos";
import {
  RelationCombinationNonePreview,
  RelationCombinationFriendCustomQueried,
  RelationCombinationIrlCustomQueried,
  RelationCombinationIAmBlockingPreview,
  RelationCombinationHasMeBlockedPreview,
  RelationCombinationBlockingBlockedPreview,
} from "@/app/components/agnostic/relcombos";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import { User } from "@/app/libraries/definitions/users";
import {
  RelComboInputForm,
  UserLastInputForm,
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
    title: `${username}'s Queried Previews`,
  };
}

export default async function QueriedPreviewPage({
  params,
  searchParams,
}: {
  params: {
    username: string;
  };
  searchParams: {
    userlast?: string;
    relcombo?: string;
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
  const userLast = searchParams?.userlast || "";
  let relCombo = searchParams?.relcombo || "";

  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  // updated demo behavior
  session.user = user;
  // because this and all /users/[username] pages except /users/[username]/profile pages are to be all only accessible to their own user

  const gatheredContact = await gatherContactByUserAndUsername(user, userLast);

  if (gatheredContact !== undefined) {
    relCombo = defineGatheredRelCombo(relCombo, gatheredContact);
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <H1>Welcome to {user.user_app_wide_name}&apos;s Queried Previews.</H1>
        <BackToDashboardLink session={session} />
        <UserLastInputForm userLast={userLast} />
        {userLast !== "" && (
          <>
            {gatheredContact ? (
              <p className="mt-2 font-semibold">userlast: {userLast}</p>
            ) : (
              <p className="mt-2">
                You aren&apos;t acquainted with any such other user.
              </p>
            )}
          </>
        )}
        <RelComboInputForm relCombo={relCombo} />
        {relCombo !== "" && (
          <>
            {relationCombinations.includes(relCombo) ? (
              <p className="mt-2 font-semibold">relcombo: {relCombo}</p>
            ) : (
              <p className="mt-2">
                There is no such relation combinaison defined.
              </p>
            )}
          </>
        )}
        <Suspense
          fallback={
            <>
              <p className="mt-2">Loading...</p>
            </>
          }
        >
          {gatheredContact && relCombo === "none" && (
            <RelationCombinationNonePreview />
          )}
          {gatheredContact && relCombo === "friend" && (
            <>
              <RelationCombinationFriendCustomQueried
                user={user}
                contact={gatheredContact}
              />
            </>
          )}
          {gatheredContact && relCombo === "irl" && (
            <>
              <RelationCombinationIrlCustomQueried
                user={user}
                contact={gatheredContact}
              />
            </>
          )}
          {gatheredContact && relCombo === "i-am-blocking" && (
            <RelationCombinationIAmBlockingPreview user={user} />
          )}
          {gatheredContact && relCombo === "has-me-blocked" && (
            <RelationCombinationHasMeBlockedPreview user={user} />
          )}
          {gatheredContact && relCombo === "blocking-blocked" && (
            <RelationCombinationBlockingBlockedPreview user={user} />
          )}
          {gatheredContact && relationCombinations.includes(relCombo) && (
            <>
              <PageLink
                href={`/users/${gatheredContact.user_username}/profile`}
                name={`To ${gatheredContact.user_app_wide_name}'s Profile`}
              />
            </>
          )}
        </Suspense>
        <PageLink href={`/users/${username}/previews`} name={"To Previews"} />
        <PageLink
          href={`/users/${username}/profile`}
          name={"To Your Profile"}
        />
        <PageLink href={`/sign-in`} name={`sign out`} />
      </div>
    </main>
  );
}
