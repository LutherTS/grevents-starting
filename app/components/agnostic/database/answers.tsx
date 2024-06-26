// Agnostic components have neither the "use client" nor the "use server" directive on top. Since this is Next.js, they are server components by default, but because the "use server" is absent from their file, they are not forced server components, and become client components when positioned as child of parent client components.

import { Answer } from "@/app/libraries/definitions/answers";
import {
  ButtonCancelPinUserQuestionFriendForm,
  ButtonHiddableForm,
  ButtonPinUserQuestionFriendForm,
  ButtonPinnableForm,
  ButtonPseudoableForm,
  OneCriteriaAnswerModifyForm,
} from "../../client/forms";
import { FoundContact } from "@/app/libraries/definitions/contacts";
import Link from "next/link";
import {
  ManyPaginatedCriteria,
  ManyPaginatedCriteriaCancelPinnableByFriend,
  ManyPaginatedCriteriaModify,
  ManyPaginatedCriteriaPinnable,
  ManyPaginatedCriteriaPinnableByFriend,
  ManyPaginatedCriteriaPinnablePseudoable,
  ManyPaginatedLinkCriteria,
} from "../../client/database/answers";
import { AnswersLabel } from "@/app/libraries/utilities/answerslabels";
import { NoAnswersLabel } from "@/app/libraries/utilities/noanswerslabels";
import {
  ANSWERS_PINNED_BY_FRIEND_LIMIT,
  ANSWERS_PINNED_BY_USER_LIMIT,
} from "@/app/libraries/data/answers";

export function OneCriteriaQuestion({
  answer,
  personalView,
}: {
  answer: Answer;
  personalView?: boolean;
}) {
  return (
    <>
      <p className="mt-2">
        {answer.question_kind === "NATIVE" && (
          <span className="text-violet-500">
            <span className="font-semibold">{answer.question_name}</span> /
            native
          </span>
        )}
        {answer.question_kind === "NATIVEIRL" && (
          <span className="text-purple-500">
            <span className="font-semibold">{answer.question_name}</span> /
            native irl
          </span>
        )}
        {answer.question_kind === "PSEUDO" &&
          answer.userquestion_kind === "PSEUDONATIVE" && (
            <span className="text-green-500">
              <span className="font-semibold">{answer.question_name}</span> /
              pseudonative
            </span>
          )}
        {answer.question_kind === "PSEUDO" &&
          answer.userquestion_kind === "PSEUDONATIVEIRL" && (
            <span className="text-emerald-500">
              <span className="font-semibold">{answer.question_name}</span> /
              pseudonative irl
            </span>
          )}
        {answer.question_kind === "CUSTOM" && personalView && (
          <span className="text-lime-500">
            <span className="font-semibold">{answer.question_name}</span> /
            custom{" "}
            {answer.userquestionfriends_count &&
            answer.userquestionfriends_count >= 1 ? (
              <>/ shared ({answer.userquestionfriends_count})</>
            ) : (
              <>/ not shared</>
            )}
          </span>
        )}
        {answer.question_kind === "CUSTOM" && !personalView && (
          <span className="text-lime-500">
            <span className="font-semibold">{answer.question_name}</span> /
            custom / shared to you
          </span>
        )}
      </p>
    </>
  );
}

export function OneLinkCriteriaQuestion({ answer }: { answer: Answer }) {
  return (
    <>
      <p className="mt-2">
        {answer.question_kind === "CUSTOM" && (
          <span className="text-lime-500 underline hover:text-lime-400 dark:hover:text-lime-600">
            <span className="font-semibold">{answer.question_name}</span> /
            custom{" "}
            {answer.userquestionfriends_count &&
            answer.userquestionfriends_count >= 1 ? (
              <>/ shared ({answer.userquestionfriends_count})</>
            ) : (
              <>/ not shared</>
            )}
          </span>
        )}
      </p>
    </>
  );
}

export function OneCriteriaAnswer({ answer }: { answer: Answer }) {
  return (
    <>
      <p
        className={
          answer.userquestion_state === "HIDDEN" ? "mt-2 text-gray-500" : "mt-2"
        }
      >
        {answer.answer_value}
      </p>
    </>
  );
}

export function OneCriteriaAnswerModify({ answer }: { answer: Answer }) {
  return (
    <>
      <div className="relative mt-2 inline-flex items-center justify-center">
        <OneCriteriaAnswerModifyForm answer={answer} />
        {answer.question_name === "Email address" && (
          <ButtonHiddableForm answer={answer} />
        )}
      </div>
    </>
  );
}

export function OneCriteriaAnswerPinnable({
  answer,
  pinnedAnswersCount,
}: {
  answer: Answer;
  pinnedAnswersCount: number;
}) {
  return (
    <>
      <div className="mt-2 flex justify-center">
        {/* <ButtonPinnableForm answer={answer} /> */}
        {pinnedAnswersCount < ANSWERS_PINNED_BY_USER_LIMIT && (
          <ButtonPinnableForm answer={answer} />
        )}
        {pinnedAnswersCount >= ANSWERS_PINNED_BY_USER_LIMIT &&
          answer.userquestion_is_pinned === true && (
            <ButtonPinnableForm answer={answer} />
          )}
        <p
          className={
            answer.userquestion_state === "HIDDEN"
              ? "text-gray-300 dark:text-gray-700"
              : "text-inherit"
          }
        >
          {answer.answer_value}
        </p>
      </div>
    </>
  );
}

export function OneCriteriaAnswerPinnablePseudoable({
  answer,
  pinnedAnswersCount,
}: {
  answer: Answer;
  pinnedAnswersCount: number;
}) {
  return (
    <>
      <div className="mt-2 flex justify-center">
        {/* <ButtonPinnableForm answer={answer} /> */}
        {pinnedAnswersCount < ANSWERS_PINNED_BY_USER_LIMIT && (
          <ButtonPinnableForm answer={answer} />
        )}
        {pinnedAnswersCount >= ANSWERS_PINNED_BY_USER_LIMIT &&
          answer.userquestion_is_pinned === true && (
            <ButtonPinnableForm answer={answer} />
          )}
        <p>{answer.answer_value}</p>
        <ButtonPseudoableForm answer={answer} />
      </div>
    </>
  );
}

export function OneCriteriaAnswerPinnableByFriend({
  answer,
  contact,
  pinnedbyFriendAnswersLength,
}: {
  answer: Answer;
  contact: FoundContact;
  pinnedbyFriendAnswersLength: number;
}) {
  return (
    <>
      <div className="mt-2 flex justify-center">
        {pinnedbyFriendAnswersLength < ANSWERS_PINNED_BY_FRIEND_LIMIT && (
          <ButtonPinUserQuestionFriendForm answer={answer} contact={contact} />
        )}
        <p>{answer.answer_value}</p>
      </div>
    </>
  );
}

export function OneCriteriaAnswerCancelPinnableByFriend({
  answer,
  contact,
}: {
  answer: Answer;
  contact: FoundContact;
}) {
  return (
    <>
      <div className="mt-2 flex justify-center">
        <ButtonCancelPinUserQuestionFriendForm
          answer={answer}
          contact={contact}
        />
        <p>{answer.answer_value}</p>
      </div>
    </>
  );
}

export function OneCriteria({
  answer,
  personalView,
}: {
  answer: Answer;
  personalView?: boolean;
}) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} personalView={personalView} />
      <OneCriteriaAnswer answer={answer} />
    </>
  );
}

export function OneCriteriaModify({
  answer,
  personalView,
}: {
  answer: Answer;
  personalView?: boolean;
}) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} personalView={personalView} />
      <OneCriteriaAnswerModify answer={answer} />
    </>
  );
}

export function OneCriteriaPinnable({
  answer,
  personalView,
  pinnedAnswersCount,
}: {
  answer: Answer;
  personalView?: boolean;
  pinnedAnswersCount: number;
}) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} personalView={personalView} />
      <OneCriteriaAnswerPinnable
        answer={answer}
        pinnedAnswersCount={pinnedAnswersCount}
      />
    </>
  );
}

export function OneCriteriaPinnablePseudoable({
  answer,
  pinnedAnswersCount,
}: {
  answer: Answer;
  pinnedAnswersCount: number;
}) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} />
      <OneCriteriaAnswerPinnablePseudoable
        answer={answer}
        pinnedAnswersCount={pinnedAnswersCount}
      />
    </>
  );
}

export function OneCriteriaPinnableByFriend({
  answer,
  contact,
  pinnedbyFriendAnswersLength,
}: {
  answer: Answer;
  contact: FoundContact;
  pinnedbyFriendAnswersLength: number;
}) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} />
      <OneCriteriaAnswerPinnableByFriend
        answer={answer}
        contact={contact}
        pinnedbyFriendAnswersLength={pinnedbyFriendAnswersLength}
      />
    </>
  );
}

export function OneCriteriaCancelPinnableByFriend({
  answer,
  contact,
}: {
  answer: Answer;
  contact: FoundContact;
}) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} />
      <OneCriteriaAnswerCancelPinnableByFriend
        answer={answer}
        contact={contact}
      />
    </>
  );
}

export function OneLinkCriteria({
  answer,
  pinnedAnswersCount,
}: {
  answer: Answer;
  pinnedAnswersCount: number;
}) {
  return (
    <>
      <div>
        <Link
          href={`/users/${answer.user_username}/personal-info/user-criteria/${answer.userquestion_id}`}
          className="inline-block underline"
        >
          <OneLinkCriteriaQuestion answer={answer} />
        </Link>
      </div>
      <OneCriteriaAnswerPinnable
        answer={answer}
        pinnedAnswersCount={pinnedAnswersCount}
      />
    </>
  );
}

export function ManyCriteria({
  answers,
  answersLabel,
  noAnswersLabel,
  personalView,
}: {
  answers: Answer[];
  answersLabel: AnswersLabel;
  noAnswersLabel?: NoAnswersLabel;
  personalView?: boolean;
}) {
  return (
    <>
      {answers.length > 0 && (
        <>
          {answers.length <= 4 ? (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ol>
                {answers.map((answer) => {
                  return (
                    <li key={answer.answer_id}>
                      <OneCriteria
                        answer={answer}
                        personalView={personalView}
                      />
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ManyPaginatedCriteria
                answers={answers}
                personalView={personalView}
              />
            </>
          )}
        </>
      )}
      {answers.length === 0 && noAnswersLabel && (
        <>
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <p className="mt-2">{noAnswersLabel}</p>
        </>
      )}
    </>
  );
}

export function ManyCriteriaModify({
  answers,
  answersLabel,
  noAnswersLabel,
}: {
  answers: Answer[];
  answersLabel: AnswersLabel;
  noAnswersLabel?: NoAnswersLabel;
}) {
  return (
    <>
      {answers.length > 0 && (
        <>
          {answers.length <= 4 ? (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ol>
                {answers.map((answer) => {
                  return (
                    <li key={answer.answer_id}>
                      <OneCriteriaModify answer={answer} />
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ManyPaginatedCriteriaModify answers={answers} />
            </>
          )}
        </>
      )}
      {answers.length === 0 && noAnswersLabel && (
        <>
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <p className="mt-2">{noAnswersLabel}</p>
        </>
      )}
    </>
  );
}

export function ManyCriteriaPinnable({
  answers,
  answersLabel,
  noAnswersLabel,
  pinnedAnswersCount,
}: {
  answers: Answer[];
  answersLabel: AnswersLabel;
  noAnswersLabel?: NoAnswersLabel;
  pinnedAnswersCount: number;
}) {
  return (
    <>
      {answers.length > 0 && (
        <>
          {answers.length <= 4 ? (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ol>
                {answers.map((answer) => {
                  return (
                    <li key={answer.answer_id}>
                      <OneCriteriaPinnable
                        answer={answer}
                        personalView={true}
                        pinnedAnswersCount={pinnedAnswersCount}
                      />
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ManyPaginatedCriteriaPinnable
                answers={answers}
                pinnedAnswersCount={pinnedAnswersCount}
              />
            </>
          )}
        </>
      )}
      {answers.length === 0 && noAnswersLabel && (
        <>
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <p className="mt-2">{noAnswersLabel}</p>
        </>
      )}
    </>
  );
}

export function ManyCriteriaPinnablePseudoable({
  answers,
  answersLabel,
  noAnswersLabel,
  pinnedAnswersCount,
}: {
  answers: Answer[];
  answersLabel: AnswersLabel;
  noAnswersLabel?: NoAnswersLabel;
  pinnedAnswersCount: number;
}) {
  return (
    <>
      {answers.length > 0 && (
        <>
          {answers.length <= 4 ? (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ol>
                {answers.map((answer) => {
                  return (
                    <li key={answer.answer_id}>
                      <OneCriteriaPinnablePseudoable
                        answer={answer}
                        pinnedAnswersCount={pinnedAnswersCount}
                      />
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ManyPaginatedCriteriaPinnablePseudoable
                answers={answers}
                pinnedAnswersCount={pinnedAnswersCount}
              />
            </>
          )}
        </>
      )}
      {answers.length === 0 && noAnswersLabel && (
        <>
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <p className="mt-2">{noAnswersLabel}</p>
        </>
      )}
    </>
  );
}

export function ManyCriteriaPinnableByFriend({
  answers,
  answersLabel,
  noAnswersLabel,
  contact,
  pinnedbyFriendAnswersLength,
}: {
  answers: Answer[];
  answersLabel: AnswersLabel;
  noAnswersLabel?: NoAnswersLabel;
  contact: FoundContact;
  pinnedbyFriendAnswersLength: number;
}) {
  return (
    <>
      {answers.length > 0 && (
        <>
          {answers.length <= 4 ? (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ol>
                {answers.map((answer) => {
                  return (
                    <li key={answer.answer_id}>
                      <OneCriteriaPinnableByFriend
                        answer={answer}
                        contact={contact}
                        pinnedbyFriendAnswersLength={
                          pinnedbyFriendAnswersLength
                        }
                      />
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ManyPaginatedCriteriaPinnableByFriend
                answers={answers}
                contact={contact}
                pinnedbyFriendAnswersLength={pinnedbyFriendAnswersLength}
              />
            </>
          )}
        </>
      )}
      {answers.length === 0 && noAnswersLabel && (
        <>
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <p className="mt-2">{noAnswersLabel}</p>
        </>
      )}
    </>
  );
}

export function ManyCriteriaCancelPinnableByFriend({
  answers,
  answersLabel,
  noAnswersLabel,
  contact,
}: {
  answers: Answer[];
  answersLabel: AnswersLabel;
  noAnswersLabel?: NoAnswersLabel;
  contact: FoundContact;
}) {
  return (
    <>
      {answers.length > 0 && (
        <>
          {answers.length <= 4 ? (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ol>
                {answers.map((answer) => {
                  return (
                    <li key={answer.answer_id}>
                      <OneCriteriaCancelPinnableByFriend
                        answer={answer}
                        contact={contact}
                      />
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ManyPaginatedCriteriaCancelPinnableByFriend
                answers={answers}
                contact={contact}
              />
            </>
          )}
        </>
      )}
      {answers.length === 0 && noAnswersLabel && (
        <>
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <p className="mt-2">{noAnswersLabel}</p>
        </>
      )}
    </>
  );
}

export function ManyLinkCriteria({
  answers,
  answersLabel,
  noAnswersLabel,
  pinnedAnswersCount,
}: {
  answers: Answer[];
  answersLabel: AnswersLabel;
  noAnswersLabel?: NoAnswersLabel;
  pinnedAnswersCount: number;
}) {
  return (
    <>
      {answers.length > 0 && (
        <>
          {answers.length <= 4 ? (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ol>
                {answers.map((answer) => {
                  return (
                    <li key={answer.answer_id}>
                      <OneLinkCriteria
                        answer={answer}
                        pinnedAnswersCount={pinnedAnswersCount}
                      />
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
              <ManyPaginatedLinkCriteria
                answers={answers}
                pinnedAnswersCount={pinnedAnswersCount}
              />
            </>
          )}
        </>
      )}
      {answers.length === 0 && noAnswersLabel && (
        <>
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <p className="mt-2">{noAnswersLabel}</p>
        </>
      )}
    </>
  );
}
