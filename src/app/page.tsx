import Link from "next/link";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#0b132b] to-[#1c2541] text-white">
      <div className="container mx-auto flex max-w-5xl flex-col items-center justify-center gap-10 px-6 py-20">
        <header className="flex w-full items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-xl font-bold">
              U
            </div>
            <span className="text-lg font-semibold tracking-wide">
              unghosted
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="#features"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              How it works
            </Link>
            <Link
              href="#faq"
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10"
            >
              FAQ
            </Link>
          </nav>
        </header>

        <section className="flex w-full flex-col items-center gap-6 text-center">
          <h1 className="max-w-3xl text-5xl font-extrabold tracking-tight sm:text-6xl">
            Take control of your interview data and request feedback
          </h1>
          <p className="max-w-2xl text-lg text-balance text-white/80">
            unghosted helps candidates easily file GDPR data access and
            deletion requests to companies—especially after interviews—so you
            can understand decisions and request constructive feedback.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/get-started"
              className="rounded-full bg-blue-500 px-6 py-3 text-base font-semibold text-white shadow hover:bg-blue-400"
            >
              Get started
            </Link>
            <Link
              href="#learn-more"
              className="rounded-full border border-white/30 px-6 py-3 text-base font-semibold hover:bg-white/10"
            >
              Learn more
            </Link>
          </div>
        </section>

        <section
          id="features"
          className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2"
        >
          <div className="rounded-xl bg-white/5 p-6">
            <h2 className="text-2xl font-bold">GDPR Data Request</h2>
            <p className="mt-2 text-white/80">
              Generate and send a GDPR data access request to companies to
              obtain your personal data collected during the interview process.
            </p>
            <ul className="mt-4 list-outside list-disc space-y-1 pl-5 text-white/80">
              <li>Guided form with compliant language</li>
              <li>Company contact finder and template email</li>
              <li>Timeline tracking and follow-up reminders</li>
            </ul>
          </div>
          <div className="rounded-xl bg-white/5 p-6">
            <h2 className="text-2xl font-bold">GDPR Delete Request</h2>
            <p className="mt-2 text-white/80">
              Request deletion of your personal data from company systems after
              the interview process.
            </p>
            <ul className="mt-4 list-outside list-disc space-y-1 pl-5 text-white/80">
              <li>Auto-generated, legally grounded request</li>
              <li>Track responses and deadlines</li>
              <li>Evidence archive for all correspondence</li>
            </ul>
          </div>
        </section>

        <section id="how-it-works" className="w-full rounded-xl bg-white/5 p-6">
          <h2 className="text-2xl font-bold">How it works</h2>
          <ol className="mt-4 list-inside list-decimal space-y-2 text-white/80">
            <li>Enter the company and interview details.</li>
            <li>Choose Data Access or Delete request (or both).</li>
            <li>We generate compliant emails and track due dates.</li>
            <li>
              Send via your email client and monitor replies in one place.
            </li>
          </ol>
        </section>

        <section id="faq" className="w-full">
          <h2 className="text-2xl font-bold">Why is this useful?</h2>
          <p className="mt-2 text-white/80">
            Many recruiters decline to provide feedback after interviews. Under
            GDPR, you have rights to access your data and understand automated
            decisions. unghosted streamlines exercising those rights and
            increases your chances of receiving actionable feedback.
          </p>
        </section>

        <footer className="mt-4 w-full text-center text-sm text-white/60">
          © {new Date().getFullYear()} unghosted. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
