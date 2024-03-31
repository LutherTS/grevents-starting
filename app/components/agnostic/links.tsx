import { User } from "@/app/libraries/definitions/users";
import Link from "next/link";

export function PageLink({ href, name }: { href: string; name: string }) {
  return (
    <>
      <div>
        <Link
          href={href}
          className="mt-2 inline-block text-blue-500 underline hover:text-blue-400 dark:hover:text-blue-600"
        >
          {name}
        </Link>
      </div>
    </>
  );
}

export function PageLinkWithChildren({
  href,
  children,
  specifiedClassName,
}: {
  href: string;
  children: React.ReactNode;
  specifiedClassName?: string;
}) {
  return (
    <>
      <div>
        <Link
          href={href}
          className={
            specifiedClassName
              ? specifiedClassName
              : "mt-2 inline-block text-blue-500 underline hover:text-blue-400 dark:hover:text-blue-600"
          }
        >
          {children}
        </Link>
      </div>
    </>
  );
}

export function ContactLinkWithChildren({
  href,
  children,
  specifiedClassName,
}: {
  href: string;
  children: React.ReactNode;
  specifiedClassName?: string;
}) {
  return (
    <>
      <Link
        href={href}
        className={
          specifiedClassName
            ? specifiedClassName
            : "font-semibold text-blue-500 hover:text-blue-400 dark:hover:text-blue-600"
        }
      >
        {children}
      </Link>
    </>
  );
}

export function ActionLink({ children }: { children: React.ReactNode }) {
  return (
    <>
      <p className="mt-2 text-sky-500">{children}</p>
    </>
  );
}

export function BackToDashboardLink({
  session,
}: {
  session: { [K in "user"]: User };
}) {
  return (
    <>
      <PageLink
        href={`/users/${session.user.user_username}/dashboard`}
        name={`back to dashboard`}
      />
    </>
  );
}
