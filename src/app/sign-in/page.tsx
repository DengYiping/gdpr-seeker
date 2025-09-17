import Link from "next/link";
import { redirect } from "next/navigation";

import { signIn, auth } from "~/server/auth";
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

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session) {
    redirect((await searchParams).callbackUrl ?? "/get-started");
  }

  const callbackUrl = (await searchParams).callbackUrl ?? "/get-started";

  async function signInDiscord() {
    "use server";
    await signIn("discord", { redirectTo: callbackUrl });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Continue to Unghosted to create and track GDPR requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={signInDiscord}>
            <Button className="w-full">Continue with Discord</Button>
          </form>
          <Separator />
          <div className="text-xs text-muted-foreground">
            By continuing you agree to our processing of your account info
            solely for authentication.
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button asChild variant="outline">
            <Link href="/">Back to home</Link>
          </Button>
          <div className="text-xs text-muted-foreground">Need help? Contact us.</div>
        </CardFooter>
      </Card>
    </main>
  );
}

