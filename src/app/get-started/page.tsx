import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";
import { CompanySearch } from "~/app/_components/company-search";

export default async function GetStartedPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();

  if (!session) {
    // Redirect to NextAuth sign-in and return to this page after login
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent("/get-started")}`,
    );
  }

  const name = session.user?.name ?? "there";
  const { q } = await searchParams;
  const requests = await api.gdprRequest.listMine();
  const inProgress = requests.filter((r) => r.latestState !== "DONE");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b132b] to-[#1c2541] text-white">
      <div className="container mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-20 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Welcome, {name}!
        </h1>
        {inProgress.length > 0 && (
          <div className="w-full">
            <div className="mb-2 text-left text-white/80">
              GDPR requests in progress
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10 text-left">
              <table className="min-w-full text-sm">
                <thead className="bg-white/10 text-white/80">
                  <tr>
                    <th className="px-4 py-2">Company</th>
                    <th className="px-4 py-2">Position</th>
                    <th className="px-4 py-2">State</th>
                    <th className="px-4 py-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {inProgress.map((r) => {
                    const steps = [
                      "STARTED",
                      "RECEIVED",
                      "VERIFYING_PERSONAL_INFO",
                      "DONE",
                    ] as const;
                    const currentIdx = steps.indexOf(r.latestState);
                    return (
                      <tr key={r.id} className="odd:bg-white/5">
                        <td className="px-4 py-2">{r.companyName}</td>
                        <td className="px-4 py-2">{r.position}</td>
                        <td className="px-4 py-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-white/80">
                              {r.latestState}
                            </span>
                            <div className="flex w-48 gap-1">
                              {steps.map((s, idx) => (
                                <div
                                  key={s}
                                  className={
                                    "h-1.5 flex-1 rounded-full " +
                                    (idx <= currentIdx
                                      ? "bg-green-500"
                                      : "bg-white/20")
                                  }
                                  aria-label={`${s}${idx === currentIdx ? " (current)" : ""}`}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-white/70">
                          {r.latestStateAt
                            ? (r.latestStateAt instanceof Date
                                ? r.latestStateAt
                                : new Date(r.latestStateAt)
                              ).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="w-full pt-2">
          <CompanySearch initialQuery={q ?? ""} />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full border border-white/30 px-6 py-3 text-base font-semibold hover:bg-white/10"
          >
            Back to home
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
