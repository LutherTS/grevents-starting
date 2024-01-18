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
      <div className="flex max-w-prose flex-col justify-center rounded-lg bg-white px-12 py-16 text-center sm:min-h-[70vh] sm:min-w-[65ch] dark:bg-gray-950">
        {children}
      </div>
    </>
  );
}
