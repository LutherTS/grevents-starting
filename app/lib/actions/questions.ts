"use server";

import { z } from "zod";

const QUESTION_STATES = ["NONE", "LIVE", "DELETED"] as const;

const QUESTION_KINDS = [
  "NONE",
  "NATIVE",
  "NATIVEIRL",
  "PSEUDO",
  "CUSTOM",
] as const;

/* Currently unused. */
const QuestionSchema = z.object({
  questionId: z.string().length(36),
  userId: z.string().length(36).nullable(),
  questionState: z.enum(QUESTION_STATES),
  questionKind: z.enum(QUESTION_KINDS),
  questionName: z.string().max(200),
  questionIsSuggested: z.boolean(),
  questionCreatedAt: z.string().datetime(),
  questionUpdatedAt: z.string().datetime(),
});
