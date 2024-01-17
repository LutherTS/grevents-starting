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
} from "@/app/libraries/data/contacts";
import { User } from "@/app/libraries/definitions/users";
import { UserQuestion } from "@/app/libraries/definitions/userquestions";
import {
  OneBlock,
  OneFriend,
  OneFriendAddable,
  OneSentFromContact,
  OneSentToContact,
} from "../../agnostic/database/contacts";
import {
  ManyPaginatedFriendsAddable,
  ManyPaginatedIrlFriends,
  ManyPaginatedNotIrlFriends,
  ManyPaginatedSentFriendFromContacts,
  ManyPaginatedSentFriendToContacts,
  ManyPaginatedSentIrlFromContacts,
  ManyPaginatedSentIrlToContacts,
  ManyPaginatedWhoHaveMeBlocked,
  ManyPaginatedWhoIAmBlocking,
} from "../../client/database/contacts";

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
          {allUserFriends.length <= 4 ? (
            <>
              <p className="mt-2 font-semibold text-zinc-500">
                Find your list of friend(s) to share to below
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
          ) : (
            <>
              <p className="mt-2 font-semibold text-zinc-500">
                Find your list of friend(s) to share to below
              </p>
              <ManyPaginatedFriendsAddable
                userQuestion={userQuestion}
                userFriends={allUserFriends}
              />
            </>
          )}
        </>
      )}
      {allUserFriends.length === 0 && (
        <>
          <p className="mt-2 font-semibold text-zinc-500">
            Find your list of friend(s) to share to below
          </p>
          <p className="mt-2">No remaining friends yet.</p>
        </>
      )}
    </>
  );
}

// all below to be tested
// but non-breaking in current 0 & <= 4 cases

export async function ManyNotIrlFriends({ user }: { user: User }) {
  const allUserNotIrlFriends = await fetchAllUserNotIrlFriends(user);

  return (
    <>
      <p className="mt-2 font-semibold text-zinc-500">
        Friends (not upgraded to irl)
      </p>
      {allUserNotIrlFriends.length > 0 && (
        <>
          {allUserNotIrlFriends.length <= 4 ? (
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
            <ManyPaginatedNotIrlFriends
              userNotIrlFriends={allUserNotIrlFriends}
            />
          )}
        </>
      )}
      {allUserNotIrlFriends.length === 0 && (
        <>
          <p className="mt-2">You do not have any not irl friends.</p>
        </>
      )}
    </>
  );
}

export async function ManyIrlFriends({ user }: { user: User }) {
  const allUserIrlFriends = await fetchAllUserIrlFriends(user);

  return (
    <>
      <p className="mt-2 font-semibold text-zinc-500">Upgraded to irl</p>
      {allUserIrlFriends.length > 0 && (
        <>
          {allUserIrlFriends.length <= 4 ? (
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
            <ManyPaginatedIrlFriends userIrlFriends={allUserIrlFriends} />
          )}
        </>
      )}
      {allUserIrlFriends.length === 0 && (
        <>
          <p className="mt-2">You do not have any irl friends.</p>
        </>
      )}
    </>
  );
}

export async function ManyWhoIAmBlocking({ user }: { user: User }) {
  const allUserWhoIAmBlocking = await fetchAllUserWhoIAmBlocking(user);

  return (
    <>
      <p className="mt-2 font-semibold text-zinc-500">Blocked users</p>
      {allUserWhoIAmBlocking.length > 0 && (
        <>
          {allUserWhoIAmBlocking.length <= 4 ? (
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
            <ManyPaginatedWhoIAmBlocking
              userWhoIAmBlocking={allUserWhoIAmBlocking}
            />
          )}
        </>
      )}
      {allUserWhoIAmBlocking.length === 0 && (
        <>
          <p className="mt-2">You do not have any blocked users.</p>
        </>
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
      {allUserWhoHaveMeBlocked.length > 0 && (
        <>
          {allUserWhoHaveMeBlocked.length <= 4 ? (
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
            <ManyPaginatedWhoHaveMeBlocked
              userWhoHaveMeBlocked={allUserWhoHaveMeBlocked}
            />
          )}
        </>
      )}
      {allUserWhoHaveMeBlocked.length === 0 && (
        <>
          <p className="mt-2">
            You do not have any users that have you blocked.
          </p>
        </>
      )}
    </>
  );
}

export async function ManySentFriendToContacts({ user }: { user: User }) {
  const sentFriendToContacts = await findSentFriendToContactsByUser(user);

  return (
    <>
      <p className="mt-2 font-semibold text-zinc-500">Friend requests sent</p>
      {sentFriendToContacts.length > 0 && (
        <>
          {sentFriendToContacts.length <= 4 ? (
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
            <ManyPaginatedSentFriendToContacts
              sentFriendToContacts={sentFriendToContacts}
            />
          )}
        </>
      )}
      {sentFriendToContacts.length === 0 && (
        <>
          <p className="mt-2">You have not sent any friend requests.</p>
        </>
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
      {sentIrlToContacts.length > 0 && (
        <>
          {sentIrlToContacts.length <= 4 ? (
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
            <ManyPaginatedSentIrlToContacts
              sentIrlToContacts={sentIrlToContacts}
            />
          )}
        </>
      )}
      {sentIrlToContacts.length === 0 && (
        <>
          <p className="mt-2">You have not sent any irl friend requests.</p>
        </>
      )}
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
      {sentFriendFromContacts.length > 0 && (
        <>
          {sentFriendFromContacts.length <= 4 ? (
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
            <ManyPaginatedSentFriendFromContacts
              sentFriendFromContacts={sentFriendFromContacts}
            />
          )}
        </>
      )}
      {sentFriendFromContacts.length === 0 && (
        <>
          <p className="mt-2">You have not received any friend requests.</p>
        </>
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
      {sentIrlFromContacts.length > 0 && (
        <>
          {sentIrlFromContacts.length <= 4 ? (
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
            <ManyPaginatedSentIrlFromContacts
              sentIrlFromContacts={sentIrlFromContacts}
            />
          )}
        </>
      )}
      {sentIrlFromContacts.length === 0 && (
        <>
          <p className="mt-2">
            You have not received any irl upgrade requests.
          </p>
        </>
      )}
    </>
  );
}
