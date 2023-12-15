import { fetchUserByUsername } from "@/app/lib/data/users";
import { gatherContactByUserAndUsername } from "@/app/lib/data/contacts";
import { notFound } from "next/navigation";
// import { ManyContacts } from "@/app/components/server/contacts"; // No longer concording with the expected user experience.
import { Suspense } from "react";
import { ManyRelationCombinations } from "@/app/components/agnostic/lists";
import {
  defineGatheredRelCombo,
  relationCombinations,
} from "@/app/lib/utils/relcombos";
import { PageLink } from "@/app/components/agnostic/links";
import {
  RelationCombinationNone,
  RelationCombinationFriendCustom,
  RelationCombinationIrlCustom,
  RelationCombinationIAmBlocking,
  RelationCombinationHasMeBlocked,
  RelationCombinationBlockingBlocked,
} from "@/app/components/agnostic/relcombos";

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
    title: `${username}'s Queried Previews`,
  };
}

export default async function QueriedPreviewPage({
  params,
  searchParams,
}: {
  params: {
    username: string;
  };
  searchParams: {
    userlast?: string;
    relcombo?: string;
  };
}) {
  const username = params.username;
  const userLast = searchParams?.userlast || "";
  let relCombo = searchParams?.relcombo || "";

  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  const gatheredContact = await gatherContactByUserAndUsername(user, userLast);

  if (gatheredContact !== undefined) {
    relCombo = defineGatheredRelCombo(relCombo, gatheredContact);
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Queried Previews.
        </h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <p className="mt-2">
          Type the username of a user you are acquainted with.
        </p>
        {userLast !== "" && (
          <>
            {gatheredContact ? (
              <p className="mt-2">userlast: {userLast}</p>
            ) : (
              <p className="mt-2">
                You aren&apos;t acquainted with any such other user.
              </p>
            )}
          </>
        )}
        <ManyRelationCombinations />
        {relCombo !== "" && (
          <>
            {relationCombinations.includes(relCombo) ? (
              <p className="mt-2">relcombo: {relCombo}</p>
            ) : (
              <p className="mt-2">
                There is no such relation combinaison defined.
              </p>
            )}
          </>
        )}
        <Suspense
          fallback={
            <>
              <p className="mt-2">Loading...</p>
            </>
          }
        >
          {gatheredContact && relCombo === "none" && (
            <RelationCombinationNone />
          )}
          {gatheredContact && relCombo === "friend" && (
            <>
              <RelationCombinationFriendCustom
                user={user}
                contact={gatheredContact}
              />
            </>
          )}
          {gatheredContact && relCombo === "irl" && (
            <>
              <RelationCombinationIrlCustom
                user={user}
                contact={gatheredContact}
              />
            </>
          )}
          {gatheredContact && relCombo === "i-am-blocking" && (
            <RelationCombinationIAmBlocking user={user} />
          )}
          {gatheredContact && relCombo === "has-me-blocked" && (
            <RelationCombinationHasMeBlocked user={user} />
          )}
          {gatheredContact && relCombo === "blocking-blocked" && (
            <RelationCombinationBlockingBlocked user={user} />
          )}
        </Suspense>
        <PageLink href={`/users/${username}/previews`} name={"To Previews"} />
      </div>
    </main>
  );
}
