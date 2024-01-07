import { unstable_noStore as noStore } from "next/cache";
import { FriendCodeUser, User, UserStatusTitle } from "../definitions/users";
import pRetry from "p-retry";
import { sql } from "@vercel/postgres";
import { DEFAULT_RETRIES } from "../data/users";

export async function changeUpdateUserAppWideName(
  userAppWideName: string,
  user: User,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Users
        SET 
            user_app_wide_name = ${userAppWideName},
            user_status_dashboard = 'APPWIDENAMEUPDATED',
            user_updated_at = now()
        WHERE user_id = ${user.user_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User App-Wide Name.",
    };
  }
}

export async function changeResetUserStatusDashboard(user: User) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Users
        SET 
            user_status_dashboard = 'NONE',
            user_updated_at = now()
        WHERE user_id = ${user.user_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Status Dashboard.",
    };
  }
}

export async function changeUpdateUserFriendCode(
  user: User,
  generatedFriendCode: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Users
        SET 
            user_friend_code = ${generatedFriendCode},
            user_status_dashboard = 'FRIENDCODEUPDATED',
            user_updated_at = now()
        WHERE user_id = ${user.user_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Friend Code.",
    };
  }
}

export async function changeResetUserStatusPersonalInfo(user: User) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Users
        SET 
            user_status_personal_info = 'NONE',
            user_updated_at = now()
        WHERE user_id = ${user.user_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Status Personal Info.",
    };
  }
}

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

export async function changeCreateUser(
  generatedUserID: string,
  userUsername: string,
  userEmail: string,
  userAppWideName: string,
  generatedFriendCode: string,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        INSERT INTO Users (
            user_id,
            user_username,
            user_email,
            user_password,
            user_app_wide_name,
            user_friend_code,
            user_state,
            user_created_at,
            user_updated_at,
            user_status_title
        )
        VALUES (
            ${generatedUserID},
            ${userUsername},
            ${userEmail},
            'password', -- should be userPassword eventually
            ${userAppWideName},
            ${generatedFriendCode},
            'LIVE',
            now(),
            now(),
            'WELCOMETOGREVENTS'
        )
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Create User.",
    };
  }
}

export async function changeResetUserStatusTitle(user: User) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Users
        SET 
            user_status_title = 'NONE',
            user_updated_at = now()
        WHERE user_id = ${user.user_id}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Status Title.",
    };
  }
}

export async function changeSetUserStatusTitle(
  userId: string,
  statusTitle: UserStatusTitle,
) {
  noStore();

  try {
    const run = async () => {
      const data = await sql`
        UPDATE Users
        SET 
            user_status_title = ${statusTitle},
            user_updated_at = now()
        WHERE user_id = ${userId}
        RETURNING * -- to make sure
      `;
      console.log(data.rows);
    };
    await pRetry(run, { retries: DEFAULT_RETRIES });
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Status Title.",
    };
  }
}
