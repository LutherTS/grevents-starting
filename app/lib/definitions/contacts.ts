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
  c1_kind: string;
  c1_blocking: boolean;
  c2_kind: string;
  c2_blocking: boolean;
  c1_id: string;
  c1_mirror_id: string;
};
