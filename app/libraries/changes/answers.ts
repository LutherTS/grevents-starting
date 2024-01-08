import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { sql } from "@vercel/postgres";
import { DEFAULT_RETRIES } from "../data/users";
import { Answer } from "../definitions/answers";

export async function changeUpdateDeleteAnswer(answer: Answer) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Answers
        SET 
            answer_state = 'DELETED',
            answer_updated_at = now()
        WHERE answer_id = ${answer.answer_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Deleted Answer Value.",
    };
  }
}

export async function changeUpdateAnswerValue(
  answer: Answer,
  answerValue: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Answers
        SET 
            answer_value = ${answerValue},
            answer_updated_at = now()
        WHERE answer_id = ${answer.answer_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Answer Value.",
    };
  }
}
