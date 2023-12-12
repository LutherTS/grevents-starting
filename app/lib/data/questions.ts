import { sql } from "@vercel/postgres";
import {
  NativeNotIrlQuestion,
  NativeIrlQuestion,
} from "../definitions/questions";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchAllNativeNotIrlQuestions() {
  noStore();
  try {
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
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch native not irl questions.");
  }
}

export async function fetchAllNativeIrlQuestions() {
  noStore();
  try {
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
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch native irl questions.");
  }
}
