import Link from "next/link";

type PageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function IconShield() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconProgress() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconCar() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}

export default async function PortalLoginPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const error = params.error || "";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        *, body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,222,0.08),transparent_55%),radial-gradient(circle_at_top_right,rgba(213,151,88,0.06),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <section className="relative px-5 py-8 md:px-8 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_10px_24px_-8px_rgba(27,35,69,0.6)]">
                <IconCar />
              </div>
              <span className="text-[20px] font-semibold text-[#1b2345]">
                Auto<span className="text-[#d59758]">Access</span>
              </span>
            </Link>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-full border border-[#dde4f2] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#1b2345] shadow-[0_6px_18px_-8px_rgba(15,23,42,0.15)] transition hover:border-[#2f67de] hover:text-[#2f67de]"
            >
              <IconArrow />
              New Application
            </Link>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] p-8 shadow-[0_30px_80px_-20px_rgba(11,21,50,0.55)] md:p-10 lg:p-12">
              <div className="absolute inset-0">
                <div className="absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-[#2f67de]/25 blur-3xl" />
                <div className="absolute -right-16 top-10 h-[340px] w-[340px] rounded-full bg-[#d59758]/15 blur-3xl" />
                <div className="absolute -bottom-20 left-10 h-[280px] w-[280px] rounded-full bg-[#2f67de]/15 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              <div className="relative flex h-full flex-col justify-between gap-8">
                <div>
                  <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_10px_24px_-8px_rgba(27,35,69,0.6)]">
                      <IconCar />
                    </div>
                    <p className="text-[18px] font-semibold text-white">
                      Auto<span className="text-[#f4c89a]">Access</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-200/90">
                      Auto Access · Client Portal
                    </p>
                  </div>

                  <h1 className="mt-6 max-w-[560px] font-display text-4xl font-bold leading-[1.05] tracking-tight text-white md:text-[2.85rem]">
                    Your secure
                    <br />
                    <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                      application gateway.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-[500px] text-[15px] leading-7 text-blue-50/75">
                    Log in to continue your rent-to-own vehicle application, upload documents, monitor your progress, and manage your next steps from one premium command centre.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4c89a] backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                      Secure Portal Access
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-blue-50/80 backdrop-blur">
                      <IconLock />
                      <span className="font-mono text-white">256-bit SSL</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-blue-50/80 backdrop-blur">
                      POPIA Compliant
                    </span>
                  </div>

                  <div className="mt-8 grid gap-3">
                    {[
                      {
                        icon: <IconUpload />,
                        title: "Upload Documents",
                        desc: "Submit supporting files securely and continue your application without delays.",
                      },
                      {
                        icon: <IconProgress />,
                        title: "Track Progress",
                        desc: "Review your current status, milestone updates, and next actions in one place.",
                      },
                      {
                        icon: <IconShield />,
                        title: "Continue With Confidence",
                        desc: "A structured, premium environment designed for clarity, security, and trust.",
                      },
                    ].map((item) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-xl"
                      >
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/10 text-white/80">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-[13.5px] font-semibold text-white">{item.title}</p>
                          <p className="mt-1 text-[12.5px] leading-[1.6] text-white/55">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative mt-2 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200/70">
                      Portal Access
                    </p>
                    <p className="mt-2 text-[15px] font-semibold leading-snug text-white">
                      Continue securely with your reference number and email
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      <p className="text-[12px] text-blue-50/70">
                        Protected session · Secure application continuity
                      </p>
                    </div>
                  </div>

                  <div className="relative justify-self-end">
                    <div className="absolute inset-0 rounded-full bg-[#2f67de]/30 blur-2xl" />
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl">
                      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="6"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          stroke="url(#portalHeroGrad)"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(88 / 100) * 276} 276`}
                        />
                        <defs>
                          <linearGradient id="portalHeroGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#7ea8ff" />
                            <stop offset="100%" stopColor="#f4c89a" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="text-center">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-200/70">
                          Secure
                        </p>
                        <p className="mt-0.5 text-2xl font-semibold tabular-nums text-white">
                          100%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                  >
                    ← Back to Home
                  </Link>
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.6)] transition hover:from-[#c4863f] hover:to-[#d59758]"
                  >
                    Start New Application
                    <IconArrow />
                  </Link>
                </div>
              </div>
            </div>

            <section className="relative overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2">
              <div className="relative flex h-full flex-col rounded-[26px] bg-white">
                <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-5 sm:px-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                      <IconLock />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                        Portal Login
                      </p>
                      <h2 className="text-[1.15rem] font-semibold text-white sm:text-[1.25rem]">
                        Log into your portal
                      </h2>
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] leading-[1.6] text-blue-50/70">
                    Enter your reference number and email address exactly as used in your application.
                  </p>
                </div>

                <form action="/api/portal-login" method="post" className="px-6 pb-6 pt-5 sm:px-7">
                  <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#e1e4ee] bg-[#fafbff] px-4 py-4">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#eef4ff] text-[#2f67de]">
                      <IconInfo />
                    </span>
                    <p className="text-[12.5px] leading-[1.65] text-[#39425d]">
                      Use the same email address linked to your application together with your reference number.
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

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(47,103,222,0.5)] transition hover:from-[#2559c6] hover:to-[#3568d6]"
                    >
                      <IconLock />
                      Login to Portal
                    </button>

                    <Link
                      href="/apply"
                      className="inline-flex items-center gap-2 rounded-full border border-[#dde4f2] bg-white px-6 py-3.5 text-sm font-semibold text-[#68708a] transition hover:border-[#1b2345] hover:text-[#1b2345]"
                    >
                      Start New Application
                    </Link>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-[#68708a]">
                    <IconLock />
                    256-bit SSL encrypted · Your session is secure and private
                  </div>
                </form>

                <div className="border-t border-[#eef0f7] px-6 py-5 sm:px-7">
                  <div className="flex items-start gap-3 rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#d59758] shadow-sm">
                      <IconHelp />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                        Need help?
                      </p>
                      <p className="mt-2 text-[13px] leading-[1.7] text-[#39425d]">
                        If your login details are not working, confirm that your reference number and email match the details stored against your application in the Auto Access system.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] p-8 text-center shadow-[0_30px_80px_-20px_rgba(11,21,50,0.45)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
              Continue your journey
            </p>
            <h2 className="mt-4 font-display text-[2rem] font-bold leading-[1.1] text-white">
              Need to start a new application instead?
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-blue-50/75">
              Submit your application today and let our team work with your situation. A consultant will contact you within 48 hours to guide you through the next steps.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/apply"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.6)] transition hover:from-[#c4863f] hover:to-[#d59758]"
              >
                Apply Now — It&apos;s Free
                <span className="transition group-hover:translate-x-0.5">
                  <IconArrow />
                </span>
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Back to Home
              </Link>
            </div>
          </section>

          <footer className="mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0b1532] to-[#060e24]">
            <div className="px-8 py-12">
              <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_10px_24px_-8px_rgba(27,35,69,0.5)]">
                      <IconCar />
                    </div>
                    <div className="text-[20px] font-semibold text-white">
                      Auto<span className="text-[#f4c89a]">Access</span>
                    </div>
                  </div>
                  <p className="mt-4 max-w-[240px] text-[12.5px] leading-[1.7] text-blue-50/55">
                    South Africa&apos;s trusted rent-to-own vehicle platform. Vehicle access for every South African.
                  </p>
                  <div className="mt-5 flex gap-2">
                    <a
                      href="https://wa.me/27610490061"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="WhatsApp"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-4 w-4 fill-current">
                        <path d="M16.03 3.2c-7.06 0-12.79 5.73-12.79 12.79 0 2.25.58 4.44 1.69 6.37L3 29l6.82-1.78a12.8 12.8 0 006.21 1.6h.01c7.05 0 12.79-5.74 12.79-12.79S23.09 3.2 16.03 3.2Zm0 23.45h-.01a10.6 10.6 0 01-5.4-1.48l-.39-.23-4.05 1.06 1.08-3.95-.26-.4a10.6 10.6 0 1 1 9.03 5Zm6.21-8.46c-.34-.17-2.01-.99-2.33-1.1-.31-.12-.54-.17-.77.17-.23.34-.88 1.09-1.08 1.31-.2.23-.4.25-.74.09-.34-.17-1.42-.52-2.71-1.67-1-.89-1.67-1.99-1.86-2.33-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.12-.23.06-.43-.03-.6-.08-.17-.77-1.85-1.05-2.53-.28-.67-.57-.58-.77-.59h-.66c-.23 0-.6.08-.91.43-.31.34-1.2 1.17-1.2 2.84 0 1.68 1.23 3.3 1.4 3.53.17.23 2.41 3.68 5.84 5.16.82.35 1.46.56 1.96.71.82.26 1.57.22 2.16.13.66-.1 2.01-.82 2.29-1.61.28-.79.28-1.47.2-1.61-.08-.14-.31-.22-.66-.39Z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Quick Links
                  </p>
                  <div className="mt-4 space-y-3 text-[13px] text-blue-50/50">
                    <Link href="/" className="block transition hover:text-white">
                      Home
                    </Link>
                    <Link href="/gallery" className="block transition hover:text-white">
                      Vehicle Gallery
                    </Link>
                    <Link href="/apply" className="block transition hover:text-white">
                      Apply Now
                    </Link>
                    <Link href="/portal-login" className="block transition hover:text-white">
                      Client Portal
                    </Link>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Support
                  </p>
                  <div className="mt-4 space-y-3 text-[13px] text-blue-50/50">
                    <a href="mailto:info@autoaccess.co.za" className="block transition hover:text-white">
                      Email Support
                    </a>
                    <a href="https://wa.me/27610490061" target="_blank" rel="noreferrer" className="block transition hover:text-white">
                      WhatsApp Us
                    </a>
                    <span className="block">Mon – Fri, 08:00 – 17:00</span>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                    Compliance
                  </p>
                  <div className="mt-4 space-y-3 text-[13px] text-blue-50/50">
                    <a href="#" className="block transition hover:text-white">
                      Privacy Policy
                    </a>
                    <a href="#" className="block transition hover:text-white">
                      Terms of Service
                    </a>
                    <a href="#" className="block transition hover:text-white">
                      NCR Registration
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 px-8 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] text-blue-50/35">
                  © {new Date().getFullYear()} Auto Access (Pty) Ltd · NCR Registered · POPIA Compliant
                </p>
                <div className="flex gap-5">
                  {["Privacy Policy", "Terms of Service", "NCR Registration"].map((item) => (
                    <a
                      key={item}
                      href="#"
                      className="text-[11px] text-blue-50/35 transition hover:text-white/70"
                    >
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </section>
    </main>
  );
}