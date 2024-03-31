"use server";

import { z } from "zod";
import { FoundContact } from "../definitions/contacts";
import { revalidatePath } from "next/cache";
import { User } from "../definitions/users";
import { findContactByUserAndSession } from "../data/contacts";
import _ from "lodash";
import {
  changeResetContactStatusOtherProfile,
  changeResetContactStatusRelationship,
  changeSetContactProcessRelationship,
  changeSetContactStatusRelationship,
  changeSetMirrorContactProcessRelationship,
  changeSetMirrorContactStatusRelationship,
  changeUpdateContactBlocking,
  changeUpdateContactKindToFriend,
  changeUpdateContactKindToIrl,
  changeUpdateContactKindToNone,
  changeUpdateContactUnblocking,
  changeUpdateMirrorContactKindToFriend,
  changeUpdateMirrorContactKindToIrl,
  changeUpdateMirrorContactKindToNone,
} from "../changes/contacts";

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
  await changeResetContactStatusOtherProfile(contact.c1_contact_mirror_id);

  revalidatePath(`/users/${user.user_username}/profile`);
}

export async function resetContactStatusRelationship(
  contact: FoundContact,
  user: User,
) {
  await changeResetContactStatusRelationship(contact.c1_contact_mirror_id);

  revalidatePath(`/users/${user.user_username}/profile`);
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
      changeUpdateContactKindToFriend(contact),
      changeUpdateMirrorContactKindToFriend(contact),
      changeSetMirrorContactProcessRelationship(contact, "NONE"),
      changeSetContactStatusRelationship(contact, "NOWFRIENDS"),
      changeSetMirrorContactStatusRelationship(contact, "NOWFRIENDS"),
    ]);
  }
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
      changeSetContactProcessRelationship(contact, "SENTFRIEND"),
      changeSetMirrorContactProcessRelationship(contact, "NONE"),
      changeSetContactStatusRelationship(contact, "SENTFRIEND"),
      changeSetMirrorContactStatusRelationship(contact, "RECEIVEFRIEND"),
    ]);
  }
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
      changeSetContactProcessRelationship(contact, "ANNULFRIEND"),
      changeSetContactStatusRelationship(contact, "ANNULFRIEND"),
    ]);
  }
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
      changeSetMirrorContactProcessRelationship(contact, "NONE"),
      changeSetContactStatusRelationship(contact, "REFUSEDFRIEND"),
    ]);
  }
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
      changeUpdateContactKindToIrl(contact),
      changeUpdateMirrorContactKindToIrl(contact),
      changeSetMirrorContactProcessRelationship(contact, "NONE"),
      changeSetContactStatusRelationship(contact, "NOWIRLS"),
      changeSetMirrorContactStatusRelationship(contact, "NOWIRLS"),
    ]);
  }
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
      changeSetContactProcessRelationship(contact, "SENTIRL"),
      changeSetMirrorContactProcessRelationship(contact, "NONE"),
      changeSetContactStatusRelationship(contact, "SENTIRL"),
      changeSetMirrorContactStatusRelationship(contact, "RECEIVEIRL"),
    ]);
  }
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
      changeSetContactProcessRelationship(contact, "ANNULIRL"),
      changeSetContactStatusRelationship(contact, "ANNULIRL"),
    ]);
  }
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
      changeSetMirrorContactProcessRelationship(contact, "NONE"),
      changeSetContactStatusRelationship(contact, "REFUSEDIRL"),
    ]);
  }
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
      changeUpdateContactKindToFriend(contact),
      changeUpdateMirrorContactKindToFriend(contact),
      changeSetContactStatusRelationship(contact, "NOLONGERIRLS"),
      changeSetMirrorContactStatusRelationship(contact, "NOLONGERIRLS"),
    ]);
  }
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
      changeUpdateContactKindToNone(contact),
      changeUpdateMirrorContactKindToNone(contact),
      changeSetContactStatusRelationship(contact, "NOLONGERFRIENDS"),
      changeSetMirrorContactStatusRelationship(contact, "NOLONGERFRIENDS"),
    ]);
  }
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
      changeUpdateContactBlocking(contact),
      changeSetContactStatusRelationship(contact, "NOWBLOCKING"),
      changeSetMirrorContactStatusRelationship(contact, "NOWBLOCKED"),
    ]);
  }
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
      changeUpdateContactUnblocking(contact),
      changeSetContactStatusRelationship(contact, "NOWUNBLOCKING"),
      changeSetMirrorContactStatusRelationship(contact, "NOWUNBLOCKED"),
    ]);
  }
  revalidatePath(`/users/${contact.u1_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/profile`);
  revalidatePath(`/users/${contact.u2_user_username}/dashboard`);
}
