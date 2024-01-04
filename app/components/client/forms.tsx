"use client";

import {
  createOrFindContactsByFriendCode,
  CreateOrFindContactsByFriendCodeFormState,
  updateUserAppWideName,
  UpdateUserAppWideNameFormState,
  updateUserFriendCode,
} from "@/app/lib/actions/users";
import { User } from "@/app/lib/definitions/users";
import { useFormState } from "react-dom";
import {
  AnswerInput,
  CustomizedQuestionInput,
  FriendCodeInput,
  NativeIrlQuestionSelect,
  NativeNotIrlQuestionSelect,
  OneCriteriaAnswerModifyInput,
  RelComboInput,
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
} from "@/app/lib/actions/answers";
import { Answer } from "@/app/lib/definitions/answers";
import {
  ButtonPinnable,
  ButtonAddUserQuestionFriend,
  ButtonDeleteUserQuestionFriend,
  ButtonPseudoable,
  Button,
} from "./buttons";
import { Friend } from "@/app/lib/definitions/contacts";
import { UserQuestion } from "@/app/lib/definitions/userquestions";
import { UserQuestionFriend } from "@/app/lib/definitions/userquestionfriends";
import {
  createUserQuestionFriend,
  deleteUserQuestionFriend,
} from "@/app/lib/actions/userquestionfriends";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  NativeIrlQuestion,
  NativeNotIrlQuestion,
} from "@/app/lib/definitions/questions";
import { LinkButton } from "./buttons";
import { revalidate } from "@/app/lib/actions/buttons";

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
      <form className="mt-4 flex flex-col items-center" action={formAction}>
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
        className="mb-4 mt-4 flex flex-col items-center"
        action={formAction}
      >
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
      <form className="flex flex-col items-center" action={formAction}>
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
      <form className="flex flex-col items-center" action={formAction}>
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
      <form className="mb-4 flex flex-col items-center" action={formAction}>
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
