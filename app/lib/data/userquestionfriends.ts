import { sql } from "@vercel/postgres";
import { Answer } from "../definitions/answers";
import { UserQuestion } from "../definitions/userquestions";
import { UserQuestionFriend } from "../definitions/userquestionfriends";
import { unstable_noStore as noStore } from "next/cache";

export async function countUserQuestionFriends(
  answerOrUserQuestion: Answer | UserQuestion,
) {
  noStore();
  // console.log(answerOrUserQuestion.question_kind);
  // console.log(answerOrUserQuestion.userquestion_id);
  if (answerOrUserQuestion.question_kind === "CUSTOM") {
    try {
      const data = await sql`
      SELECT COUNT(userquestionfriend_id) FROM UserQuestionFriends
  
      WHERE userquestion_id = ${answerOrUserQuestion.userquestion_id}
      
      AND userquestionfriend_state = 'LIVE';
      `;
      // console.log(data);
      return data.rows[0].count;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to count user question friends.");
    }
  }
}

export async function fetchAllUserQuestionFriends(userQuestion: UserQuestion) {
  noStore();
  // console.log(userQuestion);
  try {
    const data = await sql<UserQuestionFriend>`
      SELECT 
        u.user_app_wide_name, 
        u.user_username, 
        uqf.userquestionfriend_id 
      FROM UserQuestionFriends uqf
      
      JOIN Contacts c1 ON uqf.contact_id = c1.contact_id
      JOIN Users u ON c1.user_last_id = u.user_id
      JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
      
      WHERE uqf.userquestion_id = ${userQuestion.userquestion_id}
      AND (
          (
              c1.contact_kind = 'FRIEND' AND 
              c2.contact_kind = 'FRIEND' AND
              c1.contact_blocking = FALSE AND
              c2.contact_blocking = FALSE -- amis “simple”
          )
          OR (
              c1.contact_kind = 'IRL' AND 
              c2.contact_kind = 'IRL' AND
              c1.contact_blocking = FALSE AND
              c2.contact_blocking = FALSE -- amis “dans la vraie vie”
          )
      )
      
      AND uqf.userquestionfriend_state = 'LIVE'
      AND c1.contact_state = 'LIVE'
      AND u.user_state = 'LIVE'
      AND c2.contact_state = 'LIVE'

      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user friends.");
  }
}
