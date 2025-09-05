import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

export default async function GetStartedPage() {
  const session = await auth();

  if (!session) {
    // Redirect to NextAuth sign-in and return to this page after login
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent("/get-started")}`,
    );
  }

  const name = session.user?.name ?? "there";

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b132b] to-[#1c2541] text-white">
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Welcome, {name}!
        </h1>
        <p className="text-white/80">
          You're signed in. You're all set to create your first GDPR request.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/30 px-6 py-3 text-base font-semibold hover:bg-white/10"
          >
            Back to home
          </Link>
          <Link
            href="#"
            className="rounded-full bg-blue-500 px-6 py-3 text-base font-semibold text-white shadow hover:bg-blue-400"
          >
            Create a GDPR request
          </Link>
          <Link
            href="/api/auth/signout"
            className="rounded-full bg-white/10 px-6 py-3 text-base font-semibold hover:bg-white/20"
          >
            Sign out
          </Link>
        </div>
      </div>
    </main>
  );
}
