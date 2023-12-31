import { GatheredContact, FoundContact } from "../definitions/contacts";

export function defineFoundRelCombo(contact: FoundContact) {
  if (
    contact &&
    contact.c1_contact_kind === "NONE" &&
    contact.c2_contact_kind === "NONE" &&
    contact.c1_contact_blocking === false &&
    contact.c2_contact_blocking === false
  ) {
    return "none";
  } else if (
    contact &&
    contact.c1_contact_kind === "FRIEND" &&
    contact.c2_contact_kind === "FRIEND" &&
    contact.c1_contact_blocking === false &&
    contact.c2_contact_blocking === false
  ) {
    return "friend";
  } else if (
    contact &&
    contact.c1_contact_kind === "IRL" &&
    contact.c2_contact_kind === "IRL" &&
    contact.c1_contact_blocking === false &&
    contact.c2_contact_blocking === false
  ) {
    return "irl";
  } else if (
    contact &&
    contact.c1_contact_kind === "NONE" &&
    contact.c2_contact_kind === "NONE" &&
    contact.c1_contact_blocking === true &&
    contact.c2_contact_blocking === false
  ) {
    return "i-am-blocking";
  } else if (
    contact &&
    contact.c1_contact_kind === "NONE" &&
    contact.c2_contact_kind === "NONE" &&
    contact.c1_contact_blocking === false &&
    contact.c2_contact_blocking === true
  ) {
    return "has-me-blocked";
  } else if (
    contact &&
    contact.c1_contact_kind === "NONE" &&
    contact.c2_contact_kind === "NONE" &&
    contact.c1_contact_blocking === true &&
    contact.c2_contact_blocking === true
  ) {
    return "blocking-blocked";
  } else {
    return "";
  }
}

export function defineGatheredRelCombo(
  relCombo: string,
  contact: GatheredContact,
) {
  if (
    relCombo === "" &&
    contact &&
    contact.c1_contact_kind === "NONE" &&
    contact.c2_contact_kind === "NONE" &&
    contact.c1_contact_blocking === false &&
    contact.c2_contact_blocking === false
  ) {
    return "none";
  } else if (
    relCombo === "" &&
    contact &&
    contact.c1_contact_kind === "FRIEND" &&
    contact.c2_contact_kind === "FRIEND" &&
    contact.c1_contact_blocking === false &&
    contact.c2_contact_blocking === false
  ) {
    return "friend";
  } else if (
    relCombo === "" &&
    contact &&
    contact.c1_contact_kind === "IRL" &&
    contact.c2_contact_kind === "IRL" &&
    contact.c1_contact_blocking === false &&
    contact.c2_contact_blocking === false
  ) {
    return "irl";
  } else if (
    relCombo === "" &&
    contact &&
    contact.c1_contact_kind === "NONE" &&
    contact.c2_contact_kind === "NONE" &&
    contact.c1_contact_blocking === true &&
    contact.c2_contact_blocking === false
  ) {
    return "i-am-blocking";
  } else if (
    relCombo === "" &&
    contact &&
    contact.c1_contact_kind === "NONE" &&
    contact.c2_contact_kind === "NONE" &&
    contact.c1_contact_blocking === false &&
    contact.c2_contact_blocking === true
  ) {
    return "has-me-blocked";
  } else if (
    relCombo === "" &&
    contact &&
    contact.c1_contact_kind === "NONE" &&
    contact.c2_contact_kind === "NONE" &&
    contact.c1_contact_blocking === true &&
    contact.c2_contact_blocking === true
  ) {
    return "blocking-blocked";
  } else {
    return relCombo;
  }
}

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
