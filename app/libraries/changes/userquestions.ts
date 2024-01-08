import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { sql } from "@vercel/postgres";
import { DEFAULT_RETRIES } from "../data/users";
import { Answer } from "../definitions/answers";
import { User } from "../definitions/users";
import {
  CustomQuestion,
  NativeIrlQuestion,
  NativeNotIrlQuestion,
  PseudonativeQuestion,
} from "../definitions/questions";
import { PreExistingPseudonativeUserQuestion } from "../definitions/userquestions";

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
            userquestion_down_from_irl_at = NULL
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

export async function changeSetUserQuestionPseudonativeOfAnswer(
  answer: Answer,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE UserQuestions
        SET 
            userquestion_kind = 'PSEUDONATIVE',
            userquestion_updated_at = now(),
            userquestion_up_to_irl_at = NULL,
            userquestion_down_from_irl_at = now()
        WHERE userquestion_id = ${answer.userquestion_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message:
        "Database Error: Failed to Switch User Question Kind of Answer to Pseudonative.",
    };
  }
}

export async function changeDeleteAtUserQuestion(
  user: User,
  question:
    | NativeNotIrlQuestion
    | NativeIrlQuestion
    | PseudonativeQuestion
    | CustomQuestion,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        DELETE FROM UserQuestions
        WHERE user_id = ${user.user_id}
        AND question_id = ${question.question_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete At User Question.",
    };
  }
}

export async function changeCreateNativeUserQuestion(
  user: User,
  question: NativeNotIrlQuestion | NativeIrlQuestion,
  generatedUserQuestionID: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO UserQuestions (
            userquestion_id,
            user_id,
            question_id,
            userquestion_state,
            userquestion_created_at,
            userquestion_updated_at
        )
        VALUES (
            ${generatedUserQuestionID},
            ${user.user_id},
            ${question.question_id},
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
      message: "Database Error: Failed to Create User Question.",
    };
  }
}

export async function changeCreatePseudonativeNotIrlUserQuestion(
  user: User,
  questionID: string,
  generatedUserQuestionID: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO UserQuestions (
            userquestion_id,
            user_id,
            question_id,
            userquestion_state,
            userquestion_kind,
            userquestion_created_at,
            userquestion_updated_at
        )
        VALUES (
            ${generatedUserQuestionID},
            ${user.user_id},
            ${questionID},
            'LIVE',
            'PSEUDONATIVE',
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
      message:
        "Database Error: Failed to Create Pseudonative Not IRL User Question.",
    };
  }
}

export async function changeSwitchUserQuestionToPseudonative(
  userQuestion: PreExistingPseudonativeUserQuestion,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE UserQuestions
        SET 
            userquestion_kind = 'PSEUDONATIVE',
            userquestion_down_from_irl_at = now(),
            userquestion_up_to_irl_at = NULL,
            userquestion_updated_at = now()
            WHERE userquestion_id = ${userQuestion.userquestion_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message:
        "Database Error: Failed to Switch User Question Kind to Pseudonative.",
    };
  }
}

export async function changeCreatePseudonativeIrlUserQuestion(
  user: User,
  questionID: string,
  generatedUserQuestionID: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO UserQuestions (
            userquestion_id,
            user_id,
            question_id,
            userquestion_state,
            userquestion_kind,
            userquestion_created_at,
            userquestion_updated_at
        )
        VALUES (
            ${generatedUserQuestionID},
            ${user.user_id},
            ${questionID},
            'LIVE',
            'PSEUDONATIVEIRL',
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
      message:
        "Database Error: Failed to Create Pseudonative IRL User Question.",
    };
  }
}

export async function changeSwitchUserQuestionToPseudonativeIrl(
  userQuestion: PreExistingPseudonativeUserQuestion,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE UserQuestions
        SET 
            userquestion_kind = 'PSEUDONATIVEIRL',
            userquestion_up_to_irl_at = now(),
            userquestion_down_from_irl_at = NULL,
            userquestion_updated_at = now()
            WHERE userquestion_id = ${userQuestion.userquestion_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message:
        "Database Error: Failed to Switch User Question Kind to Pseudonative IRL.",
    };
  }
}

export async function changeCreateCustomUserQuestion(
  user: User,
  questionID: string,
  generatedUserQuestionID: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO UserQuestions (
            userquestion_id,
            user_id,
            question_id,
            userquestion_state,
            userquestion_created_at,
            userquestion_updated_at
        )
        VALUES (
            ${generatedUserQuestionID},
            ${user.user_id},
            ${questionID},
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
      message: "Database Error: Failed to Create Custom User Question.",
    };
  }
}
