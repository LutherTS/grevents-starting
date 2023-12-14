"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error);

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <h1>Something went wrong.</h1>
        <p className="mt-2">
          Database calls can be messy sometimes, so it doesn't hurt to try again
          at least once.
        </p>
        <button
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
          onClick={
            // Attempt to recover by trying to re-render the invoices route
            () => reset()
          }
        >
          Reset requests
        </button>
      </div>
    </main>
  );
}
