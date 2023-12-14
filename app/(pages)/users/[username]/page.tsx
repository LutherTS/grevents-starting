import { fetchUserByUsername } from "@/app/lib/data/users";
import { findContactByUserAndSession } from "@/app/lib/data/contacts";
import { notFound } from "next/navigation";
import { User } from "@/app/lib/definitions/users";
import { PageLink } from "@/app/components/agnostic/links";
import {
  RelationCombinationNone,
  RelationCombinationFriend,
  RelationCombinationIrl,
  RelationCombinationIAmBlocking,
  RelationCombinationHasMeBlocked,
  RelationCombinationBlockingBlocked,
} from "@/app/components/agnostic/relcombos";

export default async function UserPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  // const session: { [K in "user"]: User } = {
  //   user: {
  //     user_id: "2640aaf6-20b5-497c-b980-fbee374830c2",
  //     user_state: "LIVE",
  //     user_status_title: "NONE",
  //     user_status_dashboard: "NONE",
  //     user_status_personal_info: "NONE",
  //     user_username: "LePapier",
  //     user_app_wide_name: "“me”",
  //     user_friend_code: "fsa7hyt3g58x",
  //     user_has_temporary_password: false,
  //     user_created_at: "2023-12-09T05:59:58.074Z",
  //     user_updated_at: "2023-12-09T05:59:58.074Z",
  //   },
  // };

  const session: { [K in "user"]: User } = {
    user: {
      user_id: "e17bc7f7-b93f-4915-9f72-83d055c66e77",
      user_state: "LIVE",
      user_status_title: "NONE",
      user_status_dashboard: "NONE",
      user_status_personal_info: "NONE",
      user_username: "Alice-chan",
      user_app_wide_name: "Alice",
      user_friend_code: "k7mdsfwq2e9g",
      user_has_temporary_password: false,
      user_created_at: "2023-12-09T06:00:33.323Z",
      user_updated_at: "2023-12-09T06:00:33.323Z",
    },
  };

  // const session = null;

  const username = params.username;
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  const foundContact = await findContactByUserAndSession(user, session);

  let relCombo = "";

  if (
    foundContact &&
    foundContact.c1_kind === "NONE" &&
    foundContact.c2_kind === "NONE" &&
    foundContact.c1_blocking === false &&
    foundContact.c2_blocking === false
  ) {
    relCombo = "none";
  }
  if (
    foundContact &&
    foundContact.c1_kind === "FRIEND" &&
    foundContact.c2_kind === "FRIEND" &&
    foundContact.c1_blocking === false &&
    foundContact.c2_blocking === false
  ) {
    relCombo = "friend";
  }
  if (
    foundContact &&
    foundContact.c1_kind === "IRL" &&
    foundContact.c2_kind === "IRL" &&
    foundContact.c1_blocking === false &&
    foundContact.c2_blocking === false
  ) {
    relCombo = "irl";
  }
  if (
    foundContact &&
    foundContact.c1_kind === "NONE" &&
    foundContact.c2_kind === "NONE" &&
    foundContact.c1_blocking === true &&
    foundContact.c2_blocking === false
  ) {
    relCombo = "i-am-blocking";
  }
  if (
    foundContact &&
    foundContact.c1_kind === "NONE" &&
    foundContact.c2_kind === "NONE" &&
    foundContact.c1_blocking === false &&
    foundContact.c2_blocking === true
  ) {
    relCombo = "has-me-blocked";
  }
  if (
    foundContact &&
    foundContact.c1_kind === "NONE" &&
    foundContact.c2_kind === "NONE" &&
    foundContact.c1_blocking === false &&
    foundContact.c2_blocking === false
  ) {
    relCombo = "blocking-blocked";
  }

  relCombo = "blocking-blocked";

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        {session ? (
          <>
            <h1>Welcome to {username}&apos;s Page.</h1>
            <PageLink
              // @ts-ignore // for type never during session object testing
              href={`/users/${session.user.user_username}/dashboard`}
              name={`back to dashboard`}
            />
            {relCombo === "none" && <RelationCombinationNone />}
            {relCombo === "friend" && <RelationCombinationFriend user={user} />}
            {relCombo === "irl" && <RelationCombinationIrl user={user} />}
            {relCombo === "i-am-blocking" && (
              <RelationCombinationIAmBlocking user={user} />
            )}
            {relCombo === "has-me-blocked" && (
              <RelationCombinationHasMeBlocked user={user} />
            )}
            {relCombo === "blocking-blocked" && (
              <RelationCombinationBlockingBlocked user={user} />
            )}
          </>
        ) : (
          <>
            <h1>
              You have no session. You shall eventually be redirected to the
              sign-in page or the home page.
            </h1>
          </>
        )}
        {/* <h1 className="font-semibold">
          Welcome to {user.user_app_wide_name}&apos;s Page.
        </h1>
        <PageLink
          href={`/users/${session.user.user_username}/dashboard`}
          name={`back to dashboard`}
        /> */}
      </div>
    </main>
  );
}
