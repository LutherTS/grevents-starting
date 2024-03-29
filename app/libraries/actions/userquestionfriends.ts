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
import {
  ANSWERS_PINNED_BY_FRIEND_LIMIT,
  countUserPinnedByFriendNotAndIrlAnswersExposed,
  countUserPinnedByFriendNotIrlAnswersExposed,
} from "../data/answers";
import { defineFoundRelCombo } from "../utilities/relcombos";

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

// now making sure there aren't 5 or more pinned at time of execution
export async function pinUserQuestionFriend(
  answer: Answer,
  contact: FoundContact,
) {
  // I can refactor either with a Promise.all on the count functions, or by conditioning either function according to relCombo first, but this is so far so fast that the hassle at this time isn't worth the performance.
  // ...But I'm going to need a verifyContact here.
  /*
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
  }
  */
  // Though that case is so rare and so unimportant that it isn't worth it at this time. Here's the thing:
  // Now, you can't have more that 5, rather ANSWERS_PINNED_BY_FRIEND_LIMIT pinned with this function. That's definitive. But you can pin even if in the meantime you've been blocked or unfriended, which you'll find out with revalidatePath at the end of the function. But is it really as important as changing relation combinaison where this verification is mandatory and has been implemented?
  // This is to say that, there are many tweaks that could and should be made to a project in order to assess E-VE-RY SIN-GLE case, but some are a lot more rare than others, less breaking than others, and therefore can be depriorities for assessment ONLY when they actually happen, assuming that their happening has a truly minor impact on user experience.

  const pinnedByFriendNotIrlAnswersLength =
    await countUserPinnedByFriendNotIrlAnswersExposed(
      answer.user_id,
      contact.c1_contact_id,
    );
  // console.log(pinnedByFriendNotIrlAnswersLength);

  const pinnedByFriendNotAndIrlAnswersLength =
    await countUserPinnedByFriendNotAndIrlAnswersExposed(
      answer.user_id,
      contact.c1_contact_id,
    );
  // console.log(pinnedByFriendNotAndIrlAnswersLength);

  const relCombo = defineFoundRelCombo(contact);
  // console.log(relCombo);

  if (
    (pinnedByFriendNotIrlAnswersLength < ANSWERS_PINNED_BY_FRIEND_LIMIT &&
      relCombo === "friend") ||
    (pinnedByFriendNotAndIrlAnswersLength < ANSWERS_PINNED_BY_FRIEND_LIMIT &&
      relCombo === "irl")
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
