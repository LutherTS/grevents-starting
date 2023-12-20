"use client";

import { updateUserFriendCode } from "@/app/lib/actions/users";
import { User } from "@/app/lib/definitions/users";

export function LinkButton({
  action,
  children,
}: {
  action?: (...rest: any) => any;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        className="mt-2 inline-block text-blue-500 hover:text-blue-400 dark:hover:text-blue-600"
        onClick={action}
      >
        {children}
      </button>
    </>
  );
}

export function UserFriendCodeUpdate({ user }: { user: User }) {
  return (
    <>
      <LinkButton action={() => updateUserFriendCode(user)}>
        Generate a new friend code
      </LinkButton>
    </>
  );
}
