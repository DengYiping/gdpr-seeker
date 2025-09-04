"use client";

import { useState } from "react";

function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function EarlyAccessForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    | { state: "idle" }
    | { state: "submitting" }
    | { state: "success"; created: boolean }
    | { state: "error"; message: string }
  >({ state: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setStatus({ state: "error", message: "Enter a valid email." });
      return;
    }
    try {
      setStatus({ state: "submitting" });
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Request failed");
      }
      setStatus({ state: "success", created: Boolean(data?.created) });
      setEmail("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setStatus({ state: "error", message });
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
      <input
        type="email"
        inputMode="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md px-4 py-3 text-sm text-white border border-white/20 placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
        aria-label="Email address"
      />
      <button
        type="submit"
        disabled={status.state === "submitting"}
        className="inline-flex items-center justify-center rounded-md bg-white text-black px-5 py-3 text-sm font-medium hover:bg-neutral-100 disabled:opacity-60"
      >
        {status.state === "submitting" ? "Submitting…" : "Get early access"}
      </button>
      {status.state === "success" && (
        <p className="sm:col-span-2 text-sm text-white/80">
          {status.created
            ? "Thanks! You're on the list."
            : "You're already on the list. We'll be in touch."}
        </p>
      )}
      {status.state === "error" && (
        <p className="sm:col-span-2 text-sm text-red-200">{status.message}</p>
      )}
    </form>
  );
}


