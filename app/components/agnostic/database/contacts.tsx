import {
  Block,
  FoundContact,
  Friend,
} from "@/app/libraries/definitions/contacts";
import { UserQuestion } from "@/app/libraries/definitions/userquestions";
import { ButtonShareUserQuestionFriendForm } from "../../client/forms";
import { ContactLinkWithChildren } from "../links";

export function OneFriend({ friend }: { friend: Friend }) {
  return (
    <>
      {/* <p className="mt-2">
        <Link
          href={`/users/${friend.user_username}/profile`}
          className="font-semibold text-blue-500 hover:text-blue-400 dark:hover:text-blue-600"
        >
          {friend.user_app_wide_name}
        </Link>{" "}
        / {friend.user_username}
      </p> */}
      <p className="mt-2">
        <ContactLinkWithChildren
          href={`/users/${friend.user_username}/profile`}
        >
          {friend.user_app_wide_name}
        </ContactLinkWithChildren>{" "}
        / {friend.user_username}
      </p>
    </>
  );
}

export function OneFriendAddable({
  friend,
  userQuestion,
}: {
  friend: Friend;
  userQuestion: UserQuestion;
}) {
  return (
    <>
      <div className="mt-2 flex justify-center">
        <ButtonShareUserQuestionFriendForm
          contact={friend}
          userQuestion={userQuestion}
        />
        <p>
          <span className="font-semibold">{friend.user_app_wide_name}</span> /{" "}
          {friend.user_username}
        </p>
      </div>
    </>
  );
}

export function OneBlock({ block }: { block: Block }) {
  return (
    <>
      <p className="mt-2">
        <ContactLinkWithChildren href={`/users/${block.user_username}/profile`}>
          {block.user_app_wide_name}
        </ContactLinkWithChildren>{" "}
        / {block.user_username}
      </p>
    </>
  );
}

export function OneSentToContact({ contact }: { contact: FoundContact }) {
  return (
    <>
      <p className="mt-2">
        <ContactLinkWithChildren
          href={`/users/${contact.u2_user_username}/profile`}
        >
          {contact.u2_user_app_wide_name}
        </ContactLinkWithChildren>{" "}
        / {contact.u2_user_username}
      </p>
    </>
  );
}

export function OneSentFromContact({ contact }: { contact: FoundContact }) {
  return (
    <>
      <p className="mt-2">
        <ContactLinkWithChildren
          href={`/users/${contact.u1_user_username}/profile`}
        >
          {contact.u1_user_app_wide_name}
        </ContactLinkWithChildren>{" "}
        / {contact.u1_user_username}
      </p>
    </>
  );
}
