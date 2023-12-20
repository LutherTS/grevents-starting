"use server";

import { z } from "zod";
import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { Answer } from "../definitions/answers";

// Commencer avec le schéma zod complet de la table Answers

/* Pour inspiration : 
const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number({
      invalid_type_error: "Please enter a number.",
    })
    .gt(0, { message: "Please enter an amount greater than $0." })
    .multipleOf(0.01, {
      message: "Please enter an amount that is currency-friendly.",
    }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});
*/

// Il sera ensuite adapté pour chaque action avec .omit(), ou plutôt .pick()
/* Aussi pour inspiration :
const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });
*/

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
  // console.log(user);
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("answervalue"));

  const validatedFields = UpdateOrDeleteAnswerValue.safeParse({
    answerValue: formData.get("userappwidename"),
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
      const data = await sql`
      UPDATE Answers
      SET 
          answer_value = ${answerValue},
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

  revalidatePath(`/users/${answer.user_username}/personal-info`);
  redirect(`/users/${answer.user_username}/personal-info`);
}

//

// bind user et answer on form client component // JUST THE ANSWER. I can find the user there by answer.user_username
/*
const initialState = { message: null, errors: {} };
const UpdateOrDeleteAnswerValueWithUser = UpdateOrDeleteAnswerValue.bind(null, user);
const [state, dispatch] = useFormState(UpdateOrDeleteAnswerValueWithUser, initialState);
*/

// Pour les schéma partagés, je ne vais pas chercher midi à 14 heures

/* Premières modifications : 
// Je n'ai pas encore précisé les nullables et non nullables. Sauf qu'en fait... Non, ce n'est pas grave, je reste fidèle au schéma Postgres initial, et après je verrai en cours de développement et d'apprentissage.
const AnswerSchema = z.object({
  answerId: z.string().length(36),
  userQuestionId: z.string().length(36).nullable(),
  userId: z.string().length(36).nullable(),
  answerState: z.enum(ANSWER_STATES),
  answerValue: z.string().max(200),
  answerCreatedAt: z.string().datetime(),
  answerUpdatedAt: z.string().datetime()
  //
  Du coup je préciserai les ({invalid_type_error}) ou (, {invalid_type_error}) au fur et à mesure que j'utiliserai les déclinaisons spécifiques du schéma avec .omit(). Par exemple, je sais qu'il n'y a aucun cas d'usage où je dirai au client ("Please enter a valid UUID" puisque je les créerai toujours par moi-même.)
  //
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number({
      invalid_type_error: "Please enter a number.",
    })
    .gt(0, { message: "Please enter an amount greater than $0." })
    .multipleOf(0.01, {
      message: "Please enter an amount that is currency-friendly.",
    }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});
*/
