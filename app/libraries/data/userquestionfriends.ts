import { sql } from "@vercel/postgres";
import { UserQuestion } from "../definitions/userquestions";
import { UserQuestionFriend } from "../definitions/userquestionfriends";
import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { DEFAULT_RETRIES } from "./users";
import { FoundContact, Friend } from "../definitions/contacts";
import { Answer } from "../definitions/answers";
import { CONTACT_ARBITRARY_LIMIT } from "./contacts";

export async function fetchAllUserQuestionFriends(userQuestion: UserQuestion) {
  // noStore(); // since adding and removing will revalidate
  try {
    const run = async () => {
      const data = await sql<UserQuestionFriend>`
        SELECT 
            u.user_app_wide_name, 
            u.user_username, 
            uqf.userquestionfriend_id 
        FROM UserQuestionFriends uqf
        
        JOIN Contacts c1 ON uqf.contact_id = c1.contact_id
        JOIN Users u ON c1.user_last_id = u.user_id
        JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        
        WHERE uqf.userquestion_id = ${userQuestion.userquestion_id}
        AND uqf.userquestionfriend_shared_to_friend = TRUE -- NEW
        
        AND (
            (
                c1.contact_kind = 'FRIEND' AND 
                c2.contact_kind = 'FRIEND' AND
                c1.contact_blocking = FALSE AND
                c2.contact_blocking = FALSE -- amis “simple”
            )
            OR (
                c1.contact_kind = 'IRL' AND 
                c2.contact_kind = 'IRL' AND
                c1.contact_blocking = FALSE AND
                c2.contact_blocking = FALSE -- amis “dans la vraie vie”
            )
        )
        
        AND uqf.userquestionfriend_state = 'LIVE'
        AND c1.contact_state = 'LIVE'
        AND (u.user_state = 'LIVE'
        OR u.user_state = 'DEACTIVATED')
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            -- uqf.userquestionfriend_shared_at DESC,
            -- uqf.userquestionfriend_updated_at DESC,
            lower(u.user_app_wide_name) ASC,
            u.user_username ASC

        LIMIT ${CONTACT_ARBITRARY_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch all user question friends.");
  }
}

export async function findUserQuestionFriend(
  userQuestion: UserQuestion,
  contact: Friend,
) {
  noStore(); // just in case
  try {
    const run = async () => {
      const data = await sql<UserQuestionFriend>`
        SELECT 
            u.user_app_wide_name, 
            u.user_username, 
            uqf.userquestionfriend_id 
        FROM UserQuestionFriends uqf
        
        JOIN Contacts c1 ON uqf.contact_id = c1.contact_id
        JOIN Users u ON c1.user_last_id = u.user_id
        JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        
        WHERE uqf.userquestion_id = ${userQuestion.userquestion_id}
        AND uqf.contact_id = ${contact.contact_id}
        
        AND uqf.userquestionfriend_state = 'LIVE'
        AND c1.contact_state = 'LIVE'
        AND (u.user_state = 'LIVE'
        OR u.user_state = 'DEACTIVATED')
        AND c2.contact_state = 'LIVE'

        LIMIT 1;
      `;
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find user question friend.");
  }
}

export async function findUserQuestionFriendByAnswerAndContact(
  answer: Answer,
  contact: FoundContact,
) {
  noStore(); // just in case
  try {
    const run = async () => {
      const data = await sql<UserQuestionFriend>`
        SELECT 
            u.user_app_wide_name, 
            u.user_username, 
            uqf.userquestionfriend_id 
        FROM UserQuestionFriends uqf
        
        JOIN Contacts c1 ON uqf.contact_id = c1.contact_id
        JOIN Users u ON c1.user_last_id = u.user_id
        JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        
        WHERE uqf.userquestion_id = ${answer.userquestion_id}
        AND uqf.contact_id = ${contact.c1_contact_id}
        
        AND uqf.userquestionfriend_state = 'LIVE'
        AND c1.contact_state = 'LIVE'
        AND u.user_state = 'LIVE'
        AND c2.contact_state = 'LIVE'

        LIMIT 1;
      `;
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to find user question friend by answer and contact.",
    );
  }
}
