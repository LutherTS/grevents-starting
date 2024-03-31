import { sql } from "@vercel/postgres";
import { Answer } from "../definitions/answers";
import { User } from "../definitions/users";
import { UserQuestion } from "../definitions/userquestions";
import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { DEFAULT_RETRIES } from "./users";

export const ANSWERS_PINNED_BY_FRIEND_LIMIT = 8;
export const ANSWERS_PINNED_BY_USER_LIMIT = 16;
export const ANSWERS_DEFAULT_LIMIT = 32;

/* Trying out p-retry.
import pRetry, { AbortError } from "p-retry";

const run = async () => {
	const response = await fetch('https://sindresorhus.com/unicorn');

	// Abort retrying if the resource doesn't exist
	if (response.status === 404) {
		throw new AbortError(response.statusText);
	}

	return response.blob();
};

console.log(await pRetry(run, {retries: DEFAULT_RETRIES}));
*/

export async function fetchUserPinnedAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id,
            COUNT(CASE UserQuestionFriends.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count -- NEW
        FROM Answers 

        JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Users ON Answers.user_id = Users.user_id
        LEFT JOIN UserQuestionFriends ON UserQuestions.userquestion_id = UserQuestionFriends.userquestion_id -- NEW

        WHERE UserQuestions.user_id = ${userId}
        AND Answers.user_id = ${userId}
        AND UserQuestions.userquestion_is_pinned = TRUE

        AND Answers.answer_state = 'LIVE'
        AND UserQuestions.userquestion_state = 'LIVE'
        AND Questions.question_state = 'LIVE'
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        GROUP BY -- NEW
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id

        ORDER BY 
            UserQuestions.userquestion_pinned_at DESC, 
            Answers.answer_updated_at DESC

        LIMIT ${ANSWERS_PINNED_BY_USER_LIMIT}; -- client-side pagination allowed
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned answers.");
  }
}

// start here
export async function countUserPinnedAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql`
        SELECT 
          COUNT(*)
        FROM Answers 

        JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Users ON Answers.user_id = Users.user_id

        WHERE UserQuestions.user_id = ${userId}
        AND Answers.user_id = ${userId}
        AND UserQuestions.userquestion_is_pinned = TRUE

        AND Answers.answer_state = 'LIVE'
        AND (UserQuestions.userquestion_state = 'LIVE'
        OR UserQuestions.userquestion_state = 'HIDDEN')
        AND Questions.question_state = 'LIVE'
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')
      `;
      // console.log(data);
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to count user pinned answers.");
  }
}

// I'm going to need to verify 'HIDDEN' across the app at a later time.
export async function fetchUserNativeNotIrlAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id,
            Questions.question_id, -- SO FAR ONLY FOR EMAIL ADDRESS
            UserQuestions.userquestion_state -- SO FAR ONLY FOR EMAIL ADDRESS
        FROM Answers

        JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Users ON Answers.user_id = Users.user_id
        
        WHERE UserQuestions.user_id = ${userId}
        AND Answers.user_id = ${userId}
        AND Questions.question_kind = 'NATIVE'
        
        AND Answers.answer_state = 'LIVE'
        AND (UserQuestions.userquestion_state = 'LIVE'
        OR UserQuestions.userquestion_state = 'HIDDEN')
        AND Questions.question_state = 'LIVE'
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user native not irl answers.");
  }
}

export async function countUserNativeNotIrlAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql`
        SELECT 
            COUNT(*)
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED');
      `;
      // console.log(data);
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to count user native not irl answers.");
  }
}

export async function fetchUserNativeIrlAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user native irl answers.");
  }
}

export async function countUserNativeIrlAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql`
        SELECT 
            COUNT(*)
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED');
      `;
      // console.log(data);
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to count user native irl answers.");
  }
}

export async function fetchUserPseudonativeNotIrlAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pseudonative not irl answers.");
  }
}

export async function countUserPseudonativeNotIrlAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql`
        SELECT 
            COUNT(*)
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED');
      `;
      // console.log(data);
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to count user pseudonative not irl answers.");
  }
}

export async function fetchUserPseudonativeIrlAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pseudonative irl answers.");
  }
}

export async function countUserPseudonativeIrlAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql`
        SELECT 
            COUNT(*)
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED');
      `;
      // console.log(data);
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to count user pseudonative irl answers.");
  }
}

export async function fetchUserCustomAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id,
            COUNT(CASE UserQuestionFriends.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count -- NEW
        FROM Answers

        JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Users ON Answers.user_id = Users.user_id
        LEFT JOIN UserQuestionFriends ON UserQuestions.userquestion_id = UserQuestionFriends.userquestion_id -- NEW
        
        WHERE UserQuestions.user_id = ${userId}
        AND Answers.user_id = ${userId}
        AND Questions.question_kind = 'CUSTOM'
        
        AND Answers.answer_state = 'LIVE'
        AND UserQuestions.userquestion_state = 'LIVE'
        AND Questions.question_state = 'LIVE'
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        GROUP BY -- NEW
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id

        ORDER BY 
            userquestionfriends_count ASC, -- NEW
            lower(Questions.question_name) ASC -- lower for case sensitiveness

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    // console.error("Database Error:", error);
    throw new Error("Failed to fetch user custom answers.");
  }
}

export async function countUserCustomAnswers(userId: string) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql`
        SELECT 
            COUNT(*)
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED');
      `;
      // console.log(data);
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    // console.error("Database Error:", error);
    throw new Error("Failed to count user custom answers.");
  }
}

// Missing count. // ?
export async function findAnswerByUserQuestionAndUser(
  userQuestion: UserQuestion,
  user: User,
) {
  // noStore(); // since it's your data and you're the one that's going to have it updated and therefore revalidated
  // console.log(userQuestion);
  // console.log(user);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id,
            COUNT(CASE UserQuestionFriends.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count -- NEW
        FROM Answers

        JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
        JOIN Users ON Answers.user_id = Users.user_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        LEFT JOIN UserQuestionFriends ON UserQuestions.userquestion_id = UserQuestionFriends.userquestion_id -- NEW
        
        WHERE Answers.userquestion_id = ${userQuestion.userquestion_id}
        AND Answers.user_id = ${user.user_id}
        
        AND Answers.answer_state = 'LIVE'
        AND UserQuestions.userquestion_state = 'LIVE'
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')
        AND Questions.question_state = 'LIVE'

        GROUP BY -- NEW
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id

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
    throw new Error("Failed to fetch user question answer.");
  }
}

export async function fetchUserPinnedNotIrlAnswers(userId: string) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned, -- unneeded
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            UserQuestions.userquestion_pinned_at DESC, 
            Answers.answer_updated_at DESC

        LIMIT ${ANSWERS_PINNED_BY_USER_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not irl answers.");
  }
}

// !! NEEDS CONTACTID // Nope. :)
export async function fetchUserUnpinnedNativeNotIrlAnswers(userId: string) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            lower(Questions.question_name) ASC -- lower for case sensitiveness

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user unpinned native not irl answers.");
  }
}

export async function fetchUserUnpinnedNativeNotIrlAnswersExposed(
  userId: string,
) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
        FROM Answers

        JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Users ON Answers.user_id = Users.user_id
        LEFT JOIN UserQuestionFriends ON Answers.userquestion_id = UserQuestionFriends.userquestion_id -- NEW
        
        WHERE UserQuestions.user_id = ${userId}
        AND Answers.user_id = ${userId}
        AND Questions.question_kind = 'NATIVE'
        AND UserQuestions.userquestion_is_pinned = FALSE
        AND (
            UserQuestionFriends.userquestionfriend_pinned_by_friend IS NULL
            OR UserQuestionFriends.userquestionfriend_pinned_by_friend = FALSE
        )
        
        AND Answers.answer_state = 'LIVE'
        AND UserQuestions.userquestion_state = 'LIVE'
        AND Questions.question_state = 'LIVE'
        AND Users.user_state = 'LIVE'

        ORDER BY 
            lower(Questions.question_name) ASC -- lower for case sensitiveness

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned native not irl answers exposed.",
    );
  }
}

export async function fetchUserUnpinnedNativeNotIrlAnswersQueried(
  userId: string,
) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
            lower(Questions.question_name) ASC -- lower for case sensitiveness

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned native not irl answers queried.",
    );
  }
}

// !! NEEDS CONTACTID // Nope. :)
export async function fetchUserUnpinnedPseudonativeNotIrlAnswers(
  userId: string,
) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned pseudonative not irl answers.",
    );
  }
}

export async function fetchUserUnpinnedPseudonativeNotIrlAnswersExposed(
  userId: string,
) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
        FROM Answers

        JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Users ON Answers.user_id = Users.user_id
        LEFT JOIN UserQuestionFriends ON Answers.userquestion_id = UserQuestionFriends.userquestion_id -- NEW
        
        WHERE UserQuestions.user_id = ${userId}
        AND Answers.user_id = ${userId}
        AND Questions.question_kind = 'PSEUDO'
        AND UserQuestions.userquestion_kind = 'PSEUDONATIVE'
        AND UserQuestions.userquestion_is_pinned = FALSE
        AND (
            UserQuestionFriends.userquestionfriend_pinned_by_friend IS NULL
            OR UserQuestionFriends.userquestionfriend_pinned_by_friend = FALSE
        ) -- NEW
        
        AND Answers.answer_state = 'LIVE'
        AND UserQuestions.userquestion_state = 'LIVE'
        AND Questions.question_state = 'LIVE'
        AND Users.user_state = 'LIVE'

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned pseudonative not irl answers exposed.",
    );
  }
}

export async function fetchUserUnpinnedPseudonativeNotIrlAnswersQueried(
  userId: string,
) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned pseudonative not irl answers queried.",
    );
  }
}

export async function fetchUserPinnedNotAndIrlAnswers(userId: string) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            UserQuestions.userquestion_pinned_at DESC, 
            Answers.answer_updated_at DESC

        LIMIT ${ANSWERS_PINNED_BY_USER_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not and irl answers.");
  }
}

// !! NEEDS CONTACTID // Nope. :)
export async function fetchUserUnpinnedNativeIrlAnswers(userId: string) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            lower(Questions.question_name) ASC
            
        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user unpinned native irl answers.");
  }
}

export async function fetchUserUnpinnedNativeIrlAnswersExposed(userId: string) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
        FROM Answers

        JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Users ON Answers.user_id = Users.user_id
        LEFT JOIN UserQuestionFriends ON Answers.userquestion_id = UserQuestionFriends.userquestion_id -- NEW
        
        WHERE UserQuestions.user_id = ${userId}
        AND Answers.user_id = ${userId}
        AND Questions.question_kind = 'NATIVEIRL'
        AND UserQuestions.userquestion_is_pinned = FALSE
        AND (
            UserQuestionFriends.userquestionfriend_pinned_by_friend IS NULL
            OR UserQuestionFriends.userquestionfriend_pinned_by_friend = FALSE
        ) -- NEW
        
        AND Answers.answer_state = 'LIVE'
        AND UserQuestions.userquestion_state = 'LIVE'
        AND Questions.question_state = 'LIVE'
        AND Users.user_state = 'LIVE'

        ORDER BY 
            lower(Questions.question_name) ASC
            
        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned native irl answers exposed.",
    );
  }
}

export async function fetchUserUnpinnedNativeIrlAnswersQueried(userId: string) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
            lower(Questions.question_name) ASC
            
        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned native irl answers queried.",
    );
  }
}

// !! NEEDS CONTACTID // Nope. :)
export async function fetchUserUnpinnedPseudonativeIrlAnswers(userId: string) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
        AND (Users.user_state = 'LIVE'
        OR Users.user_state = 'DEACTIVATED')

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user unpinned pseudonative irl answers.");
  }
}

export async function fetchUserUnpinnedPseudonativeIrlAnswersExposed(
  userId: string,
) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
        FROM Answers

        JOIN UserQuestions ON Answers.userquestion_id = UserQuestions.userquestion_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Users ON Answers.user_id = Users.user_id
        LEFT JOIN UserQuestionFriends ON Answers.userquestion_id = UserQuestionFriends.userquestion_id -- NEW
        
        WHERE UserQuestions.user_id = ${userId}
        AND Answers.user_id = ${userId}
        AND Questions.question_kind = 'PSEUDO'
        AND UserQuestions.userquestion_kind = 'PSEUDONATIVEIRL'
        AND UserQuestions.userquestion_is_pinned = FALSE
        AND (
            UserQuestionFriends.userquestionfriend_pinned_by_friend IS NULL
            OR UserQuestionFriends.userquestionfriend_pinned_by_friend = FALSE
        ) -- NEW
        
        AND Answers.answer_state = 'LIVE'
        AND UserQuestions.userquestion_state = 'LIVE'
        AND Questions.question_state = 'LIVE'
        AND Users.user_state = 'LIVE'

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned pseudonative irl answers exposed.",
    );
  }
}

export async function fetchUserUnpinnedPseudonativeIrlAnswersQueried(
  userId: string,
) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            Questions.question_name, 
            Answers.answer_value, 
            Answers.answer_id,
            UserQuestions.userquestion_is_pinned,
            Questions.question_kind,
            UserQuestions.userquestion_kind,
            UserQuestions.userquestion_id,
            Users.user_username,
            Users.user_id
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
            lower(Questions.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user unpinned pseudonative irl answers queried.",
    );
  }
}

// Maintenance here is starting to get real. I will eventually have to put these SQL strings into variables.

// Previously and more descriptively:
// fetchUserSharedToContactCustomAnswersNotPinnedByFriend
export async function fetchUserSharedToContactCustomAnswersExposed(
  userId: string,
  contactId: string,
) {
  // noStore();
  // console.log(userId);
  // console.log(contactId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN UserQuestionFriends uqf ON a.userquestion_id = uqf.userquestion_id
        JOIN Users u ON a.user_id = u.user_id
        JOIN Contacts c1 ON uqf.contact_id = c1.contact_id
        JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND q.question_kind = 'CUSTOM'
        AND c1.contact_id = ${contactId}
        AND uqf.contact_id = ${contactId} -- FIX 

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

        AND uq.userquestion_is_pinned = FALSE
        AND uqf.userquestionfriend_pinned_by_friend = FALSE -- NEW
          
        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND uqf.userquestionfriend_state = 'LIVE'
        AND c1.contact_state = 'LIVE'
        AND c2.contact_state = 'LIVE'
        AND u.user_state = 'LIVE'

        ORDER BY
            lower(q.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user shared to contact custom answers not pinned by friend exposed.",
    );
  }
}

export async function fetchUserSharedToContactCustomAnswersQueried(
  userId: string,
  contactId: string,
) {
  noStore();
  // console.log(userId);
  // console.log(contactId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN UserQuestionFriends uqf ON a.userquestion_id = uqf.userquestion_id
        JOIN Users u ON a.user_id = u.user_id
        JOIN Contacts c1 ON uqf.contact_id = c1.contact_id
        JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND q.question_kind = 'CUSTOM'
        AND c1.contact_id = ${contactId}
        AND uqf.contact_id = ${contactId} -- FIX

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

        AND uq.userquestion_is_pinned = FALSE
          
        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND uqf.userquestionfriend_state = 'LIVE'
        AND c1.contact_state = 'LIVE'
        AND c2.contact_state = 'LIVE'
        AND u.user_state = 'LIVE'

        ORDER BY
            lower(q.question_name) ASC

        LIMIT ${ANSWERS_DEFAULT_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user shared to contact custom answers queried.",
    );
  }
}

export async function fetchUserPinnedNotIrlAnswersExposed(
  userId: string,
  contactId: string,
) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id -- ,
            -- COUNT(CASE uqf2.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count -- NEW
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN Users u ON a.user_id = u.user_id
        LEFT JOIN UserQuestionFriends uqf1 ON a.userquestion_id = uqf1.userquestion_id
        LEFT JOIN Contacts c1 ON uqf1.contact_id = c1.contact_id
        LEFT JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        LEFT JOIN UserQuestionFriends uqf2 ON uq.userquestion_id = uqf2.userquestion_id -- NEW

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND uq.userquestion_is_pinned = TRUE
        AND (
            uqf2.userquestionfriend_pinned_by_friend = FALSE OR -- NEW
            uqf2.userquestionfriend_pinned_by_friend IS NULL -- NEW
        )

        AND (
            (
                q.question_kind = 'NATIVE'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVE'
            )
            OR ( -- NEW
              q.question_kind = 'CUSTOM' AND
              c1.contact_id = ${contactId} AND
              uqf2.contact_id = ${contactId}
            )
        )

        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND q.question_state = 'LIVE'
        AND u.user_state = 'LIVE'

        -- GROUP BY -- NEW
            -- q.question_name, 
            -- a.answer_value, 
            -- a.answer_id,
            -- uq.userquestion_is_pinned,
            -- q.question_kind,
            -- uq.userquestion_kind,
            -- uq.userquestion_id,
            -- u.user_username,
            -- u.user_id

        ORDER BY 
            uq.userquestion_pinned_at DESC, 
            a.answer_updated_at DESC

        LIMIT ${ANSWERS_PINNED_BY_USER_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not irl answers exposed.");
  }
}

export async function fetchUserPinnedNotIrlAnswersQueried(
  userId: string,
  contactId: string,
) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id -- ,
            -- COUNT(CASE uqf2.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN Users u ON a.user_id = u.user_id
        LEFT JOIN UserQuestionFriends uqf1 ON a.userquestion_id = uqf1.userquestion_id
        LEFT JOIN Contacts c1 ON uqf1.contact_id = c1.contact_id
        LEFT JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        -- LEFT JOIN UserQuestionFriends uqf2 ON uq.userquestion_id = uqf2.userquestion_id -- NEW

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND uq.userquestion_is_pinned = TRUE

        AND (
            (
                q.question_kind = 'NATIVE'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVE'
            )
            OR (
              q.question_kind = 'CUSTOM' AND
              c1.contact_id = ${contactId}
            )
        )

        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND q.question_state = 'LIVE'
        AND u.user_state = 'LIVE'

        -- GROUP BY
            -- q.question_name, 
            -- a.answer_value, 
            -- a.answer_id,
            -- uq.userquestion_is_pinned,
            -- q.question_kind,
            -- uq.userquestion_kind,
            -- uq.userquestion_id,
            -- u.user_username,
            -- u.user_id

        ORDER BY 
            uq.userquestion_pinned_at DESC, 
            a.answer_updated_at DESC

        LIMIT ${ANSWERS_PINNED_BY_USER_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not irl answers queried.");
  }
}

export async function fetchUserPinnedNotAndIrlAnswersExposed(
  userId: string,
  contactId: string,
) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id -- ,
            -- COUNT(CASE uqf2.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count -- NEW
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN Users u ON a.user_id = u.user_id
        LEFT JOIN UserQuestionFriends uqf1 ON a.userquestion_id = uqf1.userquestion_id
        LEFT JOIN Contacts c1 ON uqf1.contact_id = c1.contact_id
        LEFT JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        LEFT JOIN UserQuestionFriends uqf2 ON uq.userquestion_id = uqf2.userquestion_id -- NEW

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND uq.userquestion_is_pinned = TRUE
        AND (
            uqf2.userquestionfriend_pinned_by_friend = FALSE OR -- NEW
            uqf2.userquestionfriend_pinned_by_friend IS NULL -- NEW
        )

        AND (
            (
                q.question_kind = 'NATIVE'
            )
            OR (
                q.question_kind = 'NATIVEIRL'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVE'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVEIRL'
            )
            OR ( -- NEW
                q.question_kind = 'CUSTOM' AND
                c1.contact_id = ${contactId} AND
                uqf2.contact_id = ${contactId}
            )
        )

        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND q.question_state = 'LIVE'
        AND u.user_state = 'LIVE'

        -- GROUP BY -- NEW
            -- q.question_name, 
            -- a.answer_value, 
            -- a.answer_id,
            -- uq.userquestion_is_pinned,
            -- q.question_kind,
            -- uq.userquestion_kind,
            -- uq.userquestion_id,
            -- u.user_username,
            -- u.user_id

        ORDER BY 
            uq.userquestion_pinned_at DESC, 
            a.answer_updated_at DESC

        LIMIT ${ANSWERS_PINNED_BY_USER_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not and irl answers exposed.");
  }
}

export async function fetchUserPinnedNotAndIrlAnswersQueried(
  userId: string,
  contactId: string,
) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id -- ,
            -- COUNT(CASE uqf2.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count -- NEW
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN Users u ON a.user_id = u.user_id
        LEFT JOIN UserQuestionFriends uqf1 ON a.userquestion_id = uqf1.userquestion_id
        LEFT JOIN Contacts c1 ON uqf1.contact_id = c1.contact_id
        LEFT JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        -- LEFT JOIN UserQuestionFriends uqf2 ON uq.userquestion_id = uqf2.userquestion_id -- NEW

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND uq.userquestion_is_pinned = TRUE

        AND (
            (
                q.question_kind = 'NATIVE'
            )
            OR (
                q.question_kind = 'NATIVEIRL'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVE'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVEIRL'
            )
            OR ( -- NEW
                q.question_kind = 'CUSTOM' AND
                c1.contact_id = ${contactId}
            )
        )

        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND q.question_state = 'LIVE'
        AND u.user_state = 'LIVE'

        -- GROUP BY -- NEW
            -- q.question_name, 
            -- a.answer_value, 
            -- a.answer_id,
            -- uq.userquestion_is_pinned,
            -- q.question_kind,
            -- uq.userquestion_kind,
            -- uq.userquestion_id,
            -- u.user_username,
            -- u.user_id

        ORDER BY 
            uq.userquestion_pinned_at DESC, 
            a.answer_updated_at DESC

        LIMIT ${ANSWERS_PINNED_BY_USER_LIMIT};
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not and irl answers queried.");
  }
}

// Previously and more simply:
// fetchUserPinnedByFriendNotIrlAnswers
export async function fetchUserPinnedByFriendNotIrlAnswersExposed(
  userId: string,
  contactId: string,
) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id -- ,
            -- COUNT(CASE uqf2.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count,
            -- uqf2.userquestionfriend_id -- NEW
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN Users u ON a.user_id = u.user_id
        LEFT JOIN UserQuestionFriends uqf1 ON a.userquestion_id = uqf1.userquestion_id
        LEFT JOIN Contacts c1 ON uqf1.contact_id = c1.contact_id
        LEFT JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        LEFT JOIN UserQuestionFriends uqf2 ON uq.userquestion_id = uqf2.userquestion_id

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND uqf2.userquestionfriend_pinned_by_friend = TRUE -- NEW
        AND uqf2.contact_id = ${contactId} -- NEW

        AND (
            (
                q.question_kind = 'NATIVE'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVE'
            )
            OR (
              q.question_kind = 'CUSTOM' AND
              c1.contact_id = ${contactId}
            )
        )

        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND q.question_state = 'LIVE'
        AND u.user_state = 'LIVE'

        -- GROUP BY
            -- q.question_name, 
            -- a.answer_value, 
            -- a.answer_id,
            -- uq.userquestion_is_pinned,
            -- q.question_kind,
            -- uq.userquestion_kind,
            -- uq.userquestion_id,
            -- u.user_username,
            -- u.user_id,
            -- uqf2.userquestionfriend_id -- NEW

        ORDER BY 
            uqf2.userquestionfriend_pinned_at DESC, -- NEW 
            a.answer_updated_at DESC

        LIMIT ${ANSWERS_PINNED_BY_FRIEND_LIMIT} -- NEW
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user pinned by friend not irl answers exposed.",
    );
  }
}

export async function countUserPinnedByFriendNotIrlAnswersExposed(
  userId: string,
  contactId: string,
) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql`
        SELECT 
          COUNT(*)
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN Users u ON a.user_id = u.user_id
        LEFT JOIN UserQuestionFriends uqf1 ON a.userquestion_id = uqf1.userquestion_id
        LEFT JOIN Contacts c1 ON uqf1.contact_id = c1.contact_id
        LEFT JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        LEFT JOIN UserQuestionFriends uqf2 ON uq.userquestion_id = uqf2.userquestion_id

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND uqf2.userquestionfriend_pinned_by_friend = TRUE -- NEW
        AND uqf2.contact_id = ${contactId} -- NEW

        AND (
            (
                q.question_kind = 'NATIVE'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVE'
            )
            OR (
              q.question_kind = 'CUSTOM' AND
              c1.contact_id = ${contactId}
            )
        )

        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND q.question_state = 'LIVE'
        AND u.user_state = 'LIVE';
      `;
      // console.log(data);
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to count user pinned by friend not irl answers exposed.",
    );
  }
}

// Previously and more descriptively:
// fetchUserPinnedByFriendNotAndIrlAnswers
export async function fetchUserPinnedByFriendNotAndIrlAnswersExposed(
  userId: string,
  contactId: string,
) {
  // noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql<Answer>`
        SELECT 
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id -- ,
            -- COUNT(CASE uqf2.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count,
            -- uqf2.userquestionfriend_id -- NEW
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN Users u ON a.user_id = u.user_id
        LEFT JOIN UserQuestionFriends uqf1 ON a.userquestion_id = uqf1.userquestion_id
        LEFT JOIN Contacts c1 ON uqf1.contact_id = c1.contact_id
        LEFT JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        LEFT JOIN UserQuestionFriends uqf2 ON uq.userquestion_id = uqf2.userquestion_id

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND uqf2.userquestionfriend_pinned_by_friend = TRUE -- NEW
        AND uqf2.contact_id = ${contactId} -- NEW

        AND (
            (
                q.question_kind = 'NATIVE'
            )
            OR (
                q.question_kind = 'NATIVEIRL'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVE'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVEIRL'
            )
            OR (
                q.question_kind = 'CUSTOM' AND
                c1.contact_id = ${contactId}
            )
        )

        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND q.question_state = 'LIVE'
        AND u.user_state = 'LIVE'

        -- GROUP BY
            -- q.question_name, 
            -- a.answer_value, 
            -- a.answer_id,
            -- uq.userquestion_is_pinned,
            -- q.question_kind,
            -- uq.userquestion_kind,
            -- uq.userquestion_id,
            -- u.user_username,
            -- u.user_id,
            -- uqf2.userquestionfriend_id -- NEW

        ORDER BY 
            uqf2.userquestionfriend_pinned_at DESC, -- NEW
            a.answer_updated_at DESC

        LIMIT ${ANSWERS_PINNED_BY_FRIEND_LIMIT} -- NEW
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user pinned by friend not and irl answers exposed.",
    );
  }
}

export async function countUserPinnedByFriendNotAndIrlAnswersExposed(
  userId: string,
  contactId: string,
) {
  noStore();
  // console.log(userId);
  try {
    const run = async () => {
      const data = await sql`
        SELECT 
            COUNT(*)
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN Users u ON a.user_id = u.user_id
        LEFT JOIN UserQuestionFriends uqf1 ON a.userquestion_id = uqf1.userquestion_id
        LEFT JOIN Contacts c1 ON uqf1.contact_id = c1.contact_id
        LEFT JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        LEFT JOIN UserQuestionFriends uqf2 ON uq.userquestion_id = uqf2.userquestion_id

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
        AND uqf2.userquestionfriend_pinned_by_friend = TRUE -- NEW
        AND uqf2.contact_id = ${contactId} -- NEW

        AND (
            (
                q.question_kind = 'NATIVE'
            )
            OR (
                q.question_kind = 'NATIVEIRL'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVE'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVEIRL'
            )
            OR (
                q.question_kind = 'CUSTOM' AND
                c1.contact_id = ${contactId}
            )
        )

        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND q.question_state = 'LIVE'
        AND u.user_state = 'LIVE';
      `;
      // console.log(data);
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to count user pinned by friend not and irl answers exposed.",
    );
  }
}
