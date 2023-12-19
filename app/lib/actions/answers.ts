"use server";

import { z } from "zod";

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
  answerValue: z.string().max(200),
  answerCreatedAt: z.string().datetime(),
  answerUpdatedAt: z.string().datetime(),
});
const UpdateOrDeleteAnswerValue = AnswerSchema.pick({ answerValue: true });
// bind user et answer on form client component
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
