"use server";

import { z } from "zod";
import { User } from "../definitions/users";
import { sql } from "@vercel/postgres";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import uid from "uid2";
import {
  DEFAULT_RETRIES,
  fetchUserByEmail,
  fetchUserByUserNameOrEmail,
  fetchUserByUsername,
  findUserByFriendCode,
} from "../data/users";
import { gatherContactByUserAndUsername } from "../data/contacts";
import { v4 as uuidv4 } from "uuid";
import pRetry from "p-retry";

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
  // for now I voluntarily don't use .uuid()
  userId: z.string().length(36),
  userState: z.enum(USER_STATES),
  userStatusTitle: z.enum(USER_STATUSES_TITLE),
  userStatusDashboard: z.enum(USER_STATUSES_DASHBOARD),
  userStatusPersonalInfo: z.enum(USER_STATUSES_PERSONAL_INFO),
  userUsername: z
    .string({
      invalid_type_error: "Please type a username.",
    })
    .min(1, {
      message: "Your username needs to be at least 1 character long.",
    })
    .max(50, {
      message: "Your username cannot be more than 50 characters long.",
    }),
  // for now I voluntarily don't use .email()
  userEmail: z
    .string({
      invalid_type_error: "Please type an e-mail.",
    })
    .min(1, {
      message: "Your e-mail needs to be at least 1 character long.",
    })
    .max(50, {
      message: "Your e-mail cannot be more than 50 characters long.",
    }),
  userPassword: z
    .string({
      invalid_type_error: "Please type a password.",
    })
    .min(1, {
      message: "Your password needs to be at least 1 character long.",
    })
    .max(50, {
      message: "Your password cannot be more than 50 characters long.",
    }),
  userAppWideName: z
    .string({
      invalid_type_error: "Please type an app-wide name.",
    })
    .min(1, {
      message: "Your app-wide name needs to be at least 1 character long.",
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
  userConfirmPassword: z
    .string({
      invalid_type_error: "Please type a password.",
    })
    .min(1, {
      message: "Your password needs to be at least 1 character long.",
    })
    .max(50, {
      message: "Your password cannot be more than 50 characters long.",
    }),
  userUsernameOrEmail: z
    .string({
      invalid_type_error: "Please type a username or an email.",
    })
    .min(1, {
      message: "Your username or email has to be at least 1 character long.",
    })
    .max(50, {
      message:
        "Your username or email could not be more than 50 characters long.",
    }),
  userLoginPassword: z
    .string({
      invalid_type_error: "Please type a password.",
    })
    .min(1, {
      message: "Your password has to be at least 1 character long.",
    })
    .max(50, {
      message: "Your password could not be more than 50 characters long.",
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

  revalidatePath(`/users/${user.user_username}/dashboard`);
  redirect(`/users/${user.user_username}/dashboard`);
}

export async function resetUserStatusDashboard(user: User) {
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

  revalidatePath(`/users/${user.user_username}/dashboard`);
}

export async function updateUserFriendCode(user: User) {
  noStore();

  const generatedFriendCode = uid(12);

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

  revalidatePath(`/users/${user.user_username}/dashboard`);
  revalidatePath(`/users/${user.user_username}/personal-info`);
  redirect(`/users/${user.user_username}/dashboard`);
}

export async function resetUserStatusPersonalInfo(user: User) {
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
  // console.log(user);
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("friendcode"));

  const validatedFields = CreateOrFindContactsByFriendCode.safeParse({
    otherUserFriendCode: formData.get("friendcode"),
  });
  // console.log(CreateOrFindContactsByFriendCode);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        "Missing Fields. Failed to Create or Find Contacts by Friend Code.",
    };
  }

  const { otherUserFriendCode } = validatedFields.data;

  // console.log(otherUserFriendCode);
  // console.log(user.user_id);

  const otherUser = await findUserByFriendCode(otherUserFriendCode);
  // console.log(otherUser);

  if (otherUser === undefined) {
    return {
      message: "Database Error. A User Could Not Be Found.",
    };
  }

  if (otherUser.user_friend_code === user.user_friend_code) {
    return {
      message: "Database Error. ...That's Your Own Friend Code.",
    };
  }

  const userOtherUserContact = await gatherContactByUserAndUsername(
    user,
    otherUser.user_username,
  );
  // console.log(userOtherUserContact);

  if (userOtherUserContact === undefined) {
    const generatedUserOtherUserContactID = uuidv4();
    const generatedOtherUserUserContactID = uuidv4();

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

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Contacts -- mirror contact from otherUser to user
          SET 
              contact_mirror_id = ${generatedOtherUserUserContactID},
              contact_updated_at = now()
          WHERE contact_id = ${generatedUserOtherUserContactID}
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

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Contacts -- mirror contact from user to otherUser
          SET 
              contact_mirror_id = ${generatedUserOtherUserContactID},
              contact_updated_at = now()
          WHERE contact_id = ${generatedOtherUserUserContactID}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: DEFAULT_RETRIES });
    } catch (error) {
      return {
        message: "Database Error: Failed to Update Mirror Contact.",
      };
    }

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Contacts -- mirror contact
          SET 
              contact_status_other_profile = 'FIRSTACCESSTHROUGHFIND',
              contact_updated_at = now()
          WHERE contact_id = ${generatedUserOtherUserContactID}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: DEFAULT_RETRIES });
    } catch (error) {
      return {
        message:
          "Database Error: Failed to Update Contact Status Other Profile.",
      };
    }

    // Missing notification on generatedOtherUserUserContactID
    // to confirm to otherUser that user has accessed their profile page
    // on their Notifications page.
    // contact_status_profile (many)

    revalidatePath(`/users/${otherUser.user_username}/profile`);
    redirect(`/users/${otherUser.user_username}/profile`);
  }

  if (userOtherUserContact) {
    noStore();

    try {
      const run = async () => {
        const data = await sql`
          UPDATE Contacts -- mirror contact
          SET 
              contact_status_other_profile = 'REACCESSTHROUGHFIND',
              contact_updated_at = now()
          WHERE contact_id = ${userOtherUserContact.c1_contact_id}
          RETURNING * -- to make sure
        `;
        console.log(data.rows);
      };
      await pRetry(run, { retries: DEFAULT_RETRIES });
    } catch (error) {
      return {
        message:
          "Database Error: Failed to Update Contact Status Other Profile.",
      };
    }

    // Other user ABSOLUTELY DO NOT NEED TO KNOW ABOUT REVISITS.
    // For example, they don't need to know that user came back to
    // their profile to remember their birthday.

    revalidatePath(`/users/${otherUser.user_username}/profile`);
    redirect(`/users/${otherUser.user_username}/profile`);
  }
}

const SignUpUser = UserSchema.pick({
  userUsername: true,
  userAppWideName: true,
  userEmail: true,
  userPassword: true,
  userConfirmPassword: true,
});

export type SignUpUserFormState = {
  errors?: {
    userUsername?: string[] | undefined;
    userAppWideName?: string[] | undefined;
    userEmail?: string[] | undefined;
    userPassword?: string[] | undefined;
    userConfirmPassword?: string[] | undefined;
  };
  message?: string | null;
};

export async function signUpUser(
  prevState: SignUpUserFormState | undefined,
  formData: FormData,
) {
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("username"));
  // console.log(formData.get("appwidename"));
  // console.log(formData.get("email"));
  // console.log(formData.get("password"));
  // console.log(formData.get("confirmpassword"));

  const validatedFields = SignUpUser.safeParse({
    userUsername: formData.get("username"),
    userAppWideName: formData.get("appwidename"),
    userEmail: formData.get("email"),
    userPassword: formData.get("password"),
    userConfirmPassword: formData.get("confirmpassword"),
  });
  // console.log(SignUpUser);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Sign Up User.",
    };
  }

  const {
    userUsername,
    userAppWideName,
    userEmail,
    userPassword,
    userConfirmPassword,
  } = validatedFields.data;
  // console.log(userUsername);
  // console.log(userAppWideName);
  // console.log(userEmail);
  // console.log(userPassword);
  // console.log(userConfirmPassword);

  if (userPassword !== userConfirmPassword) {
    return {
      message:
        "Input Error: The password and the confirm password are not the same.",
    };
  }

  const preExistingUserByUsername = await fetchUserByUsername(userUsername);
  // console.log(preExistingUserByUsername);

  if (preExistingUserByUsername) {
    return {
      message: "Database Error: This username has already been selected.",
    };
  }

  const preExistingUserByEmail = await fetchUserByEmail(userEmail);
  // console.log(preExistingUserByEmail);

  if (preExistingUserByEmail) {
    return {
      message: "Database Error: This email has already been selected.",
    };
  }

  const generatedUserID = uuidv4();
  const generatedFriendCode = uid(12);

  /* IMPORTANT
  This is a demo function to simulate an actual authentication. Therefore, even though I am verifying the password with zod, at this point I won't go any further with a library like bcrypt (which I'll do when I'll code the actual entire authentication/authorization logic). This is why for all new entries, password will just be password.
  */

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

  revalidatePath(`/users/${userUsername}/dashboard`);
  redirect(`/users/${userUsername}/dashboard`);
}

export async function resetUserStatusTitle(user: User) {
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

  revalidatePath(`/users/${user.user_username}/dashboard`);
}

const SignInUser = UserSchema.pick({
  userUsernameOrEmail: true,
  userLoginPassword: true,
});

export type SignInUserFormState = {
  errors?: {
    userUsernameOrEmail?: string[] | undefined;
    userLoginPassword?: string[] | undefined;
  };
  message?: string | null;
};

export async function signInUser(
  prevState: SignInUserFormState | undefined,
  formData: FormData,
) {
  console.log(prevState);
  // console.log(formData);
  // console.log(formData.get("usernameoremail"));
  // console.log(formData.get("loginpassword"));

  const validatedFields = SignInUser.safeParse({
    userUsernameOrEmail: formData.get("usernameoremail"),
    userLoginPassword: formData.get("loginpassword"),
  });
  // console.log(SignInUser);
  // console.log(validatedFields);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Sign In User.",
    };
  }

  const { userUsernameOrEmail, userLoginPassword } = validatedFields.data;
  // console.log(userUsernameOrEmail);
  console.log(userLoginPassword);

  const userByUsernameOrEmail =
    await fetchUserByUserNameOrEmail(userUsernameOrEmail);
  // console.log(userByUsernameOrEmail);

  if (!userByUsernameOrEmail) {
    return {
      message: "Database Error: Sign in failed. Please check your credentials.",
    };
  }

  if (userByUsernameOrEmail) {
    try {
      const run = async () => {
        const data = await sql`
          UPDATE Users
          SET 
              user_status_title = 'WELCOMEBACKTOGREVENTS',
              user_updated_at = now()
          WHERE user_id = ${userByUsernameOrEmail.user_id}
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

  revalidatePath(`/users/${userByUsernameOrEmail.user_username}/dashboard`);
  redirect(`/users/${userByUsernameOrEmail.user_username}/dashboard`);
}

// No signOutUser function since that's entirely auth. In the meantime, it will simply be a PageLink to the Sign In Page.
