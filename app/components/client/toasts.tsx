"use client";

import { resetContactStatusPersonalInfo } from "@/app/lib/actions/contacts";
import {
  resetUserStatusDashboard,
  resetUserStatusPersonalInfo,
} from "@/app/lib/actions/users";
import { FoundContact } from "@/app/lib/definitions/contacts";
import { User } from "@/app/lib/definitions/users";
import { useFormStatus } from "react-dom";

export function ToastForm({
  action,
  children,
}: {
  action: (...rest: any) => any;
  children: React.ReactNode;
}) {
  return (
    <>
      <form className="mb-2" action={action}>
        {children}
      </form>
    </>
  );
}

export function ToastChild({ children }: { children: React.ReactNode }) {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className="text-green-500 disabled:text-gray-500"
      >
        {children}
      </button>
    </>
  );
}

export function UserAppWideNameUpdated({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusDashboard(user)}>
        <ToastChild>App-wide name updated</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserFriendCodeUpdated({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusDashboard(user)}>
        <ToastChild>Friend code updated</ToastChild>
      </ToastForm>
    </>
  );
}

export function AnswerValueUpdated({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Answer value updated</ToastChild>
      </ToastForm>
    </>
  );
}

export function AnswerValueDeleted({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Answer value deleted</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserQuestionPinned({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Criteria pinned</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserQuestionUnpinned({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Criteria unpinned</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserQuestionFriendCreated({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Criteria shared to friend</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserQuestionFriendDeleted({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Criteria unshared to friend</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserQuestionUppedToIrl({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Pseudonative criteria upped to irl</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserQuestionDownedToIrl({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Pseudonative criteria downed from irl</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserNativeCriteriaNotIrlAdded({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Native criteria added</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserNativeCriteriaIrlAdded({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Native irl criteria added</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserPseudonativeCriteriaNotIrlAdded({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Pseudonative criteria added</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserPseudonativeCriteriaIrlAdded({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Pseudonative irl criteria added</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserCustomCriteriaAdded({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Custom criteria added</ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactFirstAccessThroughFind({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusPersonalInfo(contact, user)}>
        <ToastChild>{user.user_app_wide_name}&apos;s profile found</ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactReaccessThroughFind({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusPersonalInfo(contact, user)}>
        <ToastChild>
          {user.user_app_wide_name}&apos;s profile found once more
        </ToastChild>
      </ToastForm>
    </>
  );
}
