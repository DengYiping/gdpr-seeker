import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import { Button } from "@/components/ui/button";
import { CompanySearchSection } from "../_components/company-search-section";
import {
  GdprRequestsInProgress,
  GdprRequestsInProgressSpinner,
} from "../_components/gdpr-requests-in-progress";
import { Suspense } from "react";

export default async function GetStartedPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const session = await auth();

  if (!session) {
    // Redirect to custom sign-in and return to this page after login
    redirect(`/sign-in?callbackUrl=${encodeURIComponent("/get-started")}`);
  }

  const name = session.user?.name ?? "there";

  return (
    <HydrateClient>
      <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
        <div className="container mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome, {name}!
          </h1>
          <Suspense fallback={<GdprRequestsInProgressSpinner />}>
            <GdprRequestsInProgress />
          </Suspense>
          <CompanySearchSection {...props} />
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="ghost">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
