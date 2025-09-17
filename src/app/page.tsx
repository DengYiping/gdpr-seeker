import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="container mx-auto flex max-w-5xl flex-col items-center justify-center gap-10 px-6 py-20">
        <header className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-xl font-bold">
              U
            </div>
            <span className="text-lg font-semibold tracking-wide">Unghosted</span>
          </div>
          <nav className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="#features">Features</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#how-it-works">How it works</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="#faq">FAQ</Link>
            </Button>
          </nav>
        </header>

        <section className="flex w-full flex-col items-center gap-6 text-center">
          <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">
            Take control of your interview data and request feedback
          </h1>
          <p className="max-w-2xl text-lg text-balance text-muted-foreground">
            Unghosted helps candidates easily file GDPR data access and
            deletion requests to companies—especially after interviews—so you
            can understand decisions and request constructive feedback.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/get-started" prefetch={false}>
                Get started
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="#learn-more">Learn more</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">GDPR Data Request</CardTitle>
              <CardDescription>
                Generate and send a GDPR data access request to companies to
                obtain your personal data collected during the interview process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mt-2 list-outside list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Guided form with compliant language</li>
                <li>Company contact finder and template email</li>
                <li>Timeline tracking and follow-up reminders</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">GDPR Delete Request</CardTitle>
              <CardDescription>
                Request deletion of your personal data from company systems after
                the interview process.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mt-2 list-outside list-disc space-y-1 pl-5 text-muted-foreground">
                <li>Auto-generated, legally grounded request</li>
                <li>Track responses and deadlines</li>
                <li>Evidence archive for all correspondence</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section id="how-it-works" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">How it works</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="mt-2 list-inside list-decimal space-y-2 text-muted-foreground">
                <li>Enter the company and interview details.</li>
                <li>Choose Data Access or Delete request (or both).</li>
                <li>We generate compliant emails and track due dates.</li>
                <li>Send via your email client and monitor replies in one place.</li>
              </ol>
            </CardContent>
          </Card>
        </section>

        <section id="faq" className="w-full">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Why is this useful?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Many recruiters decline to provide feedback after interviews. Under
                GDPR, you have rights to access your data and understand automated
                decisions. Unghosted streamlines exercising those rights and
                increases your chances of receiving actionable feedback.
              </p>
            </CardContent>
          </Card>
        </section>

        <footer className="mt-4 w-full text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Unghosted. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
