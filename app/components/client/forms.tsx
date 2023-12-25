"use client";

import {
  updateUserAppWideName,
  UpdateUserAppWideNameFormState,
} from "@/app/lib/actions/users";
import { User } from "@/app/lib/definitions/users";
import { useFormState } from "react-dom";
import {
  OneCriteriaAnswerModifyInput,
  UserAppWideNameModifyInput,
} from "./inputs";
import {
  pinOrUnpinUserQuestionOfAnswer,
  updateOrDeleteAnswerValue,
  UpdateOrDeleteAnswerValueFormState,
} from "@/app/lib/actions/answers";
import { Answer } from "@/app/lib/definitions/answers";
import {
  ButtonPinnable,
  ButtonAddUserQuestionFriend,
  ButtonDeleteUserQuestionFriend,
} from "./buttons";
import { Friend } from "@/app/lib/definitions/contacts";
import { UserQuestion } from "@/app/lib/definitions/userquestions";
import { UserQuestionFriend } from "@/app/lib/definitions/userquestionfriends";
import {
  createUserQuestionFriend,
  deleteUserQuestionFriend,
} from "@/app/lib/actions/userquestionfriends";

export function UserAppWideNameModify({ user }: { user: User }) {
  const initialState: UpdateUserAppWideNameFormState = {
    errors: {},
    message: null,
  };
  const updateUserAppWideNameWithUser = updateUserAppWideName.bind(null, user);
  const [state, formAction] = useFormState(
    updateUserAppWideNameWithUser,
    initialState,
  );

  return (
    <>
      <form action={formAction}>
        <label htmlFor="user-app-wide-name">
          <p className="mt-2">App-wide name *</p>
        </label>
        <UserAppWideNameModifyInput user={user} />
        {state && state.errors?.userAppWideName ? (
          <div id="app-wide-name-error" aria-live="polite">
            {state.errors.userAppWideName.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
      </form>
    </>
  );
}

export function OneCriteriaAnswerModifyForm({ answer }: { answer: Answer }) {
  const initialState: UpdateOrDeleteAnswerValueFormState = {
    errors: {},
    message: null,
  };
  const updateOrDeleteAnswerValueWithAnswer = updateOrDeleteAnswerValue.bind(
    null,
    answer,
  );
  const [state, formAction] = useFormState(
    updateOrDeleteAnswerValueWithAnswer,
    initialState,
  );

  return (
    <>
      <form action={formAction}>
        <label className="sr-only" htmlFor={answer.answer_id}>
          Modify answer &quot;{answer.answer_value}&quot;
        </label>
        <OneCriteriaAnswerModifyInput answer={answer} />
        {state && state.errors?.answerValue ? (
          <div id={`answer-value-error-${answer.answer_id}`} aria-live="polite">
            {state.errors.answerValue.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id={`form-error-${answer.answer_id}`} aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
      </form>
    </>
  );
}

export function ButtonPinnableForm({ answer }: { answer: Answer }) {
  return (
    <>
      <form
        className="me-2 flex items-center"
        action={() => pinOrUnpinUserQuestionOfAnswer(answer)}
      >
        <ButtonPinnable answer={answer} />
      </form>
    </>
  );
}
export function ButtonAddUserQuestionFriendForm({
  userQuestion,
  contact,
}: {
  userQuestion: UserQuestion;
  contact: Friend;
}) {
  return (
    <>
      <form
        className="me-2 flex items-center"
        action={() => createUserQuestionFriend(userQuestion, contact)}
      >
        <ButtonAddUserQuestionFriend />
      </form>
    </>
  );
}

export function ButtonDeleteUserQuestionFriendForm({
  userQuestion,
  userQuestionFriend,
}: {
  userQuestion: UserQuestion;
  userQuestionFriend: UserQuestionFriend;
}) {
  return (
    <>
      <form
        className="me-2 flex items-center"
        action={() =>
          deleteUserQuestionFriend(userQuestion, userQuestionFriend)
        }
      >
        <ButtonDeleteUserQuestionFriend />
      </form>
    </>
  );
}
