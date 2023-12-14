"use client";

import { useRouter } from "next/navigation";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error);
  console.log(reset);

  const router = useRouter();
  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-8 py-32">
      <div className="max-w-prose text-center">
        <h1>Something went wrong. Probably.</h1>
        <p className="mt-2">
          Database calls can be messy sometimes, so it doesn&apos;t hurt to try
          again at least once. (If that fails, go for a hard refresh.)
        </p>
        <button
          className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400"
          onClick={handleRefresh}
        >
          Refresh the page
        </button>
      </div>
    </main>
  );
}
