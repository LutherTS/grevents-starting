import Link from "next/link";

export function PageLink({ href, name }: { href: string; name: string }) {
  return (
    <>
      <div>
        <Link href={href} className="inline-block pt-2 underline">
          {name}
        </Link>
      </div>
    </>
  );
}
