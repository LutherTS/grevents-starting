// import { fetchUserByUsername } from "@/app/lib/data/users";
// import { fetchCustomUserQuestionByIDAndUser } from "@/app/lib/data/userquestions";
// import { findAnswerByUserQuestionAndUser } from "@/app/lib/data/answers";
// import { Criteria } from "@/app/ui/components/answers";
// import { ManyFriends } from "@/app/ui/components/contacts";
// import { ManyUserQuestionFriends } from "@/app/ui/components/userquestionfriends";
// import { notFound } from "next/navigation";
import Link from "next/link";

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
  // const userQuestion = await fetchCustomUserQuestionByIDAndUser(
  //   userQuestionId,
  //   user
  // );
  // const userQuestionAnswer = await findAnswerByUserQuestionAndUser(
  //   userQuestion,
  //   user
  // );

  // if (!user || !userQuestion || !userQuestionAnswer) {
  //   notFound();
  // }

  return (
    <>
      <main className="min-h-screen px-8 py-32 w-full flex justify-center items-center">
        <div className="text-center max-w-prose">
          <h1>Welcome to {username}&apos;s User Criteria.</h1>
          <p className="pt-2">Below is the userQuestionId so far:</p>
          <p className="pt-2">{userQuestionId}.</p>
          {/* <h1 className="font-semibold">
            Welcome to {user.user_app_wide_name}&apos;s &quot;
            {userQuestion.question_name}&quot; User Criteria.
          </h1>
          <Criteria answer={userQuestionAnswer} />
          <ManyFriends user={user} />
          <ManyUserQuestionFriends userQuestion={userQuestion} /> */}
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
