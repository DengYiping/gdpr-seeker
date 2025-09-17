"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-static";

export default function SignInPage() {
  return (
    <SessionProvider>
      <Suspense fallback={<SignInContent callbackUrl="/get-started" />}>
        <SignInPageContent />
      </Suspense>
    </SessionProvider>
  );
}
function SignInPageContent() {
  // if session is authenticated, redirect to callbackUrl or /get-started
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") ?? "/get-started";
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  return <SignInContent callbackUrl={callbackUrl} />;
}

function SignInContent({ callbackUrl }: { callbackUrl: string }) {
  return (
    <main className="bg-background text-foreground flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Continue to Unghosted to create and track GDPR requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            className="w-full"
            onClick={() => void signIn("discord", { callbackUrl })}
          >
            Continue with Discord
          </Button>
          <Separator />
          <div className="text-muted-foreground text-xs">
            By continuing you agree to our processing of your account info
            solely for authentication.
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
          <div className="text-muted-foreground text-xs">
            Need help? Contact us.
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
