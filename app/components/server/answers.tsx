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
import Link from "next/link";
import { GatheredContact } from "@/app/lib/definitions/contacts";

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

export async function ManyPinnedCriteria({ user }: { user: User }) {
  const pinnedAnswers = await fetchUserPinnedAnswers(user.user_id);

  return (
    <>
      {pinnedAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their pinned criteria below</p>
          <ol>
            {pinnedAnswers.map((pinnedAnswer) => {
              return (
                <li key={pinnedAnswer.answer_id}>
                  <OneCriteria answer={pinnedAnswer} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyUserNativeNotIrlCriteria({ user }: { user: User }) {
  const userNativeNotIrlAnswers = await fetchUserNativeNotIrlAnswers(
    user.user_id,
  );

  return (
    <>
      {userNativeNotIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their native criteria below</p>
          <ol>
            {userNativeNotIrlAnswers.map((userNativeNotIrlAnswer) => {
              return (
                <li key={userNativeNotIrlAnswer.answer_id}>
                  <OneCriteria answer={userNativeNotIrlAnswer} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyUserNativeIrlCriteria({ user }: { user: User }) {
  const userNativeIrlAnswers = await fetchUserNativeIrlAnswers(user.user_id);

  return (
    <>
      {userNativeIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their native irl criteria below</p>
          <ol>
            {userNativeIrlAnswers.map((userNativeIrlAnswer) => {
              return (
                <li key={userNativeIrlAnswer.answer_id}>
                  <OneCriteria answer={userNativeIrlAnswer} />
                </li>
              );
            })}
          </ol>
        </>
      )}
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
      {userPseudonativeNotIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their pseudonative criteria below</p>
          <ol>
            {userPseudonativeNotIrlAnswers.map(
              (userPseudonativeNotIrlAnswer) => {
                return (
                  <li key={userPseudonativeNotIrlAnswer.answer_id}>
                    <OneCriteria answer={userPseudonativeNotIrlAnswer} />
                  </li>
                );
              },
            )}
          </ol>
        </>
      )}
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
      {userPseudonativeIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their pseudonative irl criteria below</p>
          <ol>
            {userPseudonativeIrlAnswers.map((userPseudonativeIrlAnswer) => {
              return (
                <li key={userPseudonativeIrlAnswer.answer_id}>
                  <OneCriteria answer={userPseudonativeIrlAnswer} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyUserCustomCriteria({ user }: { user: User }) {
  const userCustomAnswers = await fetchUserCustomAnswers(user.user_id);

  return (
    <>
      {userCustomAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their custom criteria below</p>
          <ol>
            {userCustomAnswers.map((userCustomAnswer) => {
              return (
                <li key={userCustomAnswer.answer_id}>
                  <OneLinkCriteria answer={userCustomAnswer} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyPinnedNotIrlCriteria({ user }: { user: User }) {
  const pinnedNotIrlAnswers = await fetchUserPinnedNotIrlAnswers(user.user_id);

  return (
    <>
      {pinnedNotIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their pinned criteria below</p>
          <ol>
            {pinnedNotIrlAnswers.map((pinnedNotIrlAnswer) => {
              return (
                <li key={pinnedNotIrlAnswer.answer_id}>
                  <OneCriteria answer={pinnedNotIrlAnswer} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyUserUnpinnedNativeNotIrlCriteria({
  user,
}: {
  user: User;
}) {
  const userUnpinnedNativeNotIrlAnswers =
    await fetchUserUnpinnedNativeNotIrlAnswers(user.user_id);

  return (
    <>
      {userUnpinnedNativeNotIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their (other) native criteria below</p>
          <ol>
            {userUnpinnedNativeNotIrlAnswers.map(
              (userUnpinnedNativeNotIrlAnswer) => {
                return (
                  <li key={userUnpinnedNativeNotIrlAnswer.answer_id}>
                    <OneCriteria answer={userUnpinnedNativeNotIrlAnswer} />
                  </li>
                );
              },
            )}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyUserUnpinnedPseudonativeNotIrlCriteria({
  user,
}: {
  user: User;
}) {
  const userUnpinnedPseudonativeNotIrlAnswers =
    await fetchUserUnpinnedPseudonativeNotIrlAnswers(user.user_id);

  return (
    <>
      {userUnpinnedPseudonativeNotIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their (other) pseudonative criteria below</p>
          <ol>
            {userUnpinnedPseudonativeNotIrlAnswers.map(
              (userUnpinnedPseudonativeNotIrlAnswer) => {
                return (
                  <li key={userUnpinnedPseudonativeNotIrlAnswer.answer_id}>
                    <OneCriteria
                      answer={userUnpinnedPseudonativeNotIrlAnswer}
                    />
                  </li>
                );
              },
            )}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyPinnedNotAndIrlCriteria({ user }: { user: User }) {
  const pinnedNotAndIrlAnswers = await fetchUserPinnedNotAndIrlAnswers(
    user.user_id,
  );

  return (
    <>
      {pinnedNotAndIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their pinned criteria below</p>
          <ol>
            {pinnedNotAndIrlAnswers.map((pinnedNotAndIrlAnswer) => {
              return (
                <li key={pinnedNotAndIrlAnswer.answer_id}>
                  <OneCriteria answer={pinnedNotAndIrlAnswer} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyUserUnpinnedNativeIrlCriteria({
  user,
}: {
  user: User;
}) {
  const userUnpinnedNativeIrlAnswers = await fetchUserUnpinnedNativeIrlAnswers(
    user.user_id,
  );

  return (
    <>
      {userUnpinnedNativeIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their (other) native irl criteria below</p>
          <ol>
            {userUnpinnedNativeIrlAnswers.map((userUnpinnedNativeIrlAnswer) => {
              return (
                <li key={userUnpinnedNativeIrlAnswer.answer_id}>
                  <OneCriteria answer={userUnpinnedNativeIrlAnswer} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyUserUnpinnedPseudonativeIrlCriteria({
  user,
}: {
  user: User;
}) {
  const userUnpinnedPseudonativeIrlAnswers =
    await fetchUserUnpinnedPseudonativeIrlAnswers(user.user_id);

  return (
    <>
      {userUnpinnedPseudonativeIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">
            Find their (other) pseudonative irl criteria below
          </p>
          <ol>
            {userUnpinnedPseudonativeIrlAnswers.map(
              (userUnpinnedPseudonativeIrlAnswer) => {
                return (
                  <li key={userUnpinnedPseudonativeIrlAnswer.answer_id}>
                    <OneCriteria answer={userUnpinnedPseudonativeIrlAnswer} />
                  </li>
                );
              },
            )}
          </ol>
        </>
      )}
    </>
  );
}

export async function ManyRelComboFriendCriteria({ user }: { user: User }) {
  return (
    <>
      <ManyPinnedNotIrlCriteria user={user} />
      <ManyUserUnpinnedNativeNotIrlCriteria user={user} />
      <ManyUserUnpinnedPseudonativeNotIrlCriteria user={user} />
    </>
  );
}

export async function ManyRelComboIrlCriteria({ user }: { user: User }) {
  return (
    <>
      <ManyPinnedNotAndIrlCriteria user={user} />
      <ManyUserUnpinnedNativeNotIrlCriteria user={user} />
      <ManyUserUnpinnedPseudonativeNotIrlCriteria user={user} />
      <ManyUserUnpinnedNativeIrlCriteria user={user} />
      <ManyUserUnpinnedPseudonativeIrlCriteria user={user} />
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
      {userSharedToContactCustomAnswers.length > 0 && (
        <>
          <p className="pt-2">See the custom answers they can see below</p>
          <ol>
            {userSharedToContactCustomAnswers.map(
              (userSharedToContactCustomAnswer) => {
                return (
                  <li key={userSharedToContactCustomAnswer.answer_id}>
                    <OneCriteria answer={userSharedToContactCustomAnswer} />
                  </li>
                );
              },
            )}
          </ol>
        </>
      )}
    </>
  );
}
