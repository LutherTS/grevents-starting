"use server";

import { z } from "zod";
import { UserQuestion } from "../definitions/userquestions";
import { Friend } from "../definitions/contacts";
import { revalidatePath } from "next/cache";
import { UserQuestionFriend } from "../definitions/userquestionfriends";
import { v4 as uuidv4 } from "uuid";
import {
  changeCreatetUserQuestionFriend,
  changeDeleteAtUserQuestionFriend,
  changeUpdateDeleteUserQuestionFriend,
} from "../changes/userquestionfriends";
import { changeSetUserStatusPersonalInfo } from "../changes/users";

const USERQUESTIONFRIEND_STATES = ["NONE", "LIVE", "DELETED"] as const;

/* Currently unused. */
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
  await changeDeleteAtUserQuestionFriend(userQuestion, contact);

  const generatedUserQuestionFriendID = uuidv4();

  await changeCreatetUserQuestionFriend(
    userQuestion,
    contact,
    generatedUserQuestionFriendID,
  );

  await changeSetUserStatusPersonalInfo(
    userQuestion.user_id,
    "USERQUESTIONFRIENDADDED",
  );

  revalidatePath(
    `/users/${userQuestion.user_username}/personal-info/user-criteria/${userQuestion.userquestion_id}`,
  );
}

export async function deleteUserQuestionFriend(
  userQuestion: UserQuestion,
  userQuestionFriend: UserQuestionFriend,
) {
  await changeUpdateDeleteUserQuestionFriend(userQuestionFriend);

  await changeSetUserStatusPersonalInfo(
    userQuestion.user_id,
    "USERQUESTIONFRIENDDELETED",
  );

  revalidatePath(
    `/users/${userQuestion.user_username}/personal-info/user-criteria/${userQuestion.userquestion_id}`,
  );
}
