"use server";

import {
  fetchUserPinnedAnswers,
  fetchUserNativeNotIrlAnswers,
  fetchUserNativeIrlAnswers,
  fetchUserPseudonativeNotIrlAnswers,
  fetchUserPseudonativeIrlAnswers,
  fetchUserCustomAnswers,
  fetchUserPinnedNotIrlAnswers,
  fetchUserUnpinnedNativeNotIrlAnswers,
  fetchUserUnpinnedPseudonativeNotIrlAnswers,
  fetchUserPinnedNotAndIrlAnswers,
  fetchUserUnpinnedNativeIrlAnswers,
  fetchUserUnpinnedPseudonativeIrlAnswers,
  fetchUserSharedToContactCustomAnswers,
  fetchUserPinnedNotIrlAnswersCustom,
  fetchUserPinnedNotAndIrlAnswersCustom,
} from "@/app/libraries/data/answers";
import { User } from "@/app/libraries/definitions/users";
import { Answer } from "@/app/libraries/definitions/answers";
import {
  GatheredContact,
  FoundContact,
} from "@/app/libraries/definitions/contacts";
import {
  AnswersLabel,
  answersLabels,
} from "@/app/libraries/utilities/answerslabels";
import Link from "next/link";
import {
  ButtonPinnableForm,
  ButtonPseudoableForm,
  OneCriteriaAnswerModifyForm,
} from "../client/forms";
import {
  NoAnswersLabel,
  noAnswersLabels,
} from "@/app/libraries/utilities/noanswerslabels";

export async function OneCriteriaQuestion({ answer }: { answer: Answer }) {
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
        {answer.question_kind === "CUSTOM" && (
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
      </p>
    </>
  );
}

export async function OneLinkCriteriaQuestion({ answer }: { answer: Answer }) {
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

export async function OneCriteriaAnswer({ answer }: { answer: Answer }) {
  return (
    <>
      <p className="mt-2">{answer.answer_value}</p>
    </>
  );
}

export async function OneCriteriaAnswerModify({ answer }: { answer: Answer }) {
  return (
    <>
      <OneCriteriaAnswerModifyForm answer={answer} />
    </>
  );
}

export async function OneCriteriaAnswerPinnable({
  answer,
}: {
  answer: Answer;
}) {
  return (
    <>
      <div className="mt-2 flex justify-center">
        <ButtonPinnableForm answer={answer} />
        <p>{answer.answer_value}</p>
      </div>
    </>
  );
}

export async function OneCriteriaAnswerPinnablePseudoable({
  answer,
}: {
  answer: Answer;
}) {
  return (
    <>
      <div className="mt-2 flex justify-center">
        <ButtonPinnableForm answer={answer} />
        <p>{answer.answer_value}</p>
        <ButtonPseudoableForm answer={answer} />
      </div>
    </>
  );
}

export async function OneCriteria({ answer }: { answer: Answer }) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} />
      <OneCriteriaAnswer answer={answer} />
    </>
  );
}

export async function OneCriteriaModify({ answer }: { answer: Answer }) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} />
      <OneCriteriaAnswerModify answer={answer} />
    </>
  );
}

export async function OneCriteriaPinnable({ answer }: { answer: Answer }) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} />
      <OneCriteriaAnswerPinnable answer={answer} />
    </>
  );
}

export async function OneCriteriaPinnablePseudoable({
  answer,
}: {
  answer: Answer;
}) {
  return (
    <>
      <OneCriteriaQuestion answer={answer} />
      <OneCriteriaAnswerPinnablePseudoable answer={answer} />
    </>
  );
}

export async function OneLinkCriteria({ answer }: { answer: Answer }) {
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
      <OneCriteriaAnswerPinnable answer={answer} />
    </>
  );
}

export async function ManyCriteria({
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
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <ol>
            {answers.map((answer) => {
              return (
                <li key={answer.answer_id}>
                  <OneCriteria answer={answer} />
                </li>
              );
            })}
          </ol>
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

export async function ManyCriteriaModify({
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

export async function ManyCriteriaPinnable({
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
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <ol>
            {answers.map((answer) => {
              return (
                <li key={answer.answer_id}>
                  <OneCriteriaPinnable answer={answer} />
                </li>
              );
            })}
          </ol>
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

export async function ManyCriteriaPinnablePseudoable({
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
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <ol>
            {answers.map((answer) => {
              return (
                <li key={answer.answer_id}>
                  <OneCriteriaPinnablePseudoable answer={answer} />
                </li>
              );
            })}
          </ol>
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

export async function ManyLinkCriteria({
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
          <p className="mt-2 font-semibold text-zinc-500">{answersLabel}</p>
          <ol>
            {answers.map((answer) => {
              return (
                <li key={answer.answer_id}>
                  <OneLinkCriteria answer={answer} />
                </li>
              );
            })}
          </ol>
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

export async function ManyUserPinnedCriteria({ user }: { user: User }) {
  const pinnedAnswers = await fetchUserPinnedAnswers(user.user_id);

  return (
    <>
      <ManyCriteria
        answers={pinnedAnswers}
        answersLabel={answersLabels.pinned}
        noAnswersLabel={noAnswersLabels.pinned}
      />
    </>
  );
}

export async function ManyUserNativeNotIrlCriteria({ user }: { user: User }) {
  const userNativeNotIrlAnswers = await fetchUserNativeNotIrlAnswers(
    user.user_id,
  );

  return (
    <>
      <ManyCriteriaPinnable
        answers={userNativeNotIrlAnswers}
        answersLabel={answersLabels.nativeNotIrl}
        noAnswersLabel={noAnswersLabels.nativeNotIrl}
      />
    </>
  );
}

export async function ManyUserNativeNotIrlCriteriaModify({
  user,
}: {
  user: User;
}) {
  const userNativeNotIrlAnswers = await fetchUserNativeNotIrlAnswers(
    user.user_id,
  );

  return (
    <>
      <ManyCriteriaModify
        answers={userNativeNotIrlAnswers}
        answersLabel={answersLabels.nativeNotIrl}
        noAnswersLabel={noAnswersLabels.nativeNotIrl}
      />
    </>
  );
}

export async function ManyUserNativeIrlCriteria({ user }: { user: User }) {
  const userNativeIrlAnswers = await fetchUserNativeIrlAnswers(user.user_id);

  return (
    <>
      <ManyCriteriaPinnable
        answers={userNativeIrlAnswers}
        answersLabel={answersLabels.nativeIrl}
        noAnswersLabel={noAnswersLabels.nativeIrl}
      />
    </>
  );
}

export async function ManyUserNativeIrlCriteriaModify({
  user,
}: {
  user: User;
}) {
  const userNativeIrlAnswers = await fetchUserNativeIrlAnswers(user.user_id);

  return (
    <>
      <ManyCriteriaModify
        answers={userNativeIrlAnswers}
        answersLabel={answersLabels.nativeIrl}
        noAnswersLabel={noAnswersLabels.nativeIrl}
      />
    </>
  );
}

export async function ManyUserPseudonativeNotIrlCriteria({
  user,
}: {
  user: User;
}) {
  const userPseudonativeNotIrlAnswers =
    await fetchUserPseudonativeNotIrlAnswers(user.user_id);

  return (
    <>
      <ManyCriteriaPinnablePseudoable
        answers={userPseudonativeNotIrlAnswers}
        answersLabel={answersLabels.pseudonativeNotIrl}
        noAnswersLabel={noAnswersLabels.pseudonativeNotIrl}
      />
    </>
  );
}

export async function ManyUserPseudonativeNotIrlCriteriaModify({
  user,
}: {
  user: User;
}) {
  const userPseudonativeNotIrlAnswers =
    await fetchUserPseudonativeNotIrlAnswers(user.user_id);

  return (
    <>
      <ManyCriteriaModify
        answers={userPseudonativeNotIrlAnswers}
        answersLabel={answersLabels.pseudonativeNotIrl}
        noAnswersLabel={noAnswersLabels.pseudonativeNotIrl}
      />
    </>
  );
}

export async function ManyUserPseudonativeIrlCriteria({
  user,
}: {
  user: User;
}) {
  const userPseudonativeIrlAnswers = await fetchUserPseudonativeIrlAnswers(
    user.user_id,
  );

  return (
    <>
      <ManyCriteriaPinnablePseudoable
        answers={userPseudonativeIrlAnswers}
        answersLabel={answersLabels.pseudonativeIrl}
        noAnswersLabel={noAnswersLabels.pseudonativeIrl}
      />
    </>
  );
}

export async function ManyUserPseudonativeIrlCriteriaModify({
  user,
}: {
  user: User;
}) {
  const userPseudonativeIrlAnswers = await fetchUserPseudonativeIrlAnswers(
    user.user_id,
  );

  return (
    <>
      <ManyCriteriaModify
        answers={userPseudonativeIrlAnswers}
        answersLabel={answersLabels.pseudonativeIrl}
        noAnswersLabel={noAnswersLabels.pseudonativeIrl}
      />
    </>
  );
}

export async function ManyUserCustomCriteria({ user }: { user: User }) {
  const userCustomAnswers = await fetchUserCustomAnswers(user.user_id);

  return (
    <>
      <ManyLinkCriteria
        answers={userCustomAnswers}
        answersLabel={answersLabels.custom}
        noAnswersLabel={noAnswersLabels.custom}
      />
    </>
  );
}

export async function ManyRelComboFriendCriteria({ user }: { user: User }) {
  const [
    pinnedNotIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
  ] = await Promise.all([
    fetchUserPinnedNotIrlAnswers(user.user_id),
    fetchUserUnpinnedNativeNotIrlAnswers(user.user_id),
    fetchUserUnpinnedPseudonativeNotIrlAnswers(user.user_id),
  ]);

  return (
    <>
      <ManyUserPinnedNotIrlCriteria answers={pinnedNotIrlAnswers} />
      <ManyUserUnpinnedNativeNotIrlCriteria
        answers={userUnpinnedNativeNotIrlAnswers}
      />
      <ManyUserUnpinnedPseudonativeNotIrlCriteria
        answers={userUnpinnedPseudonativeNotIrlAnswers}
      />
    </>
  );
}

export async function ManyRelComboIrlCriteria({ user }: { user: User }) {
  const [
    pinnedNotAndIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
    userUnpinnedNativeIrlAnswers,
    userUnpinnedPseudonativeIrlAnswers,
  ] = await Promise.all([
    fetchUserPinnedNotAndIrlAnswers(user.user_id),
    fetchUserUnpinnedNativeNotIrlAnswers(user.user_id),
    fetchUserUnpinnedPseudonativeNotIrlAnswers(user.user_id),
    fetchUserUnpinnedNativeIrlAnswers(user.user_id),
    fetchUserUnpinnedPseudonativeIrlAnswers(user.user_id),
  ]);

  return (
    <>
      <ManyUserPinnedNotAndIrlCriteria answers={pinnedNotAndIrlAnswers} />
      <ManyUserUnpinnedNativeNotIrlCriteria
        answers={userUnpinnedNativeNotIrlAnswers}
      />
      <ManyUserUnpinnedPseudonativeNotIrlCriteria
        answers={userUnpinnedPseudonativeNotIrlAnswers}
      />
      <ManyUserUnpinnedNativeIrlCriteria
        answers={userUnpinnedNativeIrlAnswers}
      />
      <ManyUserUnpinnedPseudonativeIrlCriteria
        answers={userUnpinnedPseudonativeIrlAnswers}
      />
    </>
  );
}

export async function ManyUserPinnedNotIrlCriteria({
  answers,
}: {
  answers: Answer[];
}) {
  return (
    <>
      <ManyCriteria
        answers={answers}
        answersLabel={answersLabels.pinnedNotIrl}
      />
    </>
  );
}

export async function ManyUserPinnedNotAndIrlCriteria({
  answers,
}: {
  answers: Answer[];
}) {
  return (
    <>
      <ManyCriteria
        answers={answers}
        answersLabel={answersLabels.pinnedNotAndIrl}
      />
    </>
  );
}

export async function ManyUserUnpinnedNativeNotIrlCriteria({
  answers,
}: {
  answers: Answer[];
}) {
  return (
    <>
      <ManyCriteria
        answers={answers}
        answersLabel={answersLabels.unpinnedNativeNotIrl}
      />
    </>
  );
}

export async function ManyUserUnpinnedPseudonativeNotIrlCriteria({
  answers,
}: {
  answers: Answer[];
}) {
  return (
    <>
      <ManyCriteria
        answers={answers}
        answersLabel={answersLabels.unpinnedPseudonativeNotIrl}
      />
    </>
  );
}

export async function ManyUserUnpinnedNativeIrlCriteria({
  answers,
}: {
  answers: Answer[];
}) {
  return (
    <>
      <ManyCriteria
        answers={answers}
        answersLabel={answersLabels.unpinnedNativeIrl}
      />
    </>
  );
}

export async function ManyUserUnpinnedPseudonativeIrlCriteria({
  answers,
}: {
  answers: Answer[];
}) {
  return (
    <>
      <ManyCriteria
        answers={answers}
        answersLabel={answersLabels.unpinnedPseudonativeIrl}
      />
    </>
  );
}

export async function ManyUserSharedToContactCustomAnswers({
  user,
  contact,
}: {
  user: User;
  contact: GatheredContact | FoundContact;
}) {
  const userSharedToContactCustomAnswers =
    await fetchUserSharedToContactCustomAnswers(
      user.user_id,
      contact.c1_contact_id,
    );

  return (
    <>
      <ManyCriteria
        answers={userSharedToContactCustomAnswers}
        answersLabel={answersLabels.sharedToContactCustom}
      />
    </>
  );
}

export async function ManyRelComboFriendCriteriaCustom({
  user,
  contact,
}: {
  user: User;
  contact: GatheredContact | FoundContact;
}) {
  const [
    pinnedNotIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
  ] = await Promise.all([
    fetchUserPinnedNotIrlAnswersCustom(user.user_id, contact.c1_contact_id),
    fetchUserUnpinnedNativeNotIrlAnswers(user.user_id),
    fetchUserUnpinnedPseudonativeNotIrlAnswers(user.user_id),
  ]);

  return (
    <>
      <ManyUserPinnedNotIrlCriteria answers={pinnedNotIrlAnswers} />
      <ManyUserUnpinnedNativeNotIrlCriteria
        answers={userUnpinnedNativeNotIrlAnswers}
      />
      <ManyUserUnpinnedPseudonativeNotIrlCriteria
        answers={userUnpinnedPseudonativeNotIrlAnswers}
      />
    </>
  );
}

export async function ManyRelComboIrlCriteriaCustom({
  user,
  contact,
}: {
  user: User;
  contact: GatheredContact | FoundContact;
}) {
  const [
    pinnedNotAndIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
    userUnpinnedNativeIrlAnswers,
    userUnpinnedPseudonativeIrlAnswers,
  ] = await Promise.all([
    fetchUserPinnedNotAndIrlAnswersCustom(user.user_id, contact.c1_contact_id),
    fetchUserUnpinnedNativeNotIrlAnswers(user.user_id),
    fetchUserUnpinnedPseudonativeNotIrlAnswers(user.user_id),
    fetchUserUnpinnedNativeIrlAnswers(user.user_id),
    fetchUserUnpinnedPseudonativeIrlAnswers(user.user_id),
  ]);

  return (
    <>
      <ManyUserPinnedNotAndIrlCriteria answers={pinnedNotAndIrlAnswers} />
      <ManyUserUnpinnedNativeNotIrlCriteria
        answers={userUnpinnedNativeNotIrlAnswers}
      />
      <ManyUserUnpinnedPseudonativeNotIrlCriteria
        answers={userUnpinnedPseudonativeNotIrlAnswers}
      />
      <ManyUserUnpinnedNativeIrlCriteria
        answers={userUnpinnedNativeIrlAnswers}
      />
      <ManyUserUnpinnedPseudonativeIrlCriteria
        answers={userUnpinnedPseudonativeIrlAnswers}
      />
    </>
  );
}
