import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { BackButton } from "~/app/_components/back-button";
import { GdprRequestForm } from "~/app/_components/gdpr-request-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GdprRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const { companyId } = await searchParams;
  const session = await auth();
  if (!session) {
    redirect(
      `/sign-in?callbackUrl=${encodeURIComponent("/gdpr-request" + (companyId ? `?companyId=${companyId}` : ""))}`,
    );
  }
  if (!companyId) {
    redirect("/get-started");
  }

  const idNum = Number(companyId);
  if (!Number.isInteger(idNum) || idNum <= 0) {
    redirect("/get-started");
  }

  const company = await api.company.getById({ id: idNum });
  if (!company) {
    redirect("/get-started");
  }

  return (
    <HydrateClient>
      <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
        <div className="container mx-auto max-w-3xl px-6 py-20">
          <div className="mb-6">
            <BackButton />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Create GDPR Request</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-4 text-sm">
                <div>Company: {company.name}</div>
                <div>Domain: {company.domain}</div>
                <div>GDPR Email: {company.gdprEmail}</div>
              </div>
              <GdprRequestForm
                company={company}
                userEmail={session.user?.email}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </HydrateClient>
  );
}
