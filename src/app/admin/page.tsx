import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function AdminPage() {
  const session = await auth();
  if (!session) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent("/admin")}`);
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b132b] to-[#1c2541] text-white">
      <div className="container mx-auto max-w-3xl px-6 py-20">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Admin</h1>

        <div className="overflow-hidden rounded-xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/10 text-white/80">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Domain</th>
                <th className="px-4 py-2">GDPR Email</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.length ? (
                companies.map((c) => (
                  <tr key={c.id} className="odd:bg-white/5">
                    <td className="px-4 py-2">{c.name}</td>
                    <td className="px-4 py-2">{c.domain}</td>
                    <td className="px-4 py-2">{c.gdprEmail}</td>
                    <td className="px-4 py-2">
                      <form action={verify.bind(null, c.id)} className="inline">
                        <button className="mr-2 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-500">
                          Verify
                        </button>
                      </form>
                      <form
                        action={removeCompany.bind(null, c.id)}
                        className="inline"
                      >
                        <button className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500">
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3" colSpan={4}>
                    No unverified companies
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
