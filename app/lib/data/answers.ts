import { sql } from "@vercel/postgres";

export async function fetchUserPinnedAnswers(user_id: string) {
  // console.log(user_id);
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

      ORDER BY UserQuestions.userquestion_pinned_at DESC, Answers.answer_updated_at DESC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned answers.");
  }
}
