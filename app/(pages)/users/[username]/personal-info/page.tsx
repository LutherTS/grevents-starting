import { sql } from "@vercel/postgres";

// /* To limit database calls during development
async function fetchUserByUsername(username: string) {
  // console.log(username);
  try {
    const data = await sql`
      SELECT * FROM Users
      WHERE user_username = ${username}
      AND user_state = 'LIVE'
      LIMIT 1;
    `;
    // console.log(data);
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

async function fetchUserPinnedAnswers(user_id: string) {
  console.log(user_id);
  try {
    const data = await sql`
      SELECT Questions.question_name, Answers.answer_value, Answers.answer_id FROM Answers 
      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id

      WHERE UserQuestions.user_id = ${user_id}
      AND Answers.user_id = ${user_id}
      AND UserQuestions.userquestion_is_pinned = TRUE

      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY UserQuestions.userquestion_pinned_at, Answers.answer_updated_at
      LIMIT 10;
    `;
    console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned answers.");
  }
}
// */

export default async function PersonalInfo({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  const user = await fetchUserByUsername(username);
  const pinnedAnswers = await fetchUserPinnedAnswers(user.user_id);

  return (
    <main className="min-h-screen p-8 w-full flex justify-center items-center">
      <div className="text-center max-w-prose">
        <h1>Welcome to {user.user_app_wide_name}&apos;s Personal Info.</h1>
        {/* <h1>Welcome to {username}&apos;s Personal Info.</h1> */}
        <p className="pt-2">Find their pinned criteria below.</p>
        {pinnedAnswers && (
          <ol className="pt-4 space-y-2">
            {pinnedAnswers.map((pinnedAnswer) => {
              return (
                <li key={pinnedAnswer.answer_id}>
                  <p>{pinnedAnswer.question_name}</p>
                  <p>{pinnedAnswer.answer_value}</p>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </main>
  );
}
