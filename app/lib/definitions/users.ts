// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

export type User = {
  user_id: string;
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
};
