"use client";

import { Answer } from "@/app/libraries/definitions/answers";
import { FoundContact } from "@/app/libraries/definitions/contacts";
import _ from "lodash";
import { useState } from "react";
import { OnClickLinkButton } from "../buttons";
import {
  OneCriteria,
  OneCriteriaCancelPinnableByFriend,
  OneCriteriaModify,
  OneCriteriaPinnable,
  OneCriteriaPinnableByFriend,
  OneCriteriaPinnablePseudoable,
  OneLinkCriteria,
} from "../../agnostic/database/answers";

export function ManyPaginatedCriteria({
  answers,
  personalView,
}: {
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
  answers,
}: {
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
  answers,
  pinnedAnswersCount,
}: {
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
  answers,
  pinnedAnswersCount,
}: {
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
  answers,
  contact,
  pinnedbyFriendAnswersLength,
}: {
  answers: Answer[];
  contact: FoundContact;
  pinnedbyFriendAnswersLength: number;
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
  answers,
  contact,
}: {
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
  answers,
  pinnedAnswersCount,
}: {
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
