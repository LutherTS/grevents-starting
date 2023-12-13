import {
  fetchAllUserFriends,
  fetchAllUserContacts,
} from "@/app/lib/data/contacts";
import { Friend, Contact } from "@/app/lib/definitions/contacts";
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

export function OneContact({ contact }: { contact: Contact }) {
  return (
    <>
      <p className="pt-2">{contact.user_username}</p>
    </>
  );
}

export async function ManyContacts({ user }: { user: User }) {
  // No longer in use.
  const allUserContacts = await fetchAllUserContacts(user);

  return (
    <>
      <p className="pt-2">
        Select a user you're acquainted with. (userlast in searchParams.)
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
        <p className="pt-2">You aren't acquainted with any user.</p>
      )}
    </>
  );
}
