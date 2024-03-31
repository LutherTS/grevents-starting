export function Main({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center px-8 py-24">
        {children}
      </main>
    </>
  );
}

export function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col justify-center rounded-lg bg-transparent px-8 py-16 text-center sm:min-h-[70vh] sm:min-w-[55ch] sm:max-w-prose sm:bg-white sm:px-12 sm:dark:bg-neutral-900">
        {children}
      </div>
    </>
  );
}
