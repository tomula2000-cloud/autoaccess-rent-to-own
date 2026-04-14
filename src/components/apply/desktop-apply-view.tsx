import Link from "next/link";
import SharedApplicationForm from "@/components/home/shared-application-form";

function IconCar() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

export default function DesktopApplyView() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,222,0.08),transparent_55%),radial-gradient(circle_at_top_right,rgba(213,151,88,0.06),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-[1280px] px-8 pb-16 pt-5">

        {/* ── Topbar ── */}
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_8px_18px_-6px_rgba(27,35,69,0.5)]">
              <IconCar />
            </div>
            <p className="text-[17px] font-semibold text-[#1b2345]">
              Auto<span className="text-[#d59758]">Access</span>
            </p>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/gallery"
              className="rounded-full border border-[#e1e4ee] bg-white px-4 py-2 text-[12px] font-semibold text-[#1b2345] transition hover:border-[#2f67de]/30"
            >
              Showroom
            </Link>
            <Link
              href="/portal-login"
              className="rounded-full border border-[#2f67de] px-4 py-2 text-[12px] font-semibold text-[#2f67de]"
            >
              Portal Login
            </Link>
          </div>
        </div>

        {/* ── Hero ── */}
        <section className="relative mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-10 py-12 shadow-[0_24px_60px_-20px_rgba(11,21,50,0.55)]">
          <div className="absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-[#2f67de]/25 blur-3xl" />
          <div className="absolute -bottom-16 right-0 h-[300px] w-[300px] rounded-full bg-[#d59758]/15 blur-3xl" />

          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-200/90">
                  Auto Access · Rent-to-Own Application
                </p>
              </div>

              <h1 className="mt-5 text-[clamp(2rem,3.5vw,3rem)] font-semibold leading-[1.08] tracking-tight text-white">
                Are you blacklisted or
                <br />
                <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                  under debt review?
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-[15px] leading-7 text-blue-50/75">
                Welcome to Auto Access — your solution to affordable
                rent-to-own vehicles. Apply online, upload documents, and
                track every stage from your secure portal.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f4c89a]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                  Rent To Own
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-blue-50/80">
                  <IconShield />
                  Secure Portal
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-blue-50/80">
                  <IconLock />
                  256-bit SSL
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { num: "01", title: "Wide Vehicle Choice", desc: "Quality vehicles for your lifestyle, family, or business." },
                { num: "02", title: "Online Application", desc: "Quick and convenient digital submission process." },
                { num: "03", title: "Secure Portal Access", desc: "Upload documents and track progress from one place." },
                { num: "04", title: "Fast Approval Flow", desc: "Helping qualifying applicants get on the road sooner." },
              ].map((item) => (
                <div
                  key={item.num}
                  className="rounded-[18px] border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">
                    {item.num}
                  </span>
                  <p className="mt-2 text-[13px] font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-5 text-blue-50/60">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Form ── */}
        <div className="mt-6">
          <SharedApplicationForm />
        </div>

        {/* ── Footer ── */}
        <footer className="mt-8 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b1532] to-[#060e24] px-6 py-7">
          <div className="flex items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a]">
                  <IconCar />
                </div>
                <p className="text-[16px] font-semibold text-white">
                  Auto<span className="text-[#f4c89a]">Access</span>
                </p>
              </div>
              <p className="mt-3 max-w-sm text-[12px] leading-6 text-blue-50/45">
                A premium South African rent-to-own platform built around
                clarity, trust, and structured vehicle access.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="text-[12px] text-blue-50/55 hover:text-blue-50/80">Home</Link>
              <Link href="/gallery" className="text-[12px] text-blue-50/55 hover:text-blue-50/80">Showroom</Link>
              <Link href="/apply" className="text-[12px] text-blue-50/55 hover:text-blue-50/80">Apply</Link>
              <Link href="/portal-login" className="text-[12px] text-blue-50/55 hover:text-blue-50/80">Client Portal</Link>
            </div>
          </div>
          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-[11px] text-blue-50/35">
              © {new Date().getFullYear()} Auto Access (Pty) Ltd · NCR Registered · POPIA Compliant
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}