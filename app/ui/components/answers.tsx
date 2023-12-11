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
// import { usePathname } from "next/navigation";
// import Link from "next/link";
import { Criteria } from "./Criteria";

export async function CriteriaQuestion({ answer }: { answer: Answer }) {
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

export async function CriteriaAnswer({ answer }: { answer: Answer }) {
  return (
    <>
      <p className="pt-2">{answer.answer_value}</p>
    </>
  );
}

// export async function Criteria({ answer }: { answer: Answer }) {
//   const pathname = usePathname();
//   const answerCustomizedPath = `/users/${answer.user_username}/personal-info/customized`;

//   return (
//     <>
//       {pathname === answerCustomizedPath ? (
//         <div>
//           <Link
//             href={`/users/${answer.user_username}/personal-info/user-criteria/${answer.userquestion_id}`}
//             className="underline inline-block"
//           >
//             <CriteriaQuestion answer={answer} />
//             <CriteriaAnswer answer={answer} />
//           </Link>
//         </div>
//       ) : (
//         <>
//           <CriteriaQuestion answer={answer} />
//           <CriteriaAnswer answer={answer} />
//         </>
//       )}
//     </>
//   );
// }

// export async function Answer({ answer }: { answer: Answer }) {
//   const userQuestionFriendsCount = await countUserQuestionFriends(answer);
//   const pathname = usePathname();
//   const answerCustomizedPath = `/users/${answer.user_username}/personal-info/customized`;

//   /* Pseudocode
//   I'm going to need to make another component to refactor.
//   Two in fact : <AnswerQuestion /> <AnswerAnswer />
//   Or <Criteria /> <Question /> <Answer />
//   */

//   return (
//     <>
//       {pathname === answerCustomizedPath ? (
//         <div>
//           <Link
//             href={`/users/${answer.user_username}/personal-info/user-criteria/${answer.userquestion_id}`}
//             className="underline inline-block pt-2"
//           >
//             <p className="pt-2">
//               {answer.question_name}
//               {(answer.question_kind === "NATIVE" ||
//                 answer.question_kind === "NATIVEIRL") && <> / native</>}
//               {answer.question_kind === "PSEUDO" && <> / pseudonative</>}
//               {answer.question_kind === "CUSTOM" && <> / custom</>}
//               {(answer.question_kind === "NATIVEIRL" ||
//                 answer.userquestion_kind === "PSEUDONATIVEIRL") && <> / irl</>}
//               {answer.question_kind === "CUSTOM" &&
//                 userQuestionFriendsCount < 1 && <> / not shared</>}
//               {answer.question_kind === "CUSTOM" &&
//                 userQuestionFriendsCount >= 1 && (
//                   <> / shared ({userQuestionFriendsCount})</>
//                 )}
//             </p>
//             <p className="pt-2">{answer.answer_value}</p>
//           </Link>
//         </div>
//       ) : (
//         <>
//           <p className="pt-2">
//             {answer.question_name}
//             {(answer.question_kind === "NATIVE" ||
//               answer.question_kind === "NATIVEIRL") && <> / native</>}
//             {answer.question_kind === "PSEUDO" && <> / pseudonative</>}
//             {answer.question_kind === "CUSTOM" && <> / custom</>}
//             {(answer.question_kind === "NATIVEIRL" ||
//               answer.userquestion_kind === "PSEUDONATIVEIRL") && <> / irl</>}
//             {answer.question_kind === "CUSTOM" &&
//               userQuestionFriendsCount < 1 && <> / not shared</>}
//             {answer.question_kind === "CUSTOM" &&
//               userQuestionFriendsCount >= 1 && (
//                 <> / shared ({userQuestionFriendsCount})</>
//               )}
//           </p>
//           <p className="pt-2">{answer.answer_value}</p>
//         </>
//       )}
//     </>
//   );
// }

export async function PinnedAnswers({ user }: { user: User }) {
  const pinnedAnswers = await fetchUserPinnedAnswers(user.user_id);

  return (
    <>
      {pinnedAnswers.length > 0 && (
        <>
          <p className="pt-2">Find their pinned criteria below.</p>
          <ol>
            {pinnedAnswers.map((pinnedAnswer) => {
              return (
                <li key={pinnedAnswer.answer_id}>
                  <Criteria answer={pinnedAnswer} />
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
          <ol>
            {userNativeNotIrlAnswers.map((userNativeNotIrlAnswer) => {
              return (
                <li key={userNativeNotIrlAnswer.answer_id}>
                  <Criteria answer={userNativeNotIrlAnswer} />
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
          <ol>
            {userNativeIrlAnswers.map((userNativeIrlAnswer) => {
              return (
                <li key={userNativeIrlAnswer.answer_id}>
                  <Criteria answer={userNativeIrlAnswer} />
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
          <ol>
            {userPseudonativeNotIrlAnswers.map(
              (userPseudonativeNotIrlAnswer) => {
                return (
                  <li key={userPseudonativeNotIrlAnswer.answer_id}>
                    <Criteria answer={userPseudonativeNotIrlAnswer} />
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
          <ol>
            {userPseudonativeIrlAnswers.map((userPseudonativeIrlAnswer) => {
              return (
                <li key={userPseudonativeIrlAnswer.answer_id}>
                  <Criteria answer={userPseudonativeIrlAnswer} />
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
          <ol>
            {userCustomAnswers.map((userCustomAnswer) => {
              return (
                <li key={userCustomAnswer.answer_id}>
                  <Criteria answer={userCustomAnswer} />
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}
