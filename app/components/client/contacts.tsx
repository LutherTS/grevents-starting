"use client";

import {
  Block,
  FoundContact,
  Friend,
} from "@/app/libraries/definitions/contacts";
import { UserQuestion } from "@/app/libraries/definitions/userquestions";
import _ from "lodash";
import { useState } from "react";
import {
  OneBlock,
  OneFriend,
  OneFriendAddable,
  OneSentFromContact,
  OneSentToContact,
} from "../agnostic/contacts";
import { OnClickLinkButton } from "./buttons";

// definitely could use some refactoring here

export function ManyPaginatedFriendsAddable({
  userQuestion,
  userFriends,
}: {
  userQuestion: UserQuestion;
  userFriends: Friend[];
}) {
  const chunkedUserFriends = _.chunk(userFriends, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedUserFriends[position].map((userFriend) => {
          return (
            <li key={userFriend.contact_id}>
              <OneFriendAddable
                friend={userFriend}
                userQuestion={userQuestion}
              />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedUserFriends.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

// all below to be tested
// but non-breaking in current 0 & <= 4 cases

export function ManyPaginatedNotIrlFriends({
  userNotIrlFriends,
}: {
  userNotIrlFriends: Friend[];
}) {
  const chunkedUserNotIrlFriends = _.chunk(userNotIrlFriends, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedUserNotIrlFriends[position].map((userNotIrlFriend) => {
          return (
            <li key={userNotIrlFriend.contact_id}>
              <OneFriend friend={userNotIrlFriend} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedUserNotIrlFriends.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedIrlFriends({
  userIrlFriends,
}: {
  userIrlFriends: Friend[];
}) {
  const chunkedUserIrlFriends = _.chunk(userIrlFriends, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedUserIrlFriends[position].map((userIrlFriend) => {
          return (
            <li key={userIrlFriend.contact_id}>
              <OneFriend friend={userIrlFriend} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedUserIrlFriends.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedWhoIAmBlocking({
  userWhoIAmBlocking,
}: {
  userWhoIAmBlocking: Block[];
}) {
  const chunkedUserWhoIAmBlocking = _.chunk(userWhoIAmBlocking, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedUserWhoIAmBlocking[position].map((whoIAmBlocking) => {
          return (
            <li key={whoIAmBlocking.contact_id}>
              <OneBlock block={whoIAmBlocking} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedUserWhoIAmBlocking.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedWhoHaveMeBlocked({
  userWhoHaveMeBlocked,
}: {
  userWhoHaveMeBlocked: Block[];
}) {
  const chunkedUserWhoHaveMeBlocked = _.chunk(userWhoHaveMeBlocked, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedUserWhoHaveMeBlocked[position].map((whoHaveMeBlocked) => {
          return (
            <li key={whoHaveMeBlocked.contact_id}>
              <OneBlock block={whoHaveMeBlocked} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedUserWhoHaveMeBlocked.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedSentFriendToContacts({
  sentFriendToContacts,
}: {
  sentFriendToContacts: FoundContact[];
}) {
  const chunkedSentFriendToContacts = _.chunk(sentFriendToContacts, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedSentFriendToContacts[position].map((sentFriendToContact) => {
          return (
            <li key={sentFriendToContact.c1_contact_id}>
              <OneSentToContact contact={sentFriendToContact} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedSentFriendToContacts.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedSentIrlToContacts({
  sentIrlToContacts,
}: {
  sentIrlToContacts: FoundContact[];
}) {
  const chunkedSentIrlToContacts = _.chunk(sentIrlToContacts, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedSentIrlToContacts[position].map((sentIrlToContact) => {
          return (
            <li key={sentIrlToContact.c1_contact_id}>
              <OneSentToContact contact={sentIrlToContact} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedSentIrlToContacts.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedSentFriendFromContacts({
  sentFriendFromContacts,
}: {
  sentFriendFromContacts: FoundContact[];
}) {
  const chunkedSentFriendFromContacts = _.chunk(sentFriendFromContacts, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedSentFriendFromContacts[position].map(
          (sentFriendFromContact) => {
            return (
              <li key={sentFriendFromContact.c1_contact_id}>
                <OneSentFromContact contact={sentFriendFromContact} />
              </li>
            );
          },
        )}
      </ol>
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedSentFriendFromContacts.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedSentIrlFromContacts({
  sentIrlFromContacts,
}: {
  sentIrlFromContacts: FoundContact[];
}) {
  const chunkedSentIrlFromContacts = _.chunk(sentIrlFromContacts, 4);

  const [position, setPosition] = useState(0);

  function handlePreviousPosition() {
    setPosition(position - 1);
  }

  function handleNextPosition() {
    setPosition(position + 1);
  }

  return (
    <>
      <ol>
        {chunkedSentIrlFromContacts[position].map((sentIrlFromContact) => {
          return (
            <li key={sentIrlFromContact.c1_contact_id}>
              <OneSentFromContact contact={sentIrlFromContact} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <OnClickLinkButton
          handleClick={handlePreviousPosition}
          isDisabled={position === 0}
        >
          Previous
        </OnClickLinkButton>
        &nbsp;/&nbsp;
        <OnClickLinkButton
          handleClick={handleNextPosition}
          isDisabled={position === chunkedSentIrlFromContacts.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}
