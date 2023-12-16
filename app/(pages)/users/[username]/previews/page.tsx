import { fetchUserByUsername } from "@/app/lib/data/users";
import { notFound } from "next/navigation";
import { H1 } from "@/app/components/agnostic/tags";
import { BackToDashboardLink, PageLink } from "@/app/components/agnostic/links";
import { User } from "@/app/lib/definitions/users";

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
    title: `${username}'s Previews`,
  };
}

export default async function PreviewsPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const session: { [K in "user"]: User } = {
    // “me”
    user: {
      user_id: "2640aaf6-20b5-497c-b980-fbee374830c2",
      user_state: "LIVE",
      user_status_title: "NONE",
      user_status_dashboard: "NONE",
      user_status_personal_info: "NONE",
      user_username: "LePapier",
      user_app_wide_name: "“me”",
      user_friend_code: "fsa7hyt3g58x",
      user_has_temporary_password: false,
      user_created_at: "2023-12-09T05:59:58.074Z",
      user_updated_at: "2023-12-09T05:59:58.074Z",
    },
  };

  const username = params.username;
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <H1>Welcome to {user.user_app_wide_name}&apos;s Previews.</H1>
        <BackToDashboardLink session={session} />
        <PageLink
          href={`/users/${username}/previews/none`}
          name={`To "none" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/friend`}
          name={`To "friend" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/irl`}
          name={`To "irl" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/i-am-blocking`}
          name={`To "i-am-blocking" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/has-me-blocked`}
          name={`To "has-me-blocked" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/blocking-blocked`}
          name={`To "blocking-blocked" preview`}
        />
        <PageLink
          href={`/users/${username}/previews/queried`}
          name={`To queried previews`}
        />
        <PageLink
          href={`/users/${username}/friends/find`}
          name={`Search for contacts`}
        />
      </div>
    </main>
  );
}
