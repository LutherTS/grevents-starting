"use client";

import { Answer } from "@/app/lib/definitions/answers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CriteriaAnswer, CriteriaQuestion } from "./answers";

export async function Criteria({ answer }: { answer: Answer }) {
  const pathname = usePathname();
  const answerCustomizedPath = `/users/${answer.user_username}/personal-info/customized`;

  return (
    <>
      {pathname === answerCustomizedPath &&
      answer.question_kind === "CUSTOM" ? (
        <div>
          <Link
            href={`/users/${answer.user_username}/personal-info/user-criteria/${answer.userquestion_id}`}
            className="underline inline-block"
          >
            <CriteriaQuestion answer={answer} />
          </Link>
          <CriteriaAnswer answer={answer} />
        </div>
      ) : (
        <>
          <CriteriaQuestion answer={answer} />
          <CriteriaAnswer answer={answer} />
        </>
      )}
    </>
  );
}
