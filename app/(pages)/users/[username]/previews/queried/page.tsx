import { fetchUserByUsername } from "@/app/lib/data/users";
import { notFound } from "next/navigation";
import { ManyContacts } from "@/app/components/server/contacts";
import { ManyRelationCombinations } from "@/app/components/agnostic/lists";
import {
  ManyRelComboFriendCriteria,
  ManyRelComboIrlCriteria,
} from "@/app/components/server/answers";
import { Suspense } from "react";
import { PageLink } from "@/app/components/agnostic/links";

export default async function NonePreviewPage({
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
  const relCombo = searchParams?.relcombo || "";
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        {/* <h1>Welcome to {username}&apos;s Queried Previews.</h1>
        <p className="pt-2">
          Select a user you're acquainted with. (userlast in searchParams.)
        </p>
        {userLast !== "" && <p className="pt-2">userlast: {userLast}</p>}
        <ManyRelationCombinations />
        {relCombo !== "" && <p className="pt-2">relcombo: {relCombo}</p>} */}
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Queried Previews.
        </h1>
        <ManyContacts user={user} />
        {userLast !== "" && <p className="pt-2">userlast: {userLast}</p>}
        <ManyRelationCombinations />
        {relCombo !== "" && <p className="pt-2">relcombo: {relCombo}</p>}
        <Suspense
          fallback={
            <>
              <p className="pt-2">Loading...</p>
            </>
          }
        >
          {relCombo === "friend" && <ManyRelComboFriendCriteria user={user} />}
          {relCombo === "irl" && <ManyRelComboIrlCriteria user={user} />}
        </Suspense>
        <PageLink href={`/users/${username}/previews`} name={"To Previews"} />
      </div>
    </main>
  );
}
