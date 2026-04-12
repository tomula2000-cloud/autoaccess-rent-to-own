import Link from "next/link";

export default function MobilePortalSelectVehicleView() {
  return (
    <main className="min-h-screen bg-[#f4f6fb] px-4 py-6 text-black">
      <div className="mx-auto max-w-md">
        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] p-6 shadow-[0_24px_60px_-20px_rgba(11,21,50,0.55)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-200/90">
            Auto Access · Select Vehicle
          </p>

          <h1 className="mt-4 text-[1.9rem] font-semibold leading-tight tracking-tight text-white">
            Mobile vehicle
            <br />
            <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
              selection coming soon.
            </span>
          </h1>

          <p className="mt-4 text-sm leading-6 text-blue-50/75">
            We are still building the mobile version of the select vehicle portal.
            Please use desktop mode for now to choose your vehicle and continue the
            process.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/portal"
              className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1b2345] transition hover:bg-[#f3f6ff]"
            >
              Back to Dashboard
            </Link>

            <Link
              href="/gallery"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              View Gallery
            </Link>
          </div>
        </section>

        <div className="mt-5 rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
            Status
          </p>
          <p className="mt-2 text-sm leading-6 text-[#39425d]">
            Desktop view is active for full vehicle selection, pricing totals,
            and contract request workflow.
          </p>
        </div>
      </div>
    </main>
  );
}