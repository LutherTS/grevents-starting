import { fetchUserByUsername } from "@/app/lib/data/users";
import { findContactByUserAndSession } from "@/app/lib/data/contacts";
import { notFound } from "next/navigation";
import { User } from "@/app/lib/definitions/users";
import { PageLink } from "@/app/components/agnostic/links";
import {
  RelationCombinationNone,
  RelationCombinationFriendCustom,
  RelationCombinationIrlCustom,
  RelationCombinationIAmBlocking,
  RelationCombinationHasMeBlocked,
  RelationCombinationBlockingBlocked,
} from "@/app/components/agnostic/relcombos";
import {
  RelationCombination,
  defineFoundRelCombo,
} from "@/app/lib/utils/relcombos";

export default async function UserPage({
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

  // const session: { [K in "user"]: User } = {
  //   // Alice
  //   user: {
  //     user_id: "e17bc7f7-b93f-4915-9f72-83d055c66e77",
  //     user_state: "LIVE",
  //     user_status_title: "NONE",
  //     user_status_dashboard: "NONE",
  //     user_status_personal_info: "NONE",
  //     user_username: "Alice-chan",
  //     user_app_wide_name: "Alice",
  //     user_friend_code: "k7mdsfwq2e9g",
  //     user_has_temporary_password: false,
  //     user_created_at: "2023-12-09T06:00:33.323Z",
  //     user_updated_at: "2023-12-09T06:00:33.323Z",
  //   },
  // };

  // const session = null;

  const username = params.username;
  const user = await fetchUserByUsername(username);

  if (!user) {
    notFound();
  }

  const foundContact = await findContactByUserAndSession(user, session);

  let relCombo: RelationCombination | "" = "";

  if (foundContact) {
    relCombo = defineFoundRelCombo(foundContact);
  }

  // relCombo = "none";
  // relCombo = "friend";
  // relCombo = "irl";
  // relCombo = "i-am-blocking";
  // relCombo = "has-me-blocked";
  // relCombo = "blocking-blocked";

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        {session ? (
          <>
            <h1>Welcome to {user.user_app_wide_name}&apos;s Page.</h1>
            <PageLink
              // @ts-ignore // for type never during session object testing
              href={`/users/${session.user.user_username}/dashboard`}
              name={`back to dashboard`}
            />
            {/* @ts-ignore // for type never during session object testing */}
            {username === session.user.user_username && (
              <p className="mt-2">
                This is your profile page, the one where others will be able to
                see the data you&apos;ve shared with them on a single URL, and
                eventually on more children paths as the application develops.
              </p>
            )}
            {/* @ts-ignore // for type never during session object testing */}
            {relCombo === "" && username !== session.user.user_username && (
              <p className="mt-2">
                You have no contact with {user.user_app_wide_name}. In the full
                application, new contacts between you and{" "}
                {user.user_app_wide_name} will be made upon this first visit,
                corresponding to the starting relation combinaison of
                &quot;none.&quot;
              </p>
            )}
            {/* @ts-ignore // for intentional during relCombo testing */}
            {relCombo === "none" && <RelationCombinationNone />}
            {/* @ts-ignore // for intentional during relCombo testing */}
            {relCombo === "friend" && foundContact && (
              <>
                <RelationCombinationFriendCustom
                  user={user}
                  contact={foundContact}
                />
              </>
            )}
            {/* @ts-ignore // for intentional during relCombo testing */}
            {relCombo === "irl" && foundContact && (
              <>
                <RelationCombinationIrlCustom
                  user={user}
                  contact={foundContact}
                />
              </>
            )}
            {/* @ts-ignore // for intentional during relCombo testing */}
            {relCombo === "i-am-blocking" && (
              <RelationCombinationIAmBlocking user={user} />
            )}
            {/* @ts-ignore // for intentional during relCombo testing */}
            {relCombo === "has-me-blocked" && (
              <RelationCombinationHasMeBlocked user={user} />
            )}
            {/* @ts-ignore // for intentional during relCombo testing */}
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
      </div>
    </main>
  );
}
