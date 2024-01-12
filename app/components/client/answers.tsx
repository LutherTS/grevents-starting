"use client";

import { Answer } from "@/app/libraries/definitions/answers";
import { PaginationNextForm, PaginationPreviousForm } from "./forms";

export function ManyPaginatedCriteria({
  children,
  answers,
  personalView,
}: {
  children: React.ReactNode;
  answers: Answer[];
  personalView: boolean;
}) {
  return (
    <>
      <ol>
        {answers.map((answer) => {
          return (
            <li key={answer.answer_id}>
              {/* <OneCriteria answer={answer} personalView={personalView} /> */}
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
