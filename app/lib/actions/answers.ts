"use server";

import { z } from "zod";
import { Answer } from "../definitions/answers";
import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { User } from "../definitions/users";

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
  console.log(UpdateOrDeleteAnswerValue);
  console.log(validatedFields);

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
      const data = await sql`
      UPDATE Answers
      SET 
          answer_state = 'DELETED',
          answer_updated_at = now()
      WHERE answer_id = ${answer.answer_id}
      RETURNING * -- to make sure
    `;
      console.log(data.rows);
    } catch (error) {
      return {
        message: "Database Error: Failed to Deleted Answer Value.",
      };
    }

    try {
      const data = await sql`
      UPDATE Users
      SET 
          user_status_personal_info = 'ANSWERDELETED',
          user_updated_at = now()
      WHERE user_username = ${answer.user_username}
      RETURNING * -- to make sure
    `;
      console.log(data.rows);
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  if (answerValue !== "") {
    noStore();

    try {
      const data = await sql`
      UPDATE Answers
      SET 
          answer_value = ${answerValue},
          answer_updated_at = now()
      WHERE answer_id = ${answer.answer_id}
      RETURNING * -- to make sure
    `;
      console.log(data.rows);
    } catch (error) {
      return {
        message: "Database Error: Failed to Update Answer Value.",
      };
    }

    try {
      const data = await sql`
      UPDATE Users
      SET 
          user_status_personal_info = 'ANSWERUPDATED',
          user_updated_at = now()
      WHERE user_username = ${answer.user_username}
      RETURNING * -- to make sure
    `;
      console.log(data.rows);
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
    } catch (error) {
      return {
        message: "Database Error: Failed to Pin User Question of Answer.",
      };
    }

    // When the issue arises, I'm going to have to use data from RETURNING in order to trigger the following code not from answer.user_username, but from the same data that should be obtained from the previous query to make the next one dependent on that result.

    try {
      const data = await sql`
      UPDATE Users
      SET 
          user_status_personal_info = 'CRITERIAPINNED',
          user_updated_at = now()
      WHERE user_username = ${answer.user_username}
      RETURNING * -- to make sure
    `;
      console.log(data.rows);
    } catch (error) {
      return {
        message: "Database Error: Failed to Update User Status Personal Info.",
      };
    }
  }

  if (answer.userquestion_is_pinned === true) {
    noStore();
    try {
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
    } catch (error) {
      return {
        message: "Database Error: Failed to Unpin User Question of Answer.",
      };
    }

    try {
      const data = await sql`
      UPDATE Users
      SET 
          user_status_personal_info = 'CRITERIAUNPINNED',
          user_updated_at = now()
      WHERE user_username = ${answer.user_username}
      RETURNING * -- to make sure
    `;
      console.log(data.rows);
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
    } catch (error) {
      return {
        message:
          "Database Error: Failed to Switch User Question Kind of Answer.",
      };
    }

    try {
      const data = await sql`
      UPDATE Users
      SET 
          user_status_personal_info = 'PSEUDONATIVECRITERIAUPPEDTOIRL',
          user_updated_at = now()
      WHERE user_username = ${answer.user_username}
      RETURNING * -- to make sure
    `;
      console.log(data.rows);
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
    } catch (error) {
      return {
        message:
          "Database Error: Failed to Switch User Question Kind of Answer.",
      };
    }

    try {
      const data = await sql`
      UPDATE Users
      SET 
          user_status_personal_info = 'PSEUDONATIVECRITERIADOWNEDFROMIRL',
          user_updated_at = now()
      WHERE user_username = ${answer.user_username}
      RETURNING * -- to make sure
    `;
      console.log(data.rows);
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

export async function createNativeNotIrlAnswer(
  user: User,
  prevState: CreateNativeNotIrlAnswerFormState | undefined,
  formData: FormData,
) {
  console.log(user);
  console.log(prevState);
  console.log(formData);
  console.log(formData.get("nativenotirlquestion"));
  console.log(formData.get("nativenotirlanswer"));

  const validatedFields = CreateNativeNotIrlAnswer.safeParse({
    questionId: formData.get("nativenotirlquestion"),
    initialAnswerValue: formData.get("nativenotirlanswer"),
  });
  console.log(CreateNativeNotIrlAnswer);
  console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Native Not IRL Answer.",
    };
  }

  const { questionId, initialAnswerValue } = validatedFields.data;

  console.log(questionId);
  console.log(initialAnswerValue);
  console.log(user.user_id);
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
  console.log(user);
  console.log(prevState);
  console.log(formData);
  console.log(formData.get("nativeirlquestion"));
  console.log(formData.get("nativeirlanswer"));

  const validatedFields = CreateNativeIrlAnswer.safeParse({
    questionId: formData.get("nativeirlquestion"),
    initialAnswerValue: formData.get("nativeirlanswer"),
  });
  console.log(CreateNativeIrlAnswer);
  console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Native IRL Answer.",
    };
  }

  const { questionId, initialAnswerValue } = validatedFields.data;

  console.log(questionId);
  console.log(initialAnswerValue);
  console.log(user.user_id);
}
