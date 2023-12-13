import {
  fetchAllUserFriends,
  fetchAllUserIrlFriends,
  fetchAllUserNotIrlFriends,
  fetchAllUserWhoHaveMeBlocked,
  fetchAllUserWhoIAmBlocking,
  // fetchAllUserContacts,
} from "@/app/lib/data/contacts";
import {
  Block,
  Friend,
  // Contact
} from "@/app/lib/definitions/contacts";
import { User } from "@/app/lib/definitions/users";

export function OneFriend({ friend }: { friend: Friend }) {
  return (
    <>
      <p className="pt-2">
        {friend.user_app_wide_name} / {friend.user_username}
      </p>
    </>
  );
}

export async function ManyFriends({ user }: { user: User }) {
  const allUserFriends = await fetchAllUserFriends(user);

  return (
    <>
      {allUserFriends.length > 0 && (
        <>
          <p className="pt-2">Find your list of friend(s) below</p>
          <ol>
            {allUserFriends.map((userFriend) => {
              return (
                <li key={userFriend.contact_id}>
                  <OneFriend friend={userFriend} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

/* No longer in use.
export function OneContact({ contact }: { contact: Contact }) {
  return (
    <>
      <p className="pt-2">{contact.user_username}</p>
    </>
  );
}


export async function ManyContacts({ user }: { user: User }) {
  const allUserContacts = await fetchAllUserContacts(user);

  return (
    <>
      <p className="pt-2">
        Select a user you&apos;re acquainted with. (userlast in searchParams.)
      </p>
      {allUserContacts.length > 0 ? (
        <ol>
          {allUserContacts.map((userContact) => {
            return (
              <li key={userContact.contact_id}>
                <OneContact contact={userContact} />
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="pt-2">You aren&apos;t acquainted with any user.</p>
      )}
    </>
  );
}
*/

export async function ManyNotIrlFriends({ user }: { user: User }) {
  const allUserNotIrlFriends = await fetchAllUserNotIrlFriends(user);

  return (
    <>
      {allUserNotIrlFriends.length > 0 ? (
        <>
          <p className="pt-2">Friends (not upgraded to irl)</p>
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
        <p className="pt-2">You do not have any not irl friends.</p>
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
          <p className="pt-2">Upgraded to irl</p>
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
        <p className="pt-2">You do not have any irl friends.</p>
      )}
    </>
  );
}

export function OneBlock({ block }: { block: Block }) {
  return (
    <>
      <p className="pt-2">
        {block.user_app_wide_name} / {block.user_username}
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
          <p className="pt-2">Blocked users</p>
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
        <p className="pt-2">You do not have any blocked users.</p>
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
          <p className="pt-2">Blocked users</p>
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
        <p className="pt-2">You do not have any users that have you blocked.</p>
      )}
    </>
  );
}
