// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

export type Friend = {
  user_app_wide_name: string;
  user_username: string;
  contact_id: string;
};

export type GatheredContact = {
  user_app_wide_name: string;
  user_username: string;
  c1_contact_kind: string;
  c1_contact_blocking: boolean;
  c2_contact_kind: string;
  c2_contact_blocking: boolean;
  c1_contact_id: string;
  c1_contact_mirror_id: string;
  c1_contact_status_profile: string;
  c2_contact_status_other_profile: string;
};

export type Block = {
  user_app_wide_name: string;
  user_username: string;
  contact_id: string;
};

export type FoundContact = {
  c1_contact_kind: string;
  c1_contact_blocking: boolean;
  c2_contact_kind: string;
  c2_contact_blocking: boolean;
  c1_contact_id: string;
  c1_contact_mirror_id: string;
  c1_user_first_id: string;
  c1_user_last_id: string;
  c1_contact_status_profile: string;
  c2_contact_status_other_profile: string;
  c2_contact_status_relationship: string;
  c2_contact_process_relationship: string;
  c1_contact_process_relationship: string;
  u1_user_username: string;
  u2_user_username: string;
  u1_user_app_wide_name: string;
  u2_user_app_wide_name: string;
};

export type ContactStatusOtherProfile =
  | "NONE"
  | "FIRSTACCESSTHROUGHFIND"
  | "REACCESSTHROUGHFIND";
