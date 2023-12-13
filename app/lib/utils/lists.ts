export const relationCombinations = [
  "none",
  "friend",
  "irl",
  "i-am-blocking",
  "has-me-blocked",
  "blocking-blocked",
];

export type RelationCombination =
  | "none"
  | "friend"
  | "irl"
  | "i-am-blocking"
  | "has-me-blocked"
  | "blocking-blocked";

export const answersLabels: { [K in AnswersLabelKey]: AnswersLabel } = {
  pinned: "Find their pinned criteria below",
  nativeNotIrl: "Find their native criteria below",
  nativeIrl: "Find their native irl criteria below",
  pseudonativeNotIrl: "Find their pseudonative criteria below",
  pseudonativeIrl: "Find their pseudonative irl criteria below",
  custom: "Find their custom criteria below",
  pinnedNotIrl: "Find their pinned for friend criteria below",
  unpinnedNativeNotIrl: "Find their (other) native criteria below",
  unpinnedPseudonativeNotIrl: "Find their (other) pseudonative criteria below",
  pinnedNotAndIrl: "Find their pinned for irl criteria below",
  unpinnedNativeIrl: "Find their (other) native irl criteria below",
  unpinnedPseudonativeIrl: "Find their (other) pseudonative irl criteria below",
  sharedToContactCustom: "See the custom answers they can see below",
};

export type AnswersLabelKey =
  | "pinned"
  | "nativeNotIrl"
  | "nativeIrl"
  | "pseudonativeNotIrl"
  | "pseudonativeIrl"
  | "custom"
  | "pinnedNotIrl"
  | "unpinnedNativeNotIrl"
  | "unpinnedPseudonativeNotIrl"
  | "pinnedNotAndIrl"
  | "unpinnedNativeIrl"
  | "unpinnedPseudonativeIrl"
  | "sharedToContactCustom";

export type AnswersLabel =
  | "Find their pinned criteria below"
  | "Find their native criteria below"
  | "Find their native irl criteria below"
  | "Find their pseudonative criteria below"
  | "Find their pseudonative irl criteria below"
  | "Find their custom criteria below"
  | "Find their pinned for friend criteria below"
  | "Find their (other) native criteria below"
  | "Find their (other) pseudonative criteria below"
  | "Find their pinned for irl criteria below"
  | "Find their (other) native irl criteria below"
  | "Find their (other) pseudonative irl criteria below"
  | "See the custom answers they can see below";
