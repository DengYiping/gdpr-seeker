import { api } from "~/trpc/server";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Spinner } from "~/components/ui/shadcn-io/spinner";

export async function CompanySearchResults({ query }: { query: string }) {
  const hasQuery = query.trim().length > 0;

  const queryData = await api.company.searchByName({ query, limit: 10 });

  const data = hasQuery ? (queryData ?? []) : [];

  return (
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
  );
}

export function CompanySearchResultsSpinner() {
  return (
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
        <TableRow>
          <TableCell colSpan={4}>
            <div className="flex items-center justify-center">
              <Spinner className="text-muted-foreground" />
            </div>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
