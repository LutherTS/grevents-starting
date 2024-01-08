import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { sql } from "@vercel/postgres";
import { DEFAULT_RETRIES } from "../data/users";
import { UserQuestion } from "../definitions/userquestions";
import { Friend } from "../definitions/contacts";
import { UserQuestionFriend } from "../definitions/userquestionfriends";

/* NOTE:
ADDING userquestionfriend_shared_to_friend and userquestionfriend_pinned_by_friend is calling for rethink of the nature of UserQuestionFriends, doing away with the usage of carefree usage of DELETED and DELETE.
*/

export async function changeDeleteAtUserQuestionFriend(
  userQuestion: UserQuestion,
  contact: Friend,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        DELETE FROM UserQuestionFriends
        WHERE userquestion_id = ${userQuestion.userquestion_id}
        AND contact_id = ${contact.contact_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete User Question Friend.",
    };
  }
}

export async function changeCreateShareUserQuestionFriend(
  userQuestion: UserQuestion,
  contact: Friend,
  generatedUserQuestionFriendID: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO UserQuestionFriends (
            userquestionfriend_id,
            userquestion_id,
            contact_id,
            userquestionfriend_state,
            userquestionfriend_shared_to_friend,
            userquestionfriend_created_at,
            userquestionfriend_updated_at,
            userquestionfriend_shared_at
        )
        VALUES (
            ${generatedUserQuestionFriendID},
            ${userQuestion.userquestion_id},
            ${contact.contact_id},
            'LIVE',
            TRUE,
            now(),
            now(),
            now()
        )
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create User Question Friend.",
    };
  }
}

export async function changeCancelShareUserQuestionFriend(
  userQuestionFriend: UserQuestionFriend,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE UserQuestionFriends
        SET 

            userquestionfriend_shared_to_friend = FALSE,
            userquestionfriend_updated_at = now(),
            userquestionfriend_shared_at = NULL
        WHERE userquestionfriend_id = ${userQuestionFriend.userquestionfriend_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Question Friend.",
    };
  }
}

export async function changeShareUserQuestionFriend(
  userQuestionFriend: UserQuestionFriend,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE UserQuestionFriends
        SET 
            userquestionfriend_state = 'LIVE',
            userquestionfriend_shared_to_friend = TRUE,
            userquestionfriend_updated_at = now(),
            userquestionfriend_shared_at = now()
        WHERE userquestionfriend_id = ${userQuestionFriend.userquestionfriend_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Question Friend.",
    };
  }
}
