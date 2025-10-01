import { SignIn } from "@clerk/nextjs";

export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn />
      </div>
    </main>
  );
}
