import { fetchUserByUsername } from "@/app/lib/data/users";
import { notFound } from "next/navigation";
import { RelationCombinationHasMeBlocked } from "@/app/components/agnostic/relcombos";
import { PageLink } from "@/app/components/agnostic/links";

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
    title: `${username}'s Has-Me-Blocked Preview`,
  };
}

export default async function BlockedPreviewPage({
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
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Has-Me-Blocked Preview.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <RelationCombinationHasMeBlocked user={user} />
        <PageLink href={`/users/${username}/previews`} name={"To Previews"} />
      </div>
    </main>
  );
}
