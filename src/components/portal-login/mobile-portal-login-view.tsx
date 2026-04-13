import Link from "next/link";

type PageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function IconLock() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconProgress() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      className="h-3 w-3"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}

export default async function MobilePortalLoginView({
  searchParams,
}: PageProps) {
  const params = searchParams ? await searchParams : {};
  const error = params.error || "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,222,0.08),transparent_55%),radial-gradient(circle_at_top_right,rgba(213,151,88,0.06),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-[430px] px-4 pb-10 pt-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_8px_18px_-6px_rgba(27,35,69,0.5)]">
              <IconCar />
            </div>
            <p className="text-[17px] font-semibold text-[#1b2345]">
              Auto<span className="text-[#d59758]">Access</span>
            </p>
          </Link>

          <Link
            href="/apply"
            className="rounded-full border border-[#2f67de] px-4 py-2 text-[12px] font-semibold text-[#2f67de]"
          >
            Apply
          </Link>
        </div>

        <section className="relative mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 pb-6 pt-7 shadow-[0_24px_60px_-20px_rgba(11,21,50,0.55)]">
          <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-[#2f67de]/25 blur-3xl" />
          <div className="absolute -bottom-10 right-0 h-36 w-36 rounded-full bg-[#d59758]/15 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-200/90">
                Auto Access · Client Portal
              </p>
            </div>

            <h1 className="mt-5 text-[1.95rem] font-semibold leading-[1.05] tracking-tight text-white">
              Securely continue
              <br />
              <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                your application.
              </span>
            </h1>

            <p className="mt-4 text-[14px] leading-7 text-blue-50/75">
              Log in with your reference number and application email to upload
              documents, track progress, and manage your next steps.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f4c89a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                Secure Access
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-medium text-blue-50/80">
                <IconLock />
                256-bit SSL
              </span>
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#f4c89a]">
                <IconLock />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                  Portal Login
                </p>
                <h2 className="text-[1.12rem] font-semibold text-white">
                  Log into your portal
                </h2>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-[1.6] text-blue-50/70">
              Use the exact details linked to your application.
            </p>
          </div>

          <form action="/api/portal-login" method="post" className="px-5 pb-6 pt-5">
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#e1e4ee] bg-[#fafbff] px-4 py-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#2f67de]">
                <IconInfo />
              </span>
              <p className="text-[12.5px] leading-[1.65] text-[#39425d]">
                Enter the same email address you used when submitting your application.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                  Reference Number
                </label>
                <input
                  type="text"
                  name="referenceNumber"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="text"
                  className="w-full rounded-2xl border border-[#dde1ee] bg-white px-4 py-3 text-[14px] text-[#1b2345] outline-none transition placeholder:text-[#a3aac0] focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                  placeholder="Enter your reference number"
                  required
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  inputMode="email"
                  className="w-full rounded-2xl border border-[#dde1ee] bg-white px-4 py-3 text-[14px] text-[#1b2345] outline-none transition placeholder:text-[#a3aac0] focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>

            {error ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-rose-50 px-4 py-3 text-[13px] font-semibold text-red-800">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(47,103,222,0.45)]"
            >
              <IconLock />
              Login to Portal
            </button>

            <Link
              href="/apply"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#dde4f2] bg-white px-6 py-4 text-sm font-semibold text-[#68708a] transition hover:border-[#1b2345] hover:text-[#1b2345]"
            >
              Start New Application
            </Link>

            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-medium text-[#68708a]">
              <IconLock />
              256-bit SSL encrypted
            </div>
          </form>
        </section>

        <section className="mt-4 grid gap-3">
          {[
            {
              icon: <IconUpload />,
              title: "Upload Documents",
              desc: "Submit your supporting files securely through the portal.",
            },
            {
              icon: <IconProgress />,
              title: "Track Progress",
              desc: "Check your status, milestones, and next instructions clearly.",
            },
            {
              icon: <IconShield />,
              title: "Continue Securely",
              desc: "A professional, private environment for your application journey.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[20px] border border-[#e1e4ee] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a]">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[13.5px] font-semibold text-[#1b2345]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[12.5px] leading-6 text-[#39425d]">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
              Need Help?
            </p>
            <h2 className="mt-1 text-[1.05rem] font-semibold text-white">
              Portal access guidance
            </h2>
          </div>

          <div className="p-5">
            <div className="flex items-start gap-3 rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#d59758] shadow-sm">
                <IconHelp />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                  Important Notice
                </p>
                <p className="mt-2 text-[13px] leading-[1.7] text-[#39425d]">
                  If your login does not work, confirm that your reference number
                  and email address match the details used in your application.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-7 text-center shadow-[0_24px_60px_-20px_rgba(11,21,50,0.45)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
            Need a new application?
          </p>
          <h2 className="mt-3 text-[1.5rem] font-semibold leading-[1.15] text-white">
            Start your journey
            <br />
            <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
              with Auto Access
            </span>
          </h2>
          <p className="mt-4 text-[14px] leading-7 text-blue-50/75">
            Submit a new rent-to-own application and let our team guide you through the next step.
          </p>

          <div className="mt-6 grid gap-3">
            <Link
              href="/apply"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)]"
            >
              Start New Application
              <IconArrow />
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white"
            >
              Back to Home
            </Link>
          </div>
        </section>

        <footer className="mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0b1532] to-[#060e24] px-5 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a]">
              <IconCar />
            </div>
            <p className="text-[16px] font-semibold text-white">
              Auto<span className="text-[#f4c89a]">Access</span>
            </p>
          </div>

          <p className="mt-4 text-[12px] leading-6 text-blue-50/45">
            A premium South African rent-to-own platform built around clarity,
            trust, and structured vehicle access.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            <Link href="/" className="text-[12px] text-blue-50/55">
              Home
            </Link>
            <Link href="/apply" className="text-[12px] text-blue-50/55">
              Apply
            </Link>
            <Link href="/portal-login" className="text-[12px] text-blue-50/55">
              Client Portal
            </Link>
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-[11px] text-blue-50/35">
              © {new Date().getFullYear()} Auto Access (Pty) Ltd · NCR Registered · POPIA Compliant
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}