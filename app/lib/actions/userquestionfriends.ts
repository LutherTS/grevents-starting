"use server";

import { z } from "zod";
import { UserQuestion } from "../definitions/userquestions";
import { Friend } from "../definitions/contacts";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { UserQuestionFriend } from "../definitions/userquestionfriends";
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";

const USERQUESTIONFRIEND_STATES = ["NONE", "LIVE", "DELETED"] as const;

const UserQuestionFriendSchema = z.object({
  userQuestionFriendId: z.string().length(36),
  userQuestionId: z.string().length(36),
  contactId: z.string().length(36),
  userQuestionFriendState: z.enum(USERQUESTIONFRIEND_STATES),
  userQuestionFriendCreatedAt: z.string().datetime(),
  userQuestionFriendUpdatedAt: z.string().datetime(),
  userQuestionFriendSharedAt: z.string().datetime().nullable(),
});

export async function createUserQuestionFriend(
  userQuestion: UserQuestion,
  contact: Friend,
) {
  noStore();

  try {
    const data = await sql`
      DELETE FROM UserQuestionFriends
      WHERE userquestion_id = ${userQuestion.userquestion_id}
      AND contact_id = ${contact.contact_id}
      RETURNING * -- to make sure
    `;
    console.log(data.rows);
  } catch (error) {
    return {
      message: "Database Error: Failed to Delete User Question Friend.",
    };
  }

  const generatedUserQuestionFriendID = uuidv4();

  try {
    const data = await sql`
      INSERT INTO UserQuestionFriends (
          userquestionfriend_id,
          userquestion_id,
          contact_id,
          userquestionfriend_state,
          userquestionfriend_created_at,
          userquestionfriend_updated_at,
          userquestionfriend_shared_at
      )
      VALUES (
          ${generatedUserQuestionFriendID},
          ${userQuestion.userquestion_id},
          ${contact.contact_id},
          'LIVE',
          now(),
          now(),
          now()
      )
      RETURNING * -- to make sure
    `;
    console.log(data.rows);
  } catch (error) {
    return {
      message: "Database Error: Failed to Create User Question Friend.",
    };
  }

  try {
    const data = await sql`
      UPDATE Users
      SET 
          user_status_personal_info = 'USERQUESTIONFRIENDADDED',
          user_updated_at = now()
      WHERE user_username = ${userQuestion.user_username}
      RETURNING * -- to make sure
    `;
    console.log(data.rows);
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Status Personal Info.",
    };
  }

  revalidatePath(
    `/users/${userQuestion.user_username}/personal-info/user-criteria/${userQuestion.userquestion_id}`,
  );
}

export async function deleteUserQuestionFriend(
  userQuestion: UserQuestion,
  userQuestionFriend: UserQuestionFriend,
) {
  noStore();

  try {
    const data = await sql`
      UPDATE UserQuestionFriends
      SET 
          userquestionfriend_state = 'DELETED', 
          userquestionfriend_updated_at = now(),
          userquestionfriend_shared_at = NULL
      WHERE userquestionfriend_id = ${userQuestionFriend.userquestionfriend_id}
      RETURNING * -- to make sure
    `;
    console.log(data.rows);
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Question Friend.",
    };
  }

  try {
    const data = await sql`
      UPDATE Users
      SET 
          user_status_personal_info = 'USERQUESTIONFRIENDDELETED',
          user_updated_at = now()
      WHERE user_username = ${userQuestion.user_username}
      RETURNING * -- to make sure
    `;
    console.log(data.rows);
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Status Personal Info.",
    };
  }

  revalidatePath(
    `/users/${userQuestion.user_username}/personal-info/user-criteria/${userQuestion.userquestion_id}`,
  );
}
