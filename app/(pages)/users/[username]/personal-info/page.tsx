import { sql } from "@vercel/postgres";

async function fetchUserByUsername(username: string) {
  console.log(username);
  try {
    const data = await sql`
      SELECT * FROM Users
      WHERE user_username = ${username}
      AND user_state = 'LIVE'
      LIMIT 1;
    `;
    console.log(data);
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export default async function PersonalInfo({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  const user = await fetchUserByUsername(username);

  return (
    <main className="min-h-screen p-8 w-full flex justify-center items-center">
      <p>Welcome to {user.user_app_wide_name}&apos;s Personal Info.</p>
    </main>
  );
}
