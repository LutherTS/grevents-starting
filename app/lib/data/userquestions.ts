import { sql } from "@vercel/postgres";
import { User } from "../definitions/users";
import { UserQuestion } from "../definitions/userquestions";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchUserQuestionByIDAndUser(
  userQuestionId: string,
  user: User
) {
  noStore();
  // console.log(userQuestionId);
  // console.log(user);
  try {
    const data = await sql<UserQuestion>` -- UserQuestion
    SELECT * FROM UserQuestions

    JOIN Users ON UserQuestions.user_id = Users.user_id
    JOIN Questions ON UserQuestions.question_id = Questions.question_id
    
    WHERE UserQuestions.userquestion_id = ${userQuestionId}
    AND Users.user_id = ${user.user_id}
    
    AND UserQuestions.userquestion_state = 'LIVE'
    AND Users.user_state = 'LIVE'
    AND Questions.question_state = 'LIVE'

    LIMIT 1;
    `;
    // console.log(data);
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user question data.");
  }
}
