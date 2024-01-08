import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { sql } from "@vercel/postgres";
import { DEFAULT_RETRIES } from "../data/users";

export async function changeCreatePseudoQuestion(
  initialQuestionName: string,
  generatedQuestionID: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO Questions (
            question_id,
            question_name,
            question_state,
            question_kind,
            question_created_at,
            question_updated_at
        )
        VALUES (
            ${generatedQuestionID},
            ${initialQuestionName},
            'LIVE',
            'PSEUDO',
            now(),
            now()
        )
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Pseudo Question.",
    };
  }
}

export async function changeCreateCustomQuestion(
  initialQuestionName: string,
  generatedQuestionID: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO Questions (
            question_id,
            question_name,
            question_state,
            question_kind,
            question_created_at,
            question_updated_at
        )
        VALUES (
            ${generatedQuestionID},
            ${initialQuestionName},
            'LIVE',
            'CUSTOM',
            now(),
            now()
        )
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Custom Question.",
    };
  }
}
