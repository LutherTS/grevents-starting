"use client";

import {
  resetUserStatusDashboard,
  resetUserStatusPersonalInfo,
} from "@/app/lib/actions/users";
import { User } from "@/app/lib/definitions/users";

export function Toast({
  action,
  children,
}: {
  action: (...rest: any) => any;
  children: React.ReactNode;
}) {
  return (
    <>
      <button onClick={action}>{children}</button>
    </>
  );
}

export function UserAppWideNameUpdated({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusDashboard(user)}>
        <p className="mb-2 text-green-500">App-wide name updated</p>
      </Toast>
    </>
  );
}

export function UserFriendCodeUpdated({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusDashboard(user)}>
        <p className="mb-2 text-green-500">Friend code updated</p>
      </Toast>
    </>
  );
}

export function AnswerValueUpdated({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">Answer value updated</p>
      </Toast>
    </>
  );
}

export function AnswerValueDeleted({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">Answer value deleted</p>
      </Toast>
    </>
  );
}

export function UserQuestionPinned({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">Criteria pinned</p>
      </Toast>
    </>
  );
}

export function UserQuestionUnpinned({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">Criteria unpinned</p>
      </Toast>
    </>
  );
}

export function UserQuestionFriendCreated({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">Criteria shared to friend</p>
      </Toast>
    </>
  );
}

export function UserQuestionFriendDeleted({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">Criteria unshared to friend</p>
      </Toast>
    </>
  );
}

export function UserQuestionUppedToIrl({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">
          Pseudonative criteria upped to irl
        </p>
      </Toast>
    </>
  );
}

export function UserQuestionDownedToIrl({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">
          Pseudonative criteria downed from irl
        </p>
      </Toast>
    </>
  );
}

export function UserNativeCriteriaNotIrlAdded({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">Native criteria added</p>
      </Toast>
    </>
  );
}

export function UserNativeCriteriaIrlAdded({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">Native criteria irl added</p>
      </Toast>
    </>
  );
}

export function UserPseudonativeCriteriaNotIrlAdded({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusPersonalInfo(user)}>
        <p className="mb-2 text-green-500">Pseudonative criteria added</p>
      </Toast>
    </>
  );
}
