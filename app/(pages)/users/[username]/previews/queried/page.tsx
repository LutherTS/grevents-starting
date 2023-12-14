import { fetchUserByUsername } from "@/app/lib/data/users";
import { gatherContactByUserAndUsername } from "@/app/lib/data/contacts";
import { notFound } from "next/navigation";
// import { ManyContacts } from "@/app/components/server/contacts"; // No longer concording with the expected user experience.
import {
  ManyRelComboFriendCriteria,
  ManyRelComboIrlCriteria,
  ManyUserSharedToContactCustomAnswers,
} from "@/app/components/server/answers";
import { Suspense } from "react";
import { ManyRelationCombinations } from "@/app/components/agnostic/lists";
import { relationCombinations } from "@/app/lib/utils/lists";
import { PageLink } from "@/app/components/agnostic/links";

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
  const gatheredContact = await gatherContactByUserAndUsername(user, userLast);

  if (
    relCombo === "" &&
    gatheredContact &&
    gatheredContact.c1_kind === "NONE" &&
    gatheredContact.c2_kind === "NONE" &&
    gatheredContact.c1_blocking === false &&
    gatheredContact.c2_blocking === false
  ) {
    relCombo = "none";
  }
  if (
    relCombo === "" &&
    gatheredContact &&
    gatheredContact.c1_kind === "FRIEND" &&
    gatheredContact.c2_kind === "FRIEND" &&
    gatheredContact.c1_blocking === false &&
    gatheredContact.c2_blocking === false
  ) {
    relCombo = "friend";
  }
  if (
    relCombo === "" &&
    gatheredContact &&
    gatheredContact.c1_kind === "IRL" &&
    gatheredContact.c2_kind === "IRL" &&
    gatheredContact.c1_blocking === false &&
    gatheredContact.c2_blocking === false
  ) {
    relCombo = "irl";
  }
  if (
    relCombo === "" &&
    gatheredContact &&
    gatheredContact.c1_kind === "NONE" &&
    gatheredContact.c2_kind === "NONE" &&
    gatheredContact.c1_blocking === true &&
    gatheredContact.c2_blocking === false
  ) {
    relCombo = "i-am-blocking";
  }
  if (
    relCombo === "" &&
    gatheredContact &&
    gatheredContact.c1_kind === "NONE" &&
    gatheredContact.c2_kind === "NONE" &&
    gatheredContact.c1_blocking === false &&
    gatheredContact.c2_blocking === true
  ) {
    relCombo = "has-me-blocked";
  }
  if (
    relCombo === "" &&
    gatheredContact &&
    gatheredContact.c1_kind === "NONE" &&
    gatheredContact.c2_kind === "NONE" &&
    gatheredContact.c1_blocking === false &&
    gatheredContact.c2_blocking === false
  ) {
    relCombo = "blocking-blocked";
  }

  if (!user) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        {/* <h1>Welcome to {username}&apos;s Queried Previews.</h1>
        <PageLink
          href={`/users/${username}/dashboard`}
          name={`back to dashboard`}
        />
        <p className="mt-2">
          Select a user you&apos;re acquainted with. (userlast in searchParams.)
        </p>
        {userLast !== "" && <p className="mt-2">userlast: {userLast}</p>}
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
        )} */}
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
          {gatheredContact && relCombo === "friend" && (
            <ManyRelComboFriendCriteria user={user} />
          )}
          {gatheredContact && relCombo === "irl" && (
            <ManyRelComboIrlCriteria user={user} />
          )}
          {gatheredContact && (relCombo === "friend" || relCombo === "irl") && (
            <ManyUserSharedToContactCustomAnswers
              user={user}
              contact={gatheredContact}
            />
          )}
        </Suspense>
        <PageLink href={`/users/${username}/previews`} name={"To Previews"} />
      </div>
    </main>
  );
}
