"use client";

import * as React from "react";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type TimePickerProps = {
  value?: string;
  onChange?: (value: string) => void;
  stepMinutes?: number; // list granularity
  className?: string;
  "aria-label"?: string;
};

export function TimePicker({
  value = "",
  onChange,
  stepMinutes = 15,
  className,
  ...props
}: TimePickerProps) {
  const [input, setInput] = React.useState<string>(value);
  React.useEffect(() => {
    setInput(value);
  }, [value]);

  function format(h: number, m: number) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  function parseToHHMM(raw: string): string | null {
    const s = raw.trim();
    if (!s) return ""; // treat empty as empty
    // Accept HH:MM, H:MM, HHMM, HMM, HH
    const re = /^(\d{1,2})(?::?(\d{2}))?$/;
    const m = re.exec(s);
    if (!m) return null;
    const hh = Number(m[1]);
    const mm = typeof m[2] === "string" ? Number(m[2]) : 0;
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
    if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
    return format(hh, mm);
  }

  function commit(v: string) {
    setInput(v);
    onChange?.(v);
  }

  const options: string[] = React.useMemo(() => {
    const items: string[] = [];
    for (let m = 0; m < 24 * 60; m += stepMinutes) {
      const h = Math.floor(m / 60);
      const mm = m % 60;
      items.push(format(h, mm));
    }
    return items;
  }, [stepMinutes]);

  return (
    <div className={cn("grid grid-cols-[1fr_auto] gap-2", className)}>
      <Input
        {...props}
        placeholder="HH:MM"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={() => {
          const out = parseToHHMM(input);
          if (out !== null) commit(out);
        }}
        aria-invalid={input !== "" && parseToHHMM(input) === null}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" aria-label="Pick time">
            <Clock className="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-48">
          <div className="max-h-64 overflow-auto py-1">
            {options.map((t) => (
              <button
                key={t}
                type="button"
                className={cn(
                  "w-full text-left px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                  t === value && "bg-accent text-accent-foreground"
                )}
                onClick={() => commit(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
