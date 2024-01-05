"use client";

import {
  resetContactStatusOtherProfile,
  resetContactStatusRelationship,
} from "@/app/lib/actions/contacts";
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
      <ToastForm action={() => resetContactStatusOtherProfile(contact, user)}>
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
      <ToastForm action={() => resetContactStatusOtherProfile(contact, user)}>
        <ToastChild>
          {user.user_app_wide_name}&apos;s profile found once more
        </ToastChild>
      </ToastForm>
    </>
  );
}

// Penser à mettre en place un label dynamique sur les toasts comme précédemment avec les answers.

export function ContactNowFriends({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You are now friends with {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactNowIrls({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You are now irl friends with {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactNoLongerFriends({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You are no longer friends with {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactNoLongerIrls({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You are no longer irl friends with {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactNowBlocking({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just blocked {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactNowUnblocking({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just unblocked {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactNowBlocked({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just been blocked by {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactNowUnblocked({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just been unblocked by {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactSentFriend({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just sent a friend request to {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactSentIrl({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just sent an irl request to {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactAnnulFriend({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just annulled your friend request to{" "}
          {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactAnnulIrl({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just annulled your irl request to{" "}
          {user.user_app_wide_name}
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactReceiveFriend({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          {user.user_app_wide_name} has just sent you a friend request
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactReceiveIrl({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          {user.user_app_wide_name} has just sent you an irl upgrade request
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactRefusedFriend({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just refused {user.user_app_wide_name}&apos;s friend
          request
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactRefusedIrl({
  contact,
  user,
}: {
  contact: FoundContact;
  user: User;
}) {
  return (
    <>
      <ToastForm action={() => resetContactStatusRelationship(contact, user)}>
        <ToastChild>
          You&apos;ve just refused {user.user_app_wide_name}&apos;s irl upgrade
          request
        </ToastChild>
      </ToastForm>
    </>
  );
}
