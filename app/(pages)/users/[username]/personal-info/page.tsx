// import { fetchUserByUsername } from "@/app/lib/data/users";
// import { fetchUserPinnedAnswers } from "@/app/lib/data/answers";
// import { notFound } from "next/navigation";
import Link from "next/link";

export default async function PersonalInfo({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  // const user = await fetchUserByUsername(username);
  // const pinnedAnswers = await fetchUserPinnedAnswers(user.user_id);

  // if (!user) {
  //   notFound();
  // }

  return (
    <main className="min-h-screen p-8 w-full flex justify-center items-center">
      <div className="text-center max-w-prose">
        {/* <h1>Welcome to {user.user_app_wide_name}&apos;s Personal Info.</h1> */}
        <h1>Welcome to {username}&apos;s Personal Info.</h1>
        {/* {pinnedAnswers.length > 0 && (
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
        )} */}
        <div>
          <Link
            href={`/users/${username}/personal-info/standardized`}
            className="underline inline-block pt-2"
          >
            To all standardized criteria
          </Link>
        </div>
        <div>
          <Link
            href={`/users/${username}/personal-info/customized`}
            className="underline inline-block pt-2"
          >
            To all customized criteria
          </Link>
        </div>
      </div>
    </main>
  );
}
