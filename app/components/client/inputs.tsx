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

export function FriendCodeInput({ friendCode }: { friendCode: string }) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="truncate px-2 text-center text-black disabled:bg-gray-500 disabled:text-white"
        type="text"
        id="friend-code"
        name="friendcode"
        placeholder={friendCode}
        disabled={status.pending}
      />
    </>
  );
}

export function UserLastInput({ userLast }: { userLast: string }) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="truncate px-2 text-center text-black disabled:bg-gray-500 disabled:text-white"
        type="text"
        id="user-last"
        name="userlast"
        placeholder={userLast}
        disabled={status.pending}
      />
    </>
  );
}

export function RelComboInput({ relCombo }: { relCombo: string }) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="truncate px-2 text-center text-black disabled:bg-gray-500 disabled:text-white"
        type="text"
        id="rel-combo"
        name="relcombo"
        placeholder={relCombo}
        disabled={status.pending}
      />
    </>
  );
}

/* To develop during UI phase.
export function RelComboSelect({ relCombo }: { relCombo: string }) {
  const status = useFormStatus();

  return (
    <>
      <select
        className="truncate px-2 text-center text-black disabled:bg-gray-500 disabled:text-white"
        id="rel-combo"
        name="relcombo"
        placeholder={relCombo}
        disabled={status.pending}
      >
        <option value="none">none</option>
        <option value="friend">friend</option>
        <option value="irl">irl</option>
        <option value="i-am-blocking">i-am-blocking</option>
        <option value="has-me-blocked">has-me-blocked</option>
        <option value="blocking-blocked">blocking-blocked</option>
      </select>
    </>
  );
}
*/
