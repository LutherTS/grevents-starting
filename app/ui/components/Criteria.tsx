"use client";

import { Answer } from "@/app/lib/definitions/answers";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CriteriaAnswer, CriteriaQuestion } from "./answers";

export function Criteria({ answer }: { answer: Answer }) {
  const pathname = usePathname();
  const answerCustomizedPath = `/users/${answer.user_username}/personal-info/customized`;
  const pathnameIsAnswerCustomizedPath = pathname === answerCustomizedPath;

  /* Pseudo-code
  Il faut que je change de philosophie. Là je dis que l'existence même du composant dépend de usePathname(). Par conséquent, quoi que je puisse faire ou penser, si l'existence d'un composant a une dépendance client, c'est. Un. Composant. Client. 
  Par conséquent, ici, il faut non pas que l'existence mais plutôt que l'affichage de la version avec le lien dépende de usePathname(), lui laissant donc la possibilité de rester un composant serveur. 
  */

  return (
    <>
      {pathnameIsAnswerCustomizedPath && answer.question_kind === "CUSTOM" ? (
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
