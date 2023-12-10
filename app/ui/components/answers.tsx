import {
  fetchUserPinnedAnswers,
  fetchUserNativeNotIrlAnswers,
  fetchUserNativeIrlAnswers,
  fetchUserPseudonativeNotIrlAnswers,
  fetchUserPseudonativeIrlAnswers,
  fetchUserCustomAnswers,
} from "@/app/lib/data/answers";
import { countUserQuestionFriends } from "@/app/lib/data/userquestionfriends";
import { User } from "@/app/lib/definitions/users";
import { Answer } from "@/app/lib/definitions/answers";

export async function Answer({ answer }: { answer: Answer }) {
  const userQuestionFriendsCount = await countUserQuestionFriends(answer);

  return (
    <>
      <li>
        <p>
          {answer.question_name}
          {(answer.question_kind === "NATIVE" ||
            answer.question_kind === "NATIVEIRL") && <> / native</>}
          {answer.question_kind === "PSEUDO" && <> / pseudonative</>}
          {answer.question_kind === "CUSTOM" && <> / custom</>}
          {(answer.question_kind === "NATIVEIRL" ||
            answer.userquestion_kind === "PSEUDONATIVEIRL") && <> / irl</>}
          {answer.question_kind === "CUSTOM" &&
            userQuestionFriendsCount < 1 && <> / not shared</>}
          {answer.question_kind === "CUSTOM" &&
            userQuestionFriendsCount >= 1 && (
              <> / shared ({userQuestionFriendsCount})</>
            )}
        </p>
        <p>{answer.answer_value}</p>
      </li>
    </>
  );
}

export async function PinnedAnswers({ user }: { user: User }) {
  const pinnedAnswers = await fetchUserPinnedAnswers(user.user_id);

  return (
    <>
      {pinnedAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their pinned criteria below.</p>
          <ol className="pt-2 space-y-2">
            {pinnedAnswers.map((pinnedAnswer) => {
              return (
                <Answer answer={pinnedAnswer} key={pinnedAnswer.answer_id} />
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function UserNativeNotIrlAnswers({ user }: { user: User }) {
  const userNativeNotIrlAnswers = await fetchUserNativeNotIrlAnswers(
    user.user_id
  );

  return (
    <>
      {userNativeNotIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their native criteria below.</p>
          <ol className="pt-2 space-y-2">
            {userNativeNotIrlAnswers.map((userNativeNotIrlAnswer) => {
              return (
                <Answer
                  answer={userNativeNotIrlAnswer}
                  key={userNativeNotIrlAnswer.answer_id}
                />
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function UserNativeIrlAnswers({ user }: { user: User }) {
  const userNativeIrlAnswers = await fetchUserNativeIrlAnswers(user.user_id);

  return (
    <>
      {userNativeIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their native irl criteria below.</p>
          <ol className="pt-2 space-y-2">
            {userNativeIrlAnswers.map((userNativeIrlAnswer) => {
              return (
                <Answer
                  answer={userNativeIrlAnswer}
                  key={userNativeIrlAnswer.answer_id}
                />
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function UserPseudonativeNotIrlAnswers({ user }: { user: User }) {
  const userPseudonativeNotIrlAnswers =
    await fetchUserPseudonativeNotIrlAnswers(user.user_id);

  return (
    <>
      {userPseudonativeNotIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their pseudonative criteria below.</p>
          <ol className="pt-2 space-y-2">
            {userPseudonativeNotIrlAnswers.map(
              (userPseudonativeNotIrlAnswer) => {
                return (
                  <Answer
                    answer={userPseudonativeNotIrlAnswer}
                    key={userPseudonativeNotIrlAnswer.answer_id}
                  />
                );
              }
            )}
          </ol>
        </>
      )}
    </>
  );
}

export async function UserPseudonativeIrlAnswers({ user }: { user: User }) {
  const userPseudonativeIrlAnswers = await fetchUserPseudonativeIrlAnswers(
    user.user_id
  );

  return (
    <>
      {userPseudonativeIrlAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their pseudonative irl criteria below.</p>
          <ol className="pt-2 space-y-2">
            {userPseudonativeIrlAnswers.map((userPseudonativeIrlAnswer) => {
              return (
                <Answer
                  answer={userPseudonativeIrlAnswer}
                  key={userPseudonativeIrlAnswer.answer_id}
                />
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

export async function UserCustomAnswers({ user }: { user: User }) {
  const userCustomAnswers = await fetchUserCustomAnswers(user.user_id);

  return (
    <>
      {userCustomAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their custom criteria below.</p>
          <ol className="pt-2 space-y-2">
            {userCustomAnswers.map((userCustomAnswer) => {
              return (
                <Answer
                  answer={userCustomAnswer}
                  key={userCustomAnswer.answer_id}
                />
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}
