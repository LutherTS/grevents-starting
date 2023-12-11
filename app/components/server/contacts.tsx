import { fetchAllUserFriends } from "@/app/lib/data/contacts";
import { Friend } from "@/app/lib/definitions/contacts";
import { User } from "@/app/lib/definitions/users";

export function OneFriend({ contact }: { contact: Friend }) {
  return (
    <>
      <p className="pt-2">
        {contact.user_app_wide_name} / {contact.user_username}
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
          <p className="pt-2">Find their list of friend(s) below</p>
          <ol>
            {allUserFriends.map((userFriend) => {
              return (
                <li key={userFriend.contact_id}>
                  <OneFriend contact={userFriend} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}
