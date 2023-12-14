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
} from "@/app/lib/data/answers";
import { countUserQuestionFriends } from "@/app/lib/data/userquestionfriends";
import { User } from "@/app/lib/definitions/users";
import { Answer } from "@/app/lib/definitions/answers";
import { GatheredContact } from "@/app/lib/definitions/contacts";
import { AnswersLabel, answersLabels } from "@/app/lib/utils/lists";
import Link from "next/link";

export async function OneCriteriaQuestion({ answer }: { answer: Answer }) {
  const userQuestionFriendsCount = await countUserQuestionFriends(answer);

  return (
    <>
      <p className="pt-2">
        {answer.question_name}
        {(answer.question_kind === "NATIVE" ||
          answer.question_kind === "NATIVEIRL") && <> / native</>}
        {answer.question_kind === "PSEUDO" && <> / pseudonative</>}
        {answer.question_kind === "CUSTOM" && <> / custom</>}
        {(answer.question_kind === "NATIVEIRL" ||
          answer.userquestion_kind === "PSEUDONATIVEIRL") && <> / irl</>}
        {answer.question_kind === "CUSTOM" && userQuestionFriendsCount < 1 && (
          <> / not shared</>
        )}
        {answer.question_kind === "CUSTOM" && userQuestionFriendsCount >= 1 && (
          <> / shared ({userQuestionFriendsCount})</>
        )}
      </p>
    </>
  );
}

export function OneCriteriaAnswer({ answer }: { answer: Answer }) {
  return (
    <>
      <p className="pt-2">{answer.answer_value}</p>
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

export async function OneLinkCriteria({ answer }: { answer: Answer }) {
  return (
    <>
      <div>
        <Link
          href={`/users/${answer.user_username}/personal-info/user-criteria/${answer.userquestion_id}`}
          className="inline-block underline"
        >
          <OneCriteriaQuestion answer={answer} />
        </Link>
      </div>
      <OneCriteriaAnswer answer={answer} />
    </>
  );
}

export async function ManyCriteria({
  answers,
  label,
}: {
  answers: Answer[];
  label: AnswersLabel;
}) {
  return (
    <>
      {answers.length > 0 && (
        <>
          <p className="pt-2">{label}</p>
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
    </>
  );
}

export async function ManyLinkCriteria({
  answers,
  label,
}: {
  answers: Answer[];
  label: AnswersLabel;
}) {
  return (
    <>
      {answers.length > 0 && (
        <>
          <p className="pt-2">{label}</p>
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
    </>
  );
}

export async function ManyUserPinnedCriteria({ user }: { user: User }) {
  const pinnedAnswers = await fetchUserPinnedAnswers(user.user_id);

  return (
    <>
      <ManyCriteria answers={pinnedAnswers} label={answersLabels.pinned} />
    </>
  );
}

export async function ManyUserNativeNotIrlCriteria({ user }: { user: User }) {
  const userNativeNotIrlAnswers = await fetchUserNativeNotIrlAnswers(
    user.user_id,
  );

  return (
    <>
      <ManyCriteria
        answers={userNativeNotIrlAnswers}
        label={answersLabels.nativeNotIrl}
      />
    </>
  );
}

export async function ManyUserNativeIrlCriteria({ user }: { user: User }) {
  const userNativeIrlAnswers = await fetchUserNativeIrlAnswers(user.user_id);

  return (
    <>
      <ManyCriteria
        answers={userNativeIrlAnswers}
        label={answersLabels.nativeIrl}
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
      <ManyCriteria
        answers={userPseudonativeNotIrlAnswers}
        label={answersLabels.pseudonativeNotIrl}
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
      <ManyCriteria
        answers={userPseudonativeIrlAnswers}
        label={answersLabels.pseudonativeIrl}
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
        label={answersLabels.custom}
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
      <ManyCriteria answers={answers} label={answersLabels.pinnedNotIrl} />
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
      <ManyCriteria answers={answers} label={answersLabels.pinnedNotAndIrl} />
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
        label={answersLabels.unpinnedNativeNotIrl}
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
        label={answersLabels.unpinnedPseudonativeNotIrl}
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
      <ManyCriteria answers={answers} label={answersLabels.unpinnedNativeIrl} />
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
        label={answersLabels.unpinnedPseudonativeIrl}
      />
    </>
  );
}

export async function ManyUserSharedToContactCustomAnswers({
  user,
  contact,
}: {
  user: User;
  contact: GatheredContact;
}) {
  const userSharedToContactCustomAnswers =
    await fetchUserSharedToContactCustomAnswers(user.user_id, contact.c1_id);

  return (
    <>
      <ManyCriteria
        answers={userSharedToContactCustomAnswers}
        label={answersLabels.sharedToContactCustom}
      />
    </>
  );
}
