// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

export type Answer = {
  question_name: string;
  answer_value: string;
  answer_id: string;
  userquestion_is_pinned: boolean;
  question_kind: string;
  userquestion_kind: string;
  userquestion_id: string;
};
