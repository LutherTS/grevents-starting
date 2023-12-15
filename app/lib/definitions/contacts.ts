// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

export type Friend = {
  user_app_wide_name: string;
  user_username: string;
  contact_id: string;
};

// export type Contact = {
//   user_app_wide_name: string;
//   user_username: string;
//   contact_id: string;
// };

export type GatheredContact = {
  user_app_wide_name: string;
  user_username: string;
  // c1_kind: string; // previously
  // c1_blocking: boolean; // previously
  // c2_kind: string; // previously
  // c2_blocking: boolean; // previously
  // c1_id: string; // previously
  // c1_mirror_id: string; // previously
  c1_contact_kind: string;
  c1_contact_blocking: boolean;
  c2_contact_kind: string;
  c2_contact_blocking: boolean;
  c1_contact_id: string;
  c1_contact_mirror_id: string;
};

export type Block = {
  user_app_wide_name: string;
  user_username: string;
  contact_id: string;
};

export type FoundContact = {
  // c1_kind: string; // previously
  // c1_blocking: boolean; // previously
  // c2_kind: string; // previously
  // c2_blocking: boolean; // previously
  // c1_id: string; // previously
  // c1_mirror_id: string; // previously
  c1_contact_kind: string;
  c1_contact_blocking: boolean;
  c2_contact_kind: string;
  c2_contact_blocking: boolean;
  c1_contact_id: string;
  c1_contact_mirror_id: string;
  // c1_user_first_id: string; // now actually unnecessary
  // c1_user_last_id: string; // now actually unnecessary
};
