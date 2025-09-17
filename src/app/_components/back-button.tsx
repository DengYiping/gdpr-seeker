"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();
  return (
    <Button variant="outline" onClick={() => router.back()} aria-label="Go back">
      ← Back
    </Button>
  );
}
