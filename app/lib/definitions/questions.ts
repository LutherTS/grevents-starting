// This is a strict and manual translation from the schema of the database.
// My understanding is that some tools can create definitions automatically from the schema of the database.

export type NativeNotIrlQuestion = {
  question_name: string;
  question_kind: "NATIVE";
  question_id: string;
};

export type NativeIrlQuestion = {
  question_name: string;
  question_kind: "NATIVEIRL";
  question_id: string;
};
