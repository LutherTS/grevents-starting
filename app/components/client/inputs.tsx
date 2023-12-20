"use client";

import { useFormStatus } from "react-dom";
import { User } from "@/app/lib/definitions/users";
import { Answer } from "@/app/lib/definitions/answers";

export function UserAppWideNameModifyInput({ user }: { user: User }) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="mt-2 truncate px-2 text-center text-black disabled:bg-gray-500 disabled:text-white"
        type="text"
        id="user-app-wide-name"
        name="userappwidename"
        placeholder={user.user_app_wide_name}
        disabled={status.pending}
      />
    </>
  );
}

export function OneCriteriaAnswerModifyInput({ answer }: { answer: Answer }) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="mt-2 truncate px-2 text-center text-black disabled:bg-gray-500 disabled:text-white"
        type="text"
        id={answer.answer_id}
        name="answervalue"
        placeholder={answer.answer_value}
        disabled={status.pending}
      />
    </>
  );
}
