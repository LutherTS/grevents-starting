"use server";

import { z } from "zod";
import { FoundContact } from "../definitions/contacts";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { sql } from "@vercel/postgres";
import { User } from "../definitions/users";
import pRetry from "p-retry";

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

const CONTACT_STATUSES_PROFILE = ["NONE", "FIRSTACCESSEDTHROUGHFIND"] as const;

const CONTACT_STATUSES_OTHER_PROFILE = [
  "NONE",
  "FIRSTACCESSTHROUGHFIND",
  "REACCESSTHROUGHFIND",
] as const;

/* Currently unused. */
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
  contactStatusProfile: z.enum(CONTACT_STATUSES_PROFILE),
  contactStatusOtherProfile: z.enum(CONTACT_STATUSES_OTHER_PROFILE),
  contactCreatedAt: z.string().datetime(),
  contactUdpatedAt: z.string().datetime(),
  contactSentFriendAt: z.string().datetime().nullable(),
  contactSentIrlAt: z.string().datetime().nullable(),
  contactFriendAt: z.string().datetime().nullable(),
  contactIrlAt: z.string().datetime().nullable(),
  contactBlockedAt: z.string().datetime().nullable(),
});

// Eventually, update the tables and the z schemas so that _ids are all UUIDs.

export async function resetContactStatusPersonalInfo(
  contact: FoundContact,
  user: User,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_status_other_profile = 'NONE',
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_mirror_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Status Other Profile.",
    };
  }

  revalidatePath(`/users/${user.user_username}/profile`);
}
