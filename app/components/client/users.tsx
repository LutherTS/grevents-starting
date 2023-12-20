"use client";

import {
  updateUserAppWideName,
  updateUserFriendCode,
  resetUserStatusDashboard,
  UpdateUserAppWideNameFormState,
} from "@/app/lib/actions/users";
import { User } from "@/app/lib/definitions/users";
import { useFormState } from "react-dom";
import { LinkButton, Toast } from "./buttons";

export function UserAppWideNameModify({ user }: { user: User }) {
  const initialState: UpdateUserAppWideNameFormState = {
    errors: {},
    message: null,
  };
  const updateUserAppWideNameWithUser = updateUserAppWideName.bind(null, user);
  const [state, formAction] = useFormState(
    updateUserAppWideNameWithUser,
    initialState,
  );

  return (
    <>
      <form action={formAction}>
        <label htmlFor="user-app-wide-name">
          <p className="mt-2">App-wide name *</p>
        </label>
        <input
          className="mt-2 overflow-x-scroll truncate px-2 text-center text-black"
          type="text"
          id="user-app-wide-name"
          name="userappwidename"
          placeholder={user.user_app_wide_name}
        />
        {state && state.errors?.userAppWideName ? (
          <div id="status-error" aria-live="polite">
            {state.errors.userAppWideName.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
      </form>
    </>
  );
}

export function UserAppWideNameUpdated({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusDashboard(user)}>
        <p className="mb-2 text-green-500">App-wide name updated</p>
      </Toast>
    </>
  );
}

export function UpdateUserFriendCode({ user }: { user: User }) {
  return (
    <>
      <LinkButton action={() => updateUserFriendCode(user)}>
        Generate a new friend code
      </LinkButton>
    </>
  );
}

export function UserFriendCodeUpdated({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusDashboard(user)}>
        <p className="mb-2 text-green-500">Friend code updated</p>
      </Toast>
    </>
  );
}
