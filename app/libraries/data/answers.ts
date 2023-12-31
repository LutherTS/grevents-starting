import { sql } from "@vercel/postgres";
import { Answer } from "../definitions/answers";
import { User } from "../definitions/users";
import { UserQuestion } from "../definitions/userquestions";
import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { DEFAULT_RETRIES } from "./users";

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
        AND Users.user_state = 'LIVE'

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

        LIMIT 10;
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
            Users.user_id
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
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user native not irl answers.");
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
        AND Users.user_state = 'LIVE'

        ORDER BY 
            Answers.answer_created_at ASC

        LIMIT 10;
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
        AND Users.user_state = 'LIVE'

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT 10;
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
        AND Users.user_state = 'LIVE'

        ORDER BY 
            lower(Questions.question_name) ASC

        LIMIT 10;
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
        AND Users.user_state = 'LIVE'

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

        LIMIT 10;
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

// Missing count.
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
        AND Users.user_state = 'LIVE'
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
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not irl answers.");
  }
}

export async function fetchUserUnpinnedNativeNotIrlAnswers(userId: string) {
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
            Answers.answer_created_at ASC

        LIMIT 10;
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

export async function fetchUserUnpinnedPseudonativeNotIrlAnswers(
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

        LIMIT 10;
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
        AND Users.user_state = 'LIVE'

        ORDER BY 
            UserQuestions.userquestion_pinned_at DESC, 
            Answers.answer_updated_at DESC

        LIMIT 10;
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

export async function fetchUserUnpinnedNativeIrlAnswers(userId: string) {
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
            Answers.answer_created_at ASC
            
        LIMIT 10;
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

export async function fetchUserUnpinnedPseudonativeIrlAnswers(userId: string) {
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

        LIMIT 10;
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

// !! What I need to include to the customs below !! //
export async function fetchUserSharedToContactCustomAnswers(
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
            u.user_id,
            COUNT(CASE uqf2.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count -- NEW
        FROM Answers a

        JOIN UserQuestions uq ON a.userquestion_id = uq.userquestion_id
        JOIN Questions q ON uq.question_id = q.question_id
        JOIN UserQuestionFriends uqf1 ON a.userquestion_id = uqf1.userquestion_id
        JOIN Users u ON a.user_id = u.user_id
        JOIN Contacts c1 ON uqf1.contact_id = c1.contact_id
        JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        LEFT JOIN UserQuestionFriends uqf2 ON uq.userquestion_id = uqf2.userquestion_id -- NEW

        WHERE uq.user_id = ${userId}
        AND a.user_id = ${userId}
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
        AND uq.userquestion_is_pinned = FALSE
          
        AND a.answer_state = 'LIVE'
        AND uq.userquestion_state = 'LIVE'
        AND uqf1.userquestionfriend_state = 'LIVE'
        AND c1.contact_state = 'LIVE'
        AND c2.contact_state = 'LIVE'

        GROUP BY -- NEW
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id

        ORDER BY 
            userquestionfriends_count ASC, -- NEW
            lower(q.question_name) ASC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user shared to contact custom answers.");
  }
}

export async function fetchUserPinnedNotIrlAnswersCustom(
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
            u.user_id,
            COUNT(CASE uqf2.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count -- NEW
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
            (
                q.question_kind = 'NATIVE'
            )
            OR (
                q.question_kind = 'PSEUDO' AND
                uq.userquestion_kind = 'PSEUDONATIVE'
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

        GROUP BY -- NEW
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id

        ORDER BY 
            uq.userquestion_pinned_at DESC, 
            a.answer_updated_at DESC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not irl answers custom.");
  }
}

export async function fetchUserPinnedNotAndIrlAnswersCustom(
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
            u.user_id,
            COUNT(CASE uqf2.userquestionfriend_shared_to_friend WHEN TRUE THEN 1 ELSE null END) userquestionfriends_count -- NEW
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

        GROUP BY -- NEW
            q.question_name, 
            a.answer_value, 
            a.answer_id,
            uq.userquestion_is_pinned,
            q.question_kind,
            uq.userquestion_kind,
            uq.userquestion_id,
            u.user_username,
            u.user_id

        ORDER BY 
            uq.userquestion_pinned_at DESC, 
            a.answer_updated_at DESC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user pinned not and irl answers custom.");
  }
}
