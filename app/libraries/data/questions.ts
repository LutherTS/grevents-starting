import { sql } from "@vercel/postgres";
import {
  NativeNotIrlQuestion,
  NativeIrlQuestion,
  PseudonativeQuestion,
  CustomQuestion,
} from "../definitions/questions";
// import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { User } from "../definitions/users";
import { DEFAULT_RETRIES } from "./users";
import { unstable_noStore as noStore } from "next/cache";

export const NATIVE_QUESTION_LIMIT = 16;

// Only async functions are allowed to be exported in a "use server" file.
export const EMAIL_ADDRESS_QUESTION_ID = "b80f6893-f013-4964-b770-6935ef8fc4a4";

export async function fetchAllNativeNotIrlQuestions() {
  // noStore(); // since it pretty much does not change
  try {
    const run = async () => {
      const data = await sql<NativeNotIrlQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_kind = 'NATIVE'
        
        AND question_state = 'LIVE'

        ORDER BY 
            lower(question_name) ASC

        LIMIT ${NATIVE_QUESTION_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch native not irl questions.");
  }
}

export async function fetchAllNativeIrlQuestions() {
  // noStore(); // since it pretty much does not change
  try {
    const run = async () => {
      const data = await sql<NativeIrlQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_kind = 'NATIVEIRL'
        
        AND question_state = 'LIVE'

        ORDER BY 
            lower(question_name) ASC

        LIMIT ${NATIVE_QUESTION_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch native irl questions.");
  }
}

export async function fetchAllUnansweredNativeNotIrlQuestions(user: User) {
  // noStore(); // since it pretty much does not change
  try {
    const run = async () => {
      const data = await sql<NativeNotIrlQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_kind = 'NATIVE'

        AND question_id NOT IN ( -- START 

            SELECT 
                question_id 
            FROM UserQuestions

            JOIN Answers ON UserQuestions.userquestion_id = Answers.userquestion_id

            WHERE UserQuestions.user_id = ${user.user_id}

            AND UserQuestions.userquestion_state = 'LIVE'
            AND Answers.answer_state = 'LIVE'

        ) -- END
        
        AND question_state = 'LIVE'

        ORDER BY 
            lower(question_name) ASC

        LIMIT ${NATIVE_QUESTION_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch unanswered native not irl questions.");
  }
}

export async function fetchAllUnansweredNativeIrlQuestions(user: User) {
  // noStore(); // since it pretty much does not change
  try {
    const run = async () => {
      const data = await sql<NativeIrlQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_kind = 'NATIVEIRL'

        AND question_id NOT IN ( -- START 

            SELECT 
                question_id 
            FROM UserQuestions

            JOIN Answers ON UserQuestions.userquestion_id = Answers.userquestion_id

            WHERE UserQuestions.user_id = ${user.user_id}

            AND UserQuestions.userquestion_state = 'LIVE'
            AND Answers.answer_state = 'LIVE'

        ) -- END
        
        AND question_state = 'LIVE'

        ORDER BY 
            lower(question_name) ASC

        LIMIT ${NATIVE_QUESTION_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch unanswered native irl questions.");
  }
}

export async function findQuestionByQuestionID(questionId: string) {
  noStore(); // just in case of caching issues
  try {
    const run = async () => {
      const data = await sql<NativeNotIrlQuestion | NativeIrlQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_id = ${questionId} -- >NativeNotIrlQuestion< -- for 'First name' -- already exists so updated
        -- WHERE question_id = 'ba3a314a-98a4-419d-a0c7-6d9eab5ac2cf' -- >NativeNotIrlQuestion< -- for 'Other email address' -- already exists but was deleted so SQL DELETE and create new one
        -- WHERE question_id = '7de346e6-dc73-4d68-b6a3-abb5d09654cc' -- >NativeNotIrlQuestion< -- for 'Work number' -- does not exist yet so create one

        AND Questions.question_state = 'LIVE'; 
      `;
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find question by question ID.");
  }
}

export async function findPseudoQuestionByQuestionName(questionName: string) {
  noStore();
  try {
    const run = async () => {
      const data = await sql<PseudonativeQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_name = ${questionName} -- cas où la question, du moins en tant que PSEUDO, n'existe pas encore -- 'Looking for' -- DONE
        -- WHERE question_name = 'Father's birthday' -- cas où il n'y a pas encore de réponse et donc on crée les entrées correspondantes -- DONE
        -- WHERE question_name = 'Birthday' -- cas où il y a une réponse LIVE et donc on la modifie -- DONE
        -- WHERE question_name = 'Mother's birthday' -- cas où il a déjà une réponse mais elle est DELETED, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        -- WHERE question_name = 'Girlfriend's birthday' -- cas où il y a une réponse LIVE mais elle est actuellement PSEUDONATIVEIRL au lieu de PSEUDONATIVE, donc on modifie la UserQuetion à PSEUDONATIVE et on remplace la Answer -- DONE
        -- WHERE question_name = 'Crush's birthday' -- cas où il y a une réponse DELETED qui est actuellement PSEUDONATIVEIRL au lieu de PSEUDONATIVE, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        -- WHERE question_name = 'In a relationship' -- cas où la question, du moins en tant que PSEUDO, n'existe pas encore -- DONE
        -- WHERE question_name = 'Father’s birthdate' -- cas où il n'y a pas encore de réponse et donc on crée les entrées correspondantes -- DONE
        -- WHERE question_name = 'Birthdate' -- cas où il y a une réponse LIVE et donc on la modifie -- DONE
        -- WHERE question_name = 'Mother’s birthdate' -- cas où il a déjà une réponse mais elle est DELETED, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        -- WHERE question_name = 'Girlfriend’s birthdate' -- cas où il y a une réponse LIVE mais elle est actuellement PSEUDONATIVE au lieu de PSEUDONATIVEIRL, donc on modifie la UserQuetion à PSEUDONATIVEIRL et on remplace la Answer -- DONE
        -- WHERE question_name = 'Crush’s birthdate' -- cas où il y a une réponse DELETED qui est actuellement PSEUDONATIVE au lieu de PSEUDONATIVEIRL, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        AND question_kind = 'PSEUDO' -- la question est en effet pseudo

        AND question_state = 'LIVE';
      `;
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find pseudo question by question name.");
  }
}

export async function findCustomQuestionByQuestionName(questionName: string) {
  noStore();
  try {
    const run = async () => {
      const data = await sql<CustomQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_name = ${questionName} -- cas où la question, du moins en tant que CUSTOM, n'existe pas encore -- 'Favorite anime composer' -- DONE
        -- WHERE question_name = 'Favorite anime studio' -- cas où il n'y a pas encore de réponse et donc on crée les entrées correspondantes -- DONE
        -- WHERE question_name = 'Favorite anime series' -- cas où il y a une réponse LIVE et donc on la modifie -- DONE
        -- WHERE question_name = 'Favorite anime franchise' -- cas où il a déjà une réponse mais elle est DELETED, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        AND question_kind = 'CUSTOM' -- la question est en effet custom

        AND question_state = 'LIVE';
      `;
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find custom question by question name.");
  }
}
