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
  try {
    const run = async () => {
      const data = await sql<UserQuestion>` -- UserQuestion
        SELECT
            UserQuestions.userquestion_id,
            UserQuestions.user_id,
            UserQuestions.question_id,
            UserQuestions.userquestion_state, -- why
            UserQuestions.userquestion_kind, -- why
            UserQuestions.userquestion_is_pinned, -- why
            UserQuestions.userquestion_created_at, -- why
            UserQuestions.userquestion_updated_at, -- why
            UserQuestions.userquestion_pinned_at, -- why
            UserQuestions.userquestion_up_to_irl_at, -- why
            UserQuestions.userquestion_down_from_irl_at, -- why
            Users.user_state, -- why
            Users.user_status_title, -- why
            Users.user_status_dashboard, -- why
            Users.user_status_personal_info, -- why
            Users.user_username, -- why
            Users.user_app_wide_name, -- why
            Users.user_friend_code, -- why
            Users.user_has_temporary_password, -- why
            Users.user_created_at, -- why
            Users.user_updated_at, -- why
            Questions.question_state, -- why
            Questions.question_kind, -- why
            Questions.question_name,
            Questions.question_is_suggested, -- why
            Questions.question_created_at, -- why
            Questions.question_updated_at -- why
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
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
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
        AND Questions.question_state = 'LIVE' -- la question posée est opérationnelle

        LIMIT 1;
      `;
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
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
        AND Questions.question_state = 'LIVE' -- la question posée est opérationnelle

        LIMIT 1;
      `;
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
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
        AND Questions.question_state = 'LIVE' -- la question posée est opérationnelle

        LIMIT 1;
      `;
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find pre-existing custom user question.");
  }
}
