"use server";

import { z } from "zod";

// Commencer avec le schéma zod complet de la table UserQuestions

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

const USERQUESTION_STATES = ["NONE", "LIVE", "DELETED"] as const;

const USERQUESTION_KINDS = ["NONE", "PSEUDONATIVE", "PSEUDONATIVEIRL"] as const;

const UserQuestionSchema = z.object({
  userQuestionId: z.string().length(36),
  userId: z.string().length(36),
  questionId: z.string().length(36),
  userQuestionState: z.enum(USERQUESTION_STATES),
  userQuestionKind: z.enum(USERQUESTION_KINDS),
  userQuestionIsPinned: z.boolean(),
  userQuestionCreatedAt: z.string().datetime(),
  userQuestionUpdatedAt: z.string().datetime(),
  userQuestionPinnedAt: z.string().datetime().nullable(),
  userQuestionUppedToIrlAt: z.string().datetime().nullable(),
  userQuestionDownedToIrlAt: z.string().datetime().nullable(),
});

/* Premières modifications : 
const UserQuestionSchema = z.object({
  userQuestionId: z.string().length(36),
  userId: z.string().length(36),
  questionId: z.string().length(36),
  userQuestionState: z.enum(USERQUESTION_STATES),
  userQuestionKind: z.enum(USERQUESTION_KINDS),
  userQuestionIsPinned: z.boolean(),
  userQuestionCreatedAt: z.string().datetime(),
  userQuestionUpdatedAt: z.string().datetime(),
  userQuestionPinnedAt: z.string().datetime().nullable(),
  userQuestionUppedToIrlAt: z.string().datetime().nullable(),
  userQuestionDownedToIrlAt: z.string().datetime().nullable()
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
