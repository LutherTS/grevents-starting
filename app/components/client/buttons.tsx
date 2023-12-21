"use client";

import { useRouter, usePathname } from "next/navigation";
import { revalidate } from "@/app/lib/actions/buttons";
import clsx from "clsx";
import { Answer } from "@/app/lib/definitions/answers";
import { pinOrUnpinUserQuestionOfAnswer } from "@/app/lib/actions/answers";

export function Button({
  action,
  children,
}: {
  action: (...rest: any) => any;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400 dark:hover:bg-blue-600"
        onClick={action}
      >
        {children}
      </button>
    </>
  );
}

export function BackButton() {
  const router = useRouter();

  return (
    <>
      <Button action={() => router.back()}>
        Or go back to the previous page
      </Button>
    </>
  );
}

export function RevalidateButton() {
  const pathname = usePathname();

  return (
    <>
      <Button action={() => revalidate(pathname)}>Revalidate the data</Button>
    </>
  );
}

export function ButtonPinnable({ answer }: { answer: Answer }) {
  return (
    <>
      <button
        onClick={() => pinOrUnpinUserQuestionOfAnswer(answer)}
        className={clsx("me-2 h-4 w-4 rounded-full", {
          "bg-cyan-500 hover:bg-cyan-400 dark:hover:bg-cyan-600":
            answer.userquestion_is_pinned === true,
          "bg-pink-500 hover:bg-pink-400 dark:hover:bg-pink-600":
            answer.userquestion_is_pinned === false,
        })}
      ></button>
    </>
  );
}
