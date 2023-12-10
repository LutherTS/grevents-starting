import {
  fetchUserCustomAnswers,
  fetchUserNativeIrlAnswers,
  fetchUserNativeNotIrlAnswers,
  fetchUserPinnedAnswers,
  fetchUserPseudonativeIrlAnswers,
  fetchUserPseudonativeNotIrlAnswers,
} from "@/app/lib/data/answers";
import { User } from "@/app/lib/definitions/users";

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
                <li key={pinnedAnswer.answer_id}>
                  <p>{pinnedAnswer.question_name}</p>
                  <p>{pinnedAnswer.answer_value}</p>
                </li>
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
                <li key={userNativeNotIrlAnswer.answer_id}>
                  <p>{userNativeNotIrlAnswer.question_name}</p>
                  <p>{userNativeNotIrlAnswer.answer_value}</p>
                </li>
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
                <li key={userNativeIrlAnswer.answer_id}>
                  <p>{userNativeIrlAnswer.question_name}</p>
                  <p>{userNativeIrlAnswer.answer_value}</p>
                </li>
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
                  <li key={userPseudonativeNotIrlAnswer.answer_id}>
                    <p>{userPseudonativeNotIrlAnswer.question_name}</p>
                    <p>{userPseudonativeNotIrlAnswer.answer_value}</p>
                  </li>
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
                <li key={userPseudonativeIrlAnswer.answer_id}>
                  <p>{userPseudonativeIrlAnswer.question_name}</p>
                  <p>{userPseudonativeIrlAnswer.answer_value}</p>
                </li>
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
                <li key={userCustomAnswer.answer_id}>
                  <p>{userCustomAnswer.question_name}</p>
                  <p>{userCustomAnswer.answer_value}</p>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}
