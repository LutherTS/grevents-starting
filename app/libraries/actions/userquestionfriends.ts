"use server";

import { z } from "zod";
import { UserQuestion } from "../definitions/userquestions";
import { FoundContact, Friend } from "../definitions/contacts";
import { revalidatePath } from "next/cache";
import { UserQuestionFriend } from "../definitions/userquestionfriends";
import { v4 as uuidv4 } from "uuid";
import {
  changeCreateShareUserQuestionFriend,
  changeDeleteAtUserQuestionFriend,
  changeCancelShareUserQuestionFriend,
  changeShareUserQuestionFriend,
  changeCreatePinUserQuestionFriend,
  changeCancelPinUserQuestionFriend,
  changeDeleteAtUserQuestionFriendByAnswerAndContact,
  changePinUserQuestionFriend,
} from "../changes/userquestionfriends";
import { changeSetUserStatusPersonalInfo } from "../changes/users";
import {
  findUserQuestionFriend,
  findUserQuestionFriendByAnswerAndContact,
} from "../data/userquestionfriends";
import { changeSetContactStatusOtherProfile } from "../changes/contacts";
import { Answer } from "../definitions/answers";

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

export async function shareUserQuestionFriend(
  userQuestion: UserQuestion,
  contact: Friend,
) {
  const userQuestionFriend = await findUserQuestionFriend(
    userQuestion,
    contact,
  );

  if (userQuestionFriend === undefined) {
    await changeDeleteAtUserQuestionFriend(userQuestion, contact);

    const generatedUserQuestionFriendID = uuidv4();

    await changeCreateShareUserQuestionFriend(
      userQuestion,
      contact,
      generatedUserQuestionFriendID,
    );

    await changeSetUserStatusPersonalInfo(
      userQuestion.user_id,
      "USERQUESTIONFRIENDADDED",
    );
  }

  if (userQuestionFriend) {
    await changeShareUserQuestionFriend(userQuestionFriend);

    await changeSetUserStatusPersonalInfo(
      userQuestion.user_id,
      "USERQUESTIONFRIENDADDED",
    );
  }

  revalidatePath(
    `/users/${userQuestion.user_username}/personal-info/user-criteria/${userQuestion.userquestion_id}`,
  );
}

export async function cancelShareUserQuestionFriend(
  userQuestion: UserQuestion,
  userQuestionFriend: UserQuestionFriend,
) {
  await changeCancelShareUserQuestionFriend(userQuestionFriend);

  await changeSetUserStatusPersonalInfo(
    userQuestion.user_id,
    "USERQUESTIONFRIENDDELETED",
  );

  revalidatePath(
    `/users/${userQuestion.user_username}/personal-info/user-criteria/${userQuestion.userquestion_id}`,
  );
}

// Better, easier in two
// export async function pinOrUnpinUserQuestionFriend() {}

export async function pinUserQuestionFriend(
  answer: Answer,
  contact: FoundContact,
) {
  const userQuestionFriend = await findUserQuestionFriendByAnswerAndContact(
    answer,
    contact,
  );

  if (userQuestionFriend === undefined) {
    await changeDeleteAtUserQuestionFriendByAnswerAndContact(answer, contact);

    const generatedUserQuestionFriendID = uuidv4();

    await changeCreatePinUserQuestionFriend(
      answer,
      contact,
      generatedUserQuestionFriendID,
    );

    await changeSetContactStatusOtherProfile(
      contact.c1_contact_mirror_id,
      "USERQUESTIONFRIENDPINNED",
    );
  }

  if (userQuestionFriend) {
    await changePinUserQuestionFriend(userQuestionFriend);

    await changeSetContactStatusOtherProfile(
      contact.c1_contact_mirror_id,
      "USERQUESTIONFRIENDPINNED",
    );
  }

  revalidatePath(
    `/users/${answer.user_username}/personal-info/user-criteria/${answer.userquestion_id}`,
  );
}

export async function cancelPinUserQuestionFriend(
  answer: Answer,
  contact: FoundContact,
) {
  await changeCancelPinUserQuestionFriend(answer, contact);

  await changeSetContactStatusOtherProfile(
    contact.c1_contact_mirror_id,
    "USERQUESTIONFRIENDUNPINNED",
  );

  revalidatePath(
    `/users/${answer.user_username}/personal-info/user-criteria/${answer.userquestion_id}`,
  );
}

/*
export type Pelepelepele = {
  message?: string | null;
};

export type AnswerAndContact = { answer: Answer; contact: FoundContact }

export async function pinUserQuestionFriendForBind(
  answerAndContact: AnswerAndContact,
  prevState: Pelepelepele | undefined,
  formData: FormData
) {
  console.log(prevState);
  console.log(formData)

  const userQuestionFriend = await findUserQuestionFriendByAnswerAndContact(
    answerAndContact.answer,
    answerAndContact.contact,
  );

  if (userQuestionFriend === undefined) {
    await changeDeleteAtUserQuestionFriendByAnswerAndContact(
      answerAndContact.answer,
      answerAndContact.contact,
    );

    const generatedUserQuestionFriendID = uuidv4();

    await changeCreatePinUserQuestionFriend(
      answerAndContact.answer,
      answerAndContact.contact,
      generatedUserQuestionFriendID,
    );

    await changeSetContactStatusOtherProfile(
      answerAndContact.contact.c1_contact_mirror_id,
      "USERQUESTIONFRIENDPINNED",
    );
  }

  if (userQuestionFriend) {
    await changePinUserQuestionFriend(userQuestionFriend);

    await changeSetContactStatusOtherProfile(
      answerAndContact.contact.c1_contact_mirror_id,
      "USERQUESTIONFRIENDPINNED",
    );
  }

  revalidatePath(
    `/users/${answerAndContact.answer.user_username}/personal-info/user-criteria/${answerAndContact.answer.userquestion_id}`,
  );
}
*/
