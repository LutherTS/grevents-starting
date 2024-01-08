import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { sql } from "@vercel/postgres";
import { DEFAULT_RETRIES } from "../data/users";
import { Answer } from "../definitions/answers";

export async function changePinUserQuestionOfAnswer(answer: Answer) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE UserQuestions
        SET 
            userquestion_is_pinned = TRUE,
            userquestion_updated_at = now(),
            userquestion_pinned_at = now()
        WHERE userquestion_id = ${answer.userquestion_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Pin User Question of Answer.",
    };
  }
}

export async function changeUnpinUserQuestionOfAnswer(answer: Answer) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE UserQuestions
        SET 
            userquestion_is_pinned = FALSE,
            userquestion_updated_at = now(),
            userquestion_pinned_at = NULL
        WHERE userquestion_id = ${answer.userquestion_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Unpin User Question of Answer.",
    };
  }
}

export async function changeSetUserQuestionPseudonativeIrlOfAnswer(
  answer: Answer,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE UserQuestions
        SET 
            userquestion_kind = 'PSEUDONATIVEIRL',
            userquestion_updated_at = now(),
            userquestion_up_to_irl_at = now(),
            userquestion_down_to_irl_at = NULL
        WHERE userquestion_id = ${answer.userquestion_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message:
        "Database Error: Failed to Switch User Question Kind of Answer to Pseudonative Irl.",
    };
  }
}
