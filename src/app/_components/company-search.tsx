"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { keepPreviousData } from "@tanstack/react-query";
import Link from "next/link";

import { api } from "~/trpc/react";
import { AddCompanyButton } from "~/app/_components/add-company-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CompanySearch() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const qFromUrl = (searchParams?.get("q") ?? "").trim();

  const hasQuery = qFromUrl.length > 0;

  const { data: queryData } = api.company.searchByName.useQuery(
    { query: qFromUrl, limit: 10 },
    { enabled: hasQuery, placeholderData: keepPreviousData },
  );

  const data = hasQuery ? (queryData ?? []) : [];

  // Follow Next.js tutorial pattern with use-debounce
  const debouncedReplace = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams ?? undefined);
    const term = value.trim();
    if (term) params.set("q", term);
    else params.delete("q");
    const url = params.size
      ? `?${params.toString()}`
      : window.location.pathname;
    router.replace(url);
  }, 300);
  const onChange = (value: string) => debouncedReplace(value);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex items-center gap-2">
        <Input
          defaultValue={qFromUrl}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Fuzzy search companies by name (e.g., 'mic soft' → Microsoft)"
        />
      </div>

      {hasQuery && (
        <div className="mt-4 rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>GDPR Email</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length ? (
                data.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.domain}</TableCell>
                    <TableCell>{c.gdprEmail}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild>
                        <Link href={`/gdpr-request?companyId=${c.id}`}>
                          Create request
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No results</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-end gap-3 border-t px-4 py-3">
            <AddCompanyButton />
          </div>
        </div>
      )}
    </div>
  );
}

// moved to its own file
