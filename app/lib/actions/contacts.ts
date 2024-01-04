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

export async function resetContactStatusOtherProfile(
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

export async function resetContactStatusRelationship(
  contact: FoundContact,
  user: User,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_status_relationship = 'NONE',
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_mirror_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Status Relationship.",
    };
  }

  revalidatePath(`/users/${user.user_username}/profile`);
}

// The following functions are essentially temporary. Send friend request, Upgrade friendship to irl, Downgrade friendship from irl, Unfriend, along with Block, Block them back, Unblock, and Unblock if it's OK with you are meant to be processes, not actions.

export async function updateContactKindToFriend(contact: FoundContact) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_kind = 'FRIEND',
            contact_friend_at = now(),
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Kind to Friend.",
    };
  }
}

export async function updateMirrorContactKindToFriend(contact: FoundContact) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_kind = 'FRIEND',
            contact_friend_at = now(),
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_mirror_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message:
        "Database Error: Failed to Update Mirror Contact Kind to Friend.",
    };
  }
}

export async function updateContactKindToIrl(contact: FoundContact) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_kind = 'IRL',
            contact_irl_at = now(),
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Kind to IRL.",
    };
  }
}

export async function updateMirrorContactKindToIrl(contact: FoundContact) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_kind = 'IRL',
            contact_irl_at = now(),
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_mirror_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Mirror Contact Kind to IRL.",
    };
  }
}

export async function updateContactKindToNone(contact: FoundContact) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_kind = 'NONE',
            contact_friend_at = now(),
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Kind to None.",
    };
  }
}

export async function updateMirrorContactKindToNone(contact: FoundContact) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_kind = 'NONE',
            contact_friend_at = now(),
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_mirror_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Mirror Contact Kind to None.",
    };
  }
}

export async function updateContactBlocking(contact: FoundContact) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_kind = 'NONE',
            contact_blocking = TRUE,
            contact_blocked_at = now(),
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_mirror_id}
        -- because it's the session that blocks the user
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Blocking to True.",
    };
  }
}

export async function updateContactUnblocking(contact: FoundContact) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_kind = 'NONE',
            contact_blocking = FALSE,
            contact_blocked_at = now(),
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_mirror_id}
        -- because it's the session that blocks the user
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Blocking to False.",
    };
  }
}

// Notification method

export type ContactStatusRelationshipWithoutNone =
  | "SENTFRIEND"
  | "SENTIRL"
  | "RECEIVEFRIEND"
  | "RECEIVEIRL"
  | "ANNULFRIEND"
  | "ANNULIRL"
  | "REFUSEDFRIEND"
  | "REFUSEDIRL"
  | "NOWFRIENDS"
  | "NOWIRLS"
  | "NOLONGERFRIENDS"
  | "NOLONGERIRLS"
  | "NOWBLOCKING"
  | "NOWUNBLOCKING"
  | "NOWBLOCKED"
  | "NOWUNBLOCKED";

export async function setContactStatusRelationship(
  contact: FoundContact,
  statusRelationship: ContactStatusRelationshipWithoutNone,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_status_relationship = ${statusRelationship},
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_mirror_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Status Relationship.",
    };
  }
}

export async function setMirrorContactStatusRelationship(
  contact: FoundContact,
  statusRelationship: ContactStatusRelationshipWithoutNone,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_status_relationship = ${statusRelationship},
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_kind}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: 5 });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Status Relationship.",
    };
  }
}

// Now the component-called methods

export async function sendFriendRequestButItsAutoFriend(
  contact: FoundContact,
  user: User,
) {
  await Promise.all([
    updateContactKindToFriend(contact),
    updateMirrorContactKindToFriend(contact),
  ]);

  await setContactStatusRelationship(contact, "NOWFRIENDS");
  // uncomment below when available for testing
  // await setMirrorContactStatusRelationship(contact, "NOWFRIENDS");

  revalidatePath(`/users/${user.user_username}/profile`);
}

export async function upgradeFriendshipToIrlButItsAutoIrl(
  contact: FoundContact,
  user: User,
) {
  await Promise.all([
    updateContactKindToIrl(contact),
    updateMirrorContactKindToIrl(contact),
  ]);

  await setContactStatusRelationship(contact, "NOWIRLS");
  // uncomment below when available for testing
  // await setMirrorContactStatusRelationship(contact, "NOWIRLS");

  revalidatePath(`/users/${user.user_username}/profile`);
}

export async function downgradeFriendshipFromIrl(
  contact: FoundContact,
  user: User,
) {
  await Promise.all([
    updateContactKindToFriend(contact),
    updateMirrorContactKindToFriend(contact),
  ]);

  await setContactStatusRelationship(contact, "NOLONGERIRLS");
  // uncomment below when available for testing
  // await setMirrorContactStatusRelationship(contact, "NOLONGERIRLS");

  revalidatePath(`/users/${user.user_username}/profile`);
}

export async function unfriend(contact: FoundContact, user: User) {
  await Promise.all([
    updateContactKindToNone(contact),
    updateMirrorContactKindToNone(contact),
  ]);

  await setContactStatusRelationship(contact, "NOLONGERFRIENDS");
  // uncomment below when available for testing
  // await setMirrorContactStatusRelationship(contact, "NOLONGERFRIENDS");

  revalidatePath(`/users/${user.user_username}/profile`);
}

export async function block(contact: FoundContact, user: User) {
  await updateContactBlocking(contact);

  await setContactStatusRelationship(contact, "NOWBLOCKING");
  // uncomment below when available for testing
  // await setMirrorContactStatusRelationship(contact, "NOWBLOCKED");

  revalidatePath(`/users/${user.user_username}/profile`);
}

export async function unblock(contact: FoundContact, user: User) {
  await updateContactUnblocking(contact);

  await setContactStatusRelationship(contact, "NOWUNBLOCKING");
  // uncomment below when available for testing
  // await setMirrorContactStatusRelationship(contact, "NOWUNBLOCKED");

  revalidatePath(`/users/${user.user_username}/profile`);
}
