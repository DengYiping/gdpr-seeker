"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateTimePicker } from "@/components/ui/datetime-picker";

type CompanySummary = {
  id: number;
  name: string;
  domain: string;
  gdprEmail: string;
};

type InterviewRow = {
  type: string;
  date: Date | undefined;
  dateInput: string;
  time: string; // HH:MM (24h)
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
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [dobInput, setDobInput] = useState("");
  const [interviews, setInterviews] = useState<InterviewRow[]>([
    { type: "", date: undefined, dateInput: "", time: "" },
  ]);

  const utils = api.useUtils();
  const { data: last } = api.gdprRequest.getMyLatest.useQuery(undefined, {
    staleTime: 5 * 60 * 1000,
  });

  const [prefilled, setPrefilled] = useState(false);
  useEffect(() => {
    if (!prefilled && last) {
      if (!firstName) setFirstName(last.firstName);
      if (!lastName) setLastName(last.lastName);
      if (!phone) setPhone(last.phone);
      if (!dob && last.dateOfBirth) {
        const d = new Date(last.dateOfBirth);
        if (!isNaN(d.getTime())) setDob(d);
      }
      if (last.dateOfBirth) setDobInput(last.dateOfBirth);
      setPrefilled(true);
    }
  }, [last, prefilled, firstName, lastName, phone, dob]);
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
    setInterviews((prev) => [
      ...prev,
      { type: "", date: undefined, dateInput: "", time: "" },
    ]);
  }

  function removeInterview(index: number) {
    setInterviews((prev) => prev.filter((_, i) => i !== index));
  }

  function updateInterviewType(index: number, value: string) {
    setInterviews((prev) =>
      prev.map((row, i) => (i === index ? { ...row, type: value } : row)),
    );
  }
  function updateInterviewTime(index: number, value: string) {
    setInterviews((prev) =>
      prev.map((row, i) => (i === index ? { ...row, time: value } : row)),
    );
  }
  function setInterviewDate(index: number, date: Date | undefined) {
    setInterviews((prev) =>
      prev.map((row, i) =>
        i === index
          ? { ...row, date, dateInput: date ? formatDate(date) : row.dateInput }
          : row,
      ),
    );
  }
  function setInterviewDateInput(index: number, value: string) {
    setInterviews((prev) =>
      prev.map((row, i) => (i === index ? { ...row, dateInput: value } : row)),
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
      dateOfBirth: dob
        ? new Date(Date.UTC(dob.getFullYear(), dob.getMonth(), dob.getDate()))
            .toISOString()
            .slice(0, 10)
        : "",
      interviews: interviews
        .map((i) => {
          const dateStr = i.date ? formatDate(i.date) : "";
          const timeStr = (i.time || "").trim();
          return {
            type: i.type,
            time: dateStr && timeStr ? `${dateStr}T${timeStr}` : "",
          };
        })
        .filter((i) => i.type.trim() && i.time),
    };
    createMutation.mutate(payload);
  }

  // keyboard date helpers
  function formatDate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  function tryParseDate(input: string): Date | undefined {
    const s = input.trim();
    if (!s) return undefined;
    // prefer YYYY-MM-DD
    const re = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
    const m = re.exec(s);
    if (m) {
      const yyyy = Number(m[1]);
      const mm = Number(m[2]);
      const dd = Number(m[3]);
      const d = new Date(Date.UTC(yyyy, mm - 1, dd));
      if (!isNaN(d.getTime()))
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    const d = new Date(s);
    if (!isNaN(d.getTime())) return d;
    return undefined;
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="first-name">First name</Label>
          <Input
            id="first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g., Jane"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="last-name">Last name</Label>
          <Input
            id="last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="e.g., Doe"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="position">Position applied for</Label>
          <Input
            id="position"
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., Senior Software Engineer"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="applicant-email">Email used for application</Label>
          <Input
            id="applicant-email"
            type="email"
            value={applicantEmail}
            onChange={(e) => setApplicantEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g., +1 555-555-5555"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label>Date of birth</Label>
          <div className="flex gap-2">
            <Input
              placeholder="YYYY-MM-DD"
              value={dobInput}
              onChange={(e) => setDobInput(e.target.value)}
              onBlur={() => {
                const parsed = tryParseDate(dobInput);
                if (parsed) setDob(parsed);
              }}
              aria-label="Date of birth"
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" type="button">
                  Calendar
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={dob}
                  onSelect={(d) => {
                    setDob(d);
                    setDobInput(d ? formatDate(d) : "");
                  }}
                  captionLayout="dropdown"
                  fromYear={1940}
                  toYear={new Date().getFullYear()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Interviews</h2>
          <Button type="button" variant="ghost" onClick={addInterview}>
            + Add interview
          </Button>
        </div>

        <div className="space-y-3">
          {interviews.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px_auto]"
            >
              <Input
                type="text"
                value={row.type}
                onChange={(e) => updateInterviewType(idx, e.target.value)}
                placeholder="Interview type (e.g., Phone screen, Onsite)"
                required
              />
              <DateTimePicker
                date={row.date}
                time={row.time}
                onChange={({ date, time }) => {
                  setInterviewDate(idx, date);
                  updateInterviewTime(idx, time);
                  setInterviewDateInput(idx, date ? formatDate(date) : "");
                }}
                aria-label="Interview date and time"
                className="col-span-2"
              />
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeInterview(idx)}
                  aria-label="Remove interview"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button type="submit" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Submitting..." : "Submit GDPR request"}
        </Button>
      </div>
    </form>
  );
}
