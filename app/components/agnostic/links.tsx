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
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div>
        <Link
          href={href}
          className="mt-2 inline-block text-blue-500 underline hover:text-blue-400 dark:hover:text-blue-600"
        >
          {children}
        </Link>
      </div>
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
