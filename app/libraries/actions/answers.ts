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
  changeSetUserQuestionHidden,
  changeSetUserQuestionLive,
} from "../changes/userquestions";
import {
  EMAIL_ADDRESS_QUESTION_ID,
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
  const validatedFields = UpdateOrDeleteAnswerValue.safeParse({
    answerValue: formData.get("answervalue"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Nor Delete Answer Value.",
    };
  }

  const { answerValue } = validatedFields.data;

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

// createNativeNotIrlAnswer

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

export async function createNativeNotIrlAnswer(
  user: User,
  prevState: CreateNativeNotIrlAnswerFormState | undefined,
  formData: FormData,
) {
  const validatedFields = CreateNativeNotIrlAnswer.safeParse({
    questionId: formData.get("nativenotirlquestion"),
    initialAnswerValue: formData.get("nativenotirlanswer"),
  });

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

  const question = await findQuestionByQuestionID(questionId);

  const userQuestion = await findPreExistingNativeUserQuestion(user, question);

  if (userQuestion === undefined) {
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

// createNativeIrlAnswer

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
  const validatedFields = CreateNativeIrlAnswer.safeParse({
    questionId: formData.get("nativeirlquestion"),
    initialAnswerValue: formData.get("nativeirlanswer"),
  });

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

  const question = await findQuestionByQuestionID(questionId);

  const userQuestion = await findPreExistingNativeUserQuestion(user, question);

  if (userQuestion === undefined) {
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

export async function createPseudonativeNotIrlAnswer(
  user: User,
  prevState: CreatePseudonativeNotIrlAnswerFormState | undefined,
  formData: FormData,
) {
  const validatedFields = CreatePseudonativeNotIrlAnswer.safeParse({
    initialQuestionName: formData.get("pseudonativenotirlquestion"),
    initialAnswerValue: formData.get("pseudonativenotirlanswer"),
  });

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

  const question = await findPseudoQuestionByQuestionName(initialQuestionName);

  if (question === undefined) {
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

    /* EXACTEMENT LE MÊME CODE, sauf le côté PSEUDONATIVE. */
    if (userQuestion === undefined) {
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
  const validatedFields = CreatePseudonativeIrlAnswer.safeParse({
    initialQuestionName: formData.get("pseudonativeirlquestion"),
    initialAnswerValue: formData.get("pseudonativeirlanswer"),
  });

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

  const question = await findPseudoQuestionByQuestionName(initialQuestionName);

  if (question === undefined) {
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

    /* EXACTEMENT LE MÊME CODE, sauf le côté PSEUDONATIVEIRL. */
    if (userQuestion === undefined) {
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
  const validatedFields = CreateCustomAnswer.safeParse({
    initialQuestionName: formData.get("customquestion"),
    initialAnswerValue: formData.get("customanswer"),
  });

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

  const question = await findCustomQuestionByQuestionName(initialQuestionName);

  if (question === undefined) {
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

    /* EXACTEMENT LE MÊME CODE, sauf la notification CUSTOM. */
    if (userQuestion === undefined) {
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

export async function hideOrUnhideUserQuestionOfAnswer(answer: Answer) {
  // for now only for "Email address"
  if (answer.question_id === EMAIL_ADDRESS_QUESTION_ID) {
    if (answer.userquestion_state === "LIVE") {
      await changeSetUserQuestionHidden(answer);

      await changeSetUserStatusPersonalInfo(answer.user_id, "CRITERIAHIDDEN");
    }

    if (answer.userquestion_state === "HIDDEN") {
      await changeSetUserQuestionLive(answer);

      await changeSetUserStatusPersonalInfo(answer.user_id, "CRITERIAREVEALED");
    }

    // since for now only for "Email address"
    // ...and eventually it will be revalidateTag once full flow stable
    revalidatePath(`/users/${answer.user_username}/personal-info/standardized`);
    revalidatePath(
      `/users/${answer.user_username}/personal-info/standardized/modify`,
    );
    revalidatePath(`/users/${answer.user_username}/personal-info`);
    redirect(`/users/${answer.user_username}/personal-info/standardized`);
  }
}
