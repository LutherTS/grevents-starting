"use client";

import { useFormStatus } from "react-dom";
import { User } from "@/app/libraries/definitions/users";
import { Answer } from "@/app/libraries/definitions/answers";
import {
  NativeIrlQuestion,
  NativeNotIrlQuestion,
} from "@/app/libraries/definitions/questions";

// I could, should put these classes in variables, but I'm not used to it just yet.

export function UserAppWideNameModifyInput({ user }: { user: User }) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="mt-2 w-full max-w-[40ch] truncate rounded bg-gray-50 px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white"
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
        className="w-[30ch] max-w-[50ch] truncate rounded bg-gray-50 px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white sm:w-[40ch]"
        // !important didn't change a thing against user agent
        type="text"
        id={answer.answer_id}
        name="answervalue"
        placeholder={answer.answer_value}
        disabled={status.pending || answer.question_name === "Email address"}
        // That's actually better than id in some way because the id could change in production.
        // Since at creation EMAIL_ADDRESS_QUESTION_ID is used (and working), I'll have to streamline both solutions closer to production by making a decision.
      />
    </>
  );
}

export function FriendCodeInput({ user }: { user: User }) {
  // { friendCode }: { friendCode: string }
  const status = useFormStatus();

  return (
    <>
      <input
        className="mt-2 w-full max-w-[40ch] truncate rounded bg-gray-50 px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white"
        type="text"
        id="friend-code"
        name="friendcode"
        placeholder="Enter a user's friend code"
        disabled={status.pending || user.user_state === "DEACTIVATED"}
        // required // validation now gone server-side
      />
      {user.user_state === "DEACTIVATED" && (
        <p className="mt-2 text-red-500">
          You can&apos;t use the find feature while your profile is deactivated.
        </p>
      )}
    </>
  );
}

export function UserLastInput({ userLast }: { userLast: string }) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="mt-2 w-full max-w-[40ch] truncate rounded bg-gray-50 px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white"
        type="text"
        id="user-last"
        name="userlast"
        placeholder={userLast ? userLast : "userlast"}
        disabled={status.pending}
        required
      />
    </>
  );
}

export function RelComboInput({ relCombo }: { relCombo: string }) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="mt-2 w-full max-w-[40ch] truncate rounded bg-gray-50 px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white"
        type="text"
        id="rel-combo"
        name="relcombo"
        placeholder={relCombo ? relCombo : "relcombo"}
        disabled={status.pending}
        required
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
        className="truncate px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white"
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

export function NativeNotIrlQuestionSelect({
  allNativeNotIrlQuestions,
}: {
  allNativeNotIrlQuestions: NativeNotIrlQuestion[];
}) {
  const status = useFormStatus();

  return (
    <>
      <div className="mt-4 flex w-full justify-center">
        <select
          className="block truncate rounded px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white"
          id="native-not-irl-question"
          name="nativenotirlquestion"
          defaultValue=""
          disabled={status.pending}
        >
          <option value="" disabled>
            Select a native question
          </option>
          {allNativeNotIrlQuestions.map((nativeNotIrlQuestion) => {
            return (
              <option
                key={nativeNotIrlQuestion.question_id}
                value={nativeNotIrlQuestion.question_id}
              >
                {nativeNotIrlQuestion.question_name}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}

export function AnswerInput({
  id,
  name,
  placeholder,
}: {
  id: string;
  name: string;
  placeholder: string;
}) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="mt-6 w-[30ch] max-w-[50ch] truncate rounded bg-gray-50 px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white sm:w-[40ch]"
        type="text"
        id={id}
        name={name}
        disabled={status.pending}
        placeholder={placeholder}
      />
    </>
  );
}

export function NativeIrlQuestionSelect({
  allNativeIrlQuestions,
}: {
  allNativeIrlQuestions: NativeIrlQuestion[];
}) {
  const status = useFormStatus();

  return (
    <>
      <div className="mt-4 flex w-full justify-center">
        <select
          className="block truncate rounded px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white"
          id="native-irl-question"
          name="nativeirlquestion"
          defaultValue=""
          disabled={status.pending}
        >
          <option value="" disabled>
            Select a native irl question
          </option>
          {allNativeIrlQuestions.map((nativeIrlQuestion) => {
            return (
              <option
                key={nativeIrlQuestion.question_id}
                value={nativeIrlQuestion.question_id}
              >
                {nativeIrlQuestion.question_name}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
}

export function CustomizedQuestionInput({
  id,
  name,
  placeholder,
}: {
  id: string;
  name: string;
  placeholder: string;
}) {
  const status = useFormStatus();

  return (
    <>
      <input
        className="mt-4 w-[40ch] max-w-[50ch] truncate rounded bg-gray-50 px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white"
        type="text"
        id={id}
        name={name}
        disabled={status.pending}
        placeholder={placeholder}
      />
    </>
  );
}

export function SignInput({
  id,
  name,
  placeholder,
  type,
}: {
  id: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  const status = useFormStatus();

  return (
    <>
      <input
        // disabled classes don't apply when the field is fulfilled via autocomplete
        className="mt-2 w-full max-w-[40ch] truncate rounded bg-gray-50 px-2 text-center text-black disabled:!bg-gray-500 disabled:!text-white"
        type={type ? type : "text"}
        id={id}
        name={name}
        disabled={status.pending}
        placeholder={placeholder}
      />
    </>
  );
}
