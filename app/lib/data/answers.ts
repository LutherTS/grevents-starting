import { sql } from "@vercel/postgres";
// import { unstable_noStore as noStore } from "next/cache";

export async function fetchUserPinnedAnswers(user_id: string) {
  // noStore();
  // console.log(user_id);
  try {
    const data = await sql`
      SELECT Questions.question_name, Answers.answer_value, Answers.answer_id FROM Answers 
      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id

      WHERE UserQuestions.user_id = ${user_id}
      AND Answers.user_id = ${user_id}
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

export async function fetchUserNativeNotIrlAnswers(user_id: string) {
  // noStore();
  // console.log(user_id);
  try {
    const data = await sql`
      SELECT Questions.question_name, Answers.answer_value, Answers.answer_id, UserQuestions.userquestion_id FROM Answers 
      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${user_id}
      AND Answers.user_id = ${user_id}
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

export async function fetchUserNativeIrlAnswers(user_id: string) {
  // noStore();
  // console.log(user_id);
  try {
    const data = await sql`
      SELECT Questions.question_name, Answers.answer_value, Answers.answer_id, UserQuestions.userquestion_id FROM Answers 
      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${user_id}
      AND Answers.user_id = ${user_id}
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

export async function fetchUserPseudonativeNotIrlAnswers(user_id: string) {
  // noStore();
  console.log(user_id);
  try {
    const data = await sql`
      SELECT Questions.question_name, Answers.answer_value, Answers.answer_id, UserQuestions.userquestion_id FROM Answers 
      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${user_id}
      AND Answers.user_id = ${user_id}
      AND Questions.question_kind = 'PSEUDO'
      AND UserQuestions.userquestion_kind = 'PSEUDONATIVE'
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY Questions.question_name ASC
      LIMIT 10;
    `;
    console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pseudonative not irl answers.");
  }
}

export async function fetchUserPseudonativeIrlAnswers(user_id: string) {
  // noStore();
  console.log(user_id);
  try {
    const data = await sql`
      SELECT Questions.question_name, Answers.answer_value, Answers.answer_id, UserQuestions.userquestion_id FROM Answers 
      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${user_id}
      AND Answers.user_id = ${user_id}
      AND Questions.question_kind = 'PSEUDO'
      AND UserQuestions.userquestion_kind = 'PSEUDONATIVEIRL'
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY Questions.question_name ASC
      LIMIT 10;
    `;
    console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pseudonative irl answers.");
  }
}

export async function fetchUserCustomAnswers(user_id: string) {
  // noStore();
  console.log(user_id);
  try {
    const data = await sql`
      SELECT Questions.question_name, Answers.answer_value, Answers.answer_id, UserQuestions.userquestion_id FROM Answers 
      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${user_id}
      AND Answers.user_id = ${user_id}
      AND Questions.question_kind = 'CUSTOM'
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY Answers.answer_created_at ASC
      LIMIT 10;
    `;
    console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user custom answers.");
  }
}
