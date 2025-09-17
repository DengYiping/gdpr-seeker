import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "~/trpc/server";
import { Spinner } from "~/components/ui/shadcn-io/spinner";

export async function GdprRequestsInProgress() {
  const requests = await api.gdprRequest.listMine();
  const inProgress = (requests ?? []).filter((r) => r.latestState !== "DONE");

  if (inProgress.length === 0) return null;

  return (
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
                const currentIdx = steps.findIndex(
                  (step) => step === r.latestState,
                );
                const progress =
                  ((Math.max(currentIdx, 0) + 1) / steps.length) * 100;
                const updatedAt = r.latestStateAt
                  ? r.latestStateAt instanceof Date
                    ? r.latestStateAt
                    : new Date(r.latestStateAt)
                  : null;
                return (
                  <TableRow key={r.id}>
                    <TableCell>{r.companyName}</TableCell>
                    <TableCell>{r.position}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground text-xs">
                          {r.latestState}
                        </span>
                        <div className="w-48">
                          <Progress value={progress} />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {updatedAt ? updatedAt.toLocaleString() : "-"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export async function GdprRequestsInProgressSpinner() {
  return (
    <div className="w-full text-left">
      <Card>
        <CardHeader>
          <CardTitle>GDPR requests in progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Spinner className="text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
