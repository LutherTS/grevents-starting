"use client";

import {
  resetContactStatusOtherProfile,
  resetContactStatusRelationship,
} from "@/app/libraries/actions/contacts";
import {
  resetUserStatusDashboard,
  resetUserStatusPersonalInfo,
  resetUserStatusTitle,
} from "@/app/libraries/actions/users";
import { FoundContact } from "@/app/libraries/definitions/contacts";
import { User } from "@/app/libraries/definitions/users";
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

export function UserDeactivated({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusDashboard(user)}>
        <ToastChild>You&apos;ve deactivated your profile</ToastChild>
      </ToastForm>
    </>
  );
}

export function UserReactivated({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusDashboard(user)}>
        <ToastChild>You&apos;ve reactivated your profile</ToastChild>
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

// for now only on Standardized since only for "Email address"
export function UserCriteriaHidden({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Criteria hidden</ToastChild>
      </ToastForm>
    </>
  );
}

// for now only on Standardized since only for "Email address"
export function UserCriteriaRevealed({ user }: { user: User }) {
  return (
    <>
      <ToastForm action={() => resetUserStatusPersonalInfo(user)}>
        <ToastChild>Criteria revealed</ToastChild>
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

export function ContactUserQuestionFriendPinned({
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
          {user.user_app_wide_name}&apos;s criteria pinned for you
        </ToastChild>
      </ToastForm>
    </>
  );
}

export function ContactUserQuestionFriendUnpinned({
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
          {user.user_app_wide_name}&apos;s criteria unpinned for you
        </ToastChild>
      </ToastForm>
    </>
  );
}

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

export function WelcomeForm({
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

export function WelcomeChild({ children }: { children: React.ReactNode }) {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className="text-yellow-500 disabled:text-gray-500"
      >
        {children}
      </button>
    </>
  );
}

export function UserWelcomeToGrevents({ user }: { user: User }) {
  return (
    <>
      <WelcomeForm action={() => resetUserStatusTitle(user)}>
        <WelcomeChild>Welcome to Grevents</WelcomeChild>
      </WelcomeForm>
    </>
  );
}

export function UserWelcomeBackToGrevents({ user }: { user: User }) {
  return (
    <>
      <WelcomeForm action={() => resetUserStatusTitle(user)}>
        <WelcomeChild>Welcome back to Grevents</WelcomeChild>
      </WelcomeForm>
    </>
  );
}
