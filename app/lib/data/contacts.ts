import { sql } from "@vercel/postgres";
import { User } from "../definitions/users";
import {
  Friend,
  Block,
  GatheredContact,
  FoundContact,
} from "../definitions/contacts";
import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { UserQuestion } from "../definitions/userquestions";

// Going to need this improved to exclude current userQuestionFriends on userQuestion
export async function fetchAllUserFriends(user: User) {
  noStore();
  // console.log(user);
  try {
    const run = async () => {
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

        ORDER BY 
            c1.contact_updated_at DESC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user friends.");
  }
}

export async function fetchAllUserFriendsNotToUserQuestion(
  user: User,
  userQuestion: UserQuestion,
) {
  noStore();
  // console.log(user);
  try {
    const run = async () => {
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

        AND c1.contact_id NOT IN ( -- START 

            SELECT 
                uqf.contact_id
            FROM UserQuestionFriends uqf
            
            JOIN Contacts c3 ON uqf.contact_id = c3.contact_id
            JOIN Users u2 ON c3.user_last_id = u2.user_id
            JOIN Contacts c4 ON c3.contact_mirror_id = c4.contact_id
            
            WHERE uqf.userquestion_id = ${userQuestion.userquestion_id}
            AND (
                (
                    c3.contact_kind = 'FRIEND' AND 
                    c4.contact_kind = 'FRIEND' AND
                    c3.contact_blocking = FALSE AND
                    c4.contact_blocking = FALSE -- amis “simple”
                )
                OR (
                    c3.contact_kind = 'IRL' AND 
                    c4.contact_kind = 'IRL' AND
                    c3.contact_blocking = FALSE AND
                    c4.contact_blocking = FALSE -- amis “dans la vraie vie”
                )
            )
            
            AND uqf.userquestionfriend_state = 'LIVE'
            AND c3.contact_state = 'LIVE'
            AND u2.user_state = 'LIVE'
            AND c4.contact_state = 'LIVE'

        ) -- END
        
        AND c1.contact_state = 'LIVE'
        AND u.user_state = 'LIVE'
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            c1.contact_updated_at DESC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user friends not user question friends to user question.",
    );
  }
}

/* No longer in use.
export async function fetchAllUserContacts(user: User) {
  noStore();
  // console.log(user);
  try {
    const run = async () => {
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

        ORDER BY 
            c1.contact_updated_at DESC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
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
  // noStore(); // since juggling between relcombos
  // console.log(user);
  // console.log(username);
  if (username !== "") {
    try {
      const run = async () => {
        const data = await sql<GatheredContact>`
          SELECT 
              u.user_app_wide_name, 
              u.user_username, 
              c1.contact_kind c1_contact_kind, 
              c1.contact_blocking c1_contact_blocking, 
              c2.contact_kind c2_contact_kind, 
              c2.contact_blocking c2_contact_blocking, 
              c1.contact_id c1_contact_id, 
              c1.contact_mirror_id c1_contact_mirror_id 
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
        // console.log(data);
        return data.rows[0];
      };
      const data = await pRetry(run, { retries: 5 });
      // console.log(data);
      return data;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to gather contact.");
    }
  }
}

export async function fetchAllUserNotIrlFriends(user: User) {
  noStore();
  // console.log(user);
  try {
    const run = async () => {
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
            c1.contact_kind = 'FRIEND' AND 
            c2.contact_kind = 'FRIEND' AND
            c1.contact_blocking = FALSE AND
            c2.contact_blocking = FALSE
        )
        
        AND c1.contact_state = 'LIVE'
        AND u.user_state = 'LIVE'
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            c1.contact_updated_at DESC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user not irl friends.");
  }
}

export async function fetchAllUserIrlFriends(user: User) {
  noStore();
  // console.log(user);
  try {
    const run = async () => {
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
            c1.contact_kind = 'IRL' AND 
            c2.contact_kind = 'IRL' AND
            c1.contact_blocking = FALSE AND
            c2.contact_blocking = FALSE
        )
        
        AND c1.contact_state = 'LIVE'
        AND u.user_state = 'LIVE'
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            c1.contact_updated_at DESC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user irl friends.");
  }
}

export async function fetchAllUserWhoIAmBlocking(user: User) {
  noStore();
  // console.log(user);
  try {
    const run = async () => {
      const data = await sql<Block>`
        SELECT 
            u.user_app_wide_name, 
            u.user_username, 
            c1.contact_id 
        FROM Contacts c1
        
        JOIN Users u ON c1.user_last_id = u.user_id
        JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        
        WHERE c1.user_first_id = ${user.user_id}
        AND (
            c1.contact_kind = 'NONE' AND 
            c2.contact_kind = 'NONE' AND
            c1.contact_blocking = TRUE
        )
        
        AND c1.contact_state = 'LIVE'
        AND u.user_state = 'LIVE'
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            c1.contact_blocked_at DESC,
            c1.contact_updated_at DESC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user not irl friends.");
  }
}

export async function fetchAllUserWhoHaveMeBlocked(user: User) {
  noStore();
  // console.log(user);
  try {
    const run = async () => {
      const data = await sql<Block>`
        SELECT 
            u.user_app_wide_name, 
            u.user_username, 
            c1.contact_id 
        FROM Contacts c1
        
        JOIN Users u ON c1.user_last_id = u.user_id
        JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
        
        WHERE c1.user_first_id = ${user.user_id}
        AND (
            c1.contact_kind = 'NONE' AND 
            c2.contact_kind = 'NONE' AND
            c2.contact_blocking = TRUE
        )
        
        AND c1.contact_state = 'LIVE'
        AND u.user_state = 'LIVE'
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            c2.contact_blocked_at DESC,
            c1.contact_updated_at DESC

        LIMIT 10;
      `;
      // console.log(data);
      return data.rows;
    };
    const data = await pRetry(run, { retries: 5 });
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user not irl friends.");
  }
}

export async function findContactByUserAndSession(
  user: User,
  session: { [K in "user"]: User } | null,
) {
  // noStore(); // since changes in relation will revalidate
  // console.log(user);
  // console.log(session);
  if (session !== null) {
    try {
      const run = async () => {
        const data = await sql<FoundContact>`
          SELECT 
              c1.contact_kind c1_contact_kind, 
              c1.contact_blocking c1_contact_blocking, 
              c2.contact_kind c2_contact_kind, 
              c2.contact_blocking c2_contact_blocking, 
              c1.contact_id c1_contact_id, 
              c1.contact_mirror_id c1_contact_mirror_id,
              c1.user_first_id c1_user_first_id,
              c1.user_last_id c1_user_last_id 
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          
          WHERE c1.user_first_id = ${user.user_id}
          AND c1.user_last_id = ${session.user.user_id}
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'

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
      throw new Error("Failed to find contact.");
    }
  }
}
