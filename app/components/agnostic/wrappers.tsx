export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex max-w-prose flex-col justify-center rounded-lg bg-white px-12 py-16 text-center sm:min-h-[65vh] sm:min-w-[65ch] dark:bg-gray-950">
        {children}
      </div>
    </>
  );
}
