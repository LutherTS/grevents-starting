import {
  countUserQuestionFriends,
  fetchAllUserQuestionFriends,
} from "@/app/lib/data/userquestionfriends";
import { UserQuestion } from "@/app/lib/definitions/userquestions";
import { UserQuestionFriend } from "@/app/lib/definitions/userquestionfriends";

export async function ManyUserQuestionFriendsLabel({
  userQuestion,
}: {
  userQuestion: UserQuestion;
}) {
  const userQuestionFriendsCount = await countUserQuestionFriends(userQuestion);

  return (
    <>
      {userQuestionFriendsCount >= 2 ? (
        <p className="mt-2">
          Shared with the following friends ({userQuestionFriendsCount})
        </p>
      ) : (
        <p className="mt-2">
          Shared with the following friend ({userQuestionFriendsCount})
        </p>
      )}
    </>
  );
}

export function OneUserQuestionFriend({
  userQuestionFriend,
}: {
  userQuestionFriend: UserQuestionFriend;
}) {
  return (
    <>
      <p className="mt-2">
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
  const allUserQuestionFriends =
    await fetchAllUserQuestionFriends(userQuestion);

  return (
    <>
      {allUserQuestionFriends.length > 0 && (
        <>
          <ManyUserQuestionFriendsLabel userQuestion={userQuestion} />
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
