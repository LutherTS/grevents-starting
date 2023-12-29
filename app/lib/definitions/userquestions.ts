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
  user_state: string;
  user_status_title: string;
  user_status_dashboard: string;
  user_status_personal_info: string;
  user_username: string;
  // user_email: string;
  // user_password: string;
  user_app_wide_name: string;
  user_friend_code: string;
  user_has_temporary_password: boolean;
  user_created_at: string;
  user_updated_at: string;
  question_state: string;
  question_kind: string;
  question_name: string;
  question_is_suggested: boolean;
  question_created_at: string;
  question_updated_at: string;
};

export type PreExistingUserQuestion = {
  userquestion_id: string;
  userquestion_state: string;
  question_kind: string;
  answer_state: string;
};
