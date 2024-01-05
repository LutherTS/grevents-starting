import { User } from "@/app/lib/definitions/users";
import { Suspense } from "react";
import {
  ManyRelComboFriendCriteria,
  ManyRelComboFriendCriteriaCustom,
  ManyRelComboIrlCriteria,
  ManyRelComboIrlCriteriaCustom,
  ManyUserSharedToContactCustomAnswers,
} from "../server/answers";
import { FoundContact, GatheredContact } from "@/app/lib/definitions/contacts";
import { ActionLink, PageLink } from "./links";
import {
  AcceptFriendForm,
  AcceptIrlForm,
  AnnulFriendForm,
  AnnulIrlForm,
  BlockBackForm,
  BlockForm,
  DeclineFriendForm,
  DeclineIrlForm,
  DowngradeFriendshipToIrlForm,
  SendFriendForm,
  UnblockForm,
  UnblockIfThatsOKWithYouForm,
  UnfriendForm,
  UpgradeToIrlForm,
} from "../client/forms";

export function RelationCombinationNone({
  user,
  contact,
  session,
}: {
  user: User;
  contact: FoundContact;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      {/* if SENTFRIEND (session)
    AnnulFriendRequestForm
    else if ANNULFRIEND (session)
    AnnulledFriendCannotSend
    else if mirror SENTFRIEND (user)
    DeclineFriendRequestForm
    AcceptFriendRequestForm
    else // even if mirror ANNULFRIEND (user)
    SendFriendRequestForm
    */}
      {contact.c2_contact_process_relationship === "SENTFRIEND" && (
        <>
          <AnnulFriendForm session={session} user={user} contact={contact} />
        </>
      )}
      {contact.c2_contact_process_relationship === "ANNULFRIEND" && (
        <>
          <p className="mt-2 text-gray-500 line-through">Send friend request</p>
        </>
      )}
      {contact.c1_contact_process_relationship === "SENTFRIEND" && (
        <>
          <p className="mt-2">
            <AcceptFriendForm session={session} user={user} contact={contact} />
            &nbsp;/&nbsp;
            <DeclineFriendForm
              session={session}
              user={user}
              contact={contact}
            />
          </p>
        </>
      )}
      {contact.c2_contact_process_relationship !== "SENTFRIEND" &&
        contact.c2_contact_process_relationship !== "ANNULFRIEND" &&
        contact.c1_contact_process_relationship !== "SENTFRIEND" && (
          <>
            {/* <SendFriendRequestForm user={user} contact={contact} /> */}
            <SendFriendForm session={session} user={user} contact={contact} />
          </>
        )}
      {contact.c2_contact_process_relationship !== "SENTFRIEND" && (
        <>
          <BlockForm session={session} user={user} contact={contact} />
        </>
      )}
      {/* <BlockForm user={user} contact={contact} /> */}
      {/* if SENTFRIEND (session)
    SentFriendDetails
    else if ANNULFRIEND (session)
    AnnulFriendDetails
    else if mirror SENTFRIEND (user)
    MirrorSentFriendDetails
    */}
      {contact.c2_contact_process_relationship === "SENTFRIEND" && (
        <>
          <p className="mt-2 text-orange-500">
            Friend request sent and pending. However, do take into consideration
            that canceling your friend request to {user.user_app_wide_name} will
            prevent you from sending {user.user_app_wide_name} another friend
            request at this time.
          </p>
        </>
      )}
      {contact.c2_contact_process_relationship === "ANNULFRIEND" && (
        <>
          <p className="mt-2 text-red-500">
            As a consequence of you annulling your friend request sent to{" "}
            {user.user_app_wide_name}, to prevent mass requesting you cannot
            send {user.user_app_wide_name} another friend request at this time.
          </p>
        </>
      )}
      {contact.c1_contact_process_relationship === "SENTFRIEND" && (
        <>
          <p className="mt-2 text-orange-500">
            {contact.u1_user_app_wide_name} has sent you a friend request. By
            accepting this request, {contact.u1_user_app_wide_name} will have
            access to all of your native criteria, present and future, and you
            will have access to all the native criteria of{" "}
            {contact.u1_user_app_wide_name}, present and future all the same.
            Irl native criteria, however, will require upgrading your friendship
            for shared access between the two of you.
          </p>
          <PageLink
            href={`/users/${contact.u2_user_username}/previews/queried?userlast=${contact.u1_user_username}&relcombo=friend`}
            name={`Preview the criteria you'll give access to ${contact.u1_user_app_wide_name}`}
          />
        </>
      )}
      {contact.c1_contact_process_relationship === "ANNULFRIEND" && (
        <>
          <p className="mt-2 text-neutral-500">
            (Just letting you know that {user.user_app_wide_name} has annulled a
            friend request, so you&apos;re the only one between the two of you
            who can initiate a friend request at this time.)
          </p>
        </>
      )}
    </>
  );
}

export function RelationCombinationNonePreview() {
  return (
    <>
      <ActionLink>Send friend request</ActionLink>
      <ActionLink>Block</ActionLink>
    </>
  );
}

export function RelationCombinationFriendPreview({ user }: { user: User }) {
  return (
    <>
      <Suspense
        fallback={
          <>
            <p className="mt-2">Loading...</p>
          </>
        }
      >
        <ManyRelComboFriendCriteria user={user} />
      </Suspense>
      <ActionLink>Upgrade friendship to irl</ActionLink>
      <ActionLink>Unfriend</ActionLink>
    </>
  );
}

export function RelationCombinationIrlPreview({ user }: { user: User }) {
  return (
    <>
      <Suspense
        fallback={
          <>
            <p className="mt-2">Loading...</p>
          </>
        }
      >
        <ManyRelComboIrlCriteria user={user} />
      </Suspense>
      <ActionLink>Downgrade friendship from irl</ActionLink>
      <ActionLink>Unfriend</ActionLink>
    </>
  );
}

export function RelationCombinationIAmBlocking({
  user,
  contact,
  session,
}: {
  user: User;
  contact: FoundContact;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <p className="mt-2 font-semibold text-red-500">
        YOU CAN NO LONGER ACCESS ANY OF THE INFORMATION OF{" "}
        {user.user_username.toUpperCase()} ACROSS THE ENTIRE APPLICATION, FUTURE
        COMMON GROUPS AND FUTURE COMMON EVENTS INCLUDED.
      </p>
      <BlockBackForm session={session} user={user} contact={contact} />
    </>
  );
}

export function RelationCombinationIAmBlockingPreview({
  user,
}: {
  user: User;
}) {
  return (
    <>
      <p className="mt-2 font-semibold text-red-500">
        YOU CAN NO LONGER ACCESS ANY OF THE INFORMATION OF{" "}
        {user.user_username.toUpperCase()} ACROSS THE ENTIRE APPLICATION, FUTURE
        COMMON GROUPS AND FUTURE COMMON EVENTS INCLUDED.
      </p>
      <ActionLink>Block them back</ActionLink>
    </>
  );
}

export function RelationCombinationHasMeBlocked({
  user,
  contact,
  session,
}: {
  user: User;
  contact: FoundContact;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <p className="mt-2 font-semibold">
        {user.user_username.toUpperCase()} CAN NO LONGER ACCESS ANY OF YOUR
        INFORMATION ACROSS THE ENTIRE APPLICATION, FUTURE COMMON GROUPS AND
        FUTURE COMMON EVENTS INCLUDED.
      </p>
      <UnblockForm session={session} user={user} contact={contact} />
    </>
  );
}

export function RelationCombinationHasMeBlockedPreview({
  user,
}: {
  user: User;
}) {
  return (
    <>
      <p className="mt-2 font-semibold">
        {user.user_username.toUpperCase()} CAN NO LONGER ACCESS ANY OF YOUR
        INFORMATION ACROSS THE ENTIRE APPLICATION, FUTURE COMMON GROUPS AND
        FUTURE COMMON EVENTS INCLUDED.
      </p>
      <ActionLink>Unblock</ActionLink>
    </>
  );
}

export function RelationCombinationBlockingBlocked({
  user,
  contact,
  session,
}: {
  user: User;
  contact: FoundContact;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <p className="mt-2 font-semibold text-red-500">
        <span className="text-black dark:text-white">
          YOU AND {user.user_username.toUpperCase()}
        </span>{" "}
        CAN NO LONGER ACCESS EACH OTHER&apos;S INFORMATION ACROSS THE ENTIRE
        APPLICATION, FUTURE COMMON GROUPS AND FUTURE COMMON EVENTS INCLUDED.
      </p>
      <UnblockIfThatsOKWithYouForm
        session={session}
        user={user}
        contact={contact}
      />
    </>
  );
}

export function RelationCombinationBlockingBlockedPreview({
  user,
}: {
  user: User;
}) {
  return (
    <>
      <p className="mt-2 font-semibold text-red-500">
        <span className="text-black dark:text-white">
          YOU AND {user.user_username.toUpperCase()}
        </span>{" "}
        CAN NO LONGER ACCESS EACH OTHER&apos;S INFORMATION ACROSS THE ENTIRE
        APPLICATION, FUTURE COMMON GROUPS AND FUTURE COMMON EVENTS INCLUDED.
      </p>
      <ActionLink>Unblock if it&apos;s OK with you</ActionLink>
    </>
  );
}

export function RelationCombinationFriendCustom({
  user,
  contact,
  session,
}: {
  user: User;
  contact: FoundContact;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <Suspense
        fallback={
          <>
            <p className="mt-2">Loading...</p>
          </>
        }
      >
        <ManyRelComboFriendCriteriaCustom user={user} contact={contact} />
        <ManyUserSharedToContactCustomAnswers user={user} contact={contact} />
      </Suspense>
      {/* if SENTIRL (session)
    AnnulIrlRequestForm
    else if ANNULIRL (session)
    AnnulledIrlCannotSend 
    else if mirror SENTIRL (user)
    DeclineIrlRequestForm
    AcceptIrlRequestForm
    else // even if mirror ANNULIRL (user)
    SendIrlRequestForm
    */}
      {contact.c2_contact_process_relationship === "SENTIRL" && (
        <>
          <AnnulIrlForm session={session} user={user} contact={contact} />
        </>
      )}
      {contact.c2_contact_process_relationship === "ANNULIRL" && (
        <>
          <p className="mt-2 text-gray-500 line-through">
            Upgrade friendship to irl
          </p>
        </>
      )}
      {contact.c1_contact_process_relationship === "SENTIRL" && (
        <>
          <p className="mt-2">
            <DeclineIrlForm session={session} user={user} contact={contact} />
            &nbsp;/&nbsp;
            <AcceptIrlForm session={session} user={user} contact={contact} />
          </p>
        </>
      )}
      {contact.c2_contact_process_relationship !== "SENTIRL" &&
        contact.c2_contact_process_relationship !== "ANNULIRL" &&
        contact.c1_contact_process_relationship !== "SENTIRL" && (
          <>
            {/* <UpgradeFriendshipToIrlForm user={user} contact={contact} /> */}
            <UpgradeToIrlForm session={session} user={user} contact={contact} />
          </>
        )}
      {contact.c2_contact_process_relationship !== "SENTIRL" && (
        <>
          <UnfriendForm session={session} user={user} contact={contact} />
        </>
      )}
      {/* <UnfriendForm user={user} contact={contact} /> */}
      {/* if SENTFRIEND (session)
    SentFriendDetails
    else if ANNULFRIEND (session)
    AnnulFriendDetails
    else if mirror SENTFRIEND (user)
    MirrorSentFriendDetails
    */}
      {contact.c2_contact_process_relationship === "SENTIRL" && (
        <>
          <p className="mt-2 text-orange-500">
            Irl upgrade request sent and pending. However, do take into
            consideration that canceling your irl upgrade request to{" "}
            {user.user_app_wide_name} will prevent you from sending{" "}
            {user.user_app_wide_name} another irl upgrade request at this time.
          </p>
        </>
      )}
      {contact.c2_contact_process_relationship === "ANNULIRL" && (
        <>
          <p className="mt-2 text-red-500">
            As a consequence of you annulling your irl upgrade request sent to{" "}
            {user.user_app_wide_name}, to prevent mass requesting you cannot
            send {user.user_app_wide_name} another irl upgrade request at this
            time.
          </p>
        </>
      )}
      {contact.c1_contact_process_relationship === "SENTIRL" && (
        <>
          <p className="mt-2 text-orange-500">
            {contact.u1_user_app_wide_name} has sent you an irl upgrade request.
            By accepting this request, {contact.u1_user_app_wide_name} will have
            additional access to all of your irl native criteria (such as Last
            name and Address), present and future, and you will have access to
            all the irl native criteria of {contact.u1_user_app_wide_name},
            present and future all the same. Once this friendship is upgraded,
            you can downgrade this friendship from irl with a click at your own
            discretion without requiring the consent of{" "}
            {contact.u1_user_app_wide_name}, so accepting this irl upgrade
            request is easily reversible.
          </p>
          <PageLink
            href={`/users/${contact.u2_user_username}/previews/queried?userlast=${contact.u1_user_username}&relcombo=irl`}
            name={`Preview the criteria you'll give access to ${contact.u1_user_app_wide_name}`}
          />
        </>
      )}
      {contact.c1_contact_process_relationship === "ANNULIRL" && (
        <>
          <p className="mt-2 text-neutral-500">
            (Just letting you know that {user.user_app_wide_name} has annulled
            an irl upgrade request, so you&apos;re the only one between the two
            of you who can initiate an irl upgrade request at this time.)
          </p>
        </>
      )}
    </>
  );
}

export function RelationCombinationFriendCustomQueried({
  user,
  contact,
}: {
  user: User;
  contact: GatheredContact;
}) {
  return (
    <>
      <Suspense
        fallback={
          <>
            <p className="mt-2">Loading...</p>
          </>
        }
      >
        <ManyRelComboFriendCriteriaCustom user={user} contact={contact} />
        <ManyUserSharedToContactCustomAnswers user={user} contact={contact} />
      </Suspense>
      <ActionLink>Upgrade friendship to irl</ActionLink>
      <ActionLink>Unfriend</ActionLink>
    </>
  );
}

export function RelationCombinationIrlCustom({
  user,
  contact,
  session,
}: {
  user: User;
  contact: FoundContact;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <Suspense
        fallback={
          <>
            <p className="mt-2">Loading...</p>
          </>
        }
      >
        <ManyRelComboIrlCriteriaCustom user={user} contact={contact} />
        <ManyUserSharedToContactCustomAnswers user={user} contact={contact} />
      </Suspense>
      <DowngradeFriendshipToIrlForm
        session={session}
        user={user}
        contact={contact}
      />
      <UnfriendForm session={session} user={user} contact={contact} />
    </>
  );
}

export function RelationCombinationIrlCustomQueried({
  user,
  contact,
}: {
  user: User;
  contact: GatheredContact;
}) {
  return (
    <>
      <Suspense
        fallback={
          <>
            <p className="mt-2">Loading...</p>
          </>
        }
      >
        <ManyRelComboIrlCriteriaCustom user={user} contact={contact} />
        <ManyUserSharedToContactCustomAnswers user={user} contact={contact} />
      </Suspense>
      <ActionLink>Downgrade friendship from irl</ActionLink>
      <ActionLink>Unfriend</ActionLink>
    </>
  );
}
