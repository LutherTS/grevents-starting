import { sql } from "@vercel/postgres";
import {
  NativeNotIrlQuestion,
  NativeIrlQuestion,
} from "../definitions/questions";
import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";

export async function fetchAllNativeNotIrlQuestions() {
  noStore();
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

      LIMIT 10;
    `;
      // console.log(data);
      return data.rows;
    };
    console.log(await pRetry(run, { retries: 5 }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch native not irl questions.");
  }
}

export async function fetchAllNativeIrlQuestions() {
  noStore();
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

      LIMIT 10;
    `;
      // console.log(data);
      return data.rows;
    };
    console.log(await pRetry(run, { retries: 5 }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch native irl questions.");
  }
}
