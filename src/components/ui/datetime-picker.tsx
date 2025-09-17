"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

export type DateTimePickerProps = {
  date?: Date;
  time?: string; // HH:MM
  onChange: (next: { date?: Date; time: string }) => void;
  placeholder?: string;
  className?: string;
  "aria-label"?: string;
};

export function DateTimePicker({
  date,
  time = "",
  onChange,
  placeholder = "YYYY-MM-DD HH:MM",
  className,
  ...props
}: DateTimePickerProps) {
  const [text, setText] = React.useState<string>(formatDateTime(date, time));

  React.useEffect(() => {
    setText(formatDateTime(date, time));
  }, [date, time]);

  function commit(nextDate: Date | undefined, nextTime: string) {
    onChange({ date: nextDate, time: nextTime });
    setText(formatDateTime(nextDate, nextTime));
  }

  function handleBlur() {
    const parsed = parseDateTime(text);
    if (parsed) {
      commit(parsed.date ?? date, parsed.time ?? time);
    } else if (text.trim() === "") {
      commit(undefined, "");
    } else {
      // keep previous valid state, normalize text
      setText(formatDateTime(date, time));
    }
  }

  return (
    <div className={cn("grid grid-cols-[1fr_auto] gap-2", className)}>
      <Input
        {...props}
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        aria-label={props["aria-label"] ?? "Date and time"}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" aria-label="Pick date and time">
            <CalendarIcon className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-3 w-fit">
          <div className="flex flex-col gap-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => commit(d, time)}
              captionLayout="dropdown"
              fromYear={1940}
              toYear={new Date().getFullYear()}
              initialFocus
            />
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <TimePicker
                value={time}
                onChange={(t) => commit(date, t)}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function formatDate(d?: Date) {
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDateTime(d?: Date, t?: string) {
  const date = formatDate(d);
  const time = (t ?? "").trim();
  if (date && time) return `${date} ${time}`;
  if (date) return date;
  if (time) return time;
  return "";
}

function parseDateTime(input: string): { date?: Date; time?: string } | null {
  const s = input.trim();
  if (!s) return { date: undefined, time: "" };
  // Accept "YYYY-MM-DD HH:MM", "YYYY-MM-DD", "HH:MM"
  const parts = s
    .split(/[\sT]+/)
    .filter((p): p is string => Boolean(p)); // space or T
  if (parts.length === 2) {
    const datePart = parts[0]!;
    const timePart = parts[1]!;
    const d = tryParseDate(datePart);
    const t = tryParseTime(timePart);
    if (d && t) return { date: d, time: t };
    if (d) return { date: d };
    if (t) return { time: t };
    return null;
  }
  if (parts.length === 1) {
    const one = parts[0]!;
    const d = tryParseDate(one);
    if (d) return { date: d };
    const t = tryParseTime(one);
    if (t) return { time: t };
  }
  return null;
}

function tryParseDate(input: string): Date | undefined {
  const s = input.trim();
  if (!s) return undefined;
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
  const d2 = new Date(s);
  if (!isNaN(d2.getTime())) return d2;
  return undefined;
}

function tryParseTime(s: string): string | null {
  const re = /^(\d{1,2})(?::?(\d{2}))?$/;
  const m = re.exec(s.trim());
  if (!m) return null;
  const hh = Number(m[1]);
  const mm = typeof m[2] === "string" ? Number(m[2]) : 0;
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}
