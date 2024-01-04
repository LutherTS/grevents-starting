"use server";

import {
  fetchAllUserFriendsNotToUserQuestion,
  fetchAllUserIrlFriends,
  fetchAllUserNotIrlFriends,
  fetchAllUserWhoHaveMeBlocked,
  fetchAllUserWhoIAmBlocking,
} from "@/app/lib/data/contacts";
import { Block, Friend } from "@/app/lib/definitions/contacts";
import { User } from "@/app/lib/definitions/users";
import { UserQuestion } from "@/app/lib/definitions/userquestions";
import { ButtonAddUserQuestionFriendForm } from "../client/forms";
import Link from "next/link";

export async function OneFriend({ friend }: { friend: Friend }) {
  return (
    <>
      <p className="mt-2">
        <Link
          href={`/users/${friend.user_username}/profile`}
          className="font-semibold text-blue-500 hover:text-blue-400 dark:hover:text-blue-600"
        >
          {friend.user_app_wide_name}
        </Link>{" "}
        / {friend.user_username}
      </p>
    </>
  );
}

export async function OneFriendAddable({
  friend,
  userQuestion,
}: {
  friend: Friend;
  userQuestion: UserQuestion;
}) {
  return (
    <>
      <div className="mt-2 flex justify-center">
        <ButtonAddUserQuestionFriendForm
          contact={friend}
          userQuestion={userQuestion}
        />
        <p>
          <span className="font-semibold">{friend.user_app_wide_name}</span> /{" "}
          {friend.user_username}
        </p>
      </div>
    </>
  );
}

export async function ManyFriendsAddable({
  user,
  userQuestion,
}: {
  user: User;
  userQuestion: UserQuestion;
}) {
  const allUserFriends = await fetchAllUserFriendsNotToUserQuestion(
    user,
    userQuestion,
  );

  return (
    <>
      {allUserFriends.length > 0 && (
        <>
          <p className="mt-2 font-semibold text-zinc-500">
            Find your list of friend(s) below
          </p>
          <ol>
            {allUserFriends.map((userFriend) => {
              return (
                <li key={userFriend.contact_id}>
                  <OneFriendAddable
                    friend={userFriend}
                    userQuestion={userQuestion}
                  />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyNotIrlFriends({ user }: { user: User }) {
  const allUserNotIrlFriends = await fetchAllUserNotIrlFriends(user);

  return (
    <>
      {allUserNotIrlFriends.length > 0 ? (
        <>
          <p className="mt-2 font-semibold text-zinc-500">
            Friends (not upgraded to irl)
          </p>
          <ol>
            {allUserNotIrlFriends.map((notIrlFriend) => {
              return (
                <li key={notIrlFriend.contact_id}>
                  <OneFriend friend={notIrlFriend} />
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="mt-2">You do not have any not irl friends.</p>
      )}
    </>
  );
}

export async function ManyIrlFriends({ user }: { user: User }) {
  const allUserIrlFriends = await fetchAllUserIrlFriends(user);

  return (
    <>
      {allUserIrlFriends.length > 0 ? (
        <>
          <p className="mt-2 font-semibold text-zinc-500">Upgraded to irl</p>
          <ol>
            {allUserIrlFriends.map((irlFriend) => {
              return (
                <li key={irlFriend.contact_id}>
                  <OneFriend friend={irlFriend} />
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="mt-2">You do not have any irl friends.</p>
      )}
    </>
  );
}

export async function OneBlock({ block }: { block: Block }) {
  return (
    <>
      <p className="mt-2">
        <Link
          href={`/users/${block.user_username}/profile`}
          className="font-semibold text-blue-500 hover:text-blue-400 dark:hover:text-blue-600"
        >
          {block.user_app_wide_name}
        </Link>{" "}
        / {block.user_username}
      </p>
    </>
  );
}

export async function ManyWhoIAmBlocking({ user }: { user: User }) {
  const allUserWhoIAmBlocking = await fetchAllUserWhoIAmBlocking(user);

  return (
    <>
      {allUserWhoIAmBlocking.length > 0 ? (
        <>
          <p className="mt-2 font-semibold text-zinc-500">Blocked users</p>
          <ol>
            {allUserWhoIAmBlocking.map((whoIAmBlocking) => {
              return (
                <li key={whoIAmBlocking.contact_id}>
                  <OneBlock block={whoIAmBlocking} />
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="mt-2">You do not have any blocked users.</p>
      )}
    </>
  );
}

export async function ManyWhoHaveMeBlocked({ user }: { user: User }) {
  const allUserWhoHaveMeBlocked = await fetchAllUserWhoHaveMeBlocked(user);

  return (
    <>
      {allUserWhoHaveMeBlocked.length > 0 ? (
        <>
          <p className="mt-2 font-semibold text-zinc-500">
            Users that have me blocked
          </p>
          <ol>
            {allUserWhoHaveMeBlocked.map((whoHaveMeBlocked) => {
              return (
                <li key={whoHaveMeBlocked.contact_id}>
                  <OneBlock block={whoHaveMeBlocked} />
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="mt-2">You do not have any users that have you blocked.</p>
      )}
    </>
  );
}
