"use server";

import { z } from "zod";
import { Answer } from "../definitions/answers";
import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { User } from "../definitions/users";
import pRetry from "p-retry";
import {
  CustomQuestion,
  NativeIrlQuestion,
  NativeNotIrlQuestion,
  PseudonativeQuestion,
} from "../definitions/questions";
import {
  PreExistingCustomUserQuestion,
  PreExistingNativeUserQuestion,
  PreExistingPseudonativeUserQuestion,
} from "../definitions/userquestions";
import { v4 as uuidv4 } from "uuid";

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
    noStore();
    try {
      const run = async () => {
        const data = await sql`
          UPDATE Answers
          SET 
              answer_state = 'DELETED',
              answer_updated_at = now()
          WHERE answer_id = ${answer.answer_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Deleted Answer Value.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'ANSWERDELETED',
              user_updated_at = now()
          WHERE user_username = ${answer.user_username}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
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
    noStore();

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Answers
          SET 
              answer_value = ${answerValue},
              answer_updated_at = now()
          WHERE answer_id = ${answer.answer_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update Answer Value.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'ANSWERUPDATED',
              user_updated_at = now()
          WHERE user_username = ${answer.user_username}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
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
    noStore();
    try {
      const run = async () => {
        const data = await sql`
          UPDATE UserQuestions
          SET 
              userquestion_is_pinned = TRUE,
              userquestion_updated_at = now(),
              userquestion_pinned_at = now()
          WHERE userquestion_id = ${answer.userquestion_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Pin User Question of Answer.",
      };
    }

    // When the issue arises, I'm going to have to use data from RETURNING in order to trigger the following code not from answer.user_username, but from the same data that should be obtained from the previous query to make the next one dependent on that result.

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'CRITERIAPINNED',
              user_updated_at = now()
          WHERE user_username = ${answer.user_username}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  if (answer.userquestion_is_pinned === true) {
    noStore();
    try {
      const run = async () => {
        const data = await sql`
          UPDATE UserQuestions
          SET 
              userquestion_is_pinned = FALSE,
              userquestion_updated_at = now(),
              userquestion_pinned_at = NULL
          WHERE userquestion_id = ${answer.userquestion_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Unpin User Question of Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'CRITERIAUNPINNED',
              user_updated_at = now()
          WHERE user_username = ${answer.user_username}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  revalidatePath(`/users/${answer.user_username}/personal-info`);

  if (
    answer.question_kind === "NATIVE" &&
    answer.userquestion_kind === "NONE"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/standardized`);
  }

  if (
    answer.question_kind === "NATIVEIRL" &&
    answer.userquestion_kind === "NONE"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/standardized`);
  }

  if (
    answer.question_kind === "PSEUDO" &&
    answer.userquestion_kind === "PSEUDONATIVE"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/customized`);
  }

  if (
    answer.question_kind === "PSEUDO" &&
    answer.userquestion_kind === "PSEUDONATIVEIRL"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/customized`);
  }

  if (
    answer.question_kind === "CUSTOM" &&
    answer.userquestion_kind === "NONE"
  ) {
    revalidatePath(`/users/${answer.user_username}/personal-info/customized`);
  }

  redirect(`/users/${answer.user_username}/personal-info`);
}

export async function switchUserQuestionKindOfAnswer(answer: Answer) {
  if (
    answer.question_kind === "PSEUDO" &&
    answer.userquestion_kind === "PSEUDONATIVE"
  ) {
    noStore();
    try {
      const run = async () => {
        const data = await sql`
          UPDATE UserQuestions
          SET 
              userquestion_kind = 'PSEUDONATIVEIRL',
              userquestion_updated_at = now(),
              userquestion_up_to_irl_at = now(),
              userquestion_down_to_irl_at = NULL
          WHERE userquestion_id = ${answer.userquestion_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message:
          "Database Error: Failed to Switch User Question Kind of Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'PSEUDONATIVECRITERIAUPPEDTOIRL',
              user_updated_at = now()
          WHERE user_username = ${answer.user_username}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  if (
    answer.question_kind === "PSEUDO" &&
    answer.userquestion_kind === "PSEUDONATIVEIRL"
  ) {
    noStore();
    try {
      const run = async () => {
        const data = await sql`
          UPDATE UserQuestions
          SET 
              userquestion_kind = 'PSEUDONATIVE',
              userquestion_updated_at = now(),
              userquestion_up_to_irl_at = NULL,
              userquestion_down_to_irl_at = now()
          WHERE userquestion_id = ${answer.userquestion_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message:
          "Database Error: Failed to Switch User Question Kind of Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'PSEUDONATIVECRITERIADOWNEDFROMIRL',
              user_updated_at = now()
          WHERE user_username = ${answer.user_username}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  revalidatePath(`/users/${answer.user_username}/personal-info/customized`);

  if (answer.userquestion_is_pinned === true) {
    revalidatePath(`/users/${answer.user_username}/personal-info`);
  }
}

// I'm going to need new, actually update schemas combining Question and Answer. Done.

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

async function findQuestionByQuestionID(questionId: string) {
  noStore();
  // console.log(questionId);
  try {
    const run = async () => {
      const data = await sql<NativeNotIrlQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_id = ${questionId} -- >NativeNotIrlQuestion< -- for 'First name' -- already exists so updated
        -- WHERE question_id = 'ba3a314a-98a4-419d-a0c7-6d9eab5ac2cf' -- >NativeNotIrlQuestion< -- for 'Other email address' -- already exists but was deleted so SQL DELETE and create new one
        -- WHERE question_id = '7de346e6-dc73-4d68-b6a3-abb5d09654cc' -- >NativeNotIrlQuestion< -- for 'Work number' -- does not exist yet so create one

        AND Questions.question_state = 'LIVE'; 
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find question by question ID.");
  }
}

async function findPreExistingNativeUserQuestion(
  user: User,
  question: NativeNotIrlQuestion | NativeIrlQuestion,
) {
  noStore();
  // console.log(questionId);
  try {
    const run = async () => {
      const data = await sql<PreExistingNativeUserQuestion>`
        SELECT 
            UserQuestions.userquestion_id, 
            UserQuestions.userquestion_state,
            Questions.question_kind,
            Answers.answer_state
        FROM UserQuestions

        JOIN Users ON UserQuestions.user_id = Users.user_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Answers ON Answers.userquestion_id = UserQuestions.userquestion_id
      
        WHERE Users.user_id = ${user.user_id}
        AND Questions.question_id = ${question.question_id}
      
        AND (
            UserQuestions.userquestion_state = 'LIVE' -- la jointure entre la question et la personne à laquelle elle a été posée est opérationnelle
            OR UserQuestions.userquestion_state = 'DELETED' -- car il me faudra lancer la suite dépendamment de si la UserQuestion et/ou la Answer est/sont DELETED
        )
        AND (
            Answers.answer_state = 'LIVE'
            OR Answers.answer_state = 'DELETED'
        )

        AND Users.user_state = 'LIVE' -- la personne qui y a répondu est 
        AND Questions.question_state = 'LIVE'; -- la question posée est opérationnelle
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find pre-existing native user question.");
  }
}

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
    noStore();

    try {
      const run = async () => {
        const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Delete At User Question.",
      };
    }

    const generatedUserQuestionID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create User Question.",
      };
    }

    const generatedAnswerID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'NATIVECRITERIANOTIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  if (
    userQuestion &&
    userQuestion.question_kind === "NATIVE" &&
    (userQuestion.userquestion_state === "DELETED" ||
      userQuestion.answer_state === "DELETED")
  ) {
    // effacements aux emplacements de création
    noStore();

    try {
      const run = async () => {
        const data = await sql`
          DELETE FROM Answers
          WHERE userquestion_id = ${userQuestion.userquestion_id}
          AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Delete At Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Delete At User Question.",
      };
    }

    const generatedUserQuestionID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create User Question.",
      };
    }

    const generatedAnswerID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'NATIVECRITERIANOTIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  if (
    userQuestion &&
    userQuestion.question_kind === "NATIVE" &&
    userQuestion.userquestion_state === "LIVE" &&
    userQuestion.answer_state === "LIVE"
  ) {
    // cas éventuellement impossible agissant en guise de mises à jour
    noStore();

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Answers
          SET 
              answer_value = ${initialAnswerValue},
              answer_updated_at = now()
              WHERE userquestion_id = ${userQuestion.userquestion_id}
              AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update Answer Value.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'ANSWERUPDATED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
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
    noStore();

    try {
      const run = async () => {
        const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Delete At User Question.",
      };
    }

    const generatedUserQuestionID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create User Question.",
      };
    }

    const generatedAnswerID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'NATIVECRITERIAIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  if (
    userQuestion &&
    userQuestion.question_kind === "NATIVEIRL" &&
    (userQuestion.userquestion_state === "DELETED" ||
      userQuestion.answer_state === "DELETED")
  ) {
    // effacements aux emplacements de création
    noStore();

    try {
      const run = async () => {
        const data = await sql`
          DELETE FROM Answers
          WHERE userquestion_id = ${userQuestion.userquestion_id}
          AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Delete At Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Delete At User Question.",
      };
    }

    const generatedUserQuestionID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create User Question.",
      };
    }

    const generatedAnswerID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'NATIVECRITERIAIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  if (
    userQuestion &&
    userQuestion.question_kind === "NATIVEIRL" &&
    userQuestion.userquestion_state === "LIVE" &&
    userQuestion.answer_state === "LIVE"
  ) {
    // cas normalement impossible agissant en guise de mises à jour de la réponse quand on "crée" un critère déjà créé
    noStore();

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Answers
          SET 
              answer_value = ${initialAnswerValue},
              answer_updated_at = now()
              WHERE userquestion_id = ${userQuestion.userquestion_id}
              AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update Answer Value.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'ANSWERUPDATED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
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

async function findPseudoQuestionByQuestionName(questionName: string) {
  noStore();
  // console.log(questionName);
  try {
    const run = async () => {
      const data = await sql<PseudonativeQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_name = ${questionName} -- cas où la question, du moins en tant que PSEUDO, n'existe pas encore -- 'Looking for' -- DONE
        -- WHERE question_name = 'Father's birthday' -- cas où il n'y a pas encore de réponse et donc on crée les entrées correspondantes -- DONE
        -- WHERE question_name = 'Birthday' -- cas où il y a une réponse LIVE et donc on la modifie -- DONE
        -- WHERE question_name = 'Mother's birthday' -- cas où il a déjà une réponse mais elle est DELETED, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        -- WHERE question_name = 'Girlfriend's birthday' -- cas où il y a une réponse LIVE mais elle est actuellement PSEUDONATIVEIRL au lieu de PSEUDONATIVE, donc on modifie la UserQuetion à PSEUDONATIVE et on remplace la Answer -- DONE
        -- WHERE question_name = 'Crush's birthday' -- cas où il y a une réponse DELETED qui est actuellement PSEUDONATIVEIRL au lieu de PSEUDONATIVE, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        -- WHERE question_name = 'In a relationship' -- cas où la question, du moins en tant que PSEUDO, n'existe pas encore -- DONE
        -- WHERE question_name = 'Father’s birthdate' -- cas où il n'y a pas encore de réponse et donc on crée les entrées correspondantes -- DONE
        -- WHERE question_name = 'Birthdate' -- cas où il y a une réponse LIVE et donc on la modifie -- DONE
        -- WHERE question_name = 'Mother’s birthdate' -- cas où il a déjà une réponse mais elle est DELETED, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        -- WHERE question_name = 'Girlfriend’s birthdate' -- cas où il y a une réponse LIVE mais elle est actuellement PSEUDONATIVE au lieu de PSEUDONATIVEIRL, donc on modifie la UserQuetion à PSEUDONATIVEIRL et on remplace la Answer -- DONE
        -- WHERE question_name = 'Crush’s birthdate' -- cas où il y a une réponse DELETED qui est actuellement PSEUDONATIVE au lieu de PSEUDONATIVEIRL, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        AND question_kind = 'PSEUDO' -- la question est en effet pseudo

        AND question_state = 'LIVE';
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find pseudo question by question name.");
  }
}

async function findCustomQuestionByQuestionName(questionName: string) {
  noStore();
  // console.log(questionName);
  try {
    const run = async () => {
      const data = await sql<CustomQuestion>`
        SELECT 
            question_name,
            question_kind,
            question_id
        FROM Questions

        WHERE question_name = ${questionName} -- cas où la question, du moins en tant que CUSTOM, n'existe pas encore -- 'Favorite anime composer' -- DONE
        -- WHERE question_name = 'Favorite anime studio' -- cas où il n'y a pas encore de réponse et donc on crée les entrées correspondantes -- DONE
        -- WHERE question_name = 'Favorite anime series' -- cas où il y a une réponse LIVE et donc on la modifie -- DONE
        -- WHERE question_name = 'Favorite anime franchise' -- cas où il a déjà une réponse mais elle est DELETED, du coup on efface ses entrées et on en crée des nouvelles -- DONE
        AND question_kind = 'CUSTOM' -- la question est en effet custom

        AND question_state = 'LIVE';
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find custom question by question name.");
  }
}

async function findPreExistingPseudonativeUserQuestion(
  user: User,
  question: PseudonativeQuestion,
) {
  noStore();
  // console.log(questionId);
  try {
    const run = async () => {
      const data = await sql<PreExistingPseudonativeUserQuestion>`
        SELECT 
            UserQuestions.userquestion_id, 
            UserQuestions.userquestion_state,
            Questions.question_kind,
            UserQuestions.userquestion_kind, -- only addition to inspired query
            Answers.answer_state
        FROM UserQuestions

        JOIN Users ON UserQuestions.user_id = Users.user_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Answers ON Answers.userquestion_id = UserQuestions.userquestion_id
      
        WHERE Users.user_id = ${user.user_id}
        AND Questions.question_id = ${question.question_id}
      
        AND (
            UserQuestions.userquestion_state = 'LIVE' -- la jointure entre la question et la personne à laquelle elle a été posée est opérationnelle
            OR UserQuestions.userquestion_state = 'DELETED' -- car il me faudra lancer la suite dépendamment de si la UserQuestion et/ou la Answer est/sont DELETED
        )
        AND (
            Answers.answer_state = 'LIVE'
            OR Answers.answer_state = 'DELETED'
        )

        AND Users.user_state = 'LIVE' -- la personne qui y a répondu est 
        AND Questions.question_state = 'LIVE'; -- la question posée est opérationnelle
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find pre-existing pseudonative user question.");
  }
}

async function findPreExistingCustomUserQuestion(
  user: User,
  question: CustomQuestion,
) {
  noStore();
  // console.log(questionId);
  try {
    const run = async () => {
      const data = await sql<PreExistingCustomUserQuestion>`
        SELECT 
            UserQuestions.userquestion_id, 
            UserQuestions.userquestion_state,
            Questions.question_kind,
            Answers.answer_state
        FROM UserQuestions

        JOIN Users ON UserQuestions.user_id = Users.user_id
        JOIN Questions ON UserQuestions.question_id = Questions.question_id
        JOIN Answers ON Answers.userquestion_id = UserQuestions.userquestion_id
      
        WHERE Users.user_id = ${user.user_id}
        AND Questions.question_id = ${question.question_id}
      
        AND (
            UserQuestions.userquestion_state = 'LIVE' -- la jointure entre la question et la personne à laquelle elle a été posée est opérationnelle
            OR UserQuestions.userquestion_state = 'DELETED' -- car il me faudra lancer la suite dépendamment de si la UserQuestion et/ou la Answer est/sont DELETED
        )
        AND (
            Answers.answer_state = 'LIVE'
            OR Answers.answer_state = 'DELETED'
        )

        AND Users.user_state = 'LIVE' -- la personne qui y a répondu est 
        AND Questions.question_state = 'LIVE'; -- la question posée est opérationnelle
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find pre-existing custom user question.");
  }
}

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

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Questions (
              question_id,
              question_name,
              question_state,
              question_kind,
              question_created_at,
              question_updated_at
          )
          VALUES (
              ${generatedQuestionID},
              ${initialQuestionName},
              'LIVE',
              'PSEUDO',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Question.",
      };
    }

    const generatedUserQuestionID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_kind,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${generatedQuestionID},
              'LIVE',
              'PSEUDONATIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create User Question.",
      };
    }

    const generatedAnswerID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'PSEUDONATIVECRITERIANOTIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
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
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Delete At User Question.",
        };
      }

      const generatedUserQuestionID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_kind,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              'PSEUDONATIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create User Question.",
        };
      }

      const generatedAnswerID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create Answer.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'PSEUDONATIVECRITERIANOTIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
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
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          DELETE FROM Answers
          WHERE userquestion_id = ${userQuestion.userquestion_id}
          AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Delete At Answer.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Delete At User Question.",
        };
      }

      const generatedUserQuestionID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_kind,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              'PSEUDONATIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create User Question.",
        };
      }

      const generatedAnswerID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create Answer.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'PSEUDONATIVECRITERIANOTIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      userQuestion.userquestion_kind === "PSEUDONATIVE" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Answers
          SET 
              answer_value = ${initialAnswerValue},
              answer_updated_at = now()
              WHERE userquestion_id = ${userQuestion.userquestion_id}
              AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Update Answer Value.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'ANSWERUPDATED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      userQuestion.userquestion_kind === "PSEUDONATIVEIRL" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          UPDATE UserQuestions
          SET 
              userquestion_kind = 'PSEUDONATIVE',
              userquestion_down_to_irl_at = now(),
              userquestion_up_to_irl_at = NULL,
              userquestion_updated_at = now()
              WHERE userquestion_id = ${userQuestion.userquestion_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Update User Question.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Answers
          SET 
              answer_value = ${initialAnswerValue},
              answer_updated_at = now()
              WHERE userquestion_id = ${userQuestion.userquestion_id}
              AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Update Answer Value.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'ANSWERUPDATED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
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

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Questions (
              question_id,
              question_name,
              question_state,
              question_kind,
              question_created_at,
              question_updated_at
          )
          VALUES (
              ${generatedQuestionID},
              ${initialQuestionName},
              'LIVE',
              'PSEUDO',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Question.",
      };
    }

    const generatedUserQuestionID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_kind,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${generatedQuestionID},
              'LIVE',
              'PSEUDONATIVEIRL',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create User Question.",
      };
    }

    const generatedAnswerID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'PSEUDONATIVECRITERIAIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
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
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Delete At User Question.",
        };
      }

      const generatedUserQuestionID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_kind,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              'PSEUDONATIVEIRL',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create User Question.",
        };
      }

      const generatedAnswerID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create Answer.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'PSEUDONATIVECRITERIAIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
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
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          DELETE FROM Answers
          WHERE userquestion_id = ${userQuestion.userquestion_id}
          AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Delete At Answer.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Delete At User Question.",
        };
      }

      const generatedUserQuestionID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_kind,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              'PSEUDONATIVEIRL',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create User Question.",
        };
      }

      const generatedAnswerID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create Answer.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'PSEUDONATIVECRITERIAIRLADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      userQuestion.userquestion_kind === "PSEUDONATIVEIRL" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Answers
          SET 
              answer_value = ${initialAnswerValue},
              answer_updated_at = now()
              WHERE userquestion_id = ${userQuestion.userquestion_id}
              AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Update Answer Value.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'ANSWERUPDATED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "PSEUDO" &&
      userQuestion.userquestion_kind === "PSEUDONATIVE" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          UPDATE UserQuestions
          SET 
              userquestion_kind = 'PSEUDONATIVEIRL',
              userquestion_up_to_irl_at = now(),
              userquestion_down_to_irl_at = NULL,
              userquestion_updated_at = now()
              WHERE userquestion_id = ${userQuestion.userquestion_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Update User Question.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Answers
          SET 
              answer_value = ${initialAnswerValue},
              answer_updated_at = now()
              WHERE userquestion_id = ${userQuestion.userquestion_id}
              AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Update Answer Value.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'ANSWERUPDATED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
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

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Questions (
              question_id,
              question_name,
              question_state,
              question_kind,
              question_created_at,
              question_updated_at
          )
          VALUES (
              ${generatedQuestionID},
              ${initialQuestionName},
              'LIVE',
              'CUSTOM',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Question.",
      };
    }

    const generatedUserQuestionID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${generatedQuestionID},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create User Question.",
      };
    }

    const generatedAnswerID = uuidv4();

    try {
      const run = async () => {
        const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Create Answer.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'CUSTOMCRITERIAADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: 5 });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
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
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Delete At User Question.",
        };
      }

      const generatedUserQuestionID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create User Question.",
        };
      }

      const generatedAnswerID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create Answer.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'CUSTOMCRITERIAADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "CUSTOM" &&
      (userQuestion.userquestion_state === "DELETED" ||
        userQuestion.answer_state === "DELETED")
    ) {
      // effacements aux emplacements de création
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          DELETE FROM Answers
          WHERE userquestion_id = ${userQuestion.userquestion_id}
          AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Delete At Answer.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          DELETE FROM UserQuestions
          WHERE user_id = ${user.user_id}
          AND question_id = ${question.question_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Delete At User Question.",
        };
      }

      const generatedUserQuestionID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO UserQuestions (
              userquestion_id,
              user_id,
              question_id,
              userquestion_state,
              userquestion_created_at,
              userquestion_updated_at
          )
          VALUES (
              ${generatedUserQuestionID},
              ${user.user_id},
              ${question.question_id},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create User Question.",
        };
      }

      const generatedAnswerID = uuidv4();

      try {
        const run = async () => {
          const data = await sql`
          INSERT INTO Answers (
              answer_id,
              userquestion_id,
              user_id,
              answer_value,
              answer_state,
              answer_created_at,
              answer_updated_at
          )
          VALUES (
              ${generatedAnswerID},
              ${generatedUserQuestionID},
              ${user.user_id},
              ${initialAnswerValue},
              'LIVE',
              now(),
              now()
          )
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Create Answer.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'CUSTOMCRITERIAADDED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
    }

    if (
      userQuestion &&
      userQuestion.question_kind === "CUSTOM" &&
      userQuestion.userquestion_state === "LIVE" &&
      userQuestion.answer_state === "LIVE"
    ) {
      // cas éventuellement impossible agissant en guise de mises à jour
      noStore();

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Answers
          SET 
              answer_value = ${initialAnswerValue},
              answer_updated_at = now()
          WHERE userquestion_id = ${userQuestion.userquestion_id}
          AND user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message: "Database Error: Failed to Update Answer Value.",
        };
      }

      try {
        const run = async () => {
          const data = await sql`
          UPDATE Users
          SET 
              user_status_personal_info = 'ANSWERUPDATED',
              user_updated_at = now()
          WHERE user_id = ${user.user_id}
          RETURNING * -- to make sure
        `;
          console.log(data.rows);
        };
        await pRetry(run, { retries: 5 });
      } catch (error) {
        return {
          message:
            "Database Error: Failed to Update User Status Personal Info.",
        };
      }
    }
  }

  revalidatePath(`/users/${user.user_username}/personal-info/customized`);
  revalidatePath(
    `/users/${user.user_username}/personal-info/customized/modify`,
  );
  redirect(`/users/${user.user_username}/personal-info/customized`);
}
