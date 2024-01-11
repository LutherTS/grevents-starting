import { sql } from "@vercel/postgres";
import { User } from "../definitions/users";
import {
  PreExistingCustomUserQuestion,
  PreExistingNativeUserQuestion,
  PreExistingPseudonativeUserQuestion,
  UserQuestion,
} from "../definitions/userquestions";
import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { DEFAULT_RETRIES } from "./users";
import {
  CustomQuestion,
  NativeIrlQuestion,
  NativeNotIrlQuestion,
  PseudonativeQuestion,
} from "../definitions/questions";

export async function fetchCustomUserQuestionByIDAndUser(
  userQuestionId: string,
  user: User,
) {
  // noStore(); // since its for its own page
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
            UserQuestions.userquestion_down_from_irl_at,
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')
        AND Questions.question_state = 'LIVE'

        LIMIT 1;
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user question data.");
  }
}

export async function findPreExistingNativeUserQuestion(
  user: User,
  question: NativeNotIrlQuestion | NativeIrlQuestion,
) {
  noStore();
  // console.log(questionId);
  try {
    const run = async () => {
      const data = await sql<PreExistingNativeUserQuestion>`
        SELECT 
            UserQuestions.userquestion_id, 
            UserQuestions.userquestion_state,
            Questions.question_kind,
            Answers.answer_state
        FROM UserQuestions

        JOIN Users ON UserQuestions.user_id = Users.user_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Answers ON Answers.userquestion_id = UserQuestions.userquestion_id
      
        WHERE Users.user_id = ${user.user_id}
        AND Questions.question_id = ${question.question_id}
      
        AND (
            UserQuestions.userquestion_state = 'LIVE' -- la jointure entre la question et la personne à laquelle elle a été posée est opérationnelle
            OR UserQuestions.userquestion_state = 'DELETED' -- car il me faudra lancer la suite dépendamment de si la UserQuestion et/ou la Answer est/sont DELETED
        )
        AND (
            Answers.answer_state = 'LIVE'
            OR Answers.answer_state = 'DELETED'
        )

        AND Users.user_state = 'LIVE' -- la personne qui y a répondu est 
        AND Questions.question_state = 'LIVE'; -- la question posée est opérationnelle
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find pre-existing native user question.");
  }
}

export async function findPreExistingPseudonativeUserQuestion(
  user: User,
  question: PseudonativeQuestion,
) {
  noStore();
  // console.log(questionId);
  try {
    const run = async () => {
      const data = await sql<PreExistingPseudonativeUserQuestion>`
        SELECT 
            UserQuestions.userquestion_id, 
            UserQuestions.userquestion_state,
            Questions.question_kind,
            UserQuestions.userquestion_kind, -- only addition to inspired query
            Answers.answer_state
        FROM UserQuestions

        JOIN Users ON UserQuestions.user_id = Users.user_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Answers ON Answers.userquestion_id = UserQuestions.userquestion_id
      
        WHERE Users.user_id = ${user.user_id}
        AND Questions.question_id = ${question.question_id}
      
        AND (
            UserQuestions.userquestion_state = 'LIVE' -- la jointure entre la question et la personne à laquelle elle a été posée est opérationnelle
            OR UserQuestions.userquestion_state = 'DELETED' -- car il me faudra lancer la suite dépendamment de si la UserQuestion et/ou la Answer est/sont DELETED
        )
        AND (
            Answers.answer_state = 'LIVE'
            OR Answers.answer_state = 'DELETED'
        )

        AND Users.user_state = 'LIVE' -- la personne qui y a répondu est 
        AND Questions.question_state = 'LIVE'; -- la question posée est opérationnelle
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find pre-existing pseudonative user question.");
  }
}

export async function findPreExistingCustomUserQuestion(
  user: User,
  question: CustomQuestion,
) {
  noStore();
  // console.log(questionId);
  try {
    const run = async () => {
      const data = await sql<PreExistingCustomUserQuestion>`
        SELECT 
            UserQuestions.userquestion_id, 
            UserQuestions.userquestion_state,
            Questions.question_kind,
            Answers.answer_state
        FROM UserQuestions

        JOIN Users ON UserQuestions.user_id = Users.user_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Answers ON Answers.userquestion_id = UserQuestions.userquestion_id
      
        WHERE Users.user_id = ${user.user_id}
        AND Questions.question_id = ${question.question_id}
      
        AND (
            UserQuestions.userquestion_state = 'LIVE' -- la jointure entre la question et la personne à laquelle elle a été posée est opérationnelle
            OR UserQuestions.userquestion_state = 'DELETED' -- car il me faudra lancer la suite dépendamment de si la UserQuestion et/ou la Answer est/sont DELETED
        )
        AND (
            Answers.answer_state = 'LIVE'
            OR Answers.answer_state = 'DELETED'
        )

        AND Users.user_state = 'LIVE' -- la personne qui y a répondu est 
        AND Questions.question_state = 'LIVE'; -- la question posée est opérationnelle
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find pre-existing custom user question.");
  }
}
