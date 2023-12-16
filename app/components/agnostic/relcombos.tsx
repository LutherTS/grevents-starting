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

export function RelationCombinationNone() {
  // { user }: { user: User } // currently not required
  return (
    <>
      <ActionLink>Send friend request</ActionLink>
      <ActionLink>Block</ActionLink>
    </>
  );
}

export function RelationCombinationFriend({ user }: { user: User }) {
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

export function RelationCombinationIrl({ user }: { user: User }) {
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

export function RelationCombinationIAmBlocking({ user }: { user: User }) {
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

export function RelationCombinationHasMeBlocked({ user }: { user: User }) {
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

export function RelationCombinationBlockingBlocked({ user }: { user: User }) {
  return (
    <>
      <p className="mt-2 font-semibold text-red-500">
        <span className="text-black dark:text-white">
          YOU AND {user.user_username.toUpperCase()}
        </span>{" "}
        CAN NO LONGER ACCESS EACH OTHER&apos;S INFORMATION ACROSS THE ENTIRE
        APPLICATION, FUTURE COMMON GROUPS AND FUTURE COMMON EVENTS INCLUDED.
      </p>
      <ActionLink>Unblock if that&apos;s OK with you</ActionLink>
    </>
  );
}

export function RelationCombinationFriendCustom({
  user,
  contact,
}: {
  user: User;
  contact: GatheredContact | FoundContact;
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
  contact: GatheredContact | FoundContact;
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
