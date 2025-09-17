import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function Loading() {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <Spinner
        size={28}
        className="text-muted-foreground"
        aria-label="Loading"
      />
    </div>
  );
}
