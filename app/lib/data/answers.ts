import { sql } from "@vercel/postgres";
import { Answer } from "../definitions/answers";
import { User } from "../definitions/users";
import { UserQuestion } from "../definitions/userquestions";
import { unstable_noStore as noStore } from "next/cache";
// import pRetry, { AbortError } from "p-retry";

/* Moving on from p-retry for now.
const run = async () => {
	const response = await fetch('https://sindresorhus.com/unicorn');

	// Abort retrying if the resource doesn't exist
	if (response.status === 404) {
		throw new AbortError(response.statusText);
	}

	return response.blob();
};

console.log(await pRetry(run, {retries: 5}));
*/

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
          UserQuestions.userquestion_id,
          Users.user_username
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

      ORDER BY 
          UserQuestions.userquestion_pinned_at DESC, 
          Answers.answer_updated_at DESC
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
          UserQuestions.userquestion_id,
          Users.user_username
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

      ORDER BY 
          Answers.answer_created_at ASC
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
          UserQuestions.userquestion_id,
          Users.user_username
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

      ORDER BY 
          Answers.answer_created_at ASC
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
          UserQuestions.userquestion_id,
          Users.user_username
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

      ORDER BY 
          Questions.question_name ASC
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
          UserQuestions.userquestion_id,
          Users.user_username
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

      ORDER BY 
          Questions.question_name ASC
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
          UserQuestions.userquestion_id,
          Users.user_username
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
  userQuestion: UserQuestion,
  user: User,
) {
  noStore();
  // console.log(userQuestion);
  // console.log(user);
  try {
    const data = await sql<Answer>`
      SELECT 
        Questions.question_name, 
        Answers.answer_value, 
        Answers.answer_id,
        UserQuestions.userquestion_is_pinned,
        Questions.question_kind,
        UserQuestions.userquestion_kind,
        UserQuestions.userquestion_id,
        Users.user_username
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

export async function fetchUserPinnedNotIrlAnswers(userId: string) {
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
          UserQuestions.userquestion_id,
          Users.user_username
      FROM Answers 

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id

      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND UserQuestions.userquestion_is_pinned = TRUE
      AND (
          (
              Questions.question_kind = 'NATIVE'
          )
          OR (
              Questions.question_kind = 'PSEUDO' AND
              UserQuestions.userquestion_kind = 'PSEUDONATIVE'
          )
      )

      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY 
          UserQuestions.userquestion_pinned_at DESC, 
          Answers.answer_updated_at DESC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not irl answers.");
  }
}

export async function fetchUserUnpinnedNativeNotIrlAnswers(userId: string) {
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
          UserQuestions.userquestion_id,
          Users.user_username
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND Questions.question_kind = 'NATIVE'
      AND UserQuestions.userquestion_is_pinned = FALSE
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY 
          Answers.answer_created_at ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user unpinned native not irl answers.");
  }
}

export async function fetchUserUnpinnedPseudonativeNotIrlAnswers(
  userId: string,
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
          UserQuestions.userquestion_id,
          Users.user_username
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND Questions.question_kind = 'PSEUDO'
      AND UserQuestions.userquestion_kind = 'PSEUDONATIVE'
      AND UserQuestions.userquestion_is_pinned = FALSE
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY 
          Questions.question_name ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned pseudonative not irl answers.",
    );
  }
}

export async function fetchUserPinnedNotAndIrlAnswers(userId: string) {
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
          UserQuestions.userquestion_id,
          Users.user_username
      FROM Answers 

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id

      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND UserQuestions.userquestion_is_pinned = TRUE
      AND (
          (
              Questions.question_kind = 'NATIVE'
          )
          OR (
              Questions.question_kind = 'NATIVEIRL'
          )
          OR (
              Questions.question_kind = 'PSEUDO' AND
              UserQuestions.userquestion_kind = 'PSEUDONATIVE'
          )
          OR (
              Questions.question_kind = 'PSEUDO' AND
              UserQuestions.userquestion_kind = 'PSEUDONATIVEIRL'
          )
      )

      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY 
          UserQuestions.userquestion_pinned_at DESC, 
          Answers.answer_updated_at DESC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not and irl answers.");
  }
}

export async function fetchUserUnpinnedNativeIrlAnswers(userId: string) {
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
          UserQuestions.userquestion_id,
          Users.user_username
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND Questions.question_kind = 'NATIVEIRL'
      AND UserQuestions.userquestion_is_pinned = FALSE
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY 
          Answers.answer_created_at ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user unpinned native irl answers.");
  }
}

export async function fetchUserUnpinnedPseudonativeIrlAnswers(userId: string) {
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
          UserQuestions.userquestion_id,
          Users.user_username
      FROM Answers

      JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
      JOIN Questions ON UserQuestions.question_id = Questions.question_id
      JOIN Users ON Answers.user_id = Users.user_id
      
      WHERE UserQuestions.user_id = ${userId}
      AND Answers.user_id = ${userId}
      AND Questions.question_kind = 'PSEUDO'
      AND UserQuestions.userquestion_kind = 'PSEUDONATIVEIRL'
      AND UserQuestions.userquestion_is_pinned = FALSE
      
      AND Answers.answer_state = 'LIVE'
      AND UserQuestions.userquestion_state = 'LIVE'
      AND Questions.question_state = 'LIVE'
      AND Users.user_state = 'LIVE'

      ORDER BY 
          Questions.question_name ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user unpinned pseudonative irl answers.");
  }
}

export async function fetchUserSharedToContactCustomAnswers(
  userId: string,
  contactId: string,
) {
  noStore();
  // console.log(userId);
  // console.log(contactId);
  try {
    const data = await sql<Answer>`
      SELECT 
          q.question_name, 
          a.answer_value, 
          a.answer_id,
          uq.userquestion_is_pinned,
          q.question_kind,
          uq.userquestion_kind,
          uq.userquestion_id,
          u.user_username
      FROM Answers a

      JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
      JOIN Questions q ON uq.question_id = q.question_id
      JOIN UserQuestionFriends uqf ON a.userquestion_id = uqf.userquestion_id
      JOIN Contacts c1 ON uqf.contact_id = c1.contact_id
      JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
      JOIN Users u ON a.user_id = u.user_id


      WHERE a.user_id = ${userId}
      AND uq.user_id = ${userId}
      AND q.question_kind = 'CUSTOM'
      AND c1.contact_id = ${contactId}
      AND (
              (
                  c1.contact_kind = 'FRIEND' AND 
                  c2.contact_kind = 'FRIEND' AND
                  c1.contact_blocking = FALSE AND
                  c2.contact_blocking = FALSE
              )
              OR (
                  c1.contact_kind = 'IRL' AND 
                  c2.contact_kind = 'IRL' AND
                  c1.contact_blocking = FALSE AND
                  c2.contact_blocking = FALSE
              )
          )
        
      AND a.answer_state = 'LIVE'
      AND uq.userquestion_state = 'LIVE'
      AND uqf.userquestionfriend_state = 'LIVE'
      AND c1.contact_state = 'LIVE'
      AND c2.contact_state = 'LIVE'

      ORDER BY 
          q.question_name ASC
      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user shared to contact custom answers.");
  }
}
