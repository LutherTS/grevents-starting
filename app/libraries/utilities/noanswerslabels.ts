export const noAnswersLabels: { [K in NoAnswersLabelKey]: NoAnswersLabel } = {
  pinned: "No pinned criteria yet.",
  nativeNotIrl: "No native criteria yet.",
  nativeIrl: "No native irl criteria yet.",
  pseudonativeNotIrl: "No pseudonative criteria yet.",
  pseudonativeIrl: "No pseudonative irl criteria yet.",
  custom: "No custom criteria yet.",
};

export type NoAnswersLabelKey =
  | "pinned"
  | "nativeNotIrl"
  | "nativeIrl"
  | "pseudonativeNotIrl"
  | "pseudonativeIrl"
  | "custom";

export type NoAnswersLabel =
  | "No pinned criteria yet."
  | "No native criteria yet."
  | "No native irl criteria yet."
  | "No pseudonative criteria yet."
  | "No pseudonative irl criteria yet."
  | "No custom criteria yet.";
