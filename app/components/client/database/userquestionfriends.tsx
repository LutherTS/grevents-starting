"use client";

import { UserQuestionFriend } from "@/app/libraries/definitions/userquestionfriends";
import { UserQuestion } from "@/app/libraries/definitions/userquestions";
import _ from "lodash";
import { useState } from "react";
import { OneUserQuestionFriend } from "../../agnostic/database/userquestionfriends";
import { OnClickLinkButton } from "../buttons";

export function ManyPaginatedUserQuestionFriends({
  userQuestion,
  userQuestionFriends,
}: {
  userQuestion: UserQuestion;
  userQuestionFriends: UserQuestionFriend[];
}) {
  const chunkedUserQuestionFriends = _.chunk(userQuestionFriends, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedUserQuestionFriends[position].map((userQuestionFriend) => {
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
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedUserQuestionFriends.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}
