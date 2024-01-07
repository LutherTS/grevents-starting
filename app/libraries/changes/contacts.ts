import { unstable_noStore as noStore } from "next/cache";
import pRetry from "p-retry";
import { sql } from "@vercel/postgres";
import { DEFAULT_RETRIES } from "../data/users";
import { ContactStatusOtherProfile } from "../definitions/contacts";

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
