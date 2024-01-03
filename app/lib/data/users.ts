import { sql } from "@vercel/postgres";
import { FriendCodeUser, User } from "../definitions/users";
import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";

/* Trying to turn oRetry into a function I can reuse.
export async function fetchWithRetry(data: any | Function) {
  noStore();
  // console.log(friendCode);
  try {
    const run = async () => {
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch friend code user data.");
  }
}
}
*/

export async function fetchUserByUsername(username: string) {
  // noStore(); // It's always going to be the same user as in the params.
  // Therefore, there's no need to constantly revalidate.
  // Back to no store because now I can modify it with form actions.
  // It doesn't change anything, they seem to have purposefully limit
  // the updates on the database by default, even if they show in RETURNING.
  // console.log(username);

  // /*fetchWithRetry(data)*/

  try {
    const run = async () => {
      const data = await sql<User>`
        SELECT
            user_id,
            user_state,
            user_status_title,
            user_status_dashboard,
            user_status_personal_info,
            user_username,
            user_app_wide_name,
            user_friend_code,
            user_has_temporary_password,
            user_created_at,
            user_updated_at
        FROM Users

        WHERE user_username = ${username}

        AND user_state = 'LIVE'
        
        LIMIT 1;
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

/* No longer in use.
export async function findOtherUserByFriendCodeAgainstUser(
  friendCode: string,
  user: User,
) {
  noStore();
  // console.log(friendCode);
  try {
    const run = async () => {
      const data = await sql<FriendCodeUser>`
        SELECT
            user_id,
            user_username,
            user_app_wide_name,
            user_friend_code
        FROM Users

        WHERE user_friend_code = ${friendCode}
        AND user_id != ${user.user_id}

        AND user_state = 'LIVE'
        
        LIMIT 1;
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch friend code user data.");
  }
}
*/

export async function findUserByFriendCode(friendCode: string) {
  noStore();
  // console.log(friendCode);
  try {
    const run = async () => {
      const data = await sql<FriendCodeUser>`
        SELECT
            user_id,
            user_username,
            user_app_wide_name,
            user_friend_code
        FROM Users

        WHERE user_friend_code = ${friendCode}

        AND user_state = 'LIVE'
        
        LIMIT 1;
      `;
      // console.log(data);
      return data.rows[0];
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch friend code user data.");
  }
}
