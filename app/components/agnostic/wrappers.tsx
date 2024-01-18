export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="max-w-prose rounded-lg bg-white px-8 py-16 text-center sm:min-w-[65ch] dark:bg-gray-950">
        {children}
      </div>
    </>
  );
}
