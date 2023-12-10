import { sql } from "@vercel/postgres";
// import { unstable_noStore as noStore } from "next/cache";

export async function fetchUserByUsername(username: string) {
  // noStore();
  // console.log(username);
  try {
    const data = await sql`
      SELECT * FROM Users

      WHERE user_username = ${username}

      AND user_state = 'LIVE'
      
      LIMIT 1;
    `;
    // console.log(data);
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}
