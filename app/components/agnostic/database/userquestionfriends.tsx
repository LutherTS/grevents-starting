import { UserQuestionFriend } from "@/app/libraries/definitions/userquestionfriends";
import { UserQuestion } from "@/app/libraries/definitions/userquestions";
import { ButtonCancelShareUserQuestionFriendForm } from "../../client/forms";

export function ManyUserQuestionFriendsLabel({
  userQuestionFriends,
}: {
  userQuestionFriends: UserQuestionFriend[];
}) {
  return (
    <>
      {userQuestionFriends.length >= 2 ? (
        <p className="mt-2 font-semibold text-zinc-500">
          Shared with the following friends ({userQuestionFriends.length})
        </p>
      ) : (
        <p className="mt-2 font-semibold text-zinc-500">
          Shared with the following friend ({userQuestionFriends.length})
        </p>
      )}
    </>
  );
}

export function OneUserQuestionFriend({
  userQuestion,
  userQuestionFriend,
}: {
  userQuestion: UserQuestion;
  userQuestionFriend: UserQuestionFriend;
}) {
  return (
    <>
      <div className="mt-2 flex justify-center">
        <ButtonCancelShareUserQuestionFriendForm
          userQuestion={userQuestion}
          userQuestionFriend={userQuestionFriend}
        />
        <p>
          <span className="font-semibold">
            {userQuestionFriend.user_app_wide_name}
          </span>{" "}
          / {userQuestionFriend.user_username}
        </p>
      </div>
    </>
  );
}
