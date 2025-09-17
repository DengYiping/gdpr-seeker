"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";

export function CompanySearchBar(props: { defaultValue?: string }) {
  const { defaultValue } = props;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Input
      defaultValue={defaultValue ?? searchParams?.get("q") ?? ""}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams ?? "");
        if (e.target.value) {
          params.set("q", e.target.value);
        } else {
          params.delete("q");
        }
        router.replace(`${pathname}?${params.toString()}`);
      }}
      placeholder="Fuzzy search companies by name (e.g., 'mic soft' → Microsoft)"
    />
  );
}
