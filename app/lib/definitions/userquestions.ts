// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

export type UserQuestion = {
  userquestion_id: string;
  user_id: string;
  question_id: string;
  userquestion_state: string;
  userquestion_kind: string;
  userquestion_is_pinned: boolean;
  userquestion_created_at: string;
  userquestion_updated_at: string;
  userquestion_pinned_at: string;
  userquestion_up_to_irl_at: string;
  userquestion_down_to_irl_at: string;
}; // Missing User and Question types.
