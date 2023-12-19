"use client";

import { User } from "@/app/lib/definitions/users";

export function UserAppWideNameModify({ user }: { user: User }) {
  return (
    <>
      <form action="">
        <label htmlFor="user-app-wide-name">
          <p className="mt-2">App-wide name *</p>
        </label>
        <input
          className="mt-2 overflow-x-scroll truncate px-2 text-center"
          type="text"
          id="user-app-wide-name"
          name="userappwidename"
          placeholder={user.user_app_wide_name}
        />
      </form>
    </>
  );
}
