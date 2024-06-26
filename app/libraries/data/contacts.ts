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
import { DEFAULT_RETRIES } from "./users";

export const CONTACT_ARBITRARY_LIMIT = 256;

export async function fetchAllUserFriendsNotToUserQuestion(
  user: User,
  userQuestion: UserQuestion,
) {
  noStore();
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
            AND uqf.userquestionfriend_shared_to_friend = TRUE -- NEW
            
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
        AND (u.user_state = 'LIVE'
        OR u.user_state = 'DEACTIVATED')
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            -- c1.contact_updated_at DESC,
            lower(u.user_app_wide_name) ASC,
            u.user_username ASC

        LIMIT ${CONTACT_ARBITRARY_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(
      "Failed to fetch user friends not user question friends to user question.",
    );
  }
}

// Note: this is from existing contacts only, thus excluding users we have no idea of, as intended.
export async function gatherContactByUserAndUsername(
  user: User,
  username: string,
) {
  // noStore(); // since juggling between relcombos
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
              c1.contact_mirror_id c1_contact_mirror_id,
              -- c1.contact_status_profile c1_contact_status_profile, -- NEW
              c2.contact_status_other_profile c2_contact_status_other_profile, -- NEW
              u.user_state
          FROM Contacts c1

          JOIN Users u ON c1.user_last_id = u.user_id
          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          
          WHERE c1.user_first_id = ${user.user_id}
          AND u.user_username = ${username}
          
          AND c1.contact_state = 'LIVE'
          AND (u.user_state = 'LIVE'
          OR u.user_state = 'DEACTIVATED')
          AND c2.contact_state = 'LIVE'

          LIMIT 1;
        `;
        return data.rows[0];
      };
      const data = await pRetry(run, { retries: DEFAULT_RETRIES });
      return data;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to gather contact.");
    }
  }
}

export async function fetchAllUserNotIrlFriends(user: User) {
  noStore();
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
        AND (u.user_state = 'LIVE'
        OR u.user_state = 'DEACTIVATED')
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            -- c1.contact_updated_at DESC,
            lower(u.user_app_wide_name) ASC,
            u.user_username ASC

        LIMIT ${CONTACT_ARBITRARY_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user not irl friends.");
  }
}

export async function fetchAllUserIrlFriends(user: User) {
  noStore();
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
        AND (u.user_state = 'LIVE'
        OR u.user_state = 'DEACTIVATED')
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            -- c1.contact_updated_at DESC,
            lower(u.user_app_wide_name) ASC,
            u.user_username ASC
            
        LIMIT ${CONTACT_ARBITRARY_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user irl friends.");
  }
}

export async function fetchAllUserWhoIAmBlocking(user: User) {
  noStore();
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
        AND (u.user_state = 'LIVE'
        OR u.user_state = 'DEACTIVATED')
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            -- c1.contact_blocked_at DESC,
            -- c1.contact_updated_at DESC,
            lower(u.user_app_wide_name) ASC,
            u.user_username ASC

        LIMIT ${CONTACT_ARBITRARY_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user not irl friends.");
  }
}

// Since I'm not verifying if I'm deactivated or not, it's not an issue.
export async function fetchAllUserWhoHaveMeBlocked(user: User) {
  noStore();
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
        AND (u.user_state = 'LIVE'
        OR u.user_state = 'DEACTIVATED')
        AND c2.contact_state = 'LIVE'

        ORDER BY 
            -- c2.contact_blocked_at DESC,
            -- c1.contact_updated_at DESC,
            lower(u.user_app_wide_name) ASC,
            u.user_username ASC

        LIMIT ${CONTACT_ARBITRARY_LIMIT};
      `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user not irl friends.");
  }
}

// Note: for all single contacts used for validation, the user whose username is in the URL is considered the user_first.
export async function findContactByUserAndSession(
  user: User,
  session: { [K in "user"]: User } | null,
) {
  noStore(); // since changes in relation will revalidate // no
  // revalidate all the time now that I know revalidate isn't general
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
              c1.user_last_id c1_user_last_id,
              -- c1.contact_status_profile c1_contact_status_profile, -- NEW
              c2.contact_status_other_profile c2_contact_status_other_profile, -- NEW
              c2.contact_status_relationship c2_contact_status_relationship, -- NEW
              c2.contact_process_relationship c2_contact_process_relationship, -- NEW
              c1.contact_process_relationship c1_contact_process_relationship, -- NEW
              u1.user_username u1_user_username, -- NEW
              u2.user_username u2_user_username, -- NEW
              u1.user_app_wide_name u1_user_app_wide_name, -- NEW
              u2.user_app_wide_name u2_user_app_wide_name -- NEW
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          JOIN Users u1 ON c1.user_first_id = u1.user_id -- NEW
          JOIN Users u2 ON c1.user_last_id = u2.user_id -- NEW
          
          WHERE c1.user_first_id = ${user.user_id}
          AND c1.user_last_id = ${session.user.user_id}
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'
          AND (u1.user_state = 'LIVE'
          OR u1.user_state = 'DEACTIVATED') -- NEW
          AND (u2.user_state = 'LIVE'
          OR u2.user_state = 'DEACTIVATED') -- NEW

          LIMIT 1;
        `;
        return data.rows[0];
      };
      const data = await pRetry(run, { retries: DEFAULT_RETRIES });
      return data;
    } catch (error) {
      console.error("Database Error:", error);
      throw new Error("Failed to find contact.");
    }
  }
}

export async function findSentFriendToContactsByUser(user: User) {
  noStore(); // since always changing
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
              c1.user_last_id c1_user_last_id,
              -- c1.contact_status_profile c1_contact_status_profile, -- NEW
              c2.contact_status_other_profile c2_contact_status_other_profile, -- NEW
              c2.contact_status_relationship c2_contact_status_relationship, -- NEW
              c2.contact_process_relationship c2_contact_process_relationship, -- NEW
              c1.contact_process_relationship c1_contact_process_relationship, -- NEW
              u1.user_username u1_user_username, -- NEW
              u2.user_username u2_user_username, -- NEW
              u1.user_app_wide_name u1_user_app_wide_name, -- NEW
              u2.user_app_wide_name u2_user_app_wide_name -- NEW
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          JOIN Users u1 ON c1.user_first_id = u1.user_id -- NEW
          JOIN Users u2 ON c1.user_last_id = u2.user_id -- NEW
          
          WHERE c1.user_first_id = ${user.user_id}
          AND c1.contact_process_relationship = 'SENTFRIEND'
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'
          AND (u1.user_state = 'LIVE'
          OR u1.user_state = 'DEACTIVATED') -- NEW
          AND (u2.user_state = 'LIVE'
          OR u2.user_state = 'DEACTIVATED') -- NEW

          ORDER BY 
            -- c1.contact_sent_friend_at DESC,
            -- c1.contact_updated_at DESC,
            lower(u2.user_app_wide_name) ASC,
            u2.user_username ASC

          LIMIT ${CONTACT_ARBITRARY_LIMIT};
        `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find sent friend to contacts.");
  }
}

export async function findSentIrlToContactsByUser(user: User) {
  noStore(); // since always changing
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
              c1.user_last_id c1_user_last_id,
              -- c1.contact_status_profile c1_contact_status_profile, -- NEW
              c2.contact_status_other_profile c2_contact_status_other_profile, -- NEW
              c2.contact_status_relationship c2_contact_status_relationship, -- NEW
              c2.contact_process_relationship c2_contact_process_relationship, -- NEW
              c1.contact_process_relationship c1_contact_process_relationship, -- NEW
              u1.user_username u1_user_username, -- NEW
              u2.user_username u2_user_username, -- NEW
              u1.user_app_wide_name u1_user_app_wide_name, -- NEW
              u2.user_app_wide_name u2_user_app_wide_name -- NEW
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          JOIN Users u1 ON c1.user_first_id = u1.user_id -- NEW
          JOIN Users u2 ON c1.user_last_id = u2.user_id -- NEW
          
          WHERE c1.user_first_id = ${user.user_id}
          AND c1.contact_process_relationship = 'SENTIRL'
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'
          AND (u1.user_state = 'LIVE'
          OR u1.user_state = 'DEACTIVATED') -- NEW
          AND (u2.user_state = 'LIVE'
          OR u2.user_state = 'DEACTIVATED') -- NEW

          ORDER BY 
            -- c1.contact_sent_irl_at DESC,
            -- c1.contact_updated_at DESC,
            lower(u2.user_app_wide_name) ASC,
            u2.user_username ASC

          LIMIT ${CONTACT_ARBITRARY_LIMIT};
        `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find sent irl to contacts.");
  }
}

export async function findSentFriendFromContactsByUser(user: User) {
  noStore(); // since always changing
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
              c1.user_last_id c1_user_last_id,
              -- c1.contact_status_profile c1_contact_status_profile, -- NEW
              c2.contact_status_other_profile c2_contact_status_other_profile, -- NEW
              c2.contact_status_relationship c2_contact_status_relationship, -- NEW
              c2.contact_process_relationship c2_contact_process_relationship, -- NEW
              c1.contact_process_relationship c1_contact_process_relationship, -- NEW
              u1.user_username u1_user_username, -- NEW
              u2.user_username u2_user_username, -- NEW
              u1.user_app_wide_name u1_user_app_wide_name, -- NEW
              u2.user_app_wide_name u2_user_app_wide_name -- NEW
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          JOIN Users u1 ON c1.user_first_id = u1.user_id -- NEW
          JOIN Users u2 ON c1.user_last_id = u2.user_id -- NEW
          
          WHERE c2.user_first_id = ${user.user_id} -- only change versus To
          AND c1.contact_process_relationship = 'SENTFRIEND'
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'
          AND (u1.user_state = 'LIVE'
          OR u1.user_state = 'DEACTIVATED') -- NEW
          AND (u2.user_state = 'LIVE'
          OR u2.user_state = 'DEACTIVATED') -- NEW

          ORDER BY 
            -- c1.contact_sent_friend_at DESC,
            -- c1.contact_updated_at DESC,
            lower(u1.user_app_wide_name) ASC,
            u1.user_username ASC

          LIMIT ${CONTACT_ARBITRARY_LIMIT};
        `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find sent friend from contacts.");
  }
}

export async function findSentIrlFromContactsByUser(user: User) {
  noStore(); // since always changing
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
              c1.user_last_id c1_user_last_id,
              -- c1.contact_status_profile c1_contact_status_profile, -- NEW
              c2.contact_status_other_profile c2_contact_status_other_profile, -- NEW
              c2.contact_status_relationship c2_contact_status_relationship, -- NEW
              c2.contact_process_relationship c2_contact_process_relationship, -- NEW
              c1.contact_process_relationship c1_contact_process_relationship, -- NEW
              u1.user_username u1_user_username, -- NEW
              u2.user_username u2_user_username, -- NEW
              u1.user_app_wide_name u1_user_app_wide_name, -- NEW
              u2.user_app_wide_name u2_user_app_wide_name -- NEW
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          JOIN Users u1 ON c1.user_first_id = u1.user_id -- NEW
          JOIN Users u2 ON c1.user_last_id = u2.user_id -- NEW
          
          WHERE c2.user_first_id = ${user.user_id} -- only change versus To
          AND c1.contact_process_relationship = 'SENTIRL'
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'
          AND (u1.user_state = 'LIVE'
          OR u1.user_state = 'DEACTIVATED') -- NEW
          AND (u2.user_state = 'LIVE'
          OR u2.user_state = 'DEACTIVATED') -- NEW

          ORDER BY 
            -- c1.contact_sent_irl_at DESC,
            -- c1.contact_updated_at DESC,
            lower(u1.user_app_wide_name) ASC,
            u1.user_username ASC

          LIMIT ${CONTACT_ARBITRARY_LIMIT};
        `;
      return data.rows;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find sent irl from contacts.");
  }
}

// That's a bug. AND u1.user_state = 'LIVE' -- NEW should be OR 'DEACTIVATED'
export async function countSentFriendToContactsByUser(user: User) {
  noStore(); // since always changing
  try {
    const run = async () => {
      const data = await sql`
          SELECT 
              COUNT(*)
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          JOIN Users u1 ON c1.user_first_id = u1.user_id -- NEW
          JOIN Users u2 ON c1.user_last_id = u2.user_id -- NEW
          
          WHERE c1.user_first_id = ${user.user_id}
          AND c1.contact_process_relationship = 'SENTFRIEND'
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'
          AND u1.user_state = 'LIVE' -- NEW
          AND u2.user_state = 'LIVE' -- NEW
        `;
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find sent friend to contacts.");
  }
}

export async function countSentIrlToContactsByUser(user: User) {
  noStore(); // since always changing
  try {
    const run = async () => {
      const data = await sql`
          SELECT 
              COUNT(*)
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          JOIN Users u1 ON c1.user_first_id = u1.user_id -- NEW
          JOIN Users u2 ON c1.user_last_id = u2.user_id -- NEW
          
          WHERE c1.user_first_id = ${user.user_id}
          AND c1.contact_process_relationship = 'SENTIRL'
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'
          AND u1.user_state = 'LIVE' -- NEW
          AND u2.user_state = 'LIVE' -- NEW
        `;
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find sent irl to contacts.");
  }
}

export async function countSentFriendFromContactsByUser(user: User) {
  noStore(); // since always changing
  try {
    const run = async () => {
      const data = await sql`
          SELECT 
              COUNT(*)
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          JOIN Users u1 ON c1.user_first_id = u1.user_id -- NEW
          JOIN Users u2 ON c1.user_last_id = u2.user_id -- NEW
          
          WHERE c2.user_first_id = ${user.user_id} -- only change versus To
          AND c1.contact_process_relationship = 'SENTFRIEND'
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'
          AND u1.user_state = 'LIVE' -- NEW
          AND u2.user_state = 'LIVE' -- NEW
        `;
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find sent friend from contacts.");
  }
}

export async function countSentIrlFromContactsByUser(user: User) {
  noStore(); // since always changing
  try {
    const run = async () => {
      const data = await sql`
          SELECT 
              COUNT(*)
          FROM Contacts c1

          JOIN Contacts c2 ON c1.contact_mirror_id = c2.contact_id
          JOIN Users u1 ON c1.user_first_id = u1.user_id -- NEW
          JOIN Users u2 ON c1.user_last_id = u2.user_id -- NEW
          
          WHERE c2.user_first_id = ${user.user_id} -- only change versus To
          AND c1.contact_process_relationship = 'SENTIRL'
          
          AND c1.contact_state = 'LIVE'
          AND c2.contact_state = 'LIVE'
          AND u1.user_state = 'LIVE' -- NEW
          AND u2.user_state = 'LIVE' -- NEW
        `;
      return data.rows[0].count;
    };
    const data = await pRetry(run, { retries: DEFAULT_RETRIES });
    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to find sent irl from contacts.");
  }
}
