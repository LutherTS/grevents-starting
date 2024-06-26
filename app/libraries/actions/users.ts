"use server";

import { z } from "zod";
import { User } from "../definitions/users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import uid from "uid2";
import {
  fetchUserByEmail,
  fetchUserByUserNameOrEmail,
  fetchUserByUsername,
  findUserByFriendCode,
} from "../data/users";
import { gatherContactByUserAndUsername } from "../data/contacts";
import { v4 as uuidv4 } from "uuid";
import {
  changeCreateUser,
  changeResetUserStatusDashboard,
  changeResetUserStatusPersonalInfo,
  changeResetUserStatusTitle,
  changeSetUserStateDeactivated,
  changeSetUserStateReactivated,
  changeSetUserStatusTitle,
  changeUpdateUserAppWideName,
  changeUpdateUserFriendCode,
} from "../changes/users";
import {
  changeCreateContactAndMirrorContact,
  changeSetContactMirrorContact,
  changeSetContactStatusOtherProfile,
} from "../changes/contacts";
import {
  EMAIL_ADDRESS_QUESTION_ID,
  findQuestionByQuestionID,
} from "../data/questions";
import { changeCreateNativeUserQuestion } from "../changes/userquestions";
import { changeCreateAnswer } from "../changes/answers";

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
    })
    .regex(/^[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*$/gm, {
      message: "Your username should be slug-friendly.",
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
  const validatedFields = UpdateUserAppWideName.safeParse({
    userAppWideName: formData.get("userappwidename"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update User App-Wide Name.",
    };
  }

  const { userAppWideName } = validatedFields.data;

  await changeUpdateUserAppWideName(userAppWideName, user); // and that first change worked

  revalidatePath(`/users/${user.user_username}/dashboard`);
  redirect(`/users/${user.user_username}/dashboard`);
}

export async function resetUserStatusDashboard(user: User) {
  await changeResetUserStatusDashboard(user);

  revalidatePath(`/users/${user.user_username}/dashboard`);
}

export async function updateUserFriendCode(user: User) {
  const generatedFriendCode = uid(12);

  await changeUpdateUserFriendCode(user, generatedFriendCode);

  revalidatePath(`/users/${user.user_username}/dashboard`);
  revalidatePath(`/users/${user.user_username}/personal-info`);
  redirect(`/users/${user.user_username}/dashboard`);
}

export async function resetUserStatusPersonalInfo(user: User) {
  await changeResetUserStatusPersonalInfo(user);

  revalidatePath(`/users/${user.user_username}/personal-info`);
  revalidatePath(`/users/${user.user_username}/personal-info/standardized`);
  revalidatePath(`/users/${user.user_username}/personal-info/customized`);
}

export async function deactivateUser(user: User) {
  await changeSetUserStateDeactivated(user);

  revalidatePath(`/users/${user.user_username}/dashboard`);
  revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${user.user_username}/modify-app-wide-name`);
  redirect(`/users/${user.user_username}/dashboard`);
}

export async function reactivateUser(user: User) {
  await changeSetUserStateReactivated(user);

  revalidatePath(`/users/${user.user_username}/dashboard`);
  revalidatePath(`/users/${user.user_username}/profile`);
  revalidatePath(`/users/${user.user_username}/modify-app-wide-name`);
  redirect(`/users/${user.user_username}/dashboard`);
}

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
  const validatedFields = CreateOrFindContactsByFriendCode.safeParse({
    otherUserFriendCode: formData.get("friendcode"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message:
        "Missing Fields. Failed to Create or Find Contacts by Friend Code.",
    };
  }

  const { otherUserFriendCode } = validatedFields.data;

  const otherUser = await findUserByFriendCode(otherUserFriendCode);

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

  if (userOtherUserContact === undefined) {
    const generatedUserOtherUserContactID = uuidv4();
    const generatedOtherUserUserContactID = uuidv4();

    await changeCreateContactAndMirrorContact(
      user,
      otherUser,
      generatedUserOtherUserContactID,
      generatedOtherUserUserContactID,
    );
    await changeSetContactMirrorContact(
      generatedOtherUserUserContactID,
      generatedUserOtherUserContactID,
    );
    await changeSetContactMirrorContact(
      generatedUserOtherUserContactID,
      generatedOtherUserUserContactID,
    );

    await changeSetContactStatusOtherProfile(
      generatedUserOtherUserContactID,
      "FIRSTACCESSTHROUGHFIND",
    );

    revalidatePath(`/users/${otherUser.user_username}/profile`);
    redirect(`/users/${otherUser.user_username}/profile`);
  }

  if (userOtherUserContact) {
    await changeSetContactStatusOtherProfile(
      userOtherUserContact.c1_contact_id,
      "REACCESSTHROUGHFIND",
    );

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
  const validatedFields = SignUpUser.safeParse({
    userUsername: formData.get("username"),
    userAppWideName: formData.get("appwidename"),
    userEmail: formData.get("email"),
    userPassword: formData.get("password"),
    userConfirmPassword: formData.get("confirmpassword"),
  });

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

  if (userPassword !== userConfirmPassword) {
    return {
      message:
        "Input Error: The password and the confirm password are not the same.",
    };
  }

  const preExistingUserByUsername = await fetchUserByUsername(userUsername);

  if (preExistingUserByUsername) {
    return {
      message: "Database Error: This username has already been selected.",
    };
  }

  const preExistingUserByEmail = await fetchUserByEmail(userEmail);

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

  await changeCreateUser(
    generatedUserID,
    userUsername,
    userEmail,
    userAppWideName,
    generatedFriendCode,
  );

  //

  const user = await fetchUserByEmail(userEmail);

  const question = await findQuestionByQuestionID(EMAIL_ADDRESS_QUESTION_ID);

  const generatedUserQuestionID = uuidv4();

  await changeCreateNativeUserQuestion(user, question, generatedUserQuestionID);

  const generatedAnswerID = uuidv4();

  await changeCreateAnswer(
    user,
    userEmail,
    generatedAnswerID,
    generatedUserQuestionID,
  );

  //

  revalidatePath(`/users/${userUsername}/dashboard`);
  redirect(`/users/${userUsername}/dashboard`);
}

export async function resetUserStatusTitle(user: User) {
  await changeResetUserStatusTitle(user);

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
  const validatedFields = SignInUser.safeParse({
    userUsernameOrEmail: formData.get("usernameoremail"),
    userLoginPassword: formData.get("loginpassword"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Sign In User.",
    };
  }

  const { userUsernameOrEmail, userLoginPassword } = validatedFields.data;

  const userByUsernameOrEmail =
    await fetchUserByUserNameOrEmail(userUsernameOrEmail);

  if (!userByUsernameOrEmail) {
    return {
      message: "Database Error: Sign in failed. Please check your credentials.",
    };
  }

  if (userByUsernameOrEmail) {
    await changeSetUserStatusTitle(
      userByUsernameOrEmail.user_id,
      "WELCOMEBACKTOGREVENTS",
    );
  }

  revalidatePath(`/users/${userByUsernameOrEmail.user_username}/dashboard`);
  redirect(`/users/${userByUsernameOrEmail.user_username}/dashboard`);
}

// No signOutUser function since that's meant to be entirely auth. In the meantime, it will simply be a PageLink to the Sign In Page.
