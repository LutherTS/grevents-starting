"use server";

import { z } from "zod";
import { UserQuestion } from "../definitions/userquestions";
import { Friend } from "../definitions/contacts";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { UserQuestionFriend } from "../definitions/userquestionfriends";

// Commencer avec le schéma zod complet de la table UserQuestionFriends

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

const USERQUESTIONFRIEND_STATES = ["NONE", "LIVE", "DELETED"] as const;

const UserQuestionFriendSchema = z.object({
  userQuestionFriendId: z.string().length(36),
  userQuestionId: z.string().length(36),
  contactId: z.string().length(36),
  userQuestionFriendState: z.enum(USERQUESTIONFRIEND_STATES),
  userQuestionFriendCreatedAt: z.string().datetime(),
  userQuestionFriendUpdatedAt: z.string().datetime(),
  userQuestionFriendSharedAt: z.string().datetime().nullable(),
});

// Je pense que la solution la plus simple et donc la plus optimale sera d'avoir la même solution pour les trois cas de figure, dont un qui n'a pas lieu d'être.
// 1) si il n'y aucun userQuestionFriend préexistant
// 2) si il y a un userQuestionFriend préexistant DELETED
// 3) si il y a un userQuestionFriend préexistant LIVE (impossible d'accéder à la fonction depuis le front)
// 4) (si il y a un userQuestionFriend préexistant NONE)
// La solution est, puisqu'il ne peut y avoir qu'un seul userQuestionFriend entre une userQuestion et un contact, de toujours effacer à l'emplacement et recréer derrière.

/* Not actually needed.
const CreateUserQuestionFriend = UserQuestionFriendSchema.pick({
  userQuestionId: true,
  contactId: true,
}); // I don't even think that's worth checking if they're bound from the server which is already secure.
*/

// ...There's literally no FormData needed here, so no Zod... I don't even think I need a form action, this is a direct server action, where I play a function directly on the form. (I could aven get it done this morning.)

export async function createUserQuestionFriend(
  userQuestion: UserQuestion,
  contact: Friend,
) {
  noStore();

  // Now the three database queries begin:
  // 1) delete at userQuestionid and contactid
  // 2) create with userQuestionid and contactid
  // 3) set user to 'USERQUESTIONFRIENDADDED'

  // revalidate path from userQuestion
}

export async function deleteUserQuestionFriend(
  serQuestion: UserQuestion,
  userQuestionFriend: UserQuestionFriend,
) {
  noStore();

  // Now two database queries this time:
  // 1) set userQuestionFriend to deleted
  // 3) set user to 'USERQUESTIONFRIENDDELETED'

  // revalidate path from userQuestion
}

/* Premières modifications : 
const UserQuestionFriendSchema = z.object({
  userQuestionFriendId: z.string().length(36),
  userQuestionId: z.string().length(36),
  contactId: z.string().length(36),
  userQuestionFriendState: z.enum(USERQUESTIONFRIEND_STATES),
  questionKind: z.enum(QUESTION_KINDS),
  userQuestionFriendCreatedAt: z.string().datetime(),
  userQuestionFriendUpdatedAt: z.string().datetime(),
  userQuestionFriendSharedAt: z.string().datetime().nullable(),
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
