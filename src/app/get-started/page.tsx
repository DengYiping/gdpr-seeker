import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CompanySearchResults,
  CompanySearchResultsSpinner,
} from "../_components/company-search-results";
import { AddCompanyButton } from "../_components/add-company-button";
import { CompanySearchBar } from "../_components/company-search-bar";
import { Suspense } from "react";

export default async function GetStartedPage(props: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sessionPromise = auth();
  const searchParamsPromise = props.searchParams;
  const listMinePromise = api.gdprRequest.listMine();

  const [session, searchParams, requests] = await Promise.all([
    sessionPromise,
    searchParamsPromise,
    listMinePromise,
  ]);

  const query = searchParams?.q ?? "";

  if (!session) {
    // Redirect to custom sign-in and return to this page after login
    redirect(`/sign-in?callbackUrl=${encodeURIComponent("/get-started")}`);
  }

  const name = session.user?.name ?? "there";

  const inProgress = requests.filter((r) => r.latestState !== "DONE");

  return (
    <HydrateClient>
      <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
        <div className="container mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome, {name}!
          </h1>
          {inProgress.length > 0 && (
            <div className="w-full text-left">
              <Card>
                <CardHeader>
                  <CardTitle>GDPR requests in progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inProgress.map((r) => {
                        const steps = [
                          "STARTED",
                          "RECEIVED",
                          "VERIFYING_PERSONAL_INFO",
                          "DONE",
                        ] as const;
                        const currentIdx = steps.indexOf(r.latestState);
                        const progress =
                          ((currentIdx + 1) / steps.length) * 100;
                        return (
                          <TableRow key={r.id}>
                            <TableCell>{r.companyName}</TableCell>
                            <TableCell>{r.position}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="text-muted-foreground text-xs">
                                  {r.latestState}
                                </span>
                                <div className="w-48">
                                  <Progress value={progress} />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {r.latestStateAt
                                ? (r.latestStateAt instanceof Date
                                    ? r.latestStateAt
                                    : new Date(r.latestStateAt)
                                  ).toLocaleString()
                                : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          <div className="w-full pt-2">
            <div className="w-full max-w-2xl">
              <div className="flex items-center gap-2">
                <CompanySearchBar defaultValue={query} />
              </div>

              {query && (
                <div className="mt-4 rounded-xl border">
                  <Suspense
                    fallback={<CompanySearchResultsSpinner />}
                    key={query}
                  >
                    <CompanySearchResults query={query} />
                  </Suspense>
                  <div className="flex items-center justify-end gap-3 border-t px-4 py-3">
                    <AddCompanyButton />
                  </div>
                </div>
              )}
            </div>
          </div>
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
