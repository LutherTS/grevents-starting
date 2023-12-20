"use server";

import { z } from "zod";
import { User } from "../definitions/users";
import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

const USER_STATES = ["NONE", "LIVE", "DELETED"] as const;

const USER_STATUSES_TITLE = [
  "NONE",
  "WELCOMETOGREVENTS",
  "WELCOMEBACKTOGREVENTS",
] as const;

const USER_STATUSES_DASHBOARD = [
  "NONE",
  "EMAILUPDATED",
  "PASSWORDUPDATED",
  "APPWIDENAMEUPDATED",
  "FRIENDCODEUPDATED",
  "TEMPORARYPASSWORDCHANGED",
  "REDIRECTEDTODASHBOARD",
] as const;

const USER_STATUSES_PERSONAL_INFO = [
  "NONE",
  "CRITERIAPINNED",
  "CRITERIAUNPINNED",
  "ANSWERUPDATED",
  "ANSWERDELETED",
  "NATIVECRITERIANOTIRLADDED",
  "NATIVECRITERIAIRLADDED",
  "PSEUDONATIVECRITERIANOTIRLADDED",
  "PSEUDONATIVECRITERIAIRLADDED",
  "PSEUDONATIVECRITERIAUPPEDTOIRL",
  "PSEUDONATIVECRITERIADOWNEDFROMIRL",
  "CUSTOMCRITERIAADDED",
  "CUSTOMCRITERIADELETED",
  "USERQUESTIONFRIENDADDED",
  "USERQUESTIONFRIENDUPDATED",
  "USERQUESTIONFRIENDDELETED",
  "REDIRECTEDTOPERSONALINFO",
] as const;

const UserSchema = z.object({
  userId: z.string().length(36),
  userState: z.enum(USER_STATES),
  userStatusTitle: z.enum(USER_STATUSES_TITLE),
  userStatusDashboard: z.enum(USER_STATUSES_DASHBOARD),
  userStatusPersonalInfo: z.enum(USER_STATUSES_PERSONAL_INFO),
  userUsername: z.string().max(50),
  userEmail: z.string().max(100),
  userPassword: z.string().max(50),
  userAppWideName: z
    .string()
    .min(1, {
      message: "Your app-wide name needs to be at least a character long.",
    })
    .max(50, {
      message: "Your app-wide name cannot be more than 50 characters long.",
    }),
  userFriendCode: z.string().length(12),
  userHasTemporaryPassword: z.boolean(),
  userCreatedAt: z.string().datetime(),
  userUpdatedAt: z.string().datetime(),
});

const UpdateUserAppWideName = UserSchema.pick({ userAppWideName: true });

export type UpdateUserAppWideNameFormState = {
  errors?: {
    userAppWideName?: string[] | undefined;
  };
  message?: string | null;
};

export async function updateUserAppWideName(
  user: User,
  prevState: UpdateUserAppWideNameFormState | undefined,
  formData: FormData,
) {
  // console.log(user);
  // console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("userappwidename"));

  const validatedFields = UpdateUserAppWideName.safeParse({
    userAppWideName: formData.get("userappwidename"),
  });
  // console.log(UpdateUserAppWideName);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update User App-Wide Name.",
    };
  }

  const { userAppWideName } = validatedFields.data;

  // console.log(userAppWideName);
  // console.log(user.user_id);

  noStore();
  try {
    const data = await sql`
      UPDATE Users
      SET 
          user_app_wide_name = ${userAppWideName},
          user_status_dashboard = 'APPWIDENAMEUPDATED',
          user_updated_at = now()
      WHERE user_id = ${user.user_id}
      RETURNING * -- to make sure
    `;
    console.log(data);
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User App-Wide Name.",
    };
  }

  revalidatePath(`/users/${user.user_username}/dashboard`);
  redirect(`/users/${user.user_username}/dashboard`);
}

//

const UpdateUserFriendCode = UserSchema.pick({});
// bind user on form client component
/*
const initialState = { message: null, errors: {} };
const UpdateUserAppWideNameWithUser = UpdateUserAppWideName.bind(null, user);
const [state, dispatch] = useFormState(UpdateUserAppWideNameWithUser, initialState);
*/

/* Premières modifications : 
const UserSchema = z.object({
  userId: z.string().length(36),
  userState: z.enum(USER_STATES),
  userStatusTitle: z.enum(USER_STATUSES_TITLE),
  userStatusDashboard: z.enum(USER_STATUSES_DASHBOARD),
  userStatusPersonalInfo: z.enum(USER_STATUSES_PERSONAL_INFO),
  userUsername: z.string().max(50),
  userEmail: z.string().max(100),
  userPassword: z.string().max(50),
  userAppWideName: z.string().max(50),
  userFriendCode: z.string().length(12),
  userHasTemporaryPassword: z.boolean(),
  userCreatedAt: z.string().datetime(),
  userUpdatedAt: z.string().datetime()
  //
  Du coup je préciserai les ({invalid_type_error}) ou (, {invalid_type_error}) au fur et à mesure que j'utiliserai les déclinaisons spécifiques du schéma avec .omit(). Par exemple, je sais qu'il n'y a aucun cas d'usage où je dirai au client ("Please enter a valid UUID" puisque je les créerai toujours par moi-même.)
  //
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number({
      invalid_type_error: "Please enter a number.",
    })
    .gt(0, { message: "Please enter an amount greater than $0." })
    .multipleOf(0.01, {
      message: "Please enter an amount that is currency-friendly.",
    }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});
*/
