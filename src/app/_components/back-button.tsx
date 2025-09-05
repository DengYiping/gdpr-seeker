"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="rounded-full border border-white/30 px-4 py-2 text-sm font-semibold hover:bg-white/10"
      onClick={() => router.back()}
      aria-label="Go back"
    >
      ← Back
    </button>
  );
}
