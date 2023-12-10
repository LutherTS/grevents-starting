import { fetchUserPinnedAnswers } from "@/app/lib/data/answers";
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
