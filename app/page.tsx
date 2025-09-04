import EarlyAccessForm from "./components/EarlyAccessForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="px-6 sm:px-10 py-6 border-b border-neutral-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-semibold tracking-tight">GDPR Seeker</div>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:underline">Features</a>
            <a href="#rights" className="hover:underline">Your GDPR Rights</a>
            <a href="#cta" className="hover:underline">Get Started</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="px-6 sm:px-10 py-16 sm:py-24 bg-neutral-50">
          <div className="max-w-6xl mx-auto grid gap-8 sm:gap-12 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-3xl sm:text-5xl font-semibold leading-tight tracking-tight">
                Request and receive your candidate data with confidence
              </h1>
              <p className="mt-4 text-neutral-700 text-base sm:text-lg">
                GDPR Seeker helps job candidates submit GDPR requests to companies to retrieve feedback and all personal data collected during hiring.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href="#cta" className="inline-flex items-center justify-center rounded-md bg-black text-white px-5 py-3 text-sm font-medium hover:bg-neutral-800">
                  Start a GDPR request
                </a>
                <a href="#rights" className="inline-flex items-center justify-center rounded-md border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-100">
                  Learn your rights
                </a>
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 p-6 bg-white shadow-sm">
              <div className="text-sm font-mono text-neutral-600">
                <div className="text-neutral-900 font-semibold mb-2">What you can export</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Interview feedback and notes</li>
                  <li>Emails, messages, and scheduling data</li>
                  <li>Uploaded resumes, portfolios, and assessments</li>
                  <li>ATS profile and application history</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-6 sm:px-10 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">How GDPR Seeker helps</h2>
            <div className="mt-8 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-semibold">Guided request builder</h3>
                <p className="mt-2 text-sm text-neutral-700">Create a clear, legally grounded GDPR request with our step‑by‑step flow.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-semibold">Company delivery</h3>
                <p className="mt-2 text-sm text-neutral-700">Send requests to privacy contacts and track responses in one place.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-semibold">Response tracking</h3>
                <p className="mt-2 text-sm text-neutral-700">Automatic reminders and deadlines to help ensure timely responses.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-semibold">Export and organize</h3>
                <p className="mt-2 text-sm text-neutral-700">Store exports securely and download everything in structured formats.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-semibold">Privacy‑first</h3>
                <p className="mt-2 text-sm text-neutral-700">We minimize data collection and encrypt what you share with us.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6">
                <h3 className="font-semibold">Templates and guidance</h3>
                <p className="mt-2 text-sm text-neutral-700">Use vetted templates citing GDPR articles—no legal background required.</p>
              </div>
            </div>
          </div>
        </section>

        {/* GDPR Rights */}
        <section id="rights" className="px-6 sm:px-10 py-16 sm:py-24 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Your GDPR rights as a candidate (EU)</h2>
            <p className="mt-4 text-neutral-700 text-sm sm:text-base">
              Under the EU General Data Protection Regulation (GDPR), you have rights over your personal data processed during recruitment. Key rights include:
            </p>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-200 p-6 bg-white">
                <h3 className="font-semibold">Right of access (Art. 15)</h3>
                <p className="mt-2 text-sm text-neutral-700">Obtain confirmation whether a company processes your data and receive a copy, including purposes, categories, recipients, and retention.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6 bg-white">
                <h3 className="font-semibold">Right to rectification (Art. 16)</h3>
                <p className="mt-2 text-sm text-neutral-700">Request correction of inaccurate personal data and completion of incomplete information.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6 bg-white">
                <h3 className="font-semibold">Right to erasure (Art. 17)</h3>
                <p className="mt-2 text-sm text-neutral-700">Ask for deletion of your data in certain cases (e.g., when no longer necessary or consent is withdrawn).</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6 bg-white">
                <h3 className="font-semibold">Right to restriction (Art. 18)</h3>
                <p className="mt-2 text-sm text-neutral-700">Limit processing while accuracy is verified or in other specified circumstances.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6 bg-white">
                <h3 className="font-semibold">Right to data portability (Art. 20)</h3>
                <p className="mt-2 text-sm text-neutral-700">Receive your data in a structured, commonly used, machine‑readable format and transmit it elsewhere.</p>
              </div>
              <div className="rounded-lg border border-neutral-200 p-6 bg-white">
                <h3 className="font-semibold">Right to object (Art. 21)</h3>
                <p className="mt-2 text-sm text-neutral-700">Object to processing based on legitimate interests or direct marketing, including profiling.</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-neutral-500">
              This page is informational and not legal advice. Response timelines and scope vary by jurisdiction and context.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="px-6 sm:px-10 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto rounded-xl bg-black text-white p-8 sm:p-12">
            <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr] items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Start your GDPR request in minutes</h2>
                <p className="mt-3 text-white/80 text-sm sm:text-base">Use our guided builder to generate and send requests to any company. Track responses and store exports securely.</p>
              </div>
              <EarlyAccessForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="px-6 sm:px-10 py-10 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-600">
          <div>© {new Date().getFullYear()} GDPR Seeker</div>
          <div className="flex items-center gap-4">
            <a href="#rights" className="hover:underline">GDPR Rights</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
