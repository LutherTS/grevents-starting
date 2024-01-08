import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { sql } from "@vercel/postgres";
import { DEFAULT_RETRIES } from "../data/users";
import {
  ContactProcessRelationship,
  ContactStatusOtherProfile,
  ContactStatusRelationship,
  FoundContact,
} from "../definitions/contacts";
import { FriendCodeUser, User } from "../definitions/users";

export async function changeCreateContactAndMirrorContact(
  user: User,
  otherUser: FriendCodeUser,
  generatedUserOtherUserContactID: string,
  generatedOtherUserUserContactID: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO Contacts ( -- user and otherUser
            contact_id,
            user_first_id,
            user_last_id,
            contact_state,
            contact_kind,
            contact_created_at,
            contact_updated_at
        )
        VALUES ( -- from user to otherUser
            ${generatedUserOtherUserContactID},
            ${user.user_id},
            ${otherUser.user_id},
            'LIVE',
            'NONE',
            now(),
            now()
        ), ( -- from otherUser to user
            ${generatedOtherUserUserContactID},
            ${otherUser.user_id},
            ${user.user_id},
            'LIVE',
            'NONE',
            now(),
            now()
        )
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create Contacts.",
    };
  }
}

export async function changeSetContactMirrorContact(
  contactId: string,
  mirrorContactId: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts
        SET 
            contact_mirror_id = ${contactId},
            contact_updated_at = now()
        WHERE contact_id = ${mirrorContactId}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update Contact.",
    };
  }
}

export async function changeSetContactStatusOtherProfile(
  contactId: string,
  statusOtherProfile: ContactStatusOtherProfile,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts -- mirror contact
        SET 
            contact_status_other_profile = ${statusOtherProfile},
            contact_updated_at = now()
        WHERE contact_id = ${contactId}
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
}

export async function changeResetContactStatusOtherProfile(contactId: string) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts -- mirror contact
        SET 
            contact_status_other_profile = 'NONE',
            contact_updated_at = now()
        WHERE contact_id = ${contactId}
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
}

export async function changeResetContactStatusRelationship(contactId: string) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Contacts -- mirror contact
        SET 
            contact_status_relationship = 'NONE',
            contact_updated_at = now()
        WHERE contact_id = ${contactId}
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

export async function changeUpdateContactKindToFriend(contact: FoundContact) {
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

export async function changeUpdateMirrorContactKindToFriend(
  contact: FoundContact,
) {
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

export async function changeUpdateContactKindToIrl(contact: FoundContact) {
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

export async function changeUpdateMirrorContactKindToIrl(
  contact: FoundContact,
) {
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

export async function changeUpdateContactKindToNone(contact: FoundContact) {
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

export async function changeUpdateMirrorContactKindToNone(
  contact: FoundContact,
) {
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

export async function changeUpdateContactBlocking(contact: FoundContact) {
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

export async function changeUpdateContactUnblocking(contact: FoundContact) {
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

export async function changeSetContactStatusRelationship(
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

export async function changeSetMirrorContactStatusRelationship(
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
      message:
        "Database Error: Failed to Update Mirror Contact Status Relationship.",
    };
  }
}

export async function changeSetContactProcessRelationship(
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

export async function changeSetMirrorContactProcessRelationship(
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
      message:
        "Database Error: Failed to Update Mirror Contact Process Relationship.",
    };
  }
}
