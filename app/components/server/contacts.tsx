"use server";

import {
  fetchAllUserFriendsNotToUserQuestion,
  fetchAllUserIrlFriends,
  fetchAllUserNotIrlFriends,
  fetchAllUserWhoHaveMeBlocked,
  fetchAllUserWhoIAmBlocking,
  findSentFriendFromContactsByUser,
  findSentFriendToContactsByUser,
  findSentIrlFromContactsByUser,
  findSentIrlToContactsByUser,
} from "@/app/lib/data/contacts";
import { Block, FoundContact, Friend } from "@/app/lib/definitions/contacts";
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
      <p className="mt-2 font-semibold text-zinc-500">
        Friends (not upgraded to irl)
      </p>
      {allUserNotIrlFriends.length > 0 ? (
        <>
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
      <p className="mt-2 font-semibold text-zinc-500">Upgraded to irl</p>
      {allUserIrlFriends.length > 0 ? (
        <>
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
      <p className="mt-2 font-semibold text-zinc-500">Blocked users</p>
      {allUserWhoIAmBlocking.length > 0 ? (
        <>
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
      <p className="mt-2 font-semibold text-zinc-500">
        Users that have me blocked
      </p>
      {allUserWhoHaveMeBlocked.length > 0 ? (
        <>
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

export async function OneSentToContact({ contact }: { contact: FoundContact }) {
  return (
    <>
      <p className="mt-2">
        <Link
          href={`/users/${contact.u2_user_username}/profile`}
          className="font-semibold text-blue-500 hover:text-blue-400 dark:hover:text-blue-600"
        >
          {contact.u2_user_app_wide_name}
        </Link>{" "}
        / {contact.u2_user_username}
      </p>
    </>
  );
}

export async function ManySentFriendToContacts({ user }: { user: User }) {
  const sentFriendToContacts = await findSentFriendToContactsByUser(user);

  return (
    <>
      <p className="mt-2 font-semibold text-zinc-500">Friend requests sent</p>
      {sentFriendToContacts.length > 0 ? (
        <>
          <ol>
            {sentFriendToContacts.map((sentFriendToContact) => {
              return (
                <li key={sentFriendToContact.c1_contact_id}>
                  <OneSentToContact contact={sentFriendToContact} />
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="mt-2">You have not sent any friend requests.</p>
      )}
    </>
  );
}

export async function ManySentIrlToContacts({ user }: { user: User }) {
  const sentIrlToContacts = await findSentIrlToContactsByUser(user);

  return (
    <>
      <p className="mt-2 font-semibold text-zinc-500">
        Irl upgrade requests sent
      </p>
      {sentIrlToContacts.length > 0 ? (
        <>
          <ol>
            {sentIrlToContacts.map((sentIrlToContact) => {
              return (
                <li key={sentIrlToContact.c1_contact_id}>
                  <OneSentToContact contact={sentIrlToContact} />
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="mt-2">You have not sent any irl upgrade requests.</p>
      )}
    </>
  );
}

export async function OneSentFromContact({
  contact,
}: {
  contact: FoundContact;
}) {
  return (
    <>
      <p className="mt-2">
        <Link
          href={`/users/${contact.u1_user_username}/profile`}
          className="font-semibold text-blue-500 hover:text-blue-400 dark:hover:text-blue-600"
        >
          {contact.u1_user_app_wide_name}
        </Link>{" "}
        / {contact.u1_user_username}
      </p>
    </>
  );
}

export async function ManySentFriendFromContacts({ user }: { user: User }) {
  const sentFriendFromContacts = await findSentFriendFromContactsByUser(user);

  return (
    <>
      <p className="mt-2 font-semibold text-zinc-500">
        Friend requests received
      </p>
      {sentFriendFromContacts.length > 0 ? (
        <>
          <ol>
            {sentFriendFromContacts.map((sentFriendFromContact) => {
              return (
                <li key={sentFriendFromContact.c1_contact_id}>
                  <OneSentFromContact contact={sentFriendFromContact} />
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="mt-2">You have not received any friend requests.</p>
      )}
    </>
  );
}

export async function ManySentIrlFromContacts({ user }: { user: User }) {
  const sentIrlFromContacts = await findSentIrlFromContactsByUser(user);

  return (
    <>
      <p className="mt-2 font-semibold text-zinc-500">
        Irl upgrade requests received
      </p>
      {sentIrlFromContacts.length > 0 ? (
        <>
          <ol>
            {sentIrlFromContacts.map((sentIrlFromContact) => {
              return (
                <li key={sentIrlFromContact.c1_contact_id}>
                  <OneSentFromContact contact={sentIrlFromContact} />
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="mt-2">You have not received any irl upgrade requests.</p>
      )}
    </>
  );
}
