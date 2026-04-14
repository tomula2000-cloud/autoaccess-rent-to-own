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

export default function MobileApplyView() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,222,0.08),transparent_55%),radial-gradient(circle_at_top_right,rgba(213,151,88,0.06),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-[430px] px-4 pb-10 pt-4">

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

          <Link
            href="/portal-login"
            className="rounded-full border border-[#2f67de] px-4 py-2 text-[12px] font-semibold text-[#2f67de]"
          >
            Portal Login
          </Link>
        </div>

        {/* ── Compact Hero ── */}
        <section className="relative mt-4 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-5 shadow-[0_20px_50px_-16px_rgba(11,21,50,0.55)]">
          <div className="absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#2f67de]/25 blur-3xl" />
          <div className="absolute -bottom-8 right-0 h-28 w-28 rounded-full bg-[#d59758]/15 blur-3xl" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[#7ea8ff]" />
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-blue-200/80">
                  Auto Access · Apply
                </p>
              </div>
              <h1 className="mt-2 text-[1.35rem] font-semibold leading-[1.12] tracking-tight text-white">
                Rent-to-Own
                <br />
                <span className="bg-gradient-to-r from-[#9cc0ff] to-[#f4c89a] bg-clip-text text-transparent">
                  Vehicle Application
                </span>
              </h1>
              <p className="mt-1.5 text-[11.5px] leading-5 text-blue-50/65">
                Blacklisted or under debt review? Apply below.
              </p>
            </div>

            <div className="shrink-0 rounded-[14px] border border-white/10 bg-white/5 px-3 py-3 text-center backdrop-blur">
              <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-blue-200/60">
                Steps
              </p>
              <p className="mt-1 text-[1.6rem] font-semibold tabular-nums text-white">
                5
              </p>
              <p className="text-[8px] font-medium text-blue-200/50">
                Simple
              </p>
            </div>
          </div>

          <div className="relative mt-4 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#f4c89a]">
              <span className="h-1 w-1 rounded-full bg-[#f4c89a]" />
              Rent To Own
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-medium text-blue-50/70">
              Secure Portal
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-medium text-blue-50/70">
              256-bit SSL
            </span>
          </div>
        </section>

        {/* ── Compact process strip ── */}
        <div className="mt-3 overflow-hidden rounded-[16px] border border-[#e1e4ee] bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-2.5">
            <p className="text-[10px] font-semibold text-white">
              How it works
            </p>
            <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white">
              5 steps
            </span>
          </div>
          <div className="flex items-center justify-between divide-x divide-[#f0f2f8]">
            {["Apply", "Portal", "Docs", "Review", "Drive"].map((label, i) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-1 px-1 py-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-[#2f67de] to-[#3f78ea] text-[10px] font-bold text-white">
                  {i + 1}
                </div>
                <p className="text-center text-[9px] font-semibold text-[#1b2345]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <div className="mt-3">
          <SharedApplicationForm compact={true} />
        </div>

        {/* ── Footer ── */}
        <footer className="mt-4 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b1532] to-[#060e24] px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a]">
              <IconCar />
            </div>
            <p className="text-[16px] font-semibold text-white">
              Auto<span className="text-[#f4c89a]">Access</span>
            </p>
          </div>

          <p className="mt-3 text-[12px] leading-6 text-blue-50/45">
            A premium South African rent-to-own platform built around
            clarity, trust, and structured vehicle access.
          </p>

          <div className="mt-4 flex flex-wrap gap-4">
            <Link href="/" className="text-[12px] text-blue-50/55">
              Home
            </Link>
            <Link href="/gallery" className="text-[12px] text-blue-50/55">
              Showroom
            </Link>
            <Link href="/apply" className="text-[12px] text-blue-50/55">
              Apply
            </Link>
            <Link href="/portal-login" className="text-[12px] text-blue-50/55">
              Client Portal
            </Link>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <p className="text-[11px] text-blue-50/35">
              © {new Date().getFullYear()} Auto Access (Pty) Ltd · NCR
              Registered · POPIA Compliant
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}