// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

import { UserState } from "./users";

export type Friend = {
  user_app_wide_name: string;
  user_username: string;
  contact_id: string;
};

export type GatheredContact = {
  user_app_wide_name: string;
  user_username: string;
  c1_contact_kind: ContactKind;
  c1_contact_blocking: boolean;
  c2_contact_kind: ContactKind;
  c2_contact_blocking: boolean;
  c1_contact_id: string;
  c1_contact_mirror_id: string;
  c2_contact_status_other_profile: ContactStatusOtherProfile;
  user_state: UserState;
};

export type Block = {
  user_app_wide_name: string;
  user_username: string;
  contact_id: string;
};

export type FoundContact = {
  c1_contact_kind: ContactKind;
  c1_contact_blocking: boolean;
  c2_contact_kind: ContactKind;
  c2_contact_blocking: boolean;
  c1_contact_id: string;
  c1_contact_mirror_id: string;
  c1_user_first_id: string;
  c1_user_last_id: string;
  c2_contact_status_other_profile: ContactStatusOtherProfile;
  c2_contact_status_relationship: ContactStatusRelationship;
  c2_contact_process_relationship: ContactProcessRelationship;
  c1_contact_process_relationship: ContactProcessRelationship;
  u1_user_username: string;
  u2_user_username: string;
  u1_user_app_wide_name: string;
  u2_user_app_wide_name: string;
};

export type ContactStatusOtherProfile =
  | "NONE"
  | "FIRSTACCESSTHROUGHFIND"
  | "REACCESSTHROUGHFIND"
  | "USERQUESTIONFRIENDPINNED"
  | "USERQUESTIONFRIENDUNPINNED";

export type ContactStatusRelationship =
  | "NONE"
  | "SENTFRIEND"
  | "SENTIRL"
  | "RECEIVEFRIEND"
  | "RECEIVEIRL"
  | "ANNULFRIEND"
  | "ANNULIRL"
  | "REFUSEDFRIEND"
  | "REFUSEDIRL"
  | "NOWFRIENDS"
  | "NOWIRLS"
  | "NOLONGERFRIENDS"
  | "NOLONGERIRLS"
  | "NOWBLOCKING"
  | "NOWUNBLOCKING"
  | "NOWBLOCKED"
  | "NOWUNBLOCKED";

export type ContactProcessRelationship =
  | "NONE"
  | "SENTFRIEND"
  | "SENTIRL"
  | "ANNULFRIEND"
  | "ANNULIRL";

export type ContactKind = "NONE" | "FRIEND" | "IRL";
