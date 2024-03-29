"use client";

import clsx from "clsx";
import { Answer } from "@/app/libraries/definitions/answers";
import { useFormStatus } from "react-dom";
import { MouseEventHandler } from "react";

export function Button({ children }: { children: React.ReactNode }) {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400 disabled:!bg-gray-500 disabled:hover:bg-gray-500 dark:hover:bg-blue-600 disabled:dark:hover:bg-gray-500"
      >
        {children}
      </button>
    </>
  );
}

export function LinkButton({ children }: { children: React.ReactNode }) {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className="inline text-blue-500 hover:text-blue-400 disabled:text-gray-500 disabled:hover:text-gray-500 dark:hover:text-blue-600 disabled:dark:hover:text-gray-500"
      >
        {children}
      </button>
    </>
  );
}

export function OnClickLinkButton({
  children,
  handleClick,
  isDisabled,
}: {
  children: React.ReactNode;
  handleClick: MouseEventHandler<HTMLButtonElement>;
  isDisabled: boolean;
}) {
  return (
    <>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className="inline text-blue-500 hover:text-blue-400 disabled:text-gray-500 disabled:hover:text-gray-500 dark:hover:text-blue-600 disabled:dark:hover:text-gray-500"
      >
        {children}
      </button>
    </>
  );
}

export function FormButton({ children }: { children: React.ReactNode }) {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className="mt-6 w-full max-w-[40ch] rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400 disabled:!bg-gray-500 disabled:hover:bg-gray-500 dark:hover:bg-blue-600 disabled:dark:hover:bg-gray-500"
      >
        {children}
      </button>
    </>
  );
}

export function ButtonPinnable({ answer }: { answer: Answer }) {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className={clsx(
          "h-4 w-4 rounded-full disabled:!bg-gray-500 disabled:hover:bg-gray-500",
          {
            "bg-cyan-500 hover:bg-pink-300 dark:hover:bg-pink-700":
              answer.userquestion_is_pinned === true,
            "bg-pink-500 hover:bg-cyan-300 dark:hover:bg-cyan-700":
              answer.userquestion_is_pinned === false,
          },
        )}
      ></button>
    </>
  );
}

export function ButtonHiddable({ answer }: { answer: Answer }) {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className={clsx(
          "h-4 w-4 rounded-full disabled:!bg-gray-400 disabled:hover:bg-gray-400 dark:disabled:!bg-gray-600 dark:disabled:hover:bg-gray-600",
          {
            "bg-cyan-500 hover:bg-pink-300 dark:hover:bg-pink-700":
              answer.userquestion_state === "LIVE",
            "bg-pink-500 hover:bg-cyan-300 dark:hover:bg-cyan-700":
              answer.userquestion_state === "HIDDEN",
          },
        )}
      ></button>
    </>
  );
}

export function ButtonPseudoable({ answer }: { answer: Answer }) {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className={clsx(
          "h-4 w-4 rounded-full bg-yellow-500 disabled:!bg-gray-500 disabled:hover:bg-gray-500",
          {
            "hover:bg-emerald-300 dark:hover:bg-emerald-700":
              answer.question_kind === "PSEUDO" &&
              answer.userquestion_kind === "PSEUDONATIVE",
            "hover:bg-green-300 dark:hover:bg-green-700":
              answer.question_kind === "PSEUDO" &&
              answer.userquestion_kind === "PSEUDONATIVEIRL",
          },
        )}
      ></button>
    </>
  );
}

export function ButtonShareUserQuestionFriend() {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className="h-4 w-4 rounded-full bg-cyan-500 hover:bg-cyan-300 disabled:!bg-gray-500 disabled:hover:bg-gray-500 dark:hover:bg-cyan-700"
      ></button>
    </>
  );
}

export function ButtonCancelShareUserQuestionFriend() {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className="h-4 w-4 rounded-full bg-pink-500 hover:bg-pink-300 disabled:!bg-gray-500 disabled:hover:bg-gray-500 dark:hover:bg-pink-700"
      ></button>
    </>
  );
}

export function ButtonPinUserQuestionFriend() {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className="h-4 w-4 rounded-full bg-cyan-500 hover:bg-cyan-300 disabled:!bg-gray-500 disabled:hover:bg-gray-500 dark:hover:bg-cyan-700"
      ></button>
    </>
  );
}

export function ButtonCancelPinUserQuestionFriend() {
  const status = useFormStatus();

  return (
    <>
      <button
        disabled={status.pending}
        className="h-4 w-4 rounded-full bg-pink-500 hover:bg-pink-300 disabled:!bg-gray-500 disabled:hover:bg-gray-500 dark:hover:bg-pink-700"
      ></button>
    </>
  );
}
