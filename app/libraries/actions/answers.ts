"use server";

import { z } from "zod";
import { Answer } from "../definitions/answers";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { User } from "../definitions/users";
import { v4 as uuidv4 } from "uuid";
import {
  changeCreateAnswer,
  changeDeleteAtAnswer,
  changeUpdateAnswerValueByAnswerID,
  changeUpdateAnswerValueByUserQuestionAndUser,
  changeUpdateDeleteAnswer,
} from "../changes/answers";
import { changeSetUserStatusPersonalInfo } from "../changes/users";
import {
  changeCreateCustomUserQuestion,
  changeCreatePseudonativeIrlUserQuestion,
  changeCreatePseudonativeNotIrlUserQuestion,
  changeCreateNativeUserQuestion,
  changeDeleteAtUserQuestion,
  changePinUserQuestionOfAnswer,
  changeSetUserQuestionPseudonativeIrlOfAnswer,
  changeSetUserQuestionPseudonativeOfAnswer,
  changeSwitchUserQuestionToPseudonative,
  changeSwitchUserQuestionToPseudonativeIrl,
  changeUnpinUserQuestionOfAnswer,
} from "../changes/userquestions";
import {
  findCustomQuestionByQuestionName,
  findPseudoQuestionByQuestionName,
  findQuestionByQuestionID,
} from "../data/questions";
import {
  findPreExistingCustomUserQuestion,
  findPreExistingNativeUserQuestion,
  findPreExistingPseudonativeUserQuestion,
} from "../data/userquestions";
import {
  changeCreateCustomQuestion,
  changeCreatePseudoQuestion,
} from "../changes/questions";
import {
  ANSWERS_DEFAULT_LIMIT,
  ANSWERS_PINNED_BY_USER_LIMIT,
  countUserCustomAnswers,
  countUserNativeIrlAnswers,
  countUserNativeNotIrlAnswers,
  countUserPinnedAnswers,
  countUserPseudonativeIrlAnswers,
  countUserPseudonativeNotIrlAnswers,
} from "../data/answers";

const ANSWER_STATES = ["NONE", "LIVE", "DELETED"] as const;

const AnswerSchema = z.object({
  answerId: z.string().length(36),
  userQuestionId: z.string().length(36).nullable(),
  userId: z.string().length(36).nullable(),
  answerState: z.enum(ANSWER_STATES),
  answerValue: z.string().max(200, {
    message: "Your answer cannot be longer than 200 characters.",
  }),
  answerCreatedAt: z.string().datetime(),
  answerUpdatedAt: z.string().datetime(),
  questionId: z
    .string({
      invalid_type_error: "Please select a question.",
    })
    .length(36, {
      message: "Please select a valid question.",
    }),
  initialAnswerValue: z
    .string()
    .min(1, {
      message: "Your answer cannot be shorter than 1 character.",
    })
    .max(200, {
      message: "Your answer cannot be longer than 200 characters.",
    }),
  initialQuestionName: z
    .string()
    .min(1, {
      message: "Your question cannot be shorter than 1 character.",
    })
    .max(200, {
      message: "Your question cannot be longer than 200 characters.",
    }),
});

const UpdateOrDeleteAnswerValue = AnswerSchema.pick({ answerValue: true });

export type UpdateOrDeleteAnswerValueFormState = {
  errors?: {
    answerValue?: string[] | undefined;
  };
  message?: string | null;
};

export async function updateOrDeleteAnswerValue(
  answer: Answer,
  prevState: UpdateOrDeleteAnswerValueFormState | undefined,
  formData: FormData,
) {
  // console.log(answer);
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("answervalue"));

  const validatedFields = UpdateOrDeleteAnswerValue.safeParse({
    answerValue: formData.get("answervalue"),
  });
  // console.log(UpdateOrDeleteAnswerValue);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Nor Delete Answer Value.",
    };
  }

  const { answerValue } = validatedFields.data;

  // console.log(answerValue);
  // console.log(answer.user_username);

  if (answerValue === "") {
    await changeUpdateDeleteAnswer(answer);

    if (
      answer.question_kind === "NATIVE" ||
      answer.question_kind === "NATIVEIRL"
    ) {
      await changeSetUserStatusPersonalInfo(
        answer.user_id,
        "STANDARDIZEDANSWERDELETED",
      );
    }

    if (
      answer.question_kind === "PSEUDO" ||
      answer.question_kind === "CUSTOM"
    ) {
      await changeSetUserStatusPersonalInfo(
        answer.user_id,
        "CUSTOMIZEDANSWERDELETED",
      );
    }

    // To update standardized add criteria's select options.
    if (
      answer.question_kind === "NATIVE" ||
      answer.question_kind === "NATIVEIRL"
    ) {
      revalidatePath(
        `/users/${answer.user_username}/personal-info/standardized/add-criteria`,
      );
    }
  }

  if (answerValue !== "") {
    await changeUpdateAnswerValueByAnswerID(answer, answerValue);

    if (
      answer.question_kind === "NATIVE" ||
      answer.question_kind === "NATIVEIRL"
    ) {
      await changeSetUserStatusPersonalInfo(
        answer.user_id,
        "STANDARDIZEDANSWERUPDATED",
      );
    }

    if (
      answer.question_kind === "PSEUDO" ||
      answer.question_kind === "CUSTOM"
    ) {
      await changeSetUserStatusPersonalInfo(
        answer.user_id,
        "CUSTOMIZEDANSWERUPDATED",
      );
    }
  }

  if (answer.userquestion_is_pinned) {
    revalidatePath(`/users/${answer.user_username}/personal-info`);
  }

  if (
    answer.question_kind === "NATIVE" &&
    answer.userquestion_kind === "NONE"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/standardized`);
    revalidatePath(
      `/users/${answer.user_username}/personal-info/standardized/modify`,
    );
    redirect(`/users/${answer.user_username}/personal-info/standardized`);
  }

  if (
    answer.question_kind === "NATIVEIRL" &&
    answer.userquestion_kind === "NONE"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/standardized`);
    revalidatePath(
      `/users/${answer.user_username}/personal-info/standardized/modify`,
    );
    redirect(`/users/${answer.user_username}/personal-info/standardized`);
  }

  if (
    answer.question_kind === "PSEUDO" &&
    answer.userquestion_kind === "PSEUDONATIVE"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/customized`);
    revalidatePath(
      `/users/${answer.user_username}/personal-info/customized/modify`,
    );
    redirect(`/users/${answer.user_username}/personal-info/customized`);
  }

  if (
    answer.question_kind === "PSEUDO" &&
    answer.userquestion_kind === "PSEUDONATIVEIRL"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/customized`);
    revalidatePath(
      `/users/${answer.user_username}/personal-info/customized/modify`,
    );
    redirect(`/users/${answer.user_username}/personal-info/customized`);
  }

  if (
    answer.question_kind === "CUSTOM" &&
    answer.userquestion_kind === "NONE"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/customized`);
    revalidatePath(
      `/users/${answer.user_username}/personal-info/user-criteria/${answer.userquestion_id}`,
    );
    redirect(`/users/${answer.user_username}/personal-info/customized`);
  }
}

export async function pinOrUnpinUserQuestionOfAnswer(answer: Answer) {
  // FULL IMPOSSIBILITY TO PIN AT OR ABOVE ANSWERS_PINNED_BY_USER_LIMIT STILL NEEDS TO BE TESTED (ANSWERS_PINNED_BY_USER_LIMIT = 16).

  if (answer.userquestion_is_pinned === false) {
    const userPinnedAnswerLength = await countUserPinnedAnswers(answer.user_id);

    if (userPinnedAnswerLength < ANSWERS_PINNED_BY_USER_LIMIT) {
      await changePinUserQuestionOfAnswer(answer);

      // When the issue arises, I'm going to have to use data from RETURNING in order to trigger the following code not from answer.user_username (answer.user_id), but from the same data that should be obtained from the previous query to make the next one dependent on that result.

      await changeSetUserStatusPersonalInfo(answer.user_id, "CRITERIAPINNED");
    }
  }

  if (answer.userquestion_is_pinned === true) {
    await changeUnpinUserQuestionOfAnswer(answer);

    await changeSetUserStatusPersonalInfo(answer.user_id, "CRITERIAUNPINNED");
  }

  revalidatePath(`/users/${answer.user_username}/personal-info`);

  // if (
  //   answer.question_kind === "NATIVE" &&
  //   answer.userquestion_kind === "NONE"
  // ) {
  //   revalidatePath(`/users/${answer.user_username}/personal-info/standardized`);
  // }

  // if (
  //   answer.question_kind === "NATIVEIRL" &&
  //   answer.userquestion_kind === "NONE"
  // ) {
  //   revalidatePath(`/users/${answer.user_username}/personal-info/standardized`);
  // }

  // if (
  //   answer.question_kind === "PSEUDO" &&
  //   answer.userquestion_kind === "PSEUDONATIVE"
  // ) {
  //   revalidatePath(`/users/${answer.user_username}/personal-info/customized`);
  // }

  // if (
  //   answer.question_kind === "PSEUDO" &&
  //   answer.userquestion_kind === "PSEUDONATIVEIRL"
  // ) {
  //   revalidatePath(`/users/${answer.user_username}/personal-info/customized`);
  // }

  // if (
  //   answer.question_kind === "CUSTOM" &&
  //   answer.userquestion_kind === "NONE"
  // ) {
  //   revalidatePath(`/users/${answer.user_username}/personal-info/customized`);
  // }

  // Because both pages need to know if ANSWERS_PINNED_BY_USER_LIMIT has been reached.
  revalidatePath(`/users/${answer.user_username}/personal-info/standardized`);
  revalidatePath(`/users/${answer.user_username}/personal-info/customized`);

  redirect(`/users/${answer.user_username}/personal-info`);
}

export async function switchUserQuestionKindOfAnswer(answer: Answer) {
  if (
    answer.question_kind === "PSEUDO" &&
    answer.userquestion_kind === "PSEUDONATIVE"
  ) {
    await changeSetUserQuestionPseudonativeIrlOfAnswer(answer);

    await changeSetUserStatusPersonalInfo(
      answer.user_id,
      "PSEUDONATIVECRITERIAUPPEDTOIRL",
    );
  }

  if (
    answer.question_kind === "PSEUDO" &&
    answer.userquestion_kind === "PSEUDONATIVEIRL"
  ) {
    await changeSetUserQuestionPseudonativeOfAnswer(answer);

    await changeSetUserStatusPersonalInfo(
      answer.user_id,
      "PSEUDONATIVECRITERIADOWNEDFROMIRL",
    );
  }

  revalidatePath(`/users/${answer.user_username}/personal-info/customized`);

  if (answer.userquestion_is_pinned === true) {
    revalidatePath(`/users/${answer.user_username}/personal-info`);
  }
}

// I'm going to need new, actually updated schemas combining Question and Answer. Done.

const CreateNativeNotIrlAnswer = AnswerSchema.pick({
  questionId: true,
  initialAnswerValue: true,
});

export type CreateNativeNotIrlAnswerFormState = {
  errors?: {
    questionId?: string[] | undefined;
    initialAnswerValue?: string[] | undefined;
  };
  message?: string | null;
};

// These are the utility queries for standardized criteria

// async function findQuestionByQuestionID(questionId: string) {
//   noStore();
//   // console.log(questionId);
//   try {
//     const run = async () => {
//       const data = await sql<NativeNotIrlQuestion>`
//         SELECT
//             question_name,
//             question_kind,
//             question_id
//         FROM Questions

//         WHERE question_id = ${questionId} -- >NativeNotIrlQuestion< -- for 'First name' -- already exists so updated
//         -- WHERE question_id = 'ba3a314a-98a4-419d-a0c7-6d9eab5ac2cf' -- >NativeNotIrlQuestion< -- for 'Other email address' -- already exists but was deleted so SQL DELETE and create new one
//         -- WHERE question_id = '7de346e6-dc73-4d68-b6a3-abb5d09654cc' -- >NativeNotIrlQuestion< -- for 'Work number' -- does not exist yet so create one

//         AND Questions.question_state = 'LIVE';
//       `;
//       // console.log(data);
//       return data.rows[0];
//     };
//     const data = await pRetry(run, { retries: DEFAULT_RETRIES });
//     // console.log(data);
//     return data;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to find question by question ID.");
//   }
// }

// async function findPreExistingNativeUserQuestion(
//   user: User,
//   question: NativeNotIrlQuestion | NativeIrlQuestion,
// ) {
//   noStore();
//   // console.log(questionId);
//   try {
//     const run = async () => {
//       const data = await sql<PreExistingNativeUserQuestion>`
//         SELECT
//             UserQuestions.userquestion_id,
//             UserQuestions.userquestion_state,
//             Questions.question_kind,
//             Answers.answer_state
//         FROM UserQuestions

//         JOIN Users ON UserQuestions.user_id = Users.user_id
//         JOIN Questions ON UserQuestions.question_id = Questions.question_id
//         JOIN Answers ON Answers.userquestion_id = UserQuestions.userquestion_id

//         WHERE Users.user_id = ${user.user_id}
//         AND Questions.question_id = ${question.question_id}

//         AND (
//             UserQuestions.userquestion_state = 'LIVE' -- la jointure entre la question et la personne à laquelle elle a été posée est opérationnelle
//             OR UserQuestions.userquestion_state = 'DELETED' -- car il me faudra lancer la suite dépendamment de si la UserQuestion et/ou la Answer est/sont DELETED
//         )
//         AND (
//             Answers.answer_state = 'LIVE'
//             OR Answers.answer_state = 'DELETED'
//         )

//         AND Users.user_state = 'LIVE' -- la personne qui y a répondu est
//         AND Questions.question_state = 'LIVE'; -- la question posée est opérationnelle
//       `;
//       // console.log(data);
//       return data.rows[0];
//     };
//     const data = await pRetry(run, { retries: DEFAULT_RETRIES });
//     // console.log(data);
//     return data;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to find pre-existing native user question.");
//   }
// }

// I'm going to need to bind the current length of each list,
// send that length to the function,
// and return early to the form with an error message.
// That means I'm going to have to bind the current length... actually no.
// I'm just going to check the length within the function right before allowing it to happen or not.
export async function createNativeNotIrlAnswer(
  user: User,
  prevState: CreateNativeNotIrlAnswerFormState | undefined,
  formData: FormData,
) {
  // console.log(user);
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("nativenotirlquestion"));
  // console.log(formData.get("nativenotirlanswer"));

  const validatedFields = CreateNativeNotIrlAnswer.safeParse({
    questionId: formData.get("nativenotirlquestion"),
    initialAnswerValue: formData.get("nativenotirlanswer"),
  });
  // console.log(CreateNativeNotIrlAnswer);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Native Not IRL Answer.",
    };
  }

  const answersCount = await countUserNativeNotIrlAnswers(user.user_id);

  if (answersCount >= ANSWERS_DEFAULT_LIMIT) {
    return {
      message: `Apologies, you can't create more than ${ANSWERS_DEFAULT_LIMIT} of a type of criteria.`,
    };
  }

  const { questionId, initialAnswerValue } = validatedFields.data;

  // console.log(questionId);
  // console.log(initialAnswerValue);
  // console.log(user.user_id);

  const question = await findQuestionByQuestionID(questionId);
  // console.log(question);

  const userQuestion = await findPreExistingNativeUserQuestion(user, question);
  // console.log(userQuestion);

  if (userQuestion === undefined) {
    // effacements inutiles vu que les uuids n'existent pas encore // non
    // effacement à la UserQuestion, mais pas à la Answer // on ne sait jamais
    await changeDeleteAtUserQuestion(user, question);

    const generatedUserQuestionID = uuidv4();

    await changeCreateNativeUserQuestion(
      user,
      question,
      generatedUserQuestionID,
    );

    const generatedAnswerID = uuidv4();

    await changeCreateAnswer(
      user,
      initialAnswerValue,
      generatedAnswerID,
      generatedUserQuestionID,
    );

    await changeSetUserStatusPersonalInfo(
      user.user_id,
      "NATIVECRITERIANOTIRLADDED",
    );
  }

  if (
    userQuestion &&
    userQuestion.question_kind === "NATIVE" &&
    (userQuestion.userquestion_state === "DELETED" ||
      userQuestion.answer_state === "DELETED")
  ) {
    // effacements aux emplacements de création
    await changeDeleteAtAnswer(userQuestion, user);
    await changeDeleteAtUserQuestion(user, question);

    const generatedUserQuestionID = uuidv4();

    await changeCreateNativeUserQuestion(
      user,
      question,
      generatedUserQuestionID,
    );

    const generatedAnswerID = uuidv4();

    await changeCreateAnswer(
      user,
      initialAnswerValue,
      generatedAnswerID,
      generatedUserQuestionID,
    );

    await changeSetUserStatusPersonalInfo(
      user.user_id,
      "NATIVECRITERIANOTIRLADDED",
    );
  }

  if (
    userQuestion &&
    userQuestion.question_kind === "NATIVE" &&
    userQuestion.userquestion_state === "LIVE" &&
    userQuestion.answer_state === "LIVE"
  ) {
    // cas éventuellement impossible agissant en guise de mises à jour
    await changeUpdateAnswerValueByUserQuestionAndUser(
      userQuestion,
      user,
      initialAnswerValue,
    );

    await changeSetUserStatusPersonalInfo(
      user.user_id,
      "STANDARDIZEDANSWERUPDATED",
    );
  }

  revalidatePath(`/users/${user.user_username}/personal-info/standardized`);
  revalidatePath(
    `/users/${user.user_username}/personal-info/standardized/modify`,
  );
  revalidatePath(
    `/users/${user.user_username}/personal-info/standardized/add-criteria`,
  );
  redirect(`/users/${user.user_username}/personal-info/standardized`);
}

// I can make it all work under the function above eventually with conditions. But for now, moreso for training purposes, I would rather remake the entire function and flow.

const CreateNativeIrlAnswer = AnswerSchema.pick({
  questionId: true,
  initialAnswerValue: true,
});

export type CreateNativeIrlAnswerFormState = {
  errors?: {
    questionId?: string[] | undefined;
    initialAnswerValue?: string[] | undefined;
  };
  message?: string | null;
};

export async function createNativeIrlAnswer(
  user: User,
  prevState: CreateNativeIrlAnswerFormState | undefined,
  formData: FormData,
) {
  // console.log(user);
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("nativeirlquestion"));
  // console.log(formData.get("nativeirlanswer"));

  const validatedFields = CreateNativeIrlAnswer.safeParse({
    questionId: formData.get("nativeirlquestion"),
    initialAnswerValue: formData.get("nativeirlanswer"),
  });
  // console.log(CreateNativeIrlAnswer);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Native IRL Answer.",
    };
  }

  const answersCount = await countUserNativeIrlAnswers(user.user_id);

  if (answersCount >= ANSWERS_DEFAULT_LIMIT) {
    return {
      message: `Apologies, you can't create more than ${ANSWERS_DEFAULT_LIMIT} of a type of criteria.`,
    };
  }

  const { questionId, initialAnswerValue } = validatedFields.data;

  // console.log(questionId);
  // console.log(initialAnswerValue);
  // console.log(user.user_id);

  const question = await findQuestionByQuestionID(questionId);
  // console.log(question);

  const userQuestion = await findPreExistingNativeUserQuestion(user, question);
  // console.log(userQuestion);

  if (userQuestion === undefined) {
    // effacements inutiles vu que les uuids n'existent pas encore // non
    // effacement à la UserQuestion, mais pas à la Answer // on ne sait jamais
    await changeDeleteAtUserQuestion(user, question);

    const generatedUserQuestionID = uuidv4();

    await changeCreateNativeUserQuestion(
      user,
      question,
      generatedUserQuestionID,
    );

    const generatedAnswerID = uuidv4();

    await changeCreateAnswer(
      user,
      initialAnswerValue,
      generatedAnswerID,
      generatedUserQuestionID,
    );

    await changeSetUserStatusPersonalInfo(
      user.user_id,
      "NATIVECRITERIAIRLADDED",
    );
  }

  if (
    userQuestion &&
    userQuestion.question_kind === "NATIVEIRL" &&
    (userQuestion.userquestion_state === "DELETED" ||
      userQuestion.answer_state === "DELETED")
  ) {
    // effacements aux emplacements de création
    await changeDeleteAtAnswer(userQuestion, user);
    await changeDeleteAtUserQuestion(user, question);

    const generatedUserQuestionID = uuidv4();

    await changeCreateNativeUserQuestion(
      user,
      question,
      generatedUserQuestionID,
    );

    const generatedAnswerID = uuidv4();

    await changeCreateAnswer(
      user,
      initialAnswerValue,
      generatedAnswerID,
      generatedUserQuestionID,
    );

    await changeSetUserStatusPersonalInfo(
      user.user_id,
      "NATIVECRITERIAIRLADDED",
    );
  }

  if (
    userQuestion &&
    userQuestion.question_kind === "NATIVEIRL" &&
    userQuestion.userquestion_state === "LIVE" &&
    userQuestion.answer_state === "LIVE"
  ) {
    // cas normalement impossible agissant en guise de mises à jour de la réponse quand on "crée" un critère déjà créé
    await changeUpdateAnswerValueByUserQuestionAndUser(
      userQuestion,
      user,
      initialAnswerValue,
    );

    await changeSetUserStatusPersonalInfo(
      user.user_id,
      "STANDARDIZEDANSWERUPDATED",
    );
  }

  revalidatePath(`/users/${user.user_username}/personal-info/standardized`);
  revalidatePath(
    `/users/${user.user_username}/personal-info/standardized/modify`,
  );
  revalidatePath(
    `/users/${user.user_username}/personal-info/standardized/add-criteria`,
  );
  redirect(`/users/${user.user_username}/personal-info/standardized`);
}

// createPseudonativeNotIrlAnswer

const CreatePseudonativeNotIrlAnswer = AnswerSchema.pick({
  initialQuestionName: true,
  initialAnswerValue: true,
});

export type CreatePseudonativeNotIrlAnswerFormState = {
  errors?: {
    initialQuestionName?: string[] | undefined;
    initialAnswerValue?: string[] | undefined;
  };
  message?: string | null;
};

// These are the utility queries for customized criteria

// async function findPseudoQuestionByQuestionName(questionName: string) {
//   noStore();
//   // console.log(questionName);
//   try {
//     const run = async () => {
//       const data = await sql<PseudonativeQuestion>`
//         SELECT
//             question_name,
//             question_kind,
//             question_id
//         FROM Questions

//         WHERE question_name = ${questionName} -- cas où la question, du moins en tant que PSEUDO, n'existe pas encore -- 'Looking for' -- DONE
//         -- WHERE question_name = 'Father's birthday' -- cas où il n'y a pas encore de réponse et donc on crée les entrées correspondantes -- DONE
//         -- WHERE question_name = 'Birthday' -- cas où il y a une réponse LIVE et donc on la modifie -- DONE
//         -- WHERE question_name = 'Mother's birthday' -- cas où il a déjà une réponse mais elle est DELETED, du coup on efface ses entrées et on en crée des nouvelles -- DONE
//         -- WHERE question_name = 'Girlfriend's birthday' -- cas où il y a une réponse LIVE mais elle est actuellement PSEUDONATIVEIRL au lieu de PSEUDONATIVE, donc on modifie la UserQuetion à PSEUDONATIVE et on remplace la Answer -- DONE
//         -- WHERE question_name = 'Crush's birthday' -- cas où il y a une réponse DELETED qui est actuellement PSEUDONATIVEIRL au lieu de PSEUDONATIVE, du coup on efface ses entrées et on en crée des nouvelles -- DONE
//         -- WHERE question_name = 'In a relationship' -- cas où la question, du moins en tant que PSEUDO, n'existe pas encore -- DONE
//         -- WHERE question_name = 'Father’s birthdate' -- cas où il n'y a pas encore de réponse et donc on crée les entrées correspondantes -- DONE
//         -- WHERE question_name = 'Birthdate' -- cas où il y a une réponse LIVE et donc on la modifie -- DONE
//         -- WHERE question_name = 'Mother’s birthdate' -- cas où il a déjà une réponse mais elle est DELETED, du coup on efface ses entrées et on en crée des nouvelles -- DONE
//         -- WHERE question_name = 'Girlfriend’s birthdate' -- cas où il y a une réponse LIVE mais elle est actuellement PSEUDONATIVE au lieu de PSEUDONATIVEIRL, donc on modifie la UserQuetion à PSEUDONATIVEIRL et on remplace la Answer -- DONE
//         -- WHERE question_name = 'Crush’s birthdate' -- cas où il y a une réponse DELETED qui est actuellement PSEUDONATIVE au lieu de PSEUDONATIVEIRL, du coup on efface ses entrées et on en crée des nouvelles -- DONE
//         AND question_kind = 'PSEUDO' -- la question est en effet pseudo

//         AND question_state = 'LIVE';
//       `;
//       // console.log(data);
//       return data.rows[0];
//     };
//     const data = await pRetry(run, { retries: DEFAULT_RETRIES });
//     // console.log(data);
//     return data;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to find pseudo question by question name.");
//   }
// }

// async function findCustomQuestionByQuestionName(questionName: string) {
//   noStore();
//   // console.log(questionName);
//   try {
//     const run = async () => {
//       const data = await sql<CustomQuestion>`
//         SELECT
//             question_name,
//             question_kind,
//             question_id
//         FROM Questions

//         WHERE question_name = ${questionName} -- cas où la question, du moins en tant que CUSTOM, n'existe pas encore -- 'Favorite anime composer' -- DONE
//         -- WHERE question_name = 'Favorite anime studio' -- cas où il n'y a pas encore de réponse et donc on crée les entrées correspondantes -- DONE
//         -- WHERE question_name = 'Favorite anime series' -- cas où il y a une réponse LIVE et donc on la modifie -- DONE
//         -- WHERE question_name = 'Favorite anime franchise' -- cas où il a déjà une réponse mais elle est DELETED, du coup on efface ses entrées et on en crée des nouvelles -- DONE
//         AND question_kind = 'CUSTOM' -- la question est en effet custom

//         AND question_state = 'LIVE';
//       `;
//       // console.log(data);
//       return data.rows[0];
//     };
//     const data = await pRetry(run, { retries: DEFAULT_RETRIES });
//     // console.log(data);
//     return data;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to find custom question by question name.");
//   }
// }

// async function findPreExistingPseudonativeUserQuestion(
//   user: User,
//   question: PseudonativeQuestion,
// ) {
//   noStore();
//   // console.log(questionId);
//   try {
//     const run = async () => {
//       const data = await sql<PreExistingPseudonativeUserQuestion>`
//         SELECT
//             UserQuestions.userquestion_id,
//             UserQuestions.userquestion_state,
//             Questions.question_kind,
//             UserQuestions.userquestion_kind, -- only addition to inspired query
//             Answers.answer_state
//         FROM UserQuestions

//         JOIN Users ON UserQuestions.user_id = Users.user_id
//         JOIN Questions ON UserQuestions.question_id = Questions.question_id
//         JOIN Answers ON Answers.userquestion_id = UserQuestions.userquestion_id

//         WHERE Users.user_id = ${user.user_id}
//         AND Questions.question_id = ${question.question_id}

//         AND (
//             UserQuestions.userquestion_state = 'LIVE' -- la jointure entre la question et la personne à laquelle elle a été posée est opérationnelle
//             OR UserQuestions.userquestion_state = 'DELETED' -- car il me faudra lancer la suite dépendamment de si la UserQuestion et/ou la Answer est/sont DELETED
//         )
//         AND (
//             Answers.answer_state = 'LIVE'
//             OR Answers.answer_state = 'DELETED'
//         )

//         AND Users.user_state = 'LIVE' -- la personne qui y a répondu est
//         AND Questions.question_state = 'LIVE'; -- la question posée est opérationnelle
//       `;
//       // console.log(data);
//       return data.rows[0];
//     };
//     const data = await pRetry(run, { retries: DEFAULT_RETRIES });
//     // console.log(data);
//     return data;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to find pre-existing pseudonative user question.");
//   }
// }

// async function findPreExistingCustomUserQuestion(
//   user: User,
//   question: CustomQuestion,
// ) {
//   noStore();
//   // console.log(questionId);
//   try {
//     const run = async () => {
//       const data = await sql<PreExistingCustomUserQuestion>`
//         SELECT
//             UserQuestions.userquestion_id,
//             UserQuestions.userquestion_state,
//             Questions.question_kind,
//             Answers.answer_state
//         FROM UserQuestions

//         JOIN Users ON UserQuestions.user_id = Users.user_id
//         JOIN Questions ON UserQuestions.question_id = Questions.question_id
//         JOIN Answers ON Answers.userquestion_id = UserQuestions.userquestion_id

//         WHERE Users.user_id = ${user.user_id}
//         AND Questions.question_id = ${question.question_id}

//         AND (
//             UserQuestions.userquestion_state = 'LIVE' -- la jointure entre la question et la personne à laquelle elle a été posée est opérationnelle
//             OR UserQuestions.userquestion_state = 'DELETED' -- car il me faudra lancer la suite dépendamment de si la UserQuestion et/ou la Answer est/sont DELETED
//         )
//         AND (
//             Answers.answer_state = 'LIVE'
//             OR Answers.answer_state = 'DELETED'
//         )

//         AND Users.user_state = 'LIVE' -- la personne qui y a répondu est
//         AND Questions.question_state = 'LIVE'; -- la question posée est opérationnelle
//       `;
//       // console.log(data);
//       return data.rows[0];
//     };
//     const data = await pRetry(run, { retries: DEFAULT_RETRIES });
//     // console.log(data);
//     return data;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to find pre-existing custom user question.");
//   }
// }

export async function createPseudonativeNotIrlAnswer(
  user: User,
  prevState: CreatePseudonativeNotIrlAnswerFormState | undefined,
  formData: FormData,
) {
  // console.log(user);
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("pseudonativenotirlquestion"));
  // console.log(formData.get("pseudonativenotirlanswer"));

  const validatedFields = CreatePseudonativeNotIrlAnswer.safeParse({
    initialQuestionName: formData.get("pseudonativenotirlquestion"),
    initialAnswerValue: formData.get("pseudonativenotirlanswer"),
  });
  // console.log(CreatePseudonativeNotIrlAnswer);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Pseudonative Not IRL Answer.",
    };
  }

  const answersCount = await countUserPseudonativeNotIrlAnswers(user.user_id);

  if (answersCount >= ANSWERS_DEFAULT_LIMIT) {
    return {
      message: `Apologies, you can't create more than ${ANSWERS_DEFAULT_LIMIT} of a type of criteria.`,
    };
  }

  const { initialQuestionName, initialAnswerValue } = validatedFields.data;

  // console.log(initialQuestionName);
  // console.log(initialAnswerValue);
  // console.log(user.user_id);

  const question = await findPseudoQuestionByQuestionName(initialQuestionName);
  // console.log(question);

  if (question === undefined) {
    // effacements inutiles vu que les uuids n'existent pas encore // oui
    // en effet, la question pseudo elle-même n'existe pas
    noStore();

    const generatedQuestionID = uuidv4();

    await changeCreatePseudoQuestion(initialQuestionName, generatedQuestionID);

    const generatedUserQuestionID = uuidv4();

    await changeCreatePseudonativeNotIrlUserQuestion(
      user,
      generatedQuestionID,
      generatedUserQuestionID,
    );

    const generatedAnswerID = uuidv4();

    await changeCreateAnswer(
      user,
      initialAnswerValue,
      generatedAnswerID,
      generatedUserQuestionID,
    );

    await changeSetUserStatusPersonalInfo(
      user.user_id,
      "PSEUDONATIVECRITERIANOTIRLADDED",
    );
  }

  if (question) {
    const userQuestion = await findPreExistingPseudonativeUserQuestion(
      user,
      question,
    );
    // console.log(userQuestion);

    /* EXACTEMENT LE MÊME CODE, sauf le côté PSEUDONATIVE. */
    if (userQuestion === undefined) {
      // effacements inutiles vu que les uuids n'existent pas encore // non
      // effacement à la UserQuestion, mais pas à la Answer // on ne sait jamais
      await changeDeleteAtUserQuestion(user, question);

      const generatedUserQuestionID = uuidv4();

      await changeCreatePseudonativeNotIrlUserQuestion(
        user,
        question.question_id,
        generatedUserQuestionID,
      );

      const generatedAnswerID = uuidv4();

      await changeCreateAnswer(
        user,
        initialAnswerValue,
        generatedAnswerID,
        generatedUserQuestionID,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "PSEUDONATIVECRITERIANOTIRLADDED",
      );
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      // userQuestion.userquestion_kind === "PSEUDONATIVE" &&
      // C'est pareil. Irl ou pas, j'efface, et je recrée comme convenu.
      (userQuestion.userquestion_state === "DELETED" ||
        userQuestion.answer_state === "DELETED")
    ) {
      // effacements aux emplacements de création
      await changeDeleteAtAnswer(userQuestion, user);
      await changeDeleteAtUserQuestion(user, question);

      const generatedUserQuestionID = uuidv4();

      await changeCreatePseudonativeNotIrlUserQuestion(
        user,
        question.question_id,
        generatedUserQuestionID,
      );

      const generatedAnswerID = uuidv4();

      await changeCreateAnswer(
        user,
        initialAnswerValue,
        generatedAnswerID,
        generatedUserQuestionID,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "PSEUDONATIVECRITERIANOTIRLADDED",
      );
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      userQuestion.userquestion_kind === "PSEUDONATIVE" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      await changeUpdateAnswerValueByUserQuestionAndUser(
        userQuestion,
        user,
        initialAnswerValue,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "CUSTOMIZEDANSWERUPDATED",
      );
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      userQuestion.userquestion_kind === "PSEUDONATIVEIRL" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      await changeSwitchUserQuestionToPseudonative(userQuestion);
      await changeUpdateAnswerValueByUserQuestionAndUser(
        userQuestion,
        user,
        initialAnswerValue,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "CUSTOMIZEDANSWERUPDATED",
      );
    }
  }

  revalidatePath(`/users/${user.user_username}/personal-info/customized`);
  revalidatePath(
    `/users/${user.user_username}/personal-info/customized/modify`,
  );
  redirect(`/users/${user.user_username}/personal-info/customized`);
}

// createPseudonativeIrlAnswer

const CreatePseudonativeIrlAnswer = AnswerSchema.pick({
  initialQuestionName: true,
  initialAnswerValue: true,
});

export type CreatePseudonativeIrlAnswerFormState = {
  errors?: {
    initialQuestionName?: string[] | undefined;
    initialAnswerValue?: string[] | undefined;
  };
  message?: string | null;
};

export async function createPseudonativeIrlAnswer(
  user: User,
  prevState: CreatePseudonativeIrlAnswerFormState | undefined,
  formData: FormData,
) {
  // console.log(user);
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("pseudonativeirlquestion"));
  // console.log(formData.get("pseudonativeirlanswer"));

  const validatedFields = CreatePseudonativeIrlAnswer.safeParse({
    initialQuestionName: formData.get("pseudonativeirlquestion"),
    initialAnswerValue: formData.get("pseudonativeirlanswer"),
  });
  // console.log(CreatePseudonativeIrlAnswer);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Pseudonative IRL Answer.",
    };
  }

  const answersCount = await countUserPseudonativeIrlAnswers(user.user_id);

  if (answersCount >= ANSWERS_DEFAULT_LIMIT) {
    return {
      message: `Apologies, you can't create more than ${ANSWERS_DEFAULT_LIMIT} of a type of criteria.`,
    };
  }

  const { initialQuestionName, initialAnswerValue } = validatedFields.data;

  // console.log(initialQuestionName);
  // console.log(initialAnswerValue);
  // console.log(user.user_id);

  const question = await findPseudoQuestionByQuestionName(initialQuestionName);
  // console.log(question);

  if (question === undefined) {
    // effacements inutiles vu que les uuids n'existent pas encore // oui
    // en effet, la question pseudo elle-même n'existe pas
    noStore();

    const generatedQuestionID = uuidv4();

    await changeCreatePseudoQuestion(initialQuestionName, generatedQuestionID);

    const generatedUserQuestionID = uuidv4();

    await changeCreatePseudonativeIrlUserQuestion(
      user,
      generatedQuestionID,
      generatedUserQuestionID,
    );

    const generatedAnswerID = uuidv4();

    await changeCreateAnswer(
      user,
      initialAnswerValue,
      generatedAnswerID,
      generatedUserQuestionID,
    );

    await changeSetUserStatusPersonalInfo(
      user.user_id,
      "PSEUDONATIVECRITERIAIRLADDED",
    );
  }

  if (question) {
    const userQuestion = await findPreExistingPseudonativeUserQuestion(
      user,
      question,
    );
    // console.log(userQuestion);

    /* EXACTEMENT LE MÊME CODE, sauf le côté PSEUDONATIVEIRL. */
    if (userQuestion === undefined) {
      // effacements inutiles vu que les uuids n'existent pas encore // non
      // effacement à la UserQuestion, mais pas à la Answer // on ne sait jamais
      await changeDeleteAtUserQuestion(user, question);

      const generatedUserQuestionID = uuidv4();

      await changeCreatePseudonativeIrlUserQuestion(
        user,
        question.question_id,
        generatedUserQuestionID,
      );

      const generatedAnswerID = uuidv4();

      await changeCreateAnswer(
        user,
        initialAnswerValue,
        generatedAnswerID,
        generatedUserQuestionID,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "PSEUDONATIVECRITERIAIRLADDED",
      );
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      // userQuestion.userquestion_kind === "PSEUDONATIVEIRL" &&
      // C'est pareil. Irl ou pas, j'efface, et je recrée comme convenu.
      (userQuestion.userquestion_state === "DELETED" ||
        userQuestion.answer_state === "DELETED")
    ) {
      // effacements aux emplacements de création
      await changeDeleteAtAnswer(userQuestion, user);
      await changeDeleteAtUserQuestion(user, question);

      const generatedUserQuestionID = uuidv4();

      await changeCreatePseudonativeIrlUserQuestion(
        user,
        question.question_id,
        generatedUserQuestionID,
      );

      const generatedAnswerID = uuidv4();

      await changeCreateAnswer(
        user,
        initialAnswerValue,
        generatedAnswerID,
        generatedUserQuestionID,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "PSEUDONATIVECRITERIAIRLADDED",
      );
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      userQuestion.userquestion_kind === "PSEUDONATIVEIRL" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      await changeUpdateAnswerValueByUserQuestionAndUser(
        userQuestion,
        user,
        initialAnswerValue,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "CUSTOMIZEDANSWERUPDATED",
      );
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      userQuestion.userquestion_kind === "PSEUDONATIVE" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      await changeSwitchUserQuestionToPseudonativeIrl(userQuestion);
      await changeUpdateAnswerValueByUserQuestionAndUser(
        userQuestion,
        user,
        initialAnswerValue,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "CUSTOMIZEDANSWERUPDATED",
      );
    }
  }

  revalidatePath(`/users/${user.user_username}/personal-info/customized`);
  revalidatePath(
    `/users/${user.user_username}/personal-info/customized/modify`,
  );
  redirect(`/users/${user.user_username}/personal-info/customized`);
}

// createCustomAnswer

const CreateCustomAnswer = AnswerSchema.pick({
  initialQuestionName: true,
  initialAnswerValue: true,
});

export type CreateCustomAnswerFormState = {
  errors?: {
    initialQuestionName?: string[] | undefined;
    initialAnswerValue?: string[] | undefined;
  };
  message?: string | null;
};

export async function createCustomAnswer(
  user: User,
  prevState: CreateCustomAnswerFormState | undefined,
  formData: FormData,
) {
  // console.log(user);
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("customquestion"));
  // console.log(formData.get("customanswer"));

  const validatedFields = CreateCustomAnswer.safeParse({
    initialQuestionName: formData.get("customquestion"),
    initialAnswerValue: formData.get("customanswer"),
  });
  // console.log(CreateCustomAnswer);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Custom Answer.",
    };
  }

  const answersCount = await countUserCustomAnswers(user.user_id);

  if (answersCount >= ANSWERS_DEFAULT_LIMIT) {
    return {
      message: `Apologies, you can't create more than ${ANSWERS_DEFAULT_LIMIT} of a type of criteria.`,
    };
  }

  const { initialQuestionName, initialAnswerValue } = validatedFields.data;

  // console.log(initialQuestionName);
  // console.log(initialAnswerValue);
  // console.log(user.user_id);

  const question = await findCustomQuestionByQuestionName(initialQuestionName);
  // console.log(question);

  if (question === undefined) {
    // effacements inutiles vu que les uuids n'existent pas encore // oui
    // en effet, la question custom elle-même n'existe pas
    noStore();

    const generatedQuestionID = uuidv4();

    await changeCreateCustomQuestion(initialQuestionName, generatedQuestionID);

    const generatedUserQuestionID = uuidv4();

    await changeCreateCustomUserQuestion(
      user,
      generatedQuestionID,
      generatedUserQuestionID,
    );

    const generatedAnswerID = uuidv4();

    await changeCreateAnswer(
      user,
      initialAnswerValue,
      generatedAnswerID,
      generatedUserQuestionID,
    );

    await changeSetUserStatusPersonalInfo(user.user_id, "CUSTOMCRITERIAADDED");
  }

  if (question) {
    const userQuestion = await findPreExistingCustomUserQuestion(
      user,
      question,
    );
    // console.log(userQuestion);

    /* EXACTEMENT LE MÊME CODE, sauf la notification CUSTOM. */
    if (userQuestion === undefined) {
      // effacements inutiles vu que les uuids n'existent pas encore // non
      // effacement à la UserQuestion, mais pas à la Answer // on ne sait jamais
      await changeDeleteAtUserQuestion(user, question);

      const generatedUserQuestionID = uuidv4();

      await changeCreateCustomUserQuestion(
        user,
        question.question_id,
        generatedUserQuestionID,
      );

      const generatedAnswerID = uuidv4();

      await changeCreateAnswer(
        user,
        initialAnswerValue,
        generatedAnswerID,
        generatedUserQuestionID,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "CUSTOMCRITERIAADDED",
      );
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "CUSTOM" &&
      (userQuestion.userquestion_state === "DELETED" ||
        userQuestion.answer_state === "DELETED")
    ) {
      // effacements aux emplacements de création
      await changeDeleteAtAnswer(userQuestion, user);
      await changeDeleteAtUserQuestion(user, question);

      const generatedUserQuestionID = uuidv4();

      await changeCreateCustomUserQuestion(
        user,
        question.question_id,
        generatedUserQuestionID,
      );

      const generatedAnswerID = uuidv4();

      await changeCreateAnswer(
        user,
        initialAnswerValue,
        generatedAnswerID,
        generatedUserQuestionID,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "CUSTOMCRITERIAADDED",
      );
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "CUSTOM" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      await changeUpdateAnswerValueByUserQuestionAndUser(
        userQuestion,
        user,
        initialAnswerValue,
      );

      await changeSetUserStatusPersonalInfo(
        user.user_id,
        "CUSTOMIZEDANSWERUPDATED",
      );
    }
  }

  revalidatePath(`/users/${user.user_username}/personal-info/customized`);
  revalidatePath(
    `/users/${user.user_username}/personal-info/customized/modify`,
  );
  redirect(`/users/${user.user_username}/personal-info/customized`);
}
