"use server";

import { z } from "zod";

// Commencer avec le schéma zod complet de la table Questions

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

// Il sera ensuite adapté pour chaque action avec .omit()
/* Aussi pour inspiration :
const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });
*/

const QUESTION_STATES = ["NONE", "LIVE", "DELETED"] as const;

const QUESTION_KINDS = [
  "NONE",
  "NATIVE",
  "NATIVEIRL",
  "PSEUDO",
  "CUSTOM",
] as const;

const QuestionSchema = z.object({
  questionId: z.string().length(36),
  userId: z.string().length(36).nullable(),
  questionState: z.enum(QUESTION_STATES),
  questionKind: z.enum(QUESTION_KINDS),
  questionName: z.string().max(200),
  questionIsSuggested: z.boolean(),
  questionCreatedAt: z.string().datetime(),
  questionUpdatedAt: z.string().datetime(),
});

/* Premières modifications : 
const QuestionSchema = z.object({
  questionId: z.string().length(36),
  userId: z.string().length(36).nullable(),
  questionState: z.enum(QUESTION_STATES),
  questionKind: z.enum(QUESTION_KINDS),
  questionName: z.string().max(200),
  questionIsSuggested: z.boolean(),
  questionCreatedAt: z.string().datetime(),
  questionUpdatedAt: z.string().datetime()
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
