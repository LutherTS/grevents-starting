"use client";

import { useRouter, usePathname } from "next/navigation";
import { revalidate } from "@/app/lib/actions/buttons";

export function Button({
  action,
  children,
}: {
  action: (...rest: any) => any;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400 dark:hover:bg-blue-600"
        onClick={action}
      >
        {children}
      </button>
    </>
  );
}

export function BackButton() {
  const router = useRouter();

  return (
    <>
      <Button action={() => router.back()}>
        Or go back to the previous page
      </Button>
    </>
  );
}

export function RevalidateButton() {
  const pathname = usePathname();

  return (
    <>
      <Button action={() => revalidate(pathname)}>Revalidate the data</Button>
    </>
  );
}

export function Toast({
  action,
  children,
}: {
  action: (...rest: any) => any;
  children: React.ReactNode;
}) {
  return (
    <>
      <button onClick={action}>{children}</button>
    </>
  );
}

export function LinkButton({
  action,
  children,
}: {
  action?: (...rest: any) => any;
  children: React.ReactNode;
}) {
  return (
    <>
      <button
        className="mt-2 inline-block text-blue-500 hover:text-blue-400 dark:hover:text-blue-600"
        onClick={action}
      >
        {children}
      </button>
    </>
  );
}
