import { sql } from "@vercel/postgres";
import { Answer } from "../definitions/answers";
import { unstable_noStore as noStore } from "next/cache";
import { User } from "../definitions/users";

export async function fetchUserPinnedAnswers(userId: string) {
  noStore();
  // console.log(userId);
  try {
    const data = await sql<Answer>`
      SELECT 
        Questions.question_name, 
        Answers.answer_value, 
        Answers.answer_id,
        UserQuestions.userquestion_is_pinned,
        Questions.question_kind,
        UserQuestions.userquestion_kind,
        UserQuestions.userquestion_id
      FROM Answers 

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id

      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND UserQuestions.userquestion_is_pinned = TRUE

      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY UserQuestions.userquestion_pinned_at DESC, Answers.answer_updated_at DESC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned answers.");
  }
}

export async function fetchUserNativeNotIrlAnswers(userId: string) {
  noStore();
  // console.log(userId);
  try {
    const data = await sql<Answer>`
      SELECT 
        Questions.question_name, 
        Answers.answer_value, 
        Answers.answer_id,
        UserQuestions.userquestion_is_pinned,
        Questions.question_kind,
        UserQuestions.userquestion_kind,
        UserQuestions.userquestion_id
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND Questions.question_kind = 'NATIVE'
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY Answers.answer_created_at ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user native not irl answers.");
  }
}

export async function fetchUserNativeIrlAnswers(userId: string) {
  noStore();
  // console.log(userId);
  try {
    const data = await sql<Answer>`
      SELECT 
        Questions.question_name, 
        Answers.answer_value, 
        Answers.answer_id,
        UserQuestions.userquestion_is_pinned,
        Questions.question_kind,
        UserQuestions.userquestion_kind,
        UserQuestions.userquestion_id
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND Questions.question_kind = 'NATIVEIRL'
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY Answers.answer_created_at ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user native irl answers.");
  }
}

export async function fetchUserPseudonativeNotIrlAnswers(userId: string) {
  noStore();
  // console.log(userId);
  try {
    const data = await sql<Answer>`
      SELECT 
        Questions.question_name, 
        Answers.answer_value, 
        Answers.answer_id,
        UserQuestions.userquestion_is_pinned,
        Questions.question_kind,
        UserQuestions.userquestion_kind,
        UserQuestions.userquestion_id
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND Questions.question_kind = 'PSEUDO'
      AND UserQuestions.userquestion_kind = 'PSEUDONATIVE'
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY Questions.question_name ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pseudonative not irl answers.");
  }
}

export async function fetchUserPseudonativeIrlAnswers(userId: string) {
  noStore();
  // console.log(userId);
  try {
    const data = await sql<Answer>`
      SELECT 
        Questions.question_name, 
        Answers.answer_value, 
        Answers.answer_id,
        UserQuestions.userquestion_is_pinned,
        Questions.question_kind,
        UserQuestions.userquestion_kind,
        UserQuestions.userquestion_id
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND Questions.question_kind = 'PSEUDO'
      AND UserQuestions.userquestion_kind = 'PSEUDONATIVEIRL'
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY Questions.question_name ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pseudonative irl answers.");
  }
}

export async function fetchUserCustomAnswers(userId: string) {
  noStore();
  // console.log(userId);
  try {
    const data = await sql<Answer>`
      SELECT 
        Questions.question_name, 
        Answers.answer_value, 
        Answers.answer_id,
        UserQuestions.userquestion_is_pinned,
        Questions.question_kind,
        UserQuestions.userquestion_kind,
        UserQuestions.userquestion_id
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND Questions.question_kind = 'CUSTOM'
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY Answers.answer_created_at ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user custom answers.");
  }
}

export async function findAnswerByUserQuestionAndUser(
  userQuestion: any, // UserQuestion
  user: User
) {
  noStore();
  // console.log(userId);
  try {
    const data = await sql<Answer>`
      SELECT 
        Questions.question_name, 
        Answers.answer_value, 
        Answers.answer_id,
        UserQuestions.userquestion_is_pinned,
        Questions.question_kind,
        UserQuestions.userquestion_kind,
        UserQuestions.userquestion_id
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Users ON Answers.user_id = Users.user_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      
      WHERE Answers.userquestion_id = ${userQuestion.userquestion_id}
      AND Answers.user_id = ${user.user_id}
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Users.user_state = 'LIVE'
      AND Questions.question_state = 'LIVE'

      LIMIT 1;
    `;
    // console.log(data);
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user question answer.");
  }
}
