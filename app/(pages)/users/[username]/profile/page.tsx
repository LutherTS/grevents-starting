import { fetchUserByUsername } from "@/app/libraries/data/users";
import { findContactByUserAndSession } from "@/app/libraries/data/contacts";
import { notFound } from "next/navigation";
import { User } from "@/app/libraries/definitions/users";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import {
  RelationCombinationNoneExposed,
  RelationCombinationFriendExposed,
  RelationCombinationIrlExposed,
  RelationCombinationIAmBlockingExposed,
  RelationCombinationHasMeBlockedExposed,
  RelationCombinationBlockingBlockedExposed,
} from "@/app/components/agnostic/relcombos";
import {
  RelationCombination,
  defineFoundRelCombo,
} from "@/app/libraries/utilities/relcombos";
import {
  ContactAnnulFriend,
  ContactAnnulIrl,
  ContactFirstAccessThroughFind,
  ContactNoLongerFriends,
  ContactNoLongerIrls,
  ContactNowBlocked,
  ContactNowBlocking,
  ContactNowFriends,
  ContactNowIrls,
  ContactNowUnblocked,
  ContactNowUnblocking,
  ContactReaccessThroughFind,
  ContactReceiveFriend,
  ContactReceiveIrl,
  ContactRefusedFriend,
  ContactRefusedIrl,
  ContactSentFriend,
  ContactSentIrl,
  ContactUserQuestionFriendPinned,
  ContactUserQuestionFriendUnpinned,
} from "@/app/components/client/toasts";

import type { Metadata } from "next";
import {
  BackLinkForm,
  RevalidateButtonForm,
} from "@/app/components/client/forms";

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username}'s Profile`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  // const session: { [K in "user"]: User } = {
  //   // “me”
  //   user: {
  //     user_id: "2640aaf6-20b5-497c-b980-fbee374830c2",
  //     user_state: "LIVE",
  //     user_status_title: "NONE",
  //     user_status_dashboard: "NONE",
  //     user_status_personal_info: "NONE",
  //     user_username: "LePapier",
  //     user_app_wide_name: "“me”",
  //     user_friend_code: "fsa7hyt3g58x",
  //     user_has_temporary_password: false,
  //     user_created_at: "2023-12-09T05:59:58.074Z",
  //     user_updated_at: "2023-12-09T05:59:58.074Z",
  //   },
  // };

  const session: { [K in "user"]: User } = {
    // Alice
    user: {
      user_id: "e17bc7f7-b93f-4915-9f72-83d055c66e77",
      user_state: "LIVE",
      user_status_title: "NONE",
      user_status_dashboard: "NONE",
      user_status_personal_info: "NONE",
      user_username: "Alice-chan",
      user_app_wide_name: "Alice",
      user_friend_code: "X_CESa8ACtHT",
      user_has_temporary_password: false,
      user_created_at: "2023-12-09T06:00:33.323Z",
      user_updated_at: "2023-12-09T06:00:33.323Z",
    },
  };

  // const session: { [K in "user"]: User } = {
  //   // Alice, but DEACTIVATED
  //   user: {
  //     user_id: "e17bc7f7-b93f-4915-9f72-83d055c66e77",
  //     user_state: "DEACTIVATED",
  //     user_status_title: "NONE",
  //     user_status_dashboard: "NONE",
  //     user_status_personal_info: "NONE",
  //     user_username: "Alice-chan",
  //     user_app_wide_name: "Alice",
  //     user_friend_code: "k7mdsfwq2e9g",
  //     user_has_temporary_password: false,
  //     user_created_at: "2023-12-09T06:00:33.323Z",
  //     user_updated_at: "2023-12-09T06:00:33.323Z",
  //   },
  // };

  // const session = null;

  const username = params.username;
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  const foundContact = await findContactByUserAndSession(user, session);

  let relCombo: RelationCombination | "" = "";

  if (foundContact) {
    relCombo = defineFoundRelCombo(foundContact);
  }

  // relCombo = "none";
  // relCombo = "friend";
  // relCombo = "irl";
  // relCombo = "i-am-blocking";
  // relCombo = "has-me-blocked";
  // relCombo = "blocking-blocked";

  return (
    <>
      {session &&
        session.user.user_state === "LIVE" &&
        user.user_state === "LIVE" && (
          <>
            {/* This is where toasts for accessing the other user profile, creating contacts then accessing the other user profile, and other circumstances, will be called. */}
            {foundContact &&
              // That below could and should be deeper with _ eventually.
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_other_profile ===
                "FIRSTACCESSTHROUGHFIND" && (
                <ContactFirstAccessThroughFind
                  contact={foundContact}
                  user={user}
                />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_other_profile ===
                "REACCESSTHROUGHFIND" && (
                <ContactReaccessThroughFind
                  contact={foundContact}
                  user={user}
                />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_other_profile ===
                "USERQUESTIONFRIENDPINNED" && (
                <ContactUserQuestionFriendPinned
                  contact={foundContact}
                  user={user}
                />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_other_profile ===
                "USERQUESTIONFRIENDUNPINNED" && (
                <ContactUserQuestionFriendUnpinned
                  contact={foundContact}
                  user={user}
                />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "NOWFRIENDS" && (
                <ContactNowFriends contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "NOWIRLS" && (
                <ContactNowIrls contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship ===
                "NOLONGERFRIENDS" && (
                <ContactNoLongerFriends contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship ===
                "NOLONGERIRLS" && (
                <ContactNoLongerIrls contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "NOWBLOCKING" && (
                <ContactNowBlocking contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship ===
                "NOWUNBLOCKING" && (
                <ContactNowUnblocking contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "NOWBLOCKED" && (
                <ContactNowBlocked contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship ===
                "NOWUNBLOCKED" && (
                <ContactNowUnblocked contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "SENTFRIEND" && (
                <ContactSentFriend contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "SENTIRL" && (
                <ContactSentIrl contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "ANNULFRIEND" && (
                <ContactAnnulFriend contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "ANNULIRL" && (
                <ContactAnnulIrl contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship ===
                "RECEIVEFRIEND" && (
                <ContactReceiveFriend contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "RECEIVEIRL" && (
                <ContactReceiveIrl contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship ===
                "REFUSEDFRIEND" && (
                <ContactRefusedFriend contact={foundContact} user={user} />
              )}
            {foundContact &&
              session.user.user_id !== user.user_id &&
              foundContact.c2_contact_status_relationship === "REFUSEDIRL" && (
                <ContactRefusedIrl contact={foundContact} user={user} />
              )}
            <H1>Welcome to {user.user_app_wide_name}&apos;s Profile.</H1>
            <BackToDashboardLink session={session} />
            <PageLink href={`/sign-in`} name={`sign out`} />
            {username === session.user.user_username && (
              <p className="mt-2">
                This is your profile page, the one where others will be able to
                see the data you&apos;ve shared with them on a single URL, and
                eventually on more children paths as the application develops.
              </p>
            )}
            {relCombo === "" && username !== session.user.user_username && (
              <>
                <p className="mt-2">
                  You have no contact with {user.user_app_wide_name}. In the
                  full application, you&apos;ll be required to enter their
                  friend code to start connecting.
                </p>
              </>
            )}
            {foundContact && relCombo === "none" && (
              <RelationCombinationNoneExposed
                user={user}
                contact={foundContact}
                session={session}
              />
            )}
            {relCombo === "friend" && foundContact && (
              <>
                <RelationCombinationFriendExposed
                  user={user}
                  contact={foundContact}
                  session={session}
                />
              </>
            )}
            {relCombo === "irl" && foundContact && (
              <>
                <RelationCombinationIrlExposed
                  user={user}
                  contact={foundContact}
                  session={session}
                />
              </>
            )}
            {foundContact && relCombo === "i-am-blocking" && (
              <RelationCombinationIAmBlockingExposed
                user={user}
                contact={foundContact}
                session={session}
              />
            )}
            {foundContact && relCombo === "has-me-blocked" && (
              <RelationCombinationHasMeBlockedExposed
                user={user}
                contact={foundContact}
                session={session}
              />
            )}
            {foundContact && relCombo === "blocking-blocked" && (
              <RelationCombinationBlockingBlockedExposed
                user={user}
                contact={foundContact}
                session={session}
              />
            )}

            <PageLink
              href={`/users/${session.user.user_username}/friends`}
              name={`back to your friends`}
            />
            <RevalidateButtonForm />
          </>
        )}
      {session &&
        session.user.user_state === "LIVE" &&
        user.user_state === "DEACTIVATED" && (
          <>
            <BackToDashboardLink session={session} />
            <p className="mt-2">
              {user.user_app_wide_name} has deactivated their profile.
            </p>
            <BackLinkForm />
            <RevalidateButtonForm />
          </>
        )}
      {session &&
        session.user.user_state === "DEACTIVATED" &&
        session.user.user_id !== user.user_id && (
          <>
            <BackToDashboardLink session={session} />
            <p className="mt-2">
              You cannot see other users&apos; profiles while yours is
              deactivated.
            </p>
            <BackLinkForm />
            <RevalidateButtonForm />
          </>
        )}
      {session &&
        session.user.user_state === "DEACTIVATED" &&
        session.user.user_id === user.user_id && (
          <>
            <BackToDashboardLink session={session} />
            <p className="mt-2">You&apos;ve deactivated your profile.</p>
            <BackLinkForm />
            <RevalidateButtonForm />
          </>
        )}
      {!session && (
        <>
          <p>
            You have no session. You shall eventually be redirected to the
            sign-in page or the home page.
          </p>
          <PageLink href={`/`} name={`Return home`} />
        </>
      )}
    </>
  );
}
