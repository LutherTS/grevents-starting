import { User } from "@/app/lib/definitions/users";
import { Suspense } from "react";
import {
  ManyRelComboFriendCriteria,
  ManyRelComboIrlCriteria,
} from "../server/answers";

export function RelationCombinationNone() {
  // { user }: { user: User }
  return (
    <>
      <p className="mt-2">Send friend request</p>
      <p className="mt-2">Block</p>
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
      <p className="mt-2">Upgrade friendship to irl</p>
      <p className="mt-2">Unfriend</p>
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
      <p className="mt-2">Downgrade friendship from irl</p>
      <p className="mt-2">Unfriend</p>
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
      <p className="mt-2">Block them back</p>
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
      <p className="mt-2">Unblock</p>
    </>
  );
}

export function RelationCombinationBlockingBlocked({ user }: { user: User }) {
  return (
    <>
      <p className="mt-2 font-semibold text-red-500">
        <span className="text-black: dark:text-white">
          YOU AND {user.user_username.toUpperCase()}
        </span>{" "}
        CAN NO LONGER ACCESS EACH OTHER&apos;S INFORMATION ACROSS THE ENTIRE
        APPLICATION, FUTURE COMMON GROUPS AND FUTURE COMMON EVENTS INCLUDED.
      </p>
      <p className="mt-2">Unblock if that&apos;s OK with you</p>
    </>
  );
}
