// import { fetchUserByUsername } from "@/app/lib/data/users";
// import { fetchCustomUserQuestionByIDAndUser } from "@/app/lib/data/userquestions";
// import { findAnswerByUserQuestionAndUser } from "@/app/lib/data/answers";
// import { Criteria } from "@/app/ui/components/answers";
// import { ManyFriends } from "@/app/ui/components/contacts";
// import { ManyUserQuestionFriends } from "@/app/ui/components/userquestionfriends";
// import { notFound } from "next/navigation";
import { PageLink } from "@/app/ui/components/links";

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
  //   user,
  // );
  // const userQuestionAnswer = await findAnswerByUserQuestionAndUser(
  //   userQuestion,
  //   user,
  // );

  // if (!user || !userQuestion || !userQuestionAnswer) {
  //   notFound();
  // }

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
        <div className="max-w-prose text-center">
          <h1>Welcome to {username}&apos;s User Criteria.</h1>
          <p className="pt-2">Below is the userQuestionId so far</p>
          <p className="pt-2">{userQuestionId}</p>
          {/* <h1 className="font-semibold">
            Welcome to {user.user_app_wide_name}&apos;s &quot;
            {userQuestion.question_name}&quot; User Criteria.
          </h1>
          <Criteria answer={userQuestionAnswer} />
          <ManyFriends user={user} />
          <ManyUserQuestionFriends userQuestion={userQuestion} /> */}
          <PageLink
            href={`/users/${username}/personal-info/customized`}
            name={"To Customized criteria"}
          />
          <PageLink
            href={`/users/${username}/personal-info`}
            name={"To Personal Info"}
          />
        </div>
      </main>
    </>
  );
}
