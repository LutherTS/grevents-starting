export const answersLabels: { [K in AnswersLabelKey]: AnswersLabel } = {
  pinned: "Find my pinned criteria below",
  nativeNotIrl: "Find my native criteria below",
  nativeIrl: "Find my native irl criteria below",
  pseudonativeNotIrl: "Find my pseudonative criteria below",
  pseudonativeIrl: "Find my pseudonative irl criteria below",
  custom: "Find my custom criteria below",
  pinnedNotIrl: "Find their pinned for friend criteria below",
  unpinnedNativeNotIrl: "Find their (other) native criteria below",
  unpinnedPseudonativeNotIrl: "Find their (other) pseudonative criteria below",
  pinnedNotAndIrl: "Find their pinned for irl criteria below",
  unpinnedNativeIrl: "Find their (other) native irl criteria below",
  unpinnedPseudonativeIrl: "Find their (other) pseudonative irl criteria below",
  sharedToContactCustom: "See their (other) custom answers shared to you below",
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
  | "Find my pinned criteria below"
  | "Find my native criteria below"
  | "Find my native irl criteria below"
  | "Find my pseudonative criteria below"
  | "Find my pseudonative irl criteria below"
  | "Find my custom criteria below"
  | "Find their pinned for friend criteria below"
  | "Find their (other) native criteria below"
  | "Find their (other) pseudonative criteria below"
  | "Find their pinned for irl criteria below"
  | "Find their (other) native irl criteria below"
  | "Find their (other) pseudonative irl criteria below"
  | "See their (other) custom answers shared to you below";
