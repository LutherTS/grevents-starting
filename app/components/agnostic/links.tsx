import Link from "next/link";

export function PageLink({ href, name }: { href: string; name: string }) {
  return (
    <>
      <div>
        <Link href={href} className="mt-2 inline-block underline">
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
        <Link href={href} className="mt-2 inline-block underline">
          {children}
        </Link>
      </div>
    </>
  );
}
