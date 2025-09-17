"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { keepPreviousData } from "@tanstack/react-query";

import { api } from "~/trpc/react";
import { AddCompanyButton } from "~/app/_components/add-company-button";

export function CompanySearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const qFromUrl = (searchParams.get("q") ?? "").trim();

  const { data } = api.company.searchByName.useQuery(
    { query: qFromUrl, limit: 10 },
    {
      enabled: qFromUrl.length > 0,
      placeholderData: keepPreviousData,
    },
  );

  const rowsToRender = data ?? [];

  const hasQuery = qFromUrl.length > 0;

  // Follow Next.js tutorial pattern with use-debounce
  const debouncedReplace = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    const term = value.trim();
    if (term) params.set("q", term);
    else params.delete("q");
    router.replace(`${pathname}${params.size ? `?${params.toString()}` : ""}`);
  }, 300);
  const onChange = (value: string) => debouncedReplace(value);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <input
          defaultValue={qFromUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Fuzzy search companies by name (e.g., 'mic soft' → Microsoft)"
          className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 text-white placeholder-white/60"
        />
      </div>

      {hasQuery && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/10 text-white/80">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Domain</th>
                <th className="px-4 py-2">GDPR Email</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {rowsToRender?.length ? (
                rowsToRender.map((c) => (
                  <tr key={c.id} className="odd:bg-white/5">
                    <td className="px-4 py-2">{c.name}</td>
                    <td className="px-4 py-2">{c.domain}</td>
                    <td className="px-4 py-2">{c.gdprEmail}</td>
                    <td className="px-4 py-2">
                      <button
                        type="button"
                        className="rounded-full bg-blue-500 px-4 py-1.5 font-semibold text-white hover:bg-blue-400"
                        onClick={() => router.push(`/gdpr-request?companyId=${c.id}`)}
                      >
                        Create request
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3" colSpan={4}>
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-white/5 px-4 py-3">
            <AddCompanyButton />
          </div>
        </div>
      )}
    </div>
  );
}

// moved to its own file
