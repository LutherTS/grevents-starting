"use client";

import { resetUserStatusDashboard } from "@/app/lib/actions/users";
import { User } from "@/app/lib/definitions/users";

export function Toast({
  action,
  children,
}: {
  action: (...rest: any) => any;
  children: React.ReactNode;
}) {
  return (
    <>
      <button onClick={action}>{children}</button>
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

export function UserFriendCodeUpdated({ user }: { user: User }) {
  return (
    <>
      <Toast action={() => resetUserStatusDashboard(user)}>
        <p className="mb-2 text-green-500">Friend code updated</p>
      </Toast>
    </>
  );
}
