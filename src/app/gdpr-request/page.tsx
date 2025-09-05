import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { BackButton } from "~/app/_components/back-button";
import { GdprRequestForm } from "~/app/_components/gdpr-request-form";

export default async function GdprRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string }>;
}) {
  const { companyId } = await searchParams;
  const session = await auth();
  if (!session) {
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent("/gdpr-request" + (companyId ? `?companyId=${companyId}` : ""))}`,
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b132b] to-[#1c2541] text-white">
      <div className="container mx-auto max-w-3xl px-6 py-20">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="mb-4 text-3xl font-extrabold tracking-tight">
          Create GDPR Request
        </h1>
        <p className="text-white/80">Company: {company.name}</p>
        <p className="text-white/60">Domain: {company.domain}</p>
        <p className="text-white/60">GDPR Email: {company.gdprEmail}</p>

        <GdprRequestForm company={company} userEmail={session.user?.email} />
      </div>
    </main>
  );
}
