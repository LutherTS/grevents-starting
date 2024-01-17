// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

import { AnswerState } from "./answers";
import { QuestionKind, QuestionState } from "./questions";
import {
  UserState,
  UserStatusDashboard,
  UserStatusPersonalInfo,
  UserStatusTitle,
} from "./users";

export type UserQuestion = {
  userquestion_id: string;
  user_id: string;
  question_id: string;
  userquestion_state: UserQuestionState;
  userquestion_kind: UserQuestionKind;
  userquestion_is_pinned: boolean;
  userquestion_created_at: string;
  userquestion_updated_at: string;
  userquestion_pinned_at: string;
  userquestion_up_to_irl_at: string;
  userquestion_down_from_irl_at: string;
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
  question_state: QuestionState;
  question_kind: QuestionKind;
  question_name: string;
  question_is_suggested: boolean;
  question_created_at: string;
  question_updated_at: string;
};

export type PreExistingNativeUserQuestion = {
  userquestion_id: string;
  userquestion_state: UserQuestionState;
  question_kind: "NATIVE" | "NATIVEIRL";
  answer_state: AnswerState;
};

export type PreExistingPseudonativeUserQuestion = {
  userquestion_id: string;
  userquestion_state: UserQuestionState;
  question_kind: "PSEUDO";
  userquestion_kind: "PSEUDONATIVE" | "PSEUDONATIVEIRL";
  answer_state: AnswerState;
};

export type PreExistingCustomUserQuestion = {
  userquestion_id: string;
  userquestion_state: UserQuestionState;
  question_kind: "CUSTOM";
  answer_state: AnswerState;
};

export type UserQuestionKind = "NONE" | "PSEUDONATIVE" | "PSEUDONATIVEIRL";

export type UserQuestionState = "LIVE" | "DELETED" | "HIDDEN";
