import { fetchUserByUsername } from "@/app/lib/data/users";
import { notFound } from "next/navigation";
import {
  PageLink,
  PageLinkWithChildren,
} from "@/app/components/agnostic/links";

import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: {
    username: string;
  };
}): Promise<Metadata> {
  const username = params.username;

  return {
    title: `${username}'s Dashboard`,
  };
}

export default async function DashboardPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        {/* <h1>Welcome to {username}&apos;s Dashboard.</h1>
        <PageLinkWithChildren
          href={`/users/${username}/dashboard/modify-app-wide-name`}
        >
          <p>App-wide name *</p>
        </PageLinkWithChildren>
        <PageLink
          href={`/`}
          name={`Return home`}
        /> */}
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Dashboard.
        </h1>
        <PageLinkWithChildren
          href={`/users/${username}/dashboard/modify-app-wide-name`}
        >
          <p>App-wide name *</p>
        </PageLinkWithChildren>
        <p className="mt-2">{user.user_app_wide_name}</p>
        <PageLink
          href={`/users/${username}/personal-info`}
          name={`More personal info`}
        />
        <PageLink href={`/users/${username}/friends`} name={`My friends`} />
        <PageLink href={`/users/${username}/requests`} name={`My requests`} />
        <PageLink
          href={`/users/${username}/notifications`}
          name={`My notifications`}
        />
        <PageLink href={`/`} name={`Return home`} />
      </div>
    </main>
  );
}
