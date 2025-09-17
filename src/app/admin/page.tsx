import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
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

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent("/admin")}`);
  }

  // verify frontend guard by calling listUnverified; it will throw if not admin
  let companies: Awaited<ReturnType<typeof api.company.listUnverified>> = [];
  try {
    companies = await api.company.listUnverified();
  } catch {
    redirect("/get-started");
  }

  async function verify(id: number) {
    "use server";
    await api.company.verify({ id });
    redirect("/admin");
  }

  async function removeCompany(id: number) {
    "use server";
    await api.company.remove({ id });
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="container mx-auto max-w-3xl px-6 py-20">
        <Card>
          <CardHeader>
            <CardTitle>Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>GDPR Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.length ? (
                  companies.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.domain}</TableCell>
                      <TableCell>{c.gdprEmail}</TableCell>
                      <TableCell>
                        <form action={verify.bind(null, c.id)} className="inline">
                          <Button size="sm" className="mr-2">
                            Verify
                          </Button>
                        </form>
                        <form action={removeCompany.bind(null, c.id)} className="inline">
                          <Button size="sm" variant="destructive">
                            Delete
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4}>No unverified companies</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
