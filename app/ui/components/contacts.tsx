import { fetchAllUserFriends } from "@/app/lib/data/contacts";
import { User } from "@/app/lib/definitions/users";

export function OneFriend({ contact }: { contact: any }) {
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
          <p className="pt-2">Find their list of friends below.</p>
          <ol>
            {allUserFriends.map((userFriend) => {
              return (
                <li key={userFriend.answer_id}>
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
