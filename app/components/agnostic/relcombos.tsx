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
import { ActionLink } from "./links";
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
  SendFriendRequestForm,
  UnblockForm,
  UnblockIfThatsOKWithYouForm,
  UnfriendForm,
  UpgradeFriendshipToIrlForm,
} from "../client/forms";

export function RelationCombinationNone({
  user,
  contact,
}: {
  user: User;
  contact: FoundContact;
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
          <AnnulFriendForm user={user} contact={contact} />
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
            <DeclineFriendForm user={user} contact={contact} />
            &nbsp;/&nbsp;
            <AcceptFriendForm user={user} contact={contact} />
          </p>
        </>
      )}
      {contact.c2_contact_process_relationship !== "SENTFRIEND" &&
        contact.c2_contact_process_relationship !== "ANNULFRIEND" &&
        contact.c1_contact_process_relationship !== "SENTFRIEND" && (
          <>
            <SendFriendRequestForm user={user} contact={contact} />
          </>
        )}
      <BlockForm user={user} contact={contact} />
      {/* if SENTFRIEND (session)
    SentFriendDetails
    else if ANNULFRIEND (session)
    AnnulFriendDetails
    else if mirror SENTFRIEND (user)
    MirrorSentFriendDetails
     */}
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
}: {
  user: User;
  contact: FoundContact;
}) {
  return (
    <>
      <p className="mt-2 font-semibold text-red-500">
        YOU CAN NO LONGER ACCESS ANY OF THE INFORMATION OF{" "}
        {user.user_username.toUpperCase()} ACROSS THE ENTIRE APPLICATION, FUTURE
        COMMON GROUPS AND FUTURE COMMON EVENTS INCLUDED.
      </p>
      <BlockBackForm user={user} contact={contact} />
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
}: {
  user: User;
  contact: FoundContact;
}) {
  return (
    <>
      <p className="mt-2 font-semibold">
        {user.user_username.toUpperCase()} CAN NO LONGER ACCESS ANY OF YOUR
        INFORMATION ACROSS THE ENTIRE APPLICATION, FUTURE COMMON GROUPS AND
        FUTURE COMMON EVENTS INCLUDED.
      </p>
      <UnblockForm user={user} contact={contact} />
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
}: {
  user: User;
  contact: FoundContact;
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
      <UnblockIfThatsOKWithYouForm user={user} contact={contact} />
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
}: {
  user: User;
  contact: FoundContact;
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
          <AnnulIrlForm user={user} contact={contact} />
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
            <DeclineIrlForm user={user} contact={contact} />
            &nbsp;/&nbsp;
            <AcceptIrlForm user={user} contact={contact} />
          </p>
        </>
      )}
      {contact.c2_contact_process_relationship !== "SENTIRL" &&
        contact.c2_contact_process_relationship !== "ANNULIRL" &&
        contact.c1_contact_process_relationship !== "SENTIRL" && (
          <>
            <UpgradeFriendshipToIrlForm user={user} contact={contact} />
          </>
        )}
      <UnfriendForm user={user} contact={contact} />
      {/* if SENTFRIEND (session)
    SentFriendDetails
    else if ANNULFRIEND (session)
    AnnulFriendDetails
    else if mirror SENTFRIEND (user)
    MirrorSentFriendDetails
     */}
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
}: {
  user: User;
  contact: FoundContact;
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
      <DowngradeFriendshipToIrlForm user={user} contact={contact} />
      <UnfriendForm user={user} contact={contact} />
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
