import { sql } from "@vercel/postgres";
import { User } from "../definitions/users";
import { UserQuestion } from "../definitions/userquestions";
import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";

export async function fetchCustomUserQuestionByIDAndUser(
  userQuestionId: string,
  user: User,
) {
  noStore();
  // console.log(userQuestionId);
  // console.log(user);
  try {
    const run = async () => {
      const data = await sql<UserQuestion>` -- UserQuestion
    SELECT
        UserQuestions.userquestion_id,
        UserQuestions.user_id,
        UserQuestions.question_id,
        UserQuestions.userquestion_state,
        UserQuestions.userquestion_kind,
        UserQuestions.userquestion_is_pinned,
        UserQuestions.userquestion_created_at,
        UserQuestions.userquestion_updated_at,
        UserQuestions.userquestion_pinned_at,
        UserQuestions.userquestion_up_to_irl_at,
        UserQuestions.userquestion_down_to_irl_at,
        Users.user_state,
        Users.user_status_title,
        Users.user_status_dashboard,
        Users.user_status_personal_info,
        Users.user_username,
        Users.user_app_wide_name,
        Users.user_friend_code,
        Users.user_has_temporary_password,
        Users.user_created_at,
        Users.user_updated_at,
        Questions.question_state,
        Questions.question_kind,
        Questions.question_name,
        Questions.question_is_suggested,
        Questions.question_created_at,
        Questions.question_updated_at
    FROM UserQuestions

    JOIN Users ON UserQuestions.user_id = Users.user_id
    JOIN Questions ON UserQuestions.question_id = Questions.question_id
    
    WHERE UserQuestions.userquestion_id = ${userQuestionId}
    AND Users.user_id = ${user.user_id}
    AND Questions.question_kind = 'CUSTOM'
    
    AND UserQuestions.userquestion_state = 'LIVE'
    AND Users.user_state = 'LIVE'
    AND Questions.question_state = 'LIVE'

    LIMIT 1;
    `;
      // console.log(data);
      return data.rows[0];
    };
    console.log(await pRetry(run, { retries: 5 }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user question data.");
  }
}
