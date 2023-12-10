// import { fetchUserByUsername } from "@/app/lib/data/users";
import Link from "next/link";
// import { notFound } from "next/navigation";

export default async function UserQuestionPage({
  params,
}: {
  params: {
    username: string;
    userquestionid: string;
  };
}) {
  const username = params.username;
  const userQuestionId = params.userquestionid;
  // const user = await fetchUserByUsername(username);

  // if (!user || !userQuestionId) {
  //   notFound();
  // }

  return (
    <>
      <main className="min-h-screen p-8 w-full flex justify-center items-center">
        <div className="text-center max-w-prose">
          <h1>Welcome to {username}&apos;s Personal Info.</h1>
          <p className="pt-2">Below is the userQuestionId so far:</p>
          <p className="pt-2">{userQuestionId}.</p>
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
    </>
  );
}
