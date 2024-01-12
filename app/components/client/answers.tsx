"use client";

import { Answer } from "@/app/libraries/definitions/answers";
import { PaginationNextForm, PaginationPreviousForm } from "./forms";
import {
  OneCriteria,
  OneCriteriaCancelPinnableByFriend,
  OneCriteriaModify,
  OneCriteriaPinnable,
  OneCriteriaPinnableByFriend,
  OneCriteriaPinnablePseudoable,
  OneLinkCriteria,
} from "../server/answers";
import { FoundContact } from "@/app/libraries/definitions/contacts";
import _ from "lodash";

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
  return (
    <>
      <ol>
        {answers.map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteria answer={answer} personalView={personalView} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <PaginationPreviousForm />
        &nbsp;/&nbsp;
        <PaginationNextForm />
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
  return (
    <>
      <ol>
        {answers.map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteriaModify answer={answer} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <PaginationPreviousForm />
        &nbsp;/&nbsp;
        <PaginationNextForm />
      </p>
    </>
  );
}

export function ManyPaginatedCriteriaPinnable({
  // children,
  answers,
}: {
  // children: React.ReactNode;
  answers: Answer[];
}) {
  return (
    <>
      <ol>
        {answers.map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteriaPinnable answer={answer} personalView={true} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <PaginationPreviousForm />
        &nbsp;/&nbsp;
        <PaginationNextForm />
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
  console.log(answers); // C'est dans le client !!
  console.log(answers.length); // Après ça veut aussi surtout dire qu'il faudra que je sois encore plus au taquet sur ce que je passe comme informations sur Answer.

  const chunkedAnswers = _.chunk(answers, 4);
  console.log(chunkedAnswers);
  console.log(chunkedAnswers.length);

  return (
    <>
      <ol>
        {answers.map((answer) => {
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
        <PaginationPreviousForm />
        &nbsp;/&nbsp;
        <PaginationNextForm />
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
  return (
    <>
      <ol>
        {answers.map((answer) => {
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
        <PaginationPreviousForm />
        &nbsp;/&nbsp;
        <PaginationNextForm />
      </p>
    </>
  );
}

export function ManyPaginatedCriteriaPinnablePseudoable({
  // children,
  answers,
}: {
  // children: React.ReactNode;
  answers: Answer[];
}) {
  return (
    <>
      <ol>
        {answers.map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneCriteriaPinnablePseudoable answer={answer} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <PaginationPreviousForm />
        &nbsp;/&nbsp;
        <PaginationNextForm />
      </p>
    </>
  );
}

export function ManyPaginatedLinkCriteria({
  // children,
  answers,
}: {
  // children: React.ReactNode;
  answers: Answer[];
}) {
  return (
    <>
      <ol>
        {answers.map((answer) => {
          return (
            <li key={answer.answer_id}>
              <OneLinkCriteria answer={answer} />
            </li>
          );
        })}
      </ol>
      <p className="mt-2">
        <PaginationPreviousForm />
        &nbsp;/&nbsp;
        <PaginationNextForm />
      </p>
    </>
  );
}
