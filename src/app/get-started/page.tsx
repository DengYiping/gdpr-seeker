import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, currentUser } from "@clerk/nextjs/server";
import { HydrateClient } from "~/trpc/server";
import { Button } from "@/components/ui/button";
import { CompanySearchSection } from "../_components/company-search-section";
import {
  GdprRequestsInProgress,
  GdprRequestsInProgressSpinner,
} from "../_components/gdpr-requests-in-progress";
import { Suspense } from "react";
import { SignOutClientButton } from "../_components/sign-out-client-button";

export default async function GetStartedPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect(`/sign-in?redirect_url=${encodeURIComponent("/get-started")}`);
  }

  const user = await currentUser();
  const name = user?.firstName ?? user?.username ?? user?.fullName ?? "there";

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
            <SignOutClientButton />
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
