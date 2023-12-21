"use server";

import { z } from "zod";
import { Answer } from "../definitions/answers";
import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

const ANSWER_STATES = ["NONE", "LIVE", "DELETED"] as const;

const AnswerSchema = z.object({
  answerId: z.string().length(36),
  userQuestionId: z.string().length(36).nullable(),
  userId: z.string().length(36).nullable(),
  answerState: z.enum(ANSWER_STATES),
  answerValue: z.string().max(200, {
    message: "Your answer cannot be more than 200 characters long.",
  }),
  answerCreatedAt: z.string().datetime(),
  answerUpdatedAt: z.string().datetime(),
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
