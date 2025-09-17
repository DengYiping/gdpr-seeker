import Link from "next/link";
import { redirect } from "next/navigation";

import { auth, signOut } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { CompanySearch } from "~/app/_components/company-search";
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

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();

  if (!session) {
    // Redirect to custom sign-in and return to this page after login
    redirect(`/sign-in?callbackUrl=${encodeURIComponent("/get-started")}`);
  }

  const name = session.user?.name ?? "there";
  const qFromUrl = ((await searchParams).q ?? "").trim();

  const listMinePromise = api.gdprRequest.listMine();
  let searchByNamePromiseMaybe: Promise<void> | undefined;

  if (qFromUrl.length > 0) {
    searchByNamePromiseMaybe = api.company.searchByName.prefetch({
      query: qFromUrl,
      limit: 10,
    });
  }
  const requests = await listMinePromise;
  if (searchByNamePromiseMaybe) {
    await searchByNamePromiseMaybe;
  }
  const inProgress = requests.filter((r) => r.latestState !== "DONE");

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="container mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">Welcome, {name}!</h1>
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
                        const progress = ((currentIdx + 1) / steps.length) * 100;
                        return (
                          <TableRow key={r.id}>
                            <TableCell>{r.companyName}</TableCell>
                            <TableCell>{r.position}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">
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
            <CompanySearch />
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
            <form
              action={async () => {
                "use server";
                await signOut();
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
