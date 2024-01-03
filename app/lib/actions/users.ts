"use server";

import { z } from "zod";
import { User } from "../definitions/users";
import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import uid from "uid2";

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
  otherUserFriendCode: z
    .string({
      invalid_type_error: "Please type a friend code.",
    })
    .length(12, {
      message: "A friend code is exactly 12 characters long.",
    }),
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
  console.log(prevState);
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
    console.log(data.rows);
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User App-Wide Name.",
    };
  }

  revalidatePath(`/users/${user.user_username}/dashboard`);
  redirect(`/users/${user.user_username}/dashboard`);
}

export async function resetUserStatusDashboard(user: User) {
  noStore();

  try {
    const data = await sql`
      UPDATE Users
      SET 
          user_status_dashboard = 'NONE',
          user_updated_at = now()
      WHERE user_id = ${user.user_id}
      RETURNING * -- to make sure
    `;
    console.log(data.rows);
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Status Dashboard.",
    };
  }

  revalidatePath(`/users/${user.user_username}/dashboard`);
}

export async function updateUserFriendCode(user: User) {
  noStore();

  const generatedFriendCode = uid(12);

  try {
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
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Friend Code.",
    };
  }

  revalidatePath(`/users/${user.user_username}/dashboard`);
  redirect(`/users/${user.user_username}/dashboard`);
}

export async function resetUserStatusPersonalInfo(user: User) {
  noStore();

  try {
    const data = await sql`
      UPDATE Users
      SET 
          user_status_personal_info = 'NONE',
          user_updated_at = now()
      WHERE user_id = ${user.user_id}
      RETURNING * -- to make sure
    `;
    console.log(data.rows);
  } catch (error) {
    return {
      message: "Database Error: Failed to Update User Status Personal Info.",
    };
  }

  revalidatePath(`/users/${user.user_username}/personal-info`);
  revalidatePath(`/users/${user.user_username}/personal-info/standardized`);
  revalidatePath(`/users/${user.user_username}/personal-info/customized`);
}

/* Note importante :
La fonction createOrFindContactsByFriendCode sera placée dans ce fichier users.ts. 
La convention sur laquelle je vais pour l'instant me baser est que les fonctions doivent être rangées à partir de leurs arguments plutôt que de leurs résultats. Ici, l'argument correspond à la table Users et le résultat correspond à la table Contacts. Il est donc plus simple de partir du schéma Zod présent sur ce fichier users.ts que d'avoir à configurer celui de contacts.ts à cet effet, spécifiquement parce que aucun champ de la table Contacts n'est requis pour ce formulaire.
*/

const CreateOrFindContactsByFriendCode = UserSchema.pick({
  otherUserFriendCode: true,
});

export type CreateOrFindContactsByFriendCodeFormState = {
  errors?: {
    otherUserFriendCode?: string[] | undefined;
  };
  message?: string | null;
};

export async function createOrFindContactsByFriendCode(
  user: User,
  prevState: CreateOrFindContactsByFriendCodeFormState | undefined,
  formData: FormData,
) {
  console.log(user);
  console.log(prevState);
  console.log(formData);
  console.log(formData.get("friendcode"));

  const validatedFields = CreateOrFindContactsByFriendCode.safeParse({
    otherUserFriendCode: formData.get("friendcode"),
  });
  console.log(CreateOrFindContactsByFriendCode);
  console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        "Missing Fields. Failed to Create or Find Contacts by Friend Code.",
    };
  }

  const { otherUserFriendCode } = validatedFields.data;

  console.log(otherUserFriendCode);
  console.log(user.user_id);

  noStore();
  // Ready to try previous code and then to communicate with the database.
}
