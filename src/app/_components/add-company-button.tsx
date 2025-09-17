"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AddCompanyButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [gdprEmail, setGdprEmail] = useState("");

  const utils = api.useUtils();
  const createMutation = api.company.create.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      setOpen(false);
      setName("");
      setDomain("");
      setGdprEmail("");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Company</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="company-name">Company name</Label>
            <Input
              id="company-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., OpenAI"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="company-domain">Company domain</Label>
            <Input
              id="company-domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="gdpr-email">GDPR contact email</Label>
            <Input
              id="gdpr-email"
              type="email"
              value={gdprEmail}
              onChange={(e) => setGdprEmail(e.target.value)}
              placeholder="privacy@example.com"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={
              !name.trim() || !domain.trim() || !gdprEmail.trim() || createMutation.isPending
            }
            onClick={() =>
              createMutation.mutate({
                name: name.trim(),
                domain: domain.trim(),
                gdprEmail: gdprEmail.trim(),
              })
            }
          >
            {createMutation.isPending ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
