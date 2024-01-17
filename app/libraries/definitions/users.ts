// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

export type User = {
  user_id: string;
  user_state: UserState;
  user_status_title: UserStatusTitle;
  user_status_dashboard: UserStatusDashboard;
  user_status_personal_info: UserStatusPersonalInfo;
  user_username: string;
  // user_email: string;
  // user_password: string;
  user_app_wide_name: string;
  user_friend_code: string;
  user_has_temporary_password: boolean;
  user_created_at: string;
  user_updated_at: string;
};

export type FriendCodeUser = {
  user_id: string;
  user_username: string;
  user_app_wide_name: string;
  user_friend_code: string;
};

export type UserStatusTitle =
  | "NONE"
  | "WELCOMETOGREVENTS"
  | "WELCOMEBACKTOGREVENTS";

export type UserStatusPersonalInfo =
  | "NONE"
  | "CRITERIAHIDDEN"
  | "CRITERIAREVEALED"
  | "CRITERIAPINNED"
  | "CRITERIAUNPINNED"
  | "STANDARDIZEDANSWERUPDATED"
  | "STANDARDIZEDANSWERDELETED"
  | "CUSTOMIZEDANSWERUPDATED"
  | "CUSTOMIZEDANSWERDELETED"
  | "NATIVECRITERIANOTIRLADDED"
  | "NATIVECRITERIAIRLADDED"
  | "PSEUDONATIVECRITERIANOTIRLADDED"
  | "PSEUDONATIVECRITERIAIRLADDED"
  | "PSEUDONATIVECRITERIAUPPEDTOIRL"
  | "PSEUDONATIVECRITERIADOWNEDFROMIRL"
  | "CUSTOMCRITERIAADDED"
  | "CUSTOMCRITERIADELETED"
  | "USERQUESTIONFRIENDADDED"
  | "USERQUESTIONFRIENDDELETED"
  | "REDIRECTEDTOPERSONALINFO";

export type UserState = "LIVE" | "DELETED" | "DEACTIVATED";

export type UserStatusDashboard =
  | "NONE"
  | "APPWIDENAMEUPDATED"
  | "FRIENDCODEUPDATED"
  | "NOWDEACTIVATED"
  | "NOWREACTIVATED"
  | "REDIRECTEDTODASHBOARD";
