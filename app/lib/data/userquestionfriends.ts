import { sql } from "@vercel/postgres";
import { Answer } from "../definitions/answers";
import { unstable_noStore as noStore } from "next/cache";

export async function countUserQuestionFriends(answer: Answer) {
  noStore();
  // console.log(answer.question_kind);
  // console.log(answer.userquestion_id);
  if (answer.question_kind === "CUSTOM") {
    try {
      const data = await sql`
      SELECT COUNT(userquestionfriend_id) FROM UserQuestionFriends
  
      WHERE userquestion_id = ${answer.userquestion_id}
      
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
