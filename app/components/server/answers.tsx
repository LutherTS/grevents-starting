"use server";

import {
  fetchUserPinnedAnswers,
  fetchUserNativeNotIrlAnswers,
  fetchUserNativeIrlAnswers,
  fetchUserPseudonativeNotIrlAnswers,
  fetchUserPseudonativeIrlAnswers,
  fetchUserCustomAnswers,
  fetchUserPinnedNotIrlAnswers,
  fetchUserUnpinnedNativeNotIrlAnswers,
  fetchUserUnpinnedPseudonativeNotIrlAnswers,
  fetchUserPinnedNotAndIrlAnswers,
  fetchUserUnpinnedNativeIrlAnswers,
  fetchUserUnpinnedPseudonativeIrlAnswers,
  fetchUserPinnedNotIrlAnswersExposed,
  fetchUserPinnedNotAndIrlAnswersExposed,
  fetchUserPinnedByFriendNotIrlAnswersExposed,
  fetchUserPinnedByFriendNotAndIrlAnswersExposed,
  fetchUserSharedToContactCustomAnswersExposed,
  fetchUserPinnedNotAndIrlAnswersQueried,
  fetchUserUnpinnedNativeNotIrlAnswersQueried,
  fetchUserUnpinnedPseudonativeNotIrlAnswersQueried,
  fetchUserUnpinnedNativeIrlAnswersQueried,
  fetchUserUnpinnedPseudonativeIrlAnswersQueried,
  fetchUserPinnedNotIrlAnswersQueried,
  fetchUserUnpinnedNativeNotIrlAnswersExposed,
  fetchUserUnpinnedPseudonativeNotIrlAnswersExposed,
  fetchUserUnpinnedNativeIrlAnswersExposed,
  fetchUserUnpinnedPseudonativeIrlAnswersExposed,
  fetchUserSharedToContactCustomAnswersQueried,
} from "@/app/libraries/data/answers";
import { User } from "@/app/libraries/definitions/users";
import {
  GatheredContact,
  FoundContact,
} from "@/app/libraries/definitions/contacts";
import { answersLabels } from "@/app/libraries/utilities/answerslabels";
import { noAnswersLabels } from "@/app/libraries/utilities/noanswerslabels";
import {
  ManyCriteria,
  ManyCriteriaCancelPinnableByFriend,
  ManyCriteriaModify,
  ManyCriteriaPinnable,
  ManyCriteriaPinnableByFriend,
  ManyCriteriaPinnablePseudoable,
  ManyLinkCriteria,
} from "../agnostic/answers";

export async function ManyUserPinnedCriteria({ user }: { user: User }) {
  const pinnedAnswers = await fetchUserPinnedAnswers(user.user_id);

  return (
    <>
      <ManyCriteria
        answers={pinnedAnswers}
        answersLabel={answersLabels.pinned}
        noAnswersLabel={noAnswersLabels.pinned}
        personalView={true}
      />
    </>
  );
}

export async function ManyUserNativeNotIrlCriteria({
  user,
  pinnedAnswerCount,
}: {
  user: User;
  pinnedAnswerCount: number;
}) {
  const userNativeNotIrlAnswers = await fetchUserNativeNotIrlAnswers(
    user.user_id,
  );

  return (
    <>
      <ManyCriteriaPinnable
        answers={userNativeNotIrlAnswers}
        answersLabel={answersLabels.nativeNotIrl}
        noAnswersLabel={noAnswersLabels.nativeNotIrl}
        pinnedAnswersLength={pinnedAnswerCount}
      />
    </>
  );
}

export async function ManyUserNativeNotIrlCriteriaModify({
  user,
}: {
  user: User;
}) {
  const userNativeNotIrlAnswers = await fetchUserNativeNotIrlAnswers(
    user.user_id,
  );

  return (
    <>
      <ManyCriteriaModify
        answers={userNativeNotIrlAnswers}
        answersLabel={answersLabels.nativeNotIrl}
        noAnswersLabel={noAnswersLabels.nativeNotIrl}
      />
    </>
  );
}

export async function ManyUserNativeIrlCriteria({
  user,
  pinnedAnswerCount,
}: {
  user: User;
  pinnedAnswerCount: number;
}) {
  const userNativeIrlAnswers = await fetchUserNativeIrlAnswers(user.user_id);

  return (
    <>
      <ManyCriteriaPinnable
        answers={userNativeIrlAnswers}
        answersLabel={answersLabels.nativeIrl}
        noAnswersLabel={noAnswersLabels.nativeIrl}
        pinnedAnswersLength={pinnedAnswerCount}
      />
    </>
  );
}

export async function ManyUserNativeIrlCriteriaModify({
  user,
}: {
  user: User;
}) {
  const userNativeIrlAnswers = await fetchUserNativeIrlAnswers(user.user_id);

  return (
    <>
      <ManyCriteriaModify
        answers={userNativeIrlAnswers}
        answersLabel={answersLabels.nativeIrl}
        noAnswersLabel={noAnswersLabels.nativeIrl}
      />
    </>
  );
}

export async function ManyUserPseudonativeNotIrlCriteria({
  user,
  pinnedAnswerCount,
}: {
  user: User;
  pinnedAnswerCount: number;
}) {
  const userPseudonativeNotIrlAnswers =
    await fetchUserPseudonativeNotIrlAnswers(user.user_id);

  return (
    <>
      <ManyCriteriaPinnablePseudoable
        answers={userPseudonativeNotIrlAnswers}
        answersLabel={answersLabels.pseudonativeNotIrl}
        noAnswersLabel={noAnswersLabels.pseudonativeNotIrl}
        pinnedAnswersLength={pinnedAnswerCount}
      />
    </>
  );
}

export async function ManyUserPseudonativeNotIrlCriteriaModify({
  user,
}: {
  user: User;
}) {
  const userPseudonativeNotIrlAnswers =
    await fetchUserPseudonativeNotIrlAnswers(user.user_id);

  return (
    <>
      <ManyCriteriaModify
        answers={userPseudonativeNotIrlAnswers}
        answersLabel={answersLabels.pseudonativeNotIrl}
        noAnswersLabel={noAnswersLabels.pseudonativeNotIrl}
      />
    </>
  );
}

export async function ManyUserPseudonativeIrlCriteria({
  user,
  pinnedAnswerCount,
}: {
  user: User;
  pinnedAnswerCount: number;
}) {
  const userPseudonativeIrlAnswers = await fetchUserPseudonativeIrlAnswers(
    user.user_id,
  );

  return (
    <>
      <ManyCriteriaPinnablePseudoable
        answers={userPseudonativeIrlAnswers}
        answersLabel={answersLabels.pseudonativeIrl}
        noAnswersLabel={noAnswersLabels.pseudonativeIrl}
        pinnedAnswersLength={pinnedAnswerCount}
      />
    </>
  );
}

export async function ManyUserPseudonativeIrlCriteriaModify({
  user,
}: {
  user: User;
}) {
  const userPseudonativeIrlAnswers = await fetchUserPseudonativeIrlAnswers(
    user.user_id,
  );

  return (
    <>
      <ManyCriteriaModify
        answers={userPseudonativeIrlAnswers}
        answersLabel={answersLabels.pseudonativeIrl}
        noAnswersLabel={noAnswersLabels.pseudonativeIrl}
      />
    </>
  );
}

export async function ManyUserCustomCriteria({
  user,
  pinnedAnswerCount,
}: {
  user: User;
  pinnedAnswerCount: number;
}) {
  const userCustomAnswers = await fetchUserCustomAnswers(user.user_id);

  return (
    <>
      <ManyLinkCriteria
        answers={userCustomAnswers}
        answersLabel={answersLabels.custom}
        noAnswersLabel={noAnswersLabels.custom}
        pinnedAnswersLength={pinnedAnswerCount}
      />
    </>
  );
}

export async function ManyRelComboFriendCriteriaPreviewed({
  user,
}: {
  user: User;
}) {
  const [
    pinnedNotIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
  ] = await Promise.all([
    fetchUserPinnedNotIrlAnswers(user.user_id),
    fetchUserUnpinnedNativeNotIrlAnswers(user.user_id),
    fetchUserUnpinnedPseudonativeNotIrlAnswers(user.user_id),
  ]);

  return (
    <>
      <ManyCriteria
        answers={pinnedNotIrlAnswers}
        answersLabel={answersLabels.pinnedNotIrl}
      />
      <ManyCriteria
        answers={userUnpinnedNativeNotIrlAnswers}
        answersLabel={answersLabels.unpinnedNativeNotIrl}
      />
      <ManyCriteria
        answers={userUnpinnedPseudonativeNotIrlAnswers}
        answersLabel={answersLabels.unpinnedPseudonativeNotIrl}
      />
    </>
  );
}

export async function ManyRelComboIrlCriteriaPreviewed({
  user,
}: {
  user: User;
}) {
  const [
    pinnedNotAndIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
    userUnpinnedNativeIrlAnswers,
    userUnpinnedPseudonativeIrlAnswers,
  ] = await Promise.all([
    fetchUserPinnedNotAndIrlAnswers(user.user_id),
    fetchUserUnpinnedNativeNotIrlAnswers(user.user_id), // garder DEACTIVATED, enlever pinned_by_friend
    fetchUserUnpinnedPseudonativeNotIrlAnswers(user.user_id),
    fetchUserUnpinnedNativeIrlAnswers(user.user_id),
    fetchUserUnpinnedPseudonativeIrlAnswers(user.user_id),
  ]);

  return (
    <>
      <ManyCriteria
        answers={pinnedNotAndIrlAnswers}
        answersLabel={answersLabels.pinnedNotAndIrl}
      />
      <ManyCriteria
        answers={userUnpinnedNativeNotIrlAnswers}
        answersLabel={answersLabels.unpinnedNativeNotIrl}
      />
      <ManyCriteria
        answers={userUnpinnedPseudonativeNotIrlAnswers}
        answersLabel={answersLabels.unpinnedPseudonativeNotIrl}
      />
      <ManyCriteria
        answers={userUnpinnedNativeIrlAnswers}
        answersLabel={answersLabels.unpinnedNativeIrl}
      />
      <ManyCriteria
        answers={userUnpinnedPseudonativeIrlAnswers}
        answersLabel={answersLabels.unpinnedPseudonativeIrl}
      />
    </>
  );
}

export async function ManyRelComboFriendCriteriaExposed({
  user,
  contact,
}: {
  user: User;
  contact: FoundContact;
}) {
  const [
    pinnedByFriendNotIrlAnswers, // new
    pinnedNotIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
    userSharedToContactCustomAnswers, // optimisation
  ] = await Promise.all([
    fetchUserPinnedByFriendNotIrlAnswersExposed(
      user.user_id,
      contact.c1_contact_id,
    ), // new
    fetchUserPinnedNotIrlAnswersExposed(user.user_id, contact.c1_contact_id),
    fetchUserUnpinnedNativeNotIrlAnswersExposed(user.user_id), // enlever DEACTIVATED
    fetchUserUnpinnedPseudonativeNotIrlAnswersExposed(user.user_id),
    fetchUserSharedToContactCustomAnswersExposed(
      user.user_id,
      contact.c1_contact_id,
    ), // optimisation
  ]);

  const pinnedByFriendNotIrlAnswersCount = pinnedByFriendNotIrlAnswers.length;

  return (
    <>
      {pinnedByFriendNotIrlAnswers.length +
        pinnedNotIrlAnswers.length +
        userUnpinnedNativeNotIrlAnswers.length +
        userUnpinnedPseudonativeNotIrlAnswers.length +
        userSharedToContactCustomAnswers.length >
      0 ? (
        <>
          <ManyCriteriaCancelPinnableByFriend
            answers={pinnedByFriendNotIrlAnswers}
            answersLabel={answersLabels.pinnedByFriendNotIrl}
            noAnswersLabel={noAnswersLabels.pinnedByFriend}
            contact={contact}
          />
          <ManyCriteriaPinnableByFriend
            answers={pinnedNotIrlAnswers}
            answersLabel={answersLabels.pinnedNotIrl}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotIrlAnswersCount}
          />
          <ManyCriteriaPinnableByFriend
            answers={userUnpinnedNativeNotIrlAnswers}
            answersLabel={answersLabels.unpinnedNativeNotIrl}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotIrlAnswersCount}
          />
          <ManyCriteriaPinnableByFriend
            answers={userUnpinnedPseudonativeNotIrlAnswers}
            answersLabel={answersLabels.unpinnedPseudonativeNotIrl}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotIrlAnswersCount}
          />
          <ManyCriteriaPinnableByFriend
            answers={userSharedToContactCustomAnswers}
            answersLabel={answersLabels.sharedToContactCustom}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotIrlAnswersCount}
          />
        </>
      ) : (
        <>
          <p className="mt-2">
            {user.user_app_wide_name} has not exposed any criteria yet.
          </p>
        </>
      )}
    </>
  );
}

export async function ManyRelComboIrlCriteriaExposed({
  user,
  contact,
}: {
  user: User;
  contact: FoundContact;
}) {
  const [
    pinnedByFriendNotAndIrlAnswers, // new
    pinnedNotAndIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
    userUnpinnedNativeIrlAnswers,
    userUnpinnedPseudonativeIrlAnswers,
    userSharedToContactCustomAnswers, // optimisation
  ] = await Promise.all([
    fetchUserPinnedByFriendNotAndIrlAnswersExposed(
      user.user_id,
      contact.c1_contact_id,
    ), // new
    fetchUserPinnedNotAndIrlAnswersExposed(user.user_id, contact.c1_contact_id),
    fetchUserUnpinnedNativeNotIrlAnswersExposed(user.user_id),
    fetchUserUnpinnedPseudonativeNotIrlAnswersExposed(user.user_id),
    fetchUserUnpinnedNativeIrlAnswersExposed(user.user_id),
    fetchUserUnpinnedPseudonativeIrlAnswersExposed(user.user_id),
    fetchUserSharedToContactCustomAnswersExposed(
      user.user_id,
      contact.c1_contact_id,
    ), // optimisation
  ]);

  const pinnedByFriendNotAndIrlAnswersCount =
    pinnedByFriendNotAndIrlAnswers.length;

  return (
    <>
      {pinnedByFriendNotAndIrlAnswers.length +
        pinnedNotAndIrlAnswers.length +
        userUnpinnedNativeNotIrlAnswers.length +
        userUnpinnedPseudonativeNotIrlAnswers.length +
        userUnpinnedNativeIrlAnswers.length +
        userUnpinnedPseudonativeIrlAnswers.length +
        userSharedToContactCustomAnswers.length >
      0 ? (
        <>
          <ManyCriteriaCancelPinnableByFriend
            answers={pinnedByFriendNotAndIrlAnswers}
            answersLabel={answersLabels.pinnedByFriendNotAndIrl}
            noAnswersLabel={noAnswersLabels.pinnedByFriend}
            contact={contact}
          />
          <ManyCriteriaPinnableByFriend
            answers={pinnedNotAndIrlAnswers}
            answersLabel={answersLabels.pinnedNotAndIrl}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotAndIrlAnswersCount}
          />
          <ManyCriteriaPinnableByFriend
            answers={userUnpinnedNativeNotIrlAnswers}
            answersLabel={answersLabels.unpinnedNativeNotIrl}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotAndIrlAnswersCount}
          />
          <ManyCriteriaPinnableByFriend
            answers={userUnpinnedPseudonativeNotIrlAnswers}
            answersLabel={answersLabels.unpinnedPseudonativeNotIrl}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotAndIrlAnswersCount}
          />
          <ManyCriteriaPinnableByFriend
            answers={userUnpinnedNativeIrlAnswers}
            answersLabel={answersLabels.unpinnedNativeIrl}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotAndIrlAnswersCount}
          />
          <ManyCriteriaPinnableByFriend
            answers={userUnpinnedPseudonativeIrlAnswers}
            answersLabel={answersLabels.unpinnedPseudonativeIrl}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotAndIrlAnswersCount}
          />
          <ManyCriteriaPinnableByFriend
            answers={userSharedToContactCustomAnswers}
            answersLabel={answersLabels.sharedToContactCustom}
            contact={contact}
            pinnedbyFriendAnswersLength={pinnedByFriendNotAndIrlAnswersCount}
          />
        </>
      ) : (
        <>
          <p className="mt-2">
            {user.user_app_wide_name} has not exposed any criteria yet.
          </p>
        </>
      )}
    </>
  );
}

export async function ManyRelComboFriendCriteriaQueried({
  user,
  contact,
}: {
  user: User;
  contact: GatheredContact;
}) {
  const [
    pinnedNotIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
    userSharedToContactCustomAnswers, // optimisation
  ] = await Promise.all([
    fetchUserPinnedNotIrlAnswersQueried(user.user_id, contact.c1_contact_id),
    fetchUserUnpinnedNativeNotIrlAnswersQueried(user.user_id),
    fetchUserUnpinnedPseudonativeNotIrlAnswersQueried(user.user_id),
    fetchUserSharedToContactCustomAnswersQueried(
      user.user_id,
      contact.c1_contact_id,
    ), // optimisation
  ]);

  return (
    <>
      {pinnedNotIrlAnswers.length +
        userUnpinnedNativeNotIrlAnswers.length +
        userUnpinnedPseudonativeNotIrlAnswers.length +
        userSharedToContactCustomAnswers.length >
      0 ? (
        <>
          <ManyCriteria
            answers={pinnedNotIrlAnswers}
            answersLabel={answersLabels.pinnedNotIrl}
          />
          <ManyCriteria
            answers={userUnpinnedNativeNotIrlAnswers}
            answersLabel={answersLabels.unpinnedNativeNotIrl}
          />
          <ManyCriteria
            answers={userUnpinnedPseudonativeNotIrlAnswers}
            answersLabel={answersLabels.unpinnedPseudonativeNotIrl}
          />
          <ManyCriteria
            answers={userSharedToContactCustomAnswers}
            answersLabel={answersLabels.sharedToContactCustom}
          />
        </>
      ) : (
        <>
          <p className="mt-2">
            {user.user_app_wide_name} has not exposed any criteria yet.
          </p>
        </>
      )}
    </>
  );
}

export async function ManyRelComboIrlCriteriaQueried({
  user,
  contact,
}: {
  user: User;
  contact: GatheredContact;
}) {
  const [
    pinnedNotAndIrlAnswers,
    userUnpinnedNativeNotIrlAnswers,
    userUnpinnedPseudonativeNotIrlAnswers,
    userUnpinnedNativeIrlAnswers,
    userUnpinnedPseudonativeIrlAnswers,
    userSharedToContactCustomAnswers, // optimisation
  ] = await Promise.all([
    fetchUserPinnedNotAndIrlAnswersQueried(user.user_id, contact.c1_contact_id),
    fetchUserUnpinnedNativeNotIrlAnswersQueried(user.user_id),
    fetchUserUnpinnedPseudonativeNotIrlAnswersQueried(user.user_id),
    fetchUserUnpinnedNativeIrlAnswersQueried(user.user_id),
    fetchUserUnpinnedPseudonativeIrlAnswersQueried(user.user_id),
    fetchUserSharedToContactCustomAnswersQueried(
      user.user_id,
      contact.c1_contact_id,
    ), // optimisation
  ]);

  return (
    <>
      {pinnedNotAndIrlAnswers.length +
        userUnpinnedNativeNotIrlAnswers.length +
        userUnpinnedPseudonativeNotIrlAnswers.length +
        userUnpinnedNativeIrlAnswers.length +
        userUnpinnedPseudonativeIrlAnswers.length +
        userSharedToContactCustomAnswers.length >
      0 ? (
        <>
          <ManyCriteria
            answers={pinnedNotAndIrlAnswers}
            answersLabel={answersLabels.pinnedNotAndIrl}
          />
          <ManyCriteria
            answers={userUnpinnedNativeNotIrlAnswers}
            answersLabel={answersLabels.unpinnedNativeNotIrl}
          />
          <ManyCriteria
            answers={userUnpinnedPseudonativeNotIrlAnswers}
            answersLabel={answersLabels.unpinnedPseudonativeNotIrl}
          />
          <ManyCriteria
            answers={userUnpinnedNativeIrlAnswers}
            answersLabel={answersLabels.unpinnedNativeIrl}
          />
          <ManyCriteria
            answers={userUnpinnedPseudonativeIrlAnswers}
            answersLabel={answersLabels.unpinnedPseudonativeIrl}
          />
          <ManyCriteria
            answers={userSharedToContactCustomAnswers}
            answersLabel={answersLabels.sharedToContactCustom}
          />
        </>
      ) : (
        <>
          <p className="mt-2">
            {user.user_app_wide_name} has not exposed any criteria yet.
          </p>
        </>
      )}
    </>
  );
}
