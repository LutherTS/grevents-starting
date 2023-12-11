import { fetchAllUserQuestionFriends } from "@/app/lib/data/userquestionfriends";
import { UserQuestion } from "@/app/lib/definitions/userquestions";
import { UserQuestionFriend } from "@/app/lib/definitions/userquestionfriends";

export function OneUserQuestionFriend({
  userQuestionFriend,
}: {
  userQuestionFriend: UserQuestionFriend;
}) {
  return (
    <>
      <p className="pt-2">
        {userQuestionFriend.user_app_wide_name} /{" "}
        {userQuestionFriend.user_username}
      </p>
    </>
  );
}

export async function ManyUserQuestionFriends({
  userQuestion,
}: {
  userQuestion: UserQuestion;
}) {
  // userQuestion
  const allUserQuestionFriends = await fetchAllUserQuestionFriends(
    userQuestion
  );

  return (
    <>
      {allUserQuestionFriends.length > 0 && (
        <>
          <p className="pt-2">User criteria shared to the friends below.</p>
          <ol>
            {allUserQuestionFriends.map((userQuestionFriend) => {
              return (
                <li key={userQuestionFriend.userquestionfriend_id}>
                  <OneUserQuestionFriend
                    userQuestionFriend={userQuestionFriend}
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
