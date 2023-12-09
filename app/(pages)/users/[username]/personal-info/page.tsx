export default function PersonalInfo({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const username = params.username;

  return (
    <main className="min-h-screen p-8 w-full flex justify-center items-center">
      <p>Welcome to {username}&apos;s Personal Info.</p>
    </main>
  );
}
