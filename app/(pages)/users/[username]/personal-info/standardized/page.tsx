// import { fetchUserByUsername } from "@/app/lib/data/users";
// import {
//   fetchUserNativeIrlAnswers,
//   fetchUserNativeNotIrlAnswers,
// } from "@/app/lib/data/answers";
// import { notFound } from "next/navigation";
import Link from "next/link";

export default async function Stardardized({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  // const user = await fetchUserByUsername(username);
  // const userNativeNotIrlAnswers = await fetchUserNativeNotIrlAnswers(
  //   user.user_id
  // );
  // const userNativeIrlAnswers = await fetchUserNativeIrlAnswers(user.user_id);

  // if (!user) {
  //   notFound();
  // }

  return (
    <main className="min-h-screen p-8 w-full flex justify-center items-center">
      <div className="text-center max-w-prose">
        {/* <h1>Welcome to {user.user_app_wide_name}&apos;s Standardized Info.</h1> */}
        <h1>Welcome to {username}&apos;s Standardized Info.</h1>
        {/* {userNativeNotIrlAnswers.length > 0 && (
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
        )} */}
        {/* {userNativeIrlAnswers.length > 0 && (
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
        )} */}
        <div>
          <Link
            href={`/users/${username}/personal-info/customized`}
            className="underline inline-block pt-2"
          >
            To Customized criteria
          </Link>
        </div>
        <div>
          <Link
            href={`/users/${username}/personal-info`}
            className="underline inline-block pt-2"
          >
            To Personal Info
          </Link>
        </div>
      </div>
    </main>
  );
}
