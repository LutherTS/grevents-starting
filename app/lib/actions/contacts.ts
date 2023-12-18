"use server";

import { z } from "zod";

// Commencer avec le schéma zod complet de la table Contacts

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

const CONTACT_STATES = ["NONE", "LIVE", "DELETED"] as const;

const CONTACT_KINDS = ["NONE", "FRIEND", "IRL"] as const;

const CONTACT_PROCESSES_RELATIONSHIP = [
  "NONE",
  "SENTFRIEND",
  "SENTIRL",
  "ANNULFRIEND",
  "ANNULIRL",
] as const;

const CONTACT_STATUSES_RELATIONSHIP = [
  "NONE",
  "SENTFRIEND",
  "SENTIRL",
  "RECEIVEFRIEND",
  "RECEIVEIRL",
  "ANNULFRIEND",
  "ANNULIRL",
  "REFUSEDFRIEND",
  "REFUSEDIRL",
  "NOWFRIENDS",
  "NOWIRLS",
  "NOLONGERFRIENDS",
  "NOLONGERIRLS",
] as const;

const CONTACT_STATUSES_BLOCKING = [
  "NONE",
  "NOWBLOCKING",
  "NOWUNBLOCKING",
  "NOWBLOCKED",
  "NOWUNBLOCKED",
] as const;

const ContactSchema = z.object({
  contactId: z.string().length(36),
  userFirstId: z.string().length(36),
  userLastId: z.string().length(36),
  contactMirrorId: z.string().length(36).nullable(),
  contactState: z.enum(CONTACT_STATES),
  contactKind: z.enum(CONTACT_KINDS),
  contactProcessRelationship: z.enum(CONTACT_PROCESSES_RELATIONSHIP),
  contactStatusRelationship: z.enum(CONTACT_STATUSES_RELATIONSHIP),
  contactBlocking: z.boolean(),
  contactStatusBlocking: z.enum(CONTACT_STATUSES_BLOCKING),
  contactCreatedAt: z.string().datetime(),
  contactUdpatedAt: z.string().datetime(),
  contactSentFriendAt: z.string().datetime().nullable(),
  contactSentIrlAt: z.string().datetime().nullable(),
  contactFriendAt: z.string().datetime().nullable(),
  contactIrlAt: z.string().datetime().nullable(),
  contactBlockedAt: z.string().datetime().nullable(),
});

/* Premières modifications : 
const ContactSchema = z.object({
  contactId: z.string().length(36),
  userFirstId: z.string().length(36),
  userLastId: z.string().length(36),
  contactMirrorId: z.string().length(36).nullable(),
  contactState: z.enum(CONTACT_STATES),
  contactKind: z.enum(CONTACT_KINDS),
  contactProcessRelationship: z.enum(CONTACT_PROCESSES_RELATIONSHIP),
  contactStatusRelationship: z.enum(CONTACT_STATUSES_RELATIONSHIP),
  contactBlocking: z.boolean(),
  contactStatusBlocking: z.enum(CONTACT_STATUSES_BLOCKING),
  contactCreatedAt: z.string().datetime(),
  contactUdpatedAt: z.string().datetime()
  contactSentFriendAt: z.string().datetime().nullable(),
  contactSentIrlAt: z.string().datetime().nullable(),
  contactFriendAt: z.string().datetime().nullable(),
  contactIrlAt: z.string().datetime().nullable(),
  contactBlockedAt: z.string().datetime().nullable()
  //
  Du coup je préciserai les ({invalid_type_error}) ou (, {invalid_type_error}) au fur et à mesure que j'utiliserai les déclinaisons spécifiques du schéma avec .omit(). Par exemple, je sais qu'il n'y a aucun cas d'usage où je dirai au client "Please enter a valid UUID" puisque je les créerai toujours par moi-même.
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

// Eventually, update the tables and the z schemas so that _ids are all UUIDs.
