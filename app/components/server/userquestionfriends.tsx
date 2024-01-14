"use server";

import { fetchAllUserQuestionFriends } from "@/app/libraries/data/userquestionfriends";
import { UserQuestion } from "@/app/libraries/definitions/userquestions";
import {
  ManyUserQuestionFriendsLabel,
  OneUserQuestionFriend,
} from "../agnostic/userquestionfriends";
import { ManyPaginatedUserQuestionFriends } from "../client/userquestionfriends";

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
          {allUserQuestionFriends.length <= 4 ? (
            <>
              <ManyUserQuestionFriendsLabel
                userQuestionFriends={allUserQuestionFriends}
              />
              <ol>
                {allUserQuestionFriends.map((userQuestionFriend) => {
                  return (
                    <li key={userQuestionFriend.userquestionfriend_id}>
                      <OneUserQuestionFriend
                        userQuestion={userQuestion}
                        userQuestionFriend={userQuestionFriend}
                      />
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <ManyUserQuestionFriendsLabel
                userQuestionFriends={allUserQuestionFriends}
              />
              <ManyPaginatedUserQuestionFriends
                userQuestion={userQuestion}
                userQuestionFriends={allUserQuestionFriends}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
