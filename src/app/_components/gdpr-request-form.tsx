"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

type CompanySummary = {
  id: number;
  name: string;
  domain: string;
  gdprEmail: string;
};

export function GdprRequestForm({
  company,
  userEmail,
}: {
  company: CompanySummary;
  userEmail: string | null | undefined;
}) {
  const router = useRouter();
  const [position, setPosition] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState(userEmail ?? "");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [interviews, setInterviews] = useState<
    { type: string; time: string }[]
  >([{ type: "", time: "" }]);

  const utils = api.useUtils();
  const createMutation = api.gdprRequest.create.useMutation({
    onSuccess: async () => {
      await utils.invalidate();
      router.push("/get-started");
    },
    onError: (err) => {
      alert(err.message || "Failed to submit GDPR request.");
    },
  });

  function addInterview() {
    setInterviews((prev) => [...prev, { type: "", time: "" }]);
  }

  function removeInterview(index: number) {
    setInterviews((prev) => prev.filter((_, i) => i !== index));
  }

  function updateInterview(
    index: number,
    field: "type" | "time",
    value: string,
  ) {
    setInterviews((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      companyId: company.id,
      position,
      firstName,
      lastName,
      applicantEmail,
      phone,
      dateOfBirth: dob,
      interviews: interviews.filter((i) => i.type.trim() && i.time.trim()),
    };
    createMutation.mutate(payload);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm text-white/80">First name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
            placeholder="e.g., Jane"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Last name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
            placeholder="e.g., Doe"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">
            Position applied for
          </label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
            placeholder="e.g., Senior Software Engineer"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">
            Email used for application
          </label>
          <input
            type="email"
            value={applicantEmail}
            onChange={(e) => setApplicantEmail(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
            placeholder="you@example.com"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
            placeholder="e.g., +1 555-555-5555"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-white/80">
            Date of birth
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
            required
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Interviews</h2>
          <button
            type="button"
            onClick={addInterview}
            className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white hover:bg-white/20"
          >
            + Add interview
          </button>
        </div>

        <div className="space-y-3">
          {interviews.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px_auto]"
            >
              <input
                type="text"
                value={row.type}
                onChange={(e) => updateInterview(idx, "type", e.target.value)}
                className="rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
                placeholder="Interview type (e.g., Phone screen, Onsite)"
                required
              />
              <input
                type="datetime-local"
                value={row.time}
                onChange={(e) => updateInterview(idx, "time", e.target.value)}
                className="rounded-lg bg-white/10 px-3 py-2 text-white placeholder-white/60 focus:outline-none"
                required
              />
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => removeInterview(idx)}
                  className="rounded-full border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
                  aria-label="Remove interview"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
        <button
          type="submit"
          className="rounded-full bg-blue-500 px-5 py-2 font-semibold text-white hover:bg-blue-400 disabled:opacity-60"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Submitting..." : "Submit GDPR request"}
        </button>
      </div>
    </form>
  );
}
