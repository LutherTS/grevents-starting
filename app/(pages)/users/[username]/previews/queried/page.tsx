// import { fetchUserByUsername } from "@/app/lib/data/users";
// import { gatherContactByUserAndUsername } from "@/app/lib/data/contacts";
// import { notFound } from "next/navigation";
// // import { ManyContacts } from "@/app/components/server/contacts";
// import {
//   ManyRelComboFriendCriteria,
//   ManyRelComboIrlCriteria,
//   ManyUserSharedToContactCustomAnswers,
// } from "@/app/components/server/answers";
// import { Suspense } from "react";
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
  // const user = await fetchUserByUsername(username);
  // const gatheredContact = await gatherContactByUserAndUsername(user, userLast);
  // if (
  //   relCombo === "" &&
  //   gatheredContact &&
  //   gatheredContact.c1_kind === "FRIEND" &&
  //   gatheredContact.c2_kind === "FRIEND" &&
  //   gatheredContact.c1_blocking === false &&
  //   gatheredContact.c2_blocking === false
  // ) {
  //   relCombo = "friend";
  // }
  // if (
  //   relCombo === "" &&
  //   gatheredContact &&
  //   gatheredContact.c1_kind === "IRL" &&
  //   gatheredContact.c2_kind === "IRL" &&
  //   gatheredContact.c1_blocking === false &&
  //   gatheredContact.c2_blocking === false
  // ) {
  //   relCombo = "irl";
  // }

  // if (!user) {
  //   notFound();
  // }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <h1>Welcome to {username}&apos;s Queried Previews.</h1>
        <p className="pt-2">
          Select a user you're acquainted with. (userlast in searchParams.)
        </p>
        {userLast !== "" && <p className="pt-2">userlast: {userLast}</p>}
        <ManyRelationCombinations />
        {relCombo !== "" && (
          <>
            {relationCombinations.includes(relCombo) ? (
              <p className="pt-2">relcombo: {relCombo}</p>
            ) : (
              <p className="pt-2">
                There is no such relation combinaison defined.
              </p>
            )}
          </>
        )}
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Queried Previews.
        </h1>
        <p className="pt-2">
          Type the username of a user you are acquainted with.
        </p>
        {userLast !== "" && (
          <>
            {gatheredContact ? (
              <p className="pt-2">userlast: {userLast}</p>
            ) : (
              <p className="pt-2">You aren't acquainted with any such user.</p>
            )}
          </>
        )}
        <ManyRelationCombinations />
        {relCombo !== "" && (
          <>
            {relationCombinations.includes(relCombo) ? (
              <p className="pt-2">relcombo: {relCombo}</p>
            ) : (
              <p className="pt-2">
                There is no such relation combinaison defined.
              </p>
            )}
          </>
        )}
        <Suspense
          fallback={
            <>
              <p className="pt-2">Loading...</p>
            </>
          }
        >
          {relCombo === "friend" && <ManyRelComboFriendCriteria user={user} />}
          {relCombo === "irl" && <ManyRelComboIrlCriteria user={user} />}
          {gatheredContact && (relCombo === "friend" || relCombo === "irl") && (
            <ManyUserSharedToContactCustomAnswers
              user={user}
              contact={gatheredContact}
            />
          )}
        </Suspense> */}
        <PageLink href={`/users/${username}/previews`} name={"To Previews"} />
      </div>
    </main>
  );
}
