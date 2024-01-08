import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { sql } from "@vercel/postgres";
import { DEFAULT_RETRIES } from "../data/users";
import { Answer } from "../definitions/answers";
import { User } from "../definitions/users";
import { PreExistingNativeUserQuestion } from "../definitions/userquestions";

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

export async function changeUpdateAnswerValueByAnswerID(
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
      message: "Database Error: Failed to Update Answer Value By Answer ID.",
    };
  }
}

export async function changeCreateAnswer(
  user: User,
  initialAnswerValue: string,
  generatedAnswerID: string,
  generatedUserQuestionID: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO Answers (
            answer_id,
            userquestion_id,
            user_id,
            answer_value,
            answer_state,
            answer_created_at,
            answer_updated_at
        )
        VALUES (
            ${generatedAnswerID},
            ${generatedUserQuestionID},
            ${user.user_id},
            ${initialAnswerValue},
            'LIVE',
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
      message: "Database Error: Failed to Create Answer.",
    };
  }
}

export async function changeDeleteAtAnswer(
  userQuestion: PreExistingNativeUserQuestion,
  user: User,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        DELETE FROM Answers
        WHERE userquestion_id = ${userQuestion.userquestion_id}
        AND user_id = ${user.user_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete At Answer.",
    };
  }
}

export async function changeUpdateAnswerValueByUserQuestionAndUser(
  userQuestion: PreExistingNativeUserQuestion,
  user: User,
  initialAnswerValue: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Answers
        SET 
            answer_value = ${initialAnswerValue},
            answer_updated_at = now()
            WHERE userquestion_id = ${userQuestion.userquestion_id}
            AND user_id = ${user.user_id}
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
