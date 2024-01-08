"use client";

import {
  createOrFindContactsByFriendCode,
  CreateOrFindContactsByFriendCodeFormState,
  signInUser,
  SignInUserFormState,
  signUpUser,
  SignUpUserFormState,
  updateUserAppWideName,
  UpdateUserAppWideNameFormState,
  updateUserFriendCode,
} from "@/app/libraries/actions/users";
import { User } from "@/app/libraries/definitions/users";
import { useFormState } from "react-dom";
import {
  AnswerInput,
  CustomizedQuestionInput,
  FriendCodeInput,
  NativeIrlQuestionSelect,
  NativeNotIrlQuestionSelect,
  OneCriteriaAnswerModifyInput,
  RelComboInput,
  SignInput,
  UserAppWideNameModifyInput,
  UserLastInput,
} from "./inputs";
import {
  createCustomAnswer,
  CreateCustomAnswerFormState,
  createNativeIrlAnswer,
  CreateNativeIrlAnswerFormState,
  createNativeNotIrlAnswer,
  CreateNativeNotIrlAnswerFormState,
  createPseudonativeIrlAnswer,
  CreatePseudonativeIrlAnswerFormState,
  createPseudonativeNotIrlAnswer,
  CreatePseudonativeNotIrlAnswerFormState,
  pinOrUnpinUserQuestionOfAnswer,
  switchUserQuestionKindOfAnswer,
  updateOrDeleteAnswerValue,
  UpdateOrDeleteAnswerValueFormState,
} from "@/app/libraries/actions/answers";
import { Answer } from "@/app/libraries/definitions/answers";
import {
  ButtonPinnable,
  ButtonAddUserQuestionFriend,
  ButtonDeleteUserQuestionFriend,
  ButtonPseudoable,
  Button,
  FormButton,
} from "./buttons";
import { FoundContact, Friend } from "@/app/libraries/definitions/contacts";
import { UserQuestion } from "@/app/libraries/definitions/userquestions";
import { UserQuestionFriend } from "@/app/libraries/definitions/userquestionfriends";
import {
  createUserQuestionFriend,
  deleteUserQuestionFriend,
} from "@/app/libraries/actions/userquestionfriends";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  NativeIrlQuestion,
  NativeNotIrlQuestion,
} from "@/app/libraries/definitions/questions";
import { LinkButton } from "./buttons";
import { revalidate } from "@/app/libraries/actions/buttons";
import {
  acceptFriendRequest,
  acceptIrlRequest,
  annulFriendRequest,
  annulUpgradeFriendshipToIrl,
  block,
  declineFriendRequest,
  declineIrlRequest,
  downgradeFriendshipFromIrl,
  sendFriendRequest,
  unblock,
  unfriend,
  upgradeFriendshipToIrl,
} from "@/app/libraries/actions/contacts";
import { ManyRelationCombinations } from "../agnostic/lists";

export function UserAppWideNameModifyForm({ user }: { user: User }) {
  const initialState: UpdateUserAppWideNameFormState = {
    errors: {},
    message: null,
  };
  const updateUserAppWideNameWithUser = updateUserAppWideName.bind(null, user);
  const [state, formAction] = useFormState(
    updateUserAppWideNameWithUser,
    initialState,
  );

  return (
    <>
      <form action={formAction}>
        <label htmlFor="user-app-wide-name">
          {/* This and similar shouldn't have the mt-2, the form rather */}
          <p className="mt-2">App-wide name *</p>
        </label>
        <UserAppWideNameModifyInput user={user} />
        {state && state.errors?.userAppWideName ? (
          <div id="app-wide-name-error" aria-live="polite">
            {state.errors.userAppWideName.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="app-wide-name-form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
      </form>
    </>
  );
}

export function OneCriteriaAnswerModifyForm({ answer }: { answer: Answer }) {
  const initialState: UpdateOrDeleteAnswerValueFormState = {
    errors: {},
    message: null,
  };
  const updateOrDeleteAnswerValueWithAnswer = updateOrDeleteAnswerValue.bind(
    null,
    answer,
  );
  const [state, formAction] = useFormState(
    updateOrDeleteAnswerValueWithAnswer,
    initialState,
  );

  return (
    <>
      <form action={formAction}>
        <label className="sr-only" htmlFor={answer.answer_id}>
          Modify answer &quot;{answer.answer_value}&quot;
        </label>
        <OneCriteriaAnswerModifyInput answer={answer} />
        {state && state.errors?.answerValue ? (
          <div id={`answer-value-error-${answer.answer_id}`} aria-live="polite">
            {state.errors.answerValue.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id={`form-error-${answer.answer_id}`} aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
      </form>
    </>
  );
}

export function UserFriendCodeUpdateForm({ user }: { user: User }) {
  return (
    <>
      <form className="mt-2" action={() => updateUserFriendCode(user)}>
        <LinkButton>Generate a new friend code</LinkButton>
      </form>
    </>
  );
}

/* No longer in use
export function SendFriendRequestForm({
  user,
  contact,
}: {
  user: User;
  contact: FoundContact;
}) {
  return (
    <>
      <form
        className="mt-2"
        action={() => sendFriendRequestButItsAutoFriend(contact, user)}
        // action={() => sendFriendRequest(contact, user)}
      >
        <LinkButton>Send friend request but it&apos;s auto friend</LinkButton>
      </form>
    </>
  );
}

export function UpgradeFriendshipToIrlForm({
  user,
  contact,
}: {
  user: User;
  contact: FoundContact;
}) {
  return (
    <>
      <form
        className="mt-2"
        action={() => upgradeFriendshipToIrlButItsAutoIrl(contact, user)}
        // action={() => upgradeFriendshipToIrl(contact, user)}
      >
        <LinkButton>
          Upgrade friendship to irl but it&apos;s auto irl
        </LinkButton>
      </form>
    </>
  );
}
*/

export function DowngradeFriendshipToIrlForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form
        className="mt-2"
        action={() => downgradeFriendshipFromIrl(contact, user, session)}
      >
        <LinkButton>Downgrade friendship from irl</LinkButton>
      </form>
    </>
  );
}

export function UnfriendForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form className="mt-2" action={() => unfriend(contact, user, session)}>
        <LinkButton>Unfriend</LinkButton>
      </form>
    </>
  );
}

export function BlockForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form className="mt-2" action={() => block(contact, user, session)}>
        <LinkButton>Block</LinkButton>
      </form>
    </>
  );
}

export function UnblockForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form className="mt-2" action={() => unblock(contact, user, session)}>
        <LinkButton>Unblock</LinkButton>
      </form>
    </>
  );
}

export function BlockBackForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form className="mt-2" action={() => block(contact, user, session)}>
        <LinkButton>Block back</LinkButton>
      </form>
    </>
  );
}

export function UnblockIfThatsOKWithYouForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form className="mt-2" action={() => unblock(contact, user, session)}>
        <LinkButton>Unblock if that&apos;s OK with you</LinkButton>
      </form>
    </>
  );
}

// Continues

export function SendFriendForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form
        className="mt-2"
        action={() => sendFriendRequest(contact, user, session)}
      >
        <LinkButton>Send friend request</LinkButton>
      </form>
    </>
  );
}

export function DeclineFriendForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form
        className="inline-block"
        action={() => declineFriendRequest(contact, user, session)}
      >
        <LinkButton>Decline</LinkButton>
      </form>
    </>
  );
}

export function AcceptFriendForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form
        className="inline-block"
        action={() => acceptFriendRequest(contact, user, session)}
      >
        <LinkButton>Accept</LinkButton>
      </form>
    </>
  );
}

export function UpgradeToIrlForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form
        className="mt-2"
        action={() => upgradeFriendshipToIrl(contact, user, session)}
      >
        <LinkButton>Upgrade friendship to irl</LinkButton>
      </form>
    </>
  );
}

export function DeclineIrlForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form
        className="inline"
        action={() => declineIrlRequest(contact, user, session)}
      >
        <LinkButton>Decline</LinkButton>
      </form>
    </>
  );
}

export function AcceptIrlForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form
        className="inline"
        action={() => acceptIrlRequest(contact, user, session)}
      >
        <LinkButton>Accept</LinkButton>
      </form>
    </>
  );
}

export function AnnulFriendForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form
        className="mt-2"
        action={() => annulFriendRequest(contact, user, session)}
      >
        <LinkButton>Annul friend request</LinkButton>
      </form>
    </>
  );
}

export function AnnulIrlForm({
  contact,
  user,
  session,
}: {
  contact: FoundContact;
  user: User;
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <form
        className="mt-2"
        action={() => annulUpgradeFriendshipToIrl(contact, user, session)}
      >
        <LinkButton>Annul irl upgrade request</LinkButton>
      </form>
    </>
  );
}

export function RevalidateButtonForm() {
  const pathname = usePathname();

  return (
    <>
      <form className="mt-4" action={() => revalidate(pathname)}>
        <Button>Revalidate the data</Button>
      </form>
    </>
  );
}
export function BackButtonForm() {
  const router = useRouter();

  return (
    <>
      <form className="mt-4" action={() => router.back()}>
        <Button>Or go back to the previous page</Button>
      </form>
    </>
  );
}

export function ButtonPinnableForm({ answer }: { answer: Answer }) {
  return (
    <>
      <form
        className="me-2 flex items-center"
        action={() => pinOrUnpinUserQuestionOfAnswer(answer)}
      >
        <ButtonPinnable answer={answer} />
      </form>
    </>
  );
}

export function ButtonPseudoableForm({ answer }: { answer: Answer }) {
  return (
    <>
      <form
        className="ms-2 flex items-center"
        action={() => switchUserQuestionKindOfAnswer(answer)}
      >
        <ButtonPseudoable answer={answer} />
      </form>
    </>
  );
}

export function ButtonAddUserQuestionFriendForm({
  userQuestion,
  contact,
}: {
  userQuestion: UserQuestion;
  contact: Friend;
}) {
  return (
    <>
      <form
        className="me-2 flex items-center"
        action={() => createUserQuestionFriend(userQuestion, contact)}
      >
        <ButtonAddUserQuestionFriend />
      </form>
    </>
  );
}

export function ButtonDeleteUserQuestionFriendForm({
  userQuestion,
  userQuestionFriend,
}: {
  userQuestion: UserQuestion;
  userQuestionFriend: UserQuestionFriend;
}) {
  return (
    <>
      <form
        className="me-2 flex items-center"
        action={() =>
          deleteUserQuestionFriend(userQuestion, userQuestionFriend)
        }
      >
        <ButtonDeleteUserQuestionFriend />
      </form>
    </>
  );
}

export function FriendCodeInputForm({
  // friendCode,
  user,
}: {
  // friendCode: string;
  user: User;
}) {
  const initialState: CreateOrFindContactsByFriendCodeFormState = {
    errors: {},
    message: null,
  };
  const createOrFindContactsByFriendCodeWithUser =
    createOrFindContactsByFriendCode.bind(null, user);
  const [state, formAction] = useFormState(
    createOrFindContactsByFriendCodeWithUser,
    initialState,
  );

  return (
    <>
      <form
        className="mt-2"
        action={formAction}
        // A form action will be required in order to show error messages.
      >
        <label htmlFor="friend-code">
          <p>Find a user by their friend code.</p>
        </label>
        <FriendCodeInput />
        {state && state.errors?.otherUserFriendCode ? (
          <div id="question-id-native-not-irl-error" aria-live="polite">
            {state.errors.otherUserFriendCode.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="native-not-irl-answer-form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
      </form>
    </>
  );
}

export function UserLastInputForm({ userLast }: { userLast: string }) {
  return (
    <>
      <form className="mt-2">
        <label htmlFor="user-last">
          <p>
            Type the username of a user you are acquainted with. (userlast in
            searchParams.)
          </p>
        </label>
        <UserLastInput userLast={userLast} />
      </form>
    </>
  );
}

export function RelComboInputForm({ relCombo }: { relCombo: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  function handleSubmit(formData: FormData) {
    // console.log(formData);
    const params = new URLSearchParams(searchParams);
    // console.log(params);
    const term = formData.get("relcombo")?.toString();
    // console.log(term);

    if (term) {
      params.set("relcombo", term);
    } else {
      params.delete("relcombo");
    }
    // console.log(params);

    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <form
        className="mt-2"
        action={(formData) => handleSubmit(formData)}
        // Action still needed to be developed, to add to the existing searchParams.
      >
        <ManyRelationCombinations />
        <RelComboInput relCombo={relCombo} />
      </form>
    </>
  );
}

/* Some explaining.
Theoritically, I should apply this elongated logic to userlast as well for consistency. But in this case, I specifically want userlast to override relcombo in searchParams. (In order for a queried preview on any user to begin with the current relcombo between userfirst and userlast.) That's why the default behavior turns out to be exactly what I need.
*/

/* To develop during UI phase.
export function RelComboSelectForm({ relCombo }: { relCombo: string }) {
  return (
    <>
      <form
        className="mt-2"
        // Action doesn't seem automatic with a select.
      >
        <RelComboSelect relCombo={relCombo} />
      </form>
    </>
  );
}
*/

// All that is missing below is integrated labels.

export function NativeNotIrlAnswerForm({
  allNativeNotIrlQuestions,
  user,
}: {
  allNativeNotIrlQuestions: NativeNotIrlQuestion[];
  user: User;
}) {
  const initialState: CreateNativeNotIrlAnswerFormState = {
    errors: {},
    message: null,
  };
  const createNativeNotIrlAnswerWithUser = createNativeNotIrlAnswer.bind(
    null,
    user,
  );
  const [state, formAction] = useFormState(
    createNativeNotIrlAnswerWithUser,
    initialState,
  );

  return (
    <>
      <form className="mt-2 flex flex-col items-center" action={formAction}>
        <label htmlFor="native-not-irl-question" className="sr-only">
          Select a native question below
        </label>
        <label htmlFor="native-not-irl-answer">
          <p className="mt-2 font-semibold text-zinc-500">
            Select then answer a native question below
          </p>
        </label>
        <NativeNotIrlQuestionSelect
          allNativeNotIrlQuestions={allNativeNotIrlQuestions}
        />
        {state && state.errors?.questionId ? (
          <div id="question-id-native-not-irl-error" aria-live="polite">
            {state.errors.questionId.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <AnswerInput
          id="native-not-irl-answer"
          name="nativenotirlanswer"
          placeholder="Answer that native question"
        />
        {state && state.errors?.initialAnswerValue ? (
          <div
            id="initial-answer-value-native-not-irl-error"
            aria-live="polite"
          >
            {state.errors.initialAnswerValue.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="native-not-irl-answer-form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
      </form>
    </>
  );
}

export function NativeIrlAnswerForm({
  allNativeIrlQuestions,
  user,
}: {
  allNativeIrlQuestions: NativeIrlQuestion[];
  user: User;
}) {
  const initialState: CreateNativeIrlAnswerFormState = {
    errors: {},
    message: null,
  };
  const createNativeIrlAnswerWithUser = createNativeIrlAnswer.bind(null, user);
  const [state, formAction] = useFormState(
    createNativeIrlAnswerWithUser,
    initialState,
  );

  return (
    <>
      {/* Has the margin bottom 4. */}
      <form
        className="mb-4 mt-2 flex flex-col items-center"
        action={formAction}
      >
        <label htmlFor="native-irl-question" className="sr-only">
          Select a native irl question below
        </label>
        <label htmlFor="native-irl-answer">
          <p className="mt-2 font-semibold text-zinc-500">
            Select then answer a native irl question below
          </p>
        </label>
        <NativeIrlQuestionSelect
          allNativeIrlQuestions={allNativeIrlQuestions}
        />
        {state && state.errors?.questionId ? (
          <div id="question-id-native-irl-error" aria-live="polite">
            {state.errors.questionId.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <AnswerInput
          id="native-irl-answer"
          name="nativeirlanswer"
          placeholder="Answer that native irl question"
        />
        {state && state.errors?.initialAnswerValue ? (
          <div id="initial-answer-value-native-irl-error" aria-live="polite">
            {state.errors.initialAnswerValue.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="native-irl-answer-form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
      </form>
    </>
  );
}

export function PseudoNativeNotIrlAnswerForm({ user }: { user: User }) {
  const initialState: CreatePseudonativeNotIrlAnswerFormState = {
    errors: {},
    message: null,
  };
  const createPseudonativeNotIrlAnswerWithUser =
    createPseudonativeNotIrlAnswer.bind(null, user);
  const [state, formAction] = useFormState(
    createPseudonativeNotIrlAnswerWithUser,
    initialState,
  );

  return (
    <>
      <form className="mt-2 flex flex-col items-center" action={formAction}>
        <label htmlFor="pseudonative-not-irl-question">
          <p className="mt-2 font-semibold text-zinc-500">
            Create then answer a pseudonative question below
          </p>
        </label>
        <label htmlFor="pseudonative-not-irl-answer" className="sr-only">
          Answer a pseudonative question below
        </label>
        <CustomizedQuestionInput
          id="pseudonative-not-irl-question"
          name="pseudonativenotirlquestion"
          placeholder="Enter a pseudonative question"
        />
        {state && state.errors?.initialQuestionName ? (
          <div
            id="initial-question-name-pseudonative-not-irl-error"
            aria-live="polite"
          >
            {state.errors.initialQuestionName.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <AnswerInput
          id="pseudonative-not-irl-answer"
          name="pseudonativenotirlanswer"
          placeholder="Answer that pseudonative question"
        />
        {state && state.errors?.initialAnswerValue ? (
          <div
            id="initial-answer-value-pseudonative-not-irl-error"
            aria-live="polite"
          >
            {state.errors.initialAnswerValue.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="pseudonative-not-irl-answer-form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
        {/* Currently necessary to send the full form via Enter */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>
    </>
  );
}

export function PseudoNativeIrlAnswerForm({ user }: { user: User }) {
  const initialState: CreatePseudonativeIrlAnswerFormState = {
    errors: {},
    message: null,
  };
  const createPseudonativeIrlAnswerWithUser = createPseudonativeIrlAnswer.bind(
    null,
    user,
  );
  const [state, formAction] = useFormState(
    createPseudonativeIrlAnswerWithUser,
    initialState,
  );

  return (
    <>
      <form className="mt-2 flex flex-col items-center" action={formAction}>
        <label htmlFor="pseudonative-irl-question">
          <p className="mt-2 font-semibold text-zinc-500">
            Create then answer a pseudonative irl question below
          </p>
        </label>
        <label htmlFor="pseudonative-irl-answer" className="sr-only">
          Answer a pseudonative irl question below
        </label>
        <CustomizedQuestionInput
          id="pseudonative-irl-question"
          name="pseudonativeirlquestion"
          placeholder="Enter a pseudonative irl question"
        />
        {state && state.errors?.initialQuestionName ? (
          <div
            id="initial-question-name-pseudonative-irl-error"
            aria-live="polite"
          >
            {state.errors.initialQuestionName.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <AnswerInput
          id="pseudonative-irl-answer"
          name="pseudonativeirlanswer"
          placeholder="Answer that pseudonative irl question"
        />
        {state && state.errors?.initialAnswerValue ? (
          <div
            id="initial-answer-value-pseudonative-irl-error"
            aria-live="polite"
          >
            {state.errors.initialAnswerValue.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="pseudonative-irl-answer-form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
        {/* Currently necessary to send the full form via Enter */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>
    </>
  );
}

export function CustomAnswerForm({ user }: { user: User }) {
  const initialState: CreateCustomAnswerFormState = {
    errors: {},
    message: null,
  };
  const createCustomAnswerWithUser = createCustomAnswer.bind(null, user);
  const [state, formAction] = useFormState(
    createCustomAnswerWithUser,
    initialState,
  );

  return (
    <>
      {/* Has the margin bottom 4. */}
      <form
        className="mb-4 mt-2 flex flex-col items-center"
        action={formAction}
      >
        <label htmlFor="custom-question">
          <p className="mt-2 font-semibold text-zinc-500">
            Create then answer a custom question below
          </p>
        </label>
        <label htmlFor="custom-answer" className="sr-only">
          Answer a custom question below
        </label>
        <CustomizedQuestionInput
          id="custom-question"
          name="customquestion"
          placeholder="Enter a custom question"
        />
        {state && state.errors?.initialQuestionName ? (
          <div id="initial-question-name-custom-error" aria-live="polite">
            {state.errors.initialQuestionName.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <AnswerInput
          id="custom-answer"
          name="customanswer"
          placeholder="Answer that custom question"
        />
        {state && state.errors?.initialAnswerValue ? (
          <div id="initial-answer-value-custom-error" aria-live="polite">
            {state.errors.initialAnswerValue.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="custom-answer-form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
        {/* Currently necessary to send the full form via Enter */}
        <button type="submit" className="hidden">
          Submit
        </button>
      </form>
    </>
  );
}

export function SignInForm() {
  const initialState: SignInUserFormState = {
    errors: {},
    message: null,
  };
  const [state, formAction] = useFormState(signInUser, initialState);

  return (
    <>
      {/* Has the margin bottom 4. */}
      <form className="mb-4 flex flex-col items-center" action={formAction}>
        <label htmlFor="username-or-email">
          <p className="mt-4">Username or email *</p>
        </label>
        <SignInput
          id="username-or-email"
          name="usernameoremail"
          placeholder="Enter your username or your email"
        />
        {state && state.errors?.userUsernameOrEmail ? (
          <div id="username-or-email-error" aria-live="polite">
            {state.errors.userUsernameOrEmail.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <label htmlFor="login-password">
          <p className="mt-4">Password *</p>
        </label>
        <SignInput
          id="login-password"
          name="loginpassword"
          placeholder="Enter your password"
          type="password"
        />
        {state && state.errors?.userLoginPassword ? (
          <div id="password-error" aria-live="polite">
            {state.errors.userLoginPassword.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="sign-in-form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
        {/* Currently necessary to send the full form via Enter */}
        <FormButton>Sign in</FormButton>
      </form>
    </>
  );
}

export function SignUpForm() {
  const initialState: SignUpUserFormState = {
    errors: {},
    message: null,
  };
  const [state, formAction] = useFormState(signUpUser, initialState);

  return (
    <>
      {/* Has the margin bottom 4. */}
      <form className="mb-4 flex flex-col items-center" action={formAction}>
        <label htmlFor="username">
          <p className="mt-4">Username *</p>
        </label>
        <SignInput
          id="username"
          name="username"
          placeholder="Enter your username"
        />
        {state && state.errors?.userUsername ? (
          <div id="username-error" aria-live="polite">
            {state.errors.userUsername.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <label htmlFor="app-wide-name">
          <p className="mt-4">App-wide name *</p>
        </label>
        <SignInput
          id="app-wide-name"
          name="appwidename"
          placeholder="Enter your app-wide name"
        />
        {state && state.errors?.userAppWideName ? (
          <div id="app-wide-name-error" aria-live="polite">
            {state.errors.userAppWideName.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <label htmlFor="email">
          <p className="mt-4">Email *</p>
        </label>
        <SignInput id="email" name="email" placeholder="Enter your email" />
        {state && state.errors?.userEmail ? (
          <div id="email-error" aria-live="polite">
            {state.errors.userEmail.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <label htmlFor="password">
          <p className="mt-4">Password *</p>
        </label>
        <SignInput
          id="password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
        {state && state.errors?.userPassword ? (
          <div id="password-error" aria-live="polite">
            {state.errors.userPassword.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        <label htmlFor="confirm-password">
          <p className="mt-4">Confirm password *</p>
        </label>
        <SignInput
          id="confirm-password"
          name="confirmpassword"
          placeholder="Confirm your password"
          type="password"
        />
        {state && state.errors?.userConfirmPassword ? (
          <div id="confirm-password-error" aria-live="polite">
            {state.errors.userConfirmPassword.map((error: string) => (
              <p className="mt-2 text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        ) : null}
        {state && state.message ? (
          <div id="sign-up-form-error" aria-live="polite">
            <p className="mt-2 text-red-500">{state.message}</p>
          </div>
        ) : null}
        {/* Currently necessary to send the full form via Enter */}
        <FormButton>Sign up</FormButton>
      </form>
    </>
  );
}
