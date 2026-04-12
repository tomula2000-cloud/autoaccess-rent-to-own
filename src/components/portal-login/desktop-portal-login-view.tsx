import Link from "next/link";

// ─── Types — UNCHANGED ────────────────────────────────────────────────────────
type PageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

// ─── Icons ────────────────────────────────────────────────────────────────────
function IconShield() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconUpload() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function IconProgress() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IconArrow() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconHelp() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  PAGE — async server component, UNCHANGED signature
// ─────────────────────────────────────────────────────────────────────────────
export default async function PortalLoginPage({ searchParams }: PageProps) {
  // ── Params — UNCHANGED ──
  const params = searchParams ? await searchParams : {};
  const error = params.error || "";

  return (
    <main
      className="min-h-screen text-[#0a1f4e]"
      style={{
        background: "linear-gradient(160deg,#f0f3fb 0%,#f7f9fd 55%,#fdf7f3 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Font injection — matches homepage brand system */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        *, body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* ── Ambient depth blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-blue-100/50 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-orange-100/40 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      <section className="relative px-5 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-[1200px]">

          {/* ── Brand bar ── */}
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#0a1f4e]">
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="5" cy="18" r="3" />
                  <circle cx="19" cy="18" r="3" />
                  <path d="M5 15h14M1 10h2l3-6h10l4 5h2M14 4l2 6" />
                </svg>
              </div>
              <span className="font-display text-[20px] font-bold tracking-[-0.01em] text-[#0a1f4e]">
                Auto<span className="text-[#e8720c]">Access</span>
              </span>
            </Link>

            <Link
              href="/apply"
              className="inline-flex items-center gap-2 rounded-lg border border-[#dde4f2] bg-white px-4 py-2 text-[13px] font-medium text-[#0a1f4e] shadow-[0_2px_8px_rgba(10,31,78,0.06)] transition hover:border-[#1446cc] hover:text-[#1446cc]"
            >
              <IconArrow />
              New Application
            </Link>
          </div>

          {/* ── Main two-column grid ── */}
          <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr] lg:items-start lg:gap-6">

            {/* ════════════════════════════════════
                LEFT — Brand & portal explanation
            ════════════════════════════════════ */}
            <div
              className="relative overflow-hidden rounded-2xl px-9 py-11 text-white md:px-12 md:py-12"
              style={{ background: "linear-gradient(145deg,#0a1f4e 0%,#0f2d6b 60%,#122f72 100%)" }}
            >
              {/* Decorative depth */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-[#1446cc]/20 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-[240px] w-[240px] rounded-full bg-[#e8720c]/10 blur-3xl" />
                {/* Grid texture */}
                <svg className="absolute inset-0 h-full w-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="portal-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#portal-grid)" />
                </svg>
              </div>

              <div className="relative">
                {/* Eyebrow */}
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-6 bg-[#e8720c]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Auto Access Client Portal
                  </span>
                </div>

                {/* Headline */}
                <h1 className="font-display max-w-[420px] text-[clamp(2rem,3vw,3.2rem)] font-bold leading-[1.1] tracking-[-0.02em] text-white">
                  Your secure application gateway.
                </h1>

                <p className="mt-5 max-w-[420px] text-[14.5px] leading-[1.8] text-white/60">
                  Log in to continue your rent-to-own vehicle application.
                  Upload your supporting documents, monitor your approval status,
                  and follow your next steps — all from one secure place.
                </p>

                {/* Portal benefit rows */}
                <div className="mt-9 space-y-3">
                  {[
                    {
                      icon: <IconUpload />,
                      title: "Upload Documents",
                      desc: "Submit supporting files directly and securely through your portal.",
                    },
                    {
                      icon: <IconProgress />,
                      title: "Track Your Progress",
                      desc: "Review your current application status and milestone updates.",
                    },
                    {
                      icon: <IconShield />,
                      title: "Continue With Confidence",
                      desc: "A structured, professional environment built for your application journey.",
                    },
                  ].map(({ icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.06] px-4 py-4"
                    >
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/10 text-white/70">
                        {icon}
                      </div>
                      <div>
                        <p className="text-[13.5px] font-semibold text-white">{title}</p>
                        <p className="mt-0.5 text-[12.5px] leading-[1.6] text-white/50">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Security compliance strip */}
                <div className="mt-9 border-t border-white/10 pt-7">
                  <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/35">
                    Security & Compliance
                  </p>
                  <div className="flex flex-wrap gap-5">
                    {["256-bit SSL Encrypted", "NCA Compliant", "POPIA Compliant"].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-[12px] text-white/50">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#e8720c]/20 text-[#e8720c]">
                          <IconCheck />
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation links */}
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-5 py-2.5 text-[13px] font-medium text-white/80 transition hover:bg-white/15"
                  >
                    ← Back to Home
                  </Link>
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#e8720c] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(232,114,12,0.3)] transition hover:-translate-y-px hover:bg-[#d4660b]"
                  >
                    <IconArrow />
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════
                RIGHT — Login form
                action, method, input names UNCHANGED
            ════════════════════════════════════ */}
            <div className="rounded-2xl border border-[#dde4f2] bg-white shadow-[0_4px_32px_rgba(10,31,78,0.07)]">

              {/* Form header */}
              <div className="border-b border-[#edf0f7] px-8 pb-6 pt-8">
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#fff4eb] px-3 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#e8720c]" />
                  <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#e8720c]">
                    Secure Access
                  </span>
                </div>
                <h2 className="font-display mt-3 text-[1.9rem] font-bold leading-[1.15] tracking-tight text-[#0a1f4e]">
                  Log into your portal
                </h2>
                <p className="mt-2 text-[13.5px] leading-[1.7] text-[#6b7a9a]">
                  Enter your reference number and email address exactly as used
                  in your application.
                </p>
              </div>

              {/* ── Form body ── */}
              {/* action="/api/portal-login" method="post" — UNCHANGED */}
              <form action="/api/portal-login" method="post" className="px-8 pb-8 pt-6">

                {/* Info hint — above fields */}
                <div className="mb-5 flex items-start gap-3 rounded-lg border border-[#edf0f7] bg-[#f8f9fc] px-4 py-3.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1446cc]/10 text-[#1446cc]">
                    <IconInfo />
                  </span>
                  <p className="text-[12.5px] leading-[1.65] text-[#39425d]">
                    Use the same email address linked to your application
                    together with your reference number.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Reference Number — name="referenceNumber" UNCHANGED */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6b7a9a]">
                      Reference Number
                    </label>
                    <input
                      type="text"
                      name="referenceNumber"
                      autoCapitalize="characters"
                      autoCorrect="off"
                      spellCheck={false}
                      inputMode="text"
                      className="w-full rounded-lg border border-[#dde4f2] bg-[#f8f9fc] px-3.5 py-2.5 text-[13.5px] text-[#0a1f4e] outline-none transition placeholder:text-[#a8b4cc] focus:border-[#1446cc] focus:bg-white focus:shadow-[0_0_0_3px_rgba(20,70,204,0.08)]"
                      placeholder="Enter your reference number"
                      required
                    />
                  </div>

                  {/* Email — name="email" UNCHANGED */}
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#6b7a9a]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      inputMode="email"
                      className="w-full rounded-lg border border-[#dde4f2] bg-[#f8f9fc] px-3.5 py-2.5 text-[13.5px] text-[#0a1f4e] outline-none transition placeholder:text-[#a8b4cc] focus:border-[#1446cc] focus:bg-white focus:shadow-[0_0_0_3px_rgba(20,70,204,0.08)]"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>

                {/* Error state — conditional logic UNCHANGED */}
                {error ? (
                  <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-800">
                    {error}
                  </div>
                ) : null}

                {/* CTA row */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-lg bg-[#1446cc] px-6 py-3 text-[13.5px] font-semibold text-white shadow-[0_6px_20px_rgba(20,70,204,0.22)] transition hover:-translate-y-px hover:bg-[#0a1f4e]"
                  >
                    <IconLock />
                    Login to Portal
                  </button>
                  <Link
                    href="/apply"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#dde4f2] bg-white px-5 py-3 text-[13.5px] font-medium text-[#6b7a9a] transition hover:border-[#0a1f4e] hover:text-[#0a1f4e]"
                  >
                    Start New Application
                  </Link>
                </div>

                {/* Security note */}
                <div className="mt-4 flex items-center gap-1.5 text-[11px] text-[#6b7a9a]">
                  <IconLock />
                  256-bit SSL encrypted · Your session is secure and private
                </div>
              </form>

              {/* Help section */}
              <div className="border-t border-[#edf0f7] px-8 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#edf0f7] bg-[#f8f9fc] text-[#6b7a9a]">
                    <IconHelp />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e8720c]">
                      Need help?
                    </p>
                    <p className="mt-1.5 text-[13px] leading-[1.7] text-[#6b7a9a]">
                      If your login details are not working, confirm that your
                      reference number and email match the details stored against
                      your application in the Auto Access system.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  );
}