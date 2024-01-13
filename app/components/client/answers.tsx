"use client";

import { Answer } from "@/app/libraries/definitions/answers";
import { FoundContact } from "@/app/libraries/definitions/contacts";
import _ from "lodash";
import { useState } from "react";
import { OnClickLinkButton } from "./buttons";
import {
  OneCriteria,
  OneCriteriaCancelPinnableByFriend,
  OneCriteriaModify,
  OneCriteriaPinnable,
  OneCriteriaPinnableByFriend,
  OneCriteriaPinnablePseudoable,
  OneLinkCriteria,
} from "../agnostic/answers";

// I'm going to need to find a way here, and for previous similar issues as well, to refactor the following component so they could all be based on a single one... Maybe.

export function ManyPaginatedCriteria({
  // children,
  answers,
  personalView,
}: {
  // children: React.ReactNode;
  answers: Answer[];
  personalView?: boolean;
}) {
  const chunkedAnswers = _.chunk(answers, 4);

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
        {chunkedAnswers[position].map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteria answer={answer} personalView={personalView} />
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
          isDisabled={position === chunkedAnswers.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedCriteriaModify({
  // children,
  answers,
}: {
  // children: React.ReactNode;
  answers: Answer[];
}) {
  const chunkedAnswers = _.chunk(answers, 4);

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
        {chunkedAnswers[position].map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteriaModify answer={answer} />
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
          isDisabled={position === chunkedAnswers.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedCriteriaPinnable({
  // children,
  answers,
  pinnedAnswersCount,
}: {
  // children: React.ReactNode;
  answers: Answer[];
  pinnedAnswersCount: number;
}) {
  const chunkedAnswers = _.chunk(answers, 4);

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
        {chunkedAnswers[position].map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteriaPinnable
                answer={answer}
                personalView={true}
                pinnedAnswersCount={pinnedAnswersCount}
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
          isDisabled={position === chunkedAnswers.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedCriteriaPinnablePseudoable({
  // children,
  answers,
  pinnedAnswersCount,
}: {
  // children: React.ReactNode;
  answers: Answer[];
  pinnedAnswersCount: number;
}) {
  const chunkedAnswers = _.chunk(answers, 4);

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
        {chunkedAnswers[position].map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteriaPinnablePseudoable
                answer={answer}
                pinnedAnswersCount={pinnedAnswersCount}
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
          isDisabled={position === chunkedAnswers.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedCriteriaPinnableByFriend({
  // children,
  answers,
  contact,
  pinnedbyFriendAnswersLength,
}: {
  // children: React.ReactNode;
  answers: Answer[];
  contact: FoundContact;
  pinnedbyFriendAnswersLength: number;
}) {
  // console.log(answers); // C'est dans le client !!
  // console.log(answers.length); // Après ça veut aussi surtout dire qu'il faudra que je sois encore plus au taquet sur ce que je passe comme informations sur Answer.

  const chunkedAnswers = _.chunk(answers, 4);
  // console.log(chunkedAnswers);
  // console.log(chunkedAnswers.length);

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
        {chunkedAnswers[position].map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteriaPinnableByFriend
                answer={answer}
                contact={contact}
                pinnedbyFriendAnswersLength={pinnedbyFriendAnswersLength}
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
          isDisabled={position === chunkedAnswers.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedCriteriaCancelPinnableByFriend({
  // children,
  answers,
  contact,
}: {
  // children: React.ReactNode;
  answers: Answer[];
  contact: FoundContact;
}) {
  const chunkedAnswers = _.chunk(answers, 4);

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
        {chunkedAnswers[position].map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteriaCancelPinnableByFriend
                answer={answer}
                contact={contact}
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
          isDisabled={position === chunkedAnswers.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

export function ManyPaginatedLinkCriteria({
  // children,
  answers,
  pinnedAnswersCount,
}: {
  // children: React.ReactNode;
  answers: Answer[];
  pinnedAnswersCount: number;
}) {
  const chunkedAnswers = _.chunk(answers, 4);

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
        {chunkedAnswers[position].map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneLinkCriteria
                answer={answer}
                pinnedAnswersCount={pinnedAnswersCount}
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
          isDisabled={position === chunkedAnswers.length - 1}
        >
          Next
        </OnClickLinkButton>
      </p>
    </>
  );
}

// Indeed, I'm really going to need to refactor this is some way.
