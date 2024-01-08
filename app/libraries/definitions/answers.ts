// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

import { QuestionKind } from "./questions";
import { UserQuestionKind } from "./userquestions";

export type Answer = {
  question_name: string;
  answer_value: string;
  answer_id: string;
  userquestion_is_pinned: boolean;
  question_kind: QuestionKind;
  userquestion_kind: UserQuestionKind;
  userquestion_id: string;
  user_username: string;
  user_id: string;
  userquestionfriends_count?: number;
};

export type AnswerState = "LIVE" | "DELETED";
