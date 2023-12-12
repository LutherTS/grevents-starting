import { fetchUserByUsername } from "@/app/lib/data/users";
import {
  ManyPinnedNotAndIrlCriteria,
  ManyUserUnpinnedNativeNotIrlCriteria,
  ManyUserUnpinnedPseudonativeNotIrlCriteria,
  ManyUserUnpinnedNativeIrlCriteria,
  ManyUserUnpinnedPseudonativeIrlCriteria,
} from "@/app/components/server/answers";
import { notFound } from "next/navigation";
import { PageLink } from "@/app/components/agnostic/links";
import { Suspense } from "react";

export default async function IrlPreviewPage({
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
        {/* <h1>Welcome to {username}&apos;s Irl Preview.</h1>
        <p className="pt-2">Downgrade friendship from irl</p>
        <p className="pt-2">Unfriend</p> */}
        <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Irl Preview.
        </h1>
        <Suspense
          fallback={
            <>
              <p className="pt-2">Loading...</p>
            </>
          }
        >
          <ManyPinnedNotAndIrlCriteria user={user} />
          <ManyUserUnpinnedNativeNotIrlCriteria user={user} />
          <ManyUserUnpinnedPseudonativeNotIrlCriteria user={user} />
          <ManyUserUnpinnedNativeIrlCriteria user={user} />
          <ManyUserUnpinnedPseudonativeIrlCriteria user={user} />
        </Suspense>
        <p className="pt-2">Downgrade friendship from irl</p>
        <p className="pt-2">Unfriend</p>
        <PageLink href={`/users/${username}/previews`} name={"To Previews"} />
      </div>
    </main>
  );
}
