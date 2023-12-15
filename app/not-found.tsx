export default function PageNotFound() {
  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center p-8">
        <div className="max-w-prose text-center">
          <h1 className="font-semibold">Oops.</h1>
          <p className="mt-2">
            This page doesn&apos;t exist. Or perhaps it doesn&apos;t exist yet.
          </p>
          <p className="mt-2">
            You'll find a link back home here once the home page is ready.
          </p>
        </div>
      </main>
    </>
  );
}
