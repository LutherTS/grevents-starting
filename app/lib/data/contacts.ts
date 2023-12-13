import { sql } from "@vercel/postgres";
import { User } from "../definitions/users";
import { Contact, Friend, GatheredContact } from "../definitions/contacts";
import { unstable_noStore as noStore } from "next/cache";

export async function fetchAllUserFriends(user: User) {
  noStore();
  // console.log(user);
  try {
    const data = await sql<Friend>`
      SELECT 
          u.user_app_wide_name, 
          u.user_username, 
          c1.contact_id 
      FROM Contacts c1
      
      JOIN Users u ON c1.user_last_id = u.user_id
      JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
      
      WHERE c1.user_first_id = ${user.user_id}
      AND (
          (
              c1.contact_kind = 'FRIEND' AND 
              c2.contact_kind = 'FRIEND' AND
              c1.contact_blocking = FALSE AND
              c2.contact_blocking = FALSE
          )
          OR (
              c1.contact_kind = 'IRL' AND 
              c2.contact_kind = 'IRL' AND
              c1.contact_blocking = FALSE AND
              c2.contact_blocking = FALSE
          )
      )
      
      AND c1.contact_state = 'LIVE'
      AND u.user_state = 'LIVE'
      AND c2.contact_state = 'LIVE'

      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user friends.");
  }
}

/* No longer in use.
export async function fetchAllUserContacts(user: User) {
  noStore();
  // console.log(user);
  try {
    const data = await sql<Contact>`
      SELECT 
          u.user_app_wide_name, 
          u.user_username, 
          c1.contact_id 
      FROM Contacts c1

      JOIN Users u ON c1.user_last_id = u.user_id
      JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
      
      WHERE c1.user_first_id = ${user.user_id}
      
      AND c1.contact_state = 'LIVE'
      AND u.user_state = 'LIVE'
      AND c2.contact_state = 'LIVE'

      LIMIT 10;
    `;
    // console.log(data);
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user contacts.");
  }
}
*/

export async function gatherContactByUserAndUsername(
  user: User,
  username: string,
) {
  noStore();
  console.log(user);
  console.log(username);
  if (username !== "") {
    try {
      const data = await sql<GatheredContact>`
      SELECT 
          u.user_app_wide_name, 
          u.user_username, 
          c1.contact_kind c1_kind, 
          c1.contact_blocking c1_blocking, 
          c2.contact_kind c2_kind, 
          c2.contact_blocking c2_blocking, 
          c1.contact_id c1_id, 
          c1.contact_mirror_id c1_mirror_id 
      FROM Contacts c1

      JOIN Users u ON c1.user_last_id = u.user_id
      JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
      
      WHERE c1.user_first_id = ${user.user_id}
      AND u.user_username = ${username}
      
      AND c1.contact_state = 'LIVE'
      AND u.user_state = 'LIVE'
      AND c2.contact_state = 'LIVE'

      LIMIT 1;
    `;
      console.log(data);
      return data.rows[0];
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to gather contact.");
    }
  }
}
