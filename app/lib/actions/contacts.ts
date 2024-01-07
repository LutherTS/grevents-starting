"use server";

import { z } from "zod";
import { FoundContact } from "../definitions/contacts";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { sql } from "@vercel/postgres";
import { User } from "../definitions/users";
import pRetry from "p-retry";
import { findContactByUserAndSession } from "../data/contacts";
import _ from "lodash";
import { DEFAULT_RETRIES } from "../data/users";

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
    await pRetry(run, { retries: DEFAULT_RETRIES });
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Blocking to False.",
    };
  }
}

// Notification methods

export type ContactStatusRelationship =
  | "NONE"
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
  statusRelationship: ContactStatusRelationship,
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
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Status Relationship.",
    };
  }
}

export async function setMirrorContactStatusRelationship(
  contact: FoundContact,
  statusRelationship: ContactStatusRelationship,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_status_relationship = ${statusRelationship},
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Status Relationship.",
    };
  }
}

// Process methods

export type ContactProcessRelationship =
  | "NONE"
  | "SENTFRIEND"
  | "SENTIRL"
  | "ANNULFRIEND"
  | "ANNULIRL";

export async function setContactProcessRelationship(
  contact: FoundContact,
  processRelationship: ContactProcessRelationship,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_process_relationship = ${processRelationship},
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_mirror_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Process Relationship.",
    };
  }
}

export async function setMirrorContactProcessRelationship(
  contact: FoundContact,
  processRelationship: ContactProcessRelationship,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_process_relationship = ${processRelationship},
            contact_updated_at = now()
        WHERE contact_id = ${contact.c1_contact_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact Process Relationship.",
    };
  }
}

// Now the component-called methods

// For the revalidates, eventually I should work from the session I believe, but since I can get this data from the contact, I might eventually do away from needing the user altogether.

// Also, by convention no matter the method I will always revalidate the profiles of both users on the contact. (Which is what shows how I do not actually need now to have the user as a prop and an argument.)

/* NOTES FROM TESTING */

// Entirely shifted to using exclusively contact for revalidatePath.

// And this is why I don't like Promise.all, because I only get the last RETURNING and not all of them.

// Il y avait un typo....

// Another typo. And revalidatePath only works for your own client. This doesn't revalidate simultaneously for everyone from the server.

// Blocks and unblocks work. Let's go.

// It all works, real slow today though, with only revalidations on acceptFriendRequest and acceptIrlRequest being issues in production.

// So what's needed now is making sure that... What's going to be first would be deactivating Accept when Decline is active and vice versa. Je peux ou pourrais faire ça dans le même composant. Mieux encore, je pourrais, voir devrais mettre toutes les boutons dans le même composant pour qu'ils désactivent respectivement tous les autres à l'activation d'un des leurs.
// Ça c'est ce qu'il faut réaliser. ainsi il y aurait acceptStatus, declineStatus, etc. Et ça empêcherait de cliquer sur un autre bouton quand l'un des leurs est en status.pending.
// Demain. ...En vrai, c'est aussi pour ça que useFormStatus est expérimental. Je me poserai donc la question après qu'il soit sorti de canary.

// Ce qu'il reste par contre, c'est bel et bien de vérifier dans les fonctions l'état foundContact. En pseudo-code : verifyContact = = await findContactByUserAndSession(user, session)
// if contact === verifyContact // faire tout le code.
// if contact !== verifyContact // ne pas faire les modifications

// ALL OF THESE SHOULD REVALIDATE DASHBOARD.
// AND REVALIDATE REQUESTS OR NOTIFICATIONS ACCORDINGLY.
// Objectively it's not impactful, for revalidate only affect the tab, not the full browser, and for sure not the server itself. (Meaning all the clients on all devices currently on that URL. Someday hopefully.)

export async function sendFriendRequestButItsAutoFriend(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      updateContactKindToFriend(contact),
      updateMirrorContactKindToFriend(contact),
      setContactStatusRelationship(contact, "NOWFRIENDS"),
      // uncomment below when available for testing
      // setMirrorContactStatusRelationship(contact, "NOWFRIENDS"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

// No idea why this doesn't revalidate in production.
export async function acceptFriendRequest(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      updateContactKindToFriend(contact),
      updateMirrorContactKindToFriend(contact),
      setMirrorContactProcessRelationship(contact, "NONE"),
      setContactStatusRelationship(contact, "NOWFRIENDS"),
      setMirrorContactStatusRelationship(contact, "NOWFRIENDS"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function sendFriendRequest(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      setContactProcessRelationship(contact, "SENTFRIEND"),
      setMirrorContactProcessRelationship(contact, "NONE"),
      setContactStatusRelationship(contact, "SENTFRIEND"),
      setMirrorContactStatusRelationship(contact, "RECEIVEFRIEND"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function annulFriendRequest(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      setContactProcessRelationship(contact, "ANNULFRIEND"),
      setContactStatusRelationship(contact, "ANNULFRIEND"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function declineFriendRequest(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      setMirrorContactProcessRelationship(contact, "NONE"),
      setContactStatusRelationship(contact, "REFUSEDFRIEND"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function upgradeFriendshipToIrlButItsAutoIrl(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      updateContactKindToIrl(contact),
      updateMirrorContactKindToIrl(contact),
      setContactStatusRelationship(contact, "NOWIRLS"),
      // uncomment below when available for testing
      // setMirrorContactStatusRelationship(contact, "NOWIRLS"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

// No idea why this doesn't revalidate in production.
export async function acceptIrlRequest(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      updateContactKindToIrl(contact),
      updateMirrorContactKindToIrl(contact),
      setMirrorContactProcessRelationship(contact, "NONE"),
      setContactStatusRelationship(contact, "NOWIRLS"),
      setMirrorContactStatusRelationship(contact, "NOWIRLS"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function upgradeFriendshipToIrl(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      setContactProcessRelationship(contact, "SENTIRL"),
      setMirrorContactProcessRelationship(contact, "NONE"),
      setContactStatusRelationship(contact, "SENTIRL"),
      setMirrorContactStatusRelationship(contact, "RECEIVEIRL"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function annulUpgradeFriendshipToIrl(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      setContactProcessRelationship(contact, "ANNULIRL"),
      setContactStatusRelationship(contact, "ANNULIRL"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function declineIrlRequest(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      setMirrorContactProcessRelationship(contact, "NONE"),
      setContactStatusRelationship(contact, "REFUSEDIRL"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function downgradeFriendshipFromIrl(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      updateContactKindToFriend(contact),
      updateMirrorContactKindToFriend(contact),
      setContactStatusRelationship(contact, "NOLONGERIRLS"),
      setMirrorContactStatusRelationship(contact, "NOLONGERIRLS"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function unfriend(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      updateContactKindToNone(contact),
      updateMirrorContactKindToNone(contact),
      setContactStatusRelationship(contact, "NOLONGERFRIENDS"),
      setMirrorContactStatusRelationship(contact, "NOLONGERFRIENDS"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function block(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      updateContactBlocking(contact),
      setContactStatusRelationship(contact, "NOWBLOCKING"),
      setMirrorContactStatusRelationship(contact, "NOWBLOCKED"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}

export async function unblock(
  contact: FoundContact,
  user: User,
  session: { [K in "user"]: User },
) {
  const verifyContact = await findContactByUserAndSession(user, session);
  if (verifyContact && _.isEqual(contact, verifyContact)) {
    await Promise.all([
      updateContactUnblocking(contact),
      setContactStatusRelationship(contact, "NOWUNBLOCKING"),
      setMirrorContactStatusRelationship(contact, "NOWUNBLOCKED"),
    ]);
  }
  // revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}
