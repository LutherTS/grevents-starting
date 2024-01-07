"use server";

import { z } from "zod";

const USERQUESTION_STATES = ["NONE", "LIVE", "DELETED"] as const;

const USERQUESTION_KINDS = ["NONE", "PSEUDONATIVE", "PSEUDONATIVEIRL"] as const;

/* Currently unused. */
const UserQuestionSchema = z.object({
  userQuestionId: z.string().length(36),
  userId: z.string().length(36),
  questionId: z.string().length(36),
  userQuestionState: z.enum(USERQUESTION_STATES),
  userQuestionKind: z.enum(USERQUESTION_KINDS),
  userQuestionIsPinned: z.boolean(),
  userQuestionCreatedAt: z.string().datetime(),
  userQuestionUpdatedAt: z.string().datetime(),
  userQuestionPinnedAt: z.string().datetime().nullable(),
  userQuestionUppedToIrlAt: z.string().datetime().nullable(),
  userQuestionDownedFromIrlAt: z.string().datetime().nullable(),
});
