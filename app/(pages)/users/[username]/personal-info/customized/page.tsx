import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  fetchUserPseudonativeNotIrlAnswers,
  fetchUserPseudonativeIrlAnswers,
  fetchUserCustomAnswers,
} from "@/app/lib/data/answers";
import { notFound } from "next/navigation";

export default async function Customized({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  const user = await fetchUserByUsername(username);
  const userPseudonativeNotIrlAnswers =
    await fetchUserPseudonativeNotIrlAnswers(user.user_id);
  const userPseudonativeIrlAnswers = await fetchUserPseudonativeIrlAnswers(
    user.user_id
  );
  const userCustomAnswers = await fetchUserCustomAnswers(user.user_id);

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen p-8 w-full flex justify-center items-center">
      <div className="text-center max-w-prose">
        <h1>Welcome to {user.user_app_wide_name}&apos;s Customized Info.</h1>
        {/* <h1>Welcome to {username}&apos;s Customized Info.</h1> */}
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
      </div>
    </main>
  );
}
