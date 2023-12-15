import { sql } from "@vercel/postgres";
// import { Answer } from "../definitions/answers"; // no longer used
import { UserQuestion } from "../definitions/userquestions";
import { UserQuestionFriend } from "../definitions/userquestionfriends";
import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";

export async function countUserQuestionFriends(
  userQuestion: UserQuestion, // | Answer , // no longer used this way
) {
  // noStore(); // since adding and removing will revalidate
  // console.log(userQuestion.question_kind);
  // console.log(userQuestion.userquestion_id);
  if (userQuestion.question_kind === "CUSTOM") {
    try {
      const run = async () => {
        const data = await sql`
      SELECT COUNT(userquestionfriend_id) FROM UserQuestionFriends
  
      WHERE userquestion_id = ${userQuestion.userquestion_id}
      
      AND userquestionfriend_state = 'LIVE';
      `;
        // console.log(data);
        return data.rows[0].count;
      };
      const data = await pRetry(run, { retries: 5 });
      // console.log(data);
      return data;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to count user question friends.");
    }
  }
}

export async function fetchAllUserQuestionFriends(userQuestion: UserQuestion) {
  // noStore(); // since adding and removing will revalidate
  // console.log(userQuestion);
  try {
    const run = async () => {
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
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user friends.");
  }
}
