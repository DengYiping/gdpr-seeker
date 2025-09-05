"use client";

import { useEffect, useState } from "react";

import { api } from "~/trpc/react";

export function AddCompanyButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [gdprEmail, setGdprEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const utils = api.useUtils();
  const createMutation = api.company.create.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      setOpen(false);
      setName("");
      setDomain("");
      setGdprEmail("");
      setShowSuccess(true);
    },
  });

  useEffect(() => {
    if (!showSuccess) return;
    const t = setTimeout(() => setShowSuccess(false), 2500);
    return () => clearTimeout(t);
  }, [showSuccess]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/10"
          onClick={() => setOpen(true)}
        >
          Add Company
        </button>
      </div>

      {showSuccess && (
        <div
          role="status"
          aria-live="polite"
          className="fixed right-6 bottom-6 z-[80] max-w-md rounded-lg border border-green-500 bg-green-600/90 px-4 py-3 text-white shadow-lg"
        >
          Company added. Our admin will review and verify the company data
          protection information
        </div>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#1c2541] p-4 shadow-xl">
              <div className="mb-3 text-base font-semibold">Add Company</div>
              <div className="grid grid-cols-1 gap-3">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Company name"
                  className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
                />
                <input
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="Company domain (example.com)"
                  className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
                />
                <input
                  type="email"
                  value={gdprEmail}
                  onChange={(e) => setGdprEmail(e.target.value)}
                  placeholder="GDPR contact email"
                  className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
                />
              </div>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/10"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-400 disabled:opacity-60"
                  disabled={
                    !name.trim() ||
                    !domain.trim() ||
                    !gdprEmail.trim() ||
                    createMutation.isPending
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
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
