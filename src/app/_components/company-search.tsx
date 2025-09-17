"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { api } from "~/trpc/react";
import { AddCompanyButton } from "~/app/_components/add-company-button";

export function CompanySearch() {
  const searchParams = useSearchParams();
  const initialQ = (searchParams.get("q") ?? "").trim();
  const [prefix, setPrefix] = useState(initialQ);
  const [debouncedPrefix, setDebouncedPrefix] = useState(initialQ);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(
    null,
  );
  const router = useRouter();

  // Initialize once from URL; avoid syncing afterward to prevent overwriting.

  useEffect(() => {
    const id = setTimeout(() => setDebouncedPrefix(prefix.trim()), 250);
    return () => clearTimeout(id);
  }, [prefix]);

  const { data, isFetching } = api.company.searchByName.useQuery(
    { query: debouncedPrefix, limit: 10 },
    {
      enabled: debouncedPrefix.length > 0,
    },
  );

  const lastSuccessfulDataRef = useRef<typeof data | null>(null);
  useEffect(() => {
    if (data) lastSuccessfulDataRef.current = data;
  }, [data]);

  const rowsToRender = useMemo(() => {
    if (data && data.length > 0) return data;
    if (isFetching && lastSuccessfulDataRef.current)
      return lastSuccessfulDataRef.current;
    return data ?? [];
  }, [data, isFetching]);

  useEffect(() => {
    if (selectedCompanyId == null) return;
    const stillExists = rowsToRender.some((c) => c.id === selectedCompanyId);
    if (!stillExists) setSelectedCompanyId(null);
  }, [rowsToRender, selectedCompanyId]);

  const hasQuery = prefix.trim().length > 0;

  // Do not sync the search query back to the URL on every keystroke to
  // avoid triggering server re-renders of the page.

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <input
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          placeholder="Fuzzy search companies by name (e.g., 'mic soft' → Microsoft)"
          className="min-w-0 flex-1 rounded-full bg-white/10 px-4 py-2 text-white placeholder-white/60"
        />
      </div>

      {hasQuery && (
        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/10 text-white/80">
              <tr>
                <th className="px-4 py-2">Select</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Domain</th>
                <th className="px-4 py-2">GDPR Email</th>
              </tr>
            </thead>
            <tbody>
              {rowsToRender?.length ? (
                rowsToRender.map((c) => (
                  <tr key={c.id} className="odd:bg-white/5">
                    <td className="px-4 py-2 align-middle">
                      <input
                        type="radio"
                        name="companySelect"
                        checked={selectedCompanyId === c.id}
                        onChange={() => setSelectedCompanyId(c.id)}
                        aria-label={`Select ${c.name}`}
                      />
                    </td>
                    <td className="px-4 py-2">{c.name}</td>
                    <td className="px-4 py-2">{c.domain}</td>
                    <td className="px-4 py-2">{c.gdprEmail}</td>
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
            <button
              type="button"
              className="rounded-full bg-blue-500 px-5 py-2 font-semibold text-white hover:bg-blue-400 disabled:opacity-60"
              disabled={!selectedCompanyId}
              onClick={() => {
                if (!selectedCompanyId) return;
                router.push(`/gdpr-request?companyId=${selectedCompanyId}`);
              }}
            >
              Create a GDPR request
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// moved to its own file
