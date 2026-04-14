import { prisma } from "@/lib/prisma";
import Link from "next/link";

type GalleryVehicleOffer = {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  depositAmount: string;
  monthlyPayment: string;
  yearModel: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  status: string;
};

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

function IconChevron() {
  return (
    <svg
      className="h-4 w-4 transition group-open:rotate-180"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconShield() {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconClock() {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ── Compact mobile vehicle card ──
function MobileVehicleCard({ vehicle }: { vehicle: GalleryVehicleOffer }) {
  const isAvailable = vehicle.status === "AVAILABLE";

  return (
    <Link
      href={`/gallery/${vehicle.slug}`}
      className="group block overflow-hidden rounded-[18px] border border-[#e1e4ee] bg-white shadow-[0_6px_20px_-10px_rgba(15,23,42,0.1)] transition hover:border-[#2f67de]/30 hover:shadow-[0_12px_28px_-10px_rgba(47,103,222,0.15)]"
    >
      {/* Vehicle image */}
      <div className="relative overflow-hidden bg-[#f4f6fb]">
        <img
          src={vehicle.featuredImage}
          alt={vehicle.title}
          className="h-[160px] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />

        {/* Status badge */}
        <div className="absolute left-3 top-3">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-500 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_4px_10px_-4px_rgba(16,185,129,0.5)]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Available
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
              Unavailable
            </span>
          )}
        </div>

        {/* Year badge */}
        <div className="absolute right-3 top-3">
          <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff]/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#2f67de] backdrop-blur">
            {vehicle.yearModel}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3.5">
        {/* Title + tags */}
        <h3 className="line-clamp-1 text-[14px] font-semibold text-[#1b2345]">
          {vehicle.title}
        </h3>

        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-600">
            {vehicle.transmission}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-600">
            {vehicle.fuelType}
          </span>
          {vehicle.mileage ? (
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-600">
              {vehicle.mileage}
            </span>
          ) : null}
        </div>

        {/* Financial stat row */}
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2 py-2">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
              Deposit
            </p>
            <p className="mt-0.5 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
              {vehicle.depositAmount}
            </p>
          </div>
          <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2 py-2">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
              Monthly
            </p>
            <p className="mt-0.5 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
              {vehicle.monthlyPayment}
            </p>
          </div>
          <div className="rounded-[10px] border border-[#dbe6ff] bg-[#eef4ff] px-2 py-2">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#2f67de]">
              Rent-to-Own
            </p>
            <p className="mt-0.5 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
              View offer
            </p>
          </div>
        </div>

        {/* CTA strip */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-[#68708a]">
            Full details inside
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-3 py-1.5 text-[10px] font-semibold text-white">
            View Offer
            <IconArrow />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function MobileGalleryView() {
  const vehicles: GalleryVehicleOffer[] = await prisma.vehicleOffer.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      featuredImage: true,
      depositAmount: true,
      monthlyPayment: true,
      yearModel: true,
      mileage: true,
      transmission: true,
      fuelType: true,
      status: true,
    },
  });

  const vehicleCount = vehicles.length;
  const primaryVehicles = vehicles.slice(0, 4);
  const extraVehicles = vehicles.slice(4);

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
            href="/apply"
            className="rounded-full border border-[#2f67de] px-4 py-2 text-[12px] font-semibold text-[#2f67de]"
          >
            Apply
          </Link>
        </div>

        {/* ── Hero ── */}
        <section className="relative mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 pb-5 pt-6 shadow-[0_24px_60px_-20px_rgba(11,21,50,0.55)]">
          <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-[#2f67de]/25 blur-3xl" />
          <div className="absolute -bottom-10 right-0 h-36 w-36 rounded-full bg-[#d59758]/15 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-200/90">
                Auto Access · Showroom
              </p>
            </div>

            <h1 className="mt-4 text-[1.8rem] font-semibold leading-[1.08] tracking-tight text-white">
              The collection.
              <br />
              <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                Refined for South Africa.
              </span>
            </h1>

            <p className="mt-3 text-[13px] leading-6 text-blue-50/75">
              Browse a curated range of premium rent-to-own vehicles with
              transparent pricing and clear monthly terms.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f4c89a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                Rent To Own
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-blue-50/80">
                <span className="font-mono font-semibold text-white tabular-nums">
                  {vehicleCount}
                </span>
                {vehicleCount === 1 ? " vehicle" : " vehicles"} available
              </span>
            </div>
          </div>
        </section>

        {/* ── Stat strip ── */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-[14px] border border-[#e1e4ee] bg-white px-3 py-3 shadow-[0_4px_12px_-6px_rgba(15,23,42,0.08)]">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
              In Showroom
            </p>
            <p className="mt-1 text-[18px] font-semibold tabular-nums text-[#1b2345]">
              {vehicleCount}
            </p>
          </div>

          <div className="rounded-[14px] border border-emerald-200 bg-emerald-50 px-3 py-3 shadow-[0_4px_12px_-6px_rgba(16,185,129,0.12)]">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              Rent-to-Own
            </p>
            <p className="mt-1 text-[11px] font-semibold text-emerald-900">
              All listings
            </p>
          </div>

          <div className="rounded-[14px] border border-[#dbe6ff] bg-[#eef4ff] px-3 py-3 shadow-[0_4px_12px_-6px_rgba(47,103,222,0.1)]">
            <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-[#2f67de]">
              Fast Track
            </p>
            <p className="mt-1 text-[11px] font-semibold text-[#1b2345]">
              Apply today
            </p>
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div className="mt-3 overflow-hidden rounded-[14px] border border-[#e1e4ee] bg-white">
          <div className="divide-y divide-[#f0f2f8]">
            {[
              {
                icon: <IconCheck />,
                title: "Transparent Pricing",
                desc: "Deposit, monthly and total shown on every offer.",
              },
              {
                icon: <IconShield />,
                title: "Vetted Inventory",
                desc: "Every vehicle is quality checked before listing.",
              },
              {
                icon: <IconClock />,
                title: "Fast Approval",
                desc: "Streamlined application with quick turnaround.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 px-4 py-2.5"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a]">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#1b2345]">
                    {item.title}
                  </p>
                  <p className="text-[11px] leading-4 text-[#68708a]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Vehicle inventory ── */}
        <div className="mt-4 overflow-hidden rounded-[20px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.1)]">
          {/* Section header */}
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-[#f4c89a]">
                  <IconCar />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                    Curated Inventory
                  </p>
                  <h2 className="text-[1rem] font-semibold text-white">
                    Premium Vehicle Offers
                  </h2>
                </div>
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                {vehicleCount} {vehicleCount === 1 ? "listing" : "listings"}
              </span>
            </div>
          </div>

          <div className="p-4">
            {vehicles.length === 0 ? (
              <div className="rounded-[14px] border-2 border-dashed border-[#d7d9e2] bg-[#fafbff] p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef0f7] text-[#68708a]">
                  <IconCar />
                </div>
                <p className="text-[13px] font-semibold text-[#1b2345]">
                  No vehicle offers available yet
                </p>
                <p className="mt-1.5 text-[12px] leading-5 text-[#68708a]">
                  Please check back soon for the latest listings.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {primaryVehicles.map((vehicle: GalleryVehicleOffer) => (
                  <MobileVehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}

                {extraVehicles.length > 0 ? (
                  <details className="group rounded-[14px] border border-[#e1e4ee] bg-[#fafbff]">
                    <summary className="flex cursor-pointer list-none items-center justify-center gap-2 px-4 py-3 text-[12px] font-semibold text-[#1b2345] marker:content-none">
                      View {extraVehicles.length} more{" "}
                      {extraVehicles.length === 1 ? "vehicle" : "vehicles"}
                      <IconChevron />
                    </summary>

                    <div className="space-y-3 border-t border-[#e7eaf2] p-3">
                      {extraVehicles.map((vehicle: GalleryVehicleOffer) => (
                        <MobileVehicleCard key={vehicle.id} vehicle={vehicle} />
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* ── Apply CTA ── */}
        {vehicles.length > 0 ? (
          <section className="relative mt-4 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-6 shadow-[0_24px_60px_-20px_rgba(11,21,50,0.45)]">
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#2f67de]/20 blur-3xl" />
            <div className="absolute -bottom-10 right-0 h-32 w-32 rounded-full bg-[#d59758]/15 blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#f4c89a] shadow-[0_0_10px_rgba(244,200,154,0.8)]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#f4c89a]">
                  Ready to drive
                </p>
              </div>

              <h2 className="mt-3 text-[1.4rem] font-semibold leading-[1.15] text-white">
                Found one you love?
                <br />
                <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                  Start your application.
                </span>
              </h2>

              <p className="mt-2.5 text-[12.5px] leading-6 text-blue-50/75">
                Begin a fast-tracked rent-to-own application and manage every
                step from your secure client portal.
              </p>

              <div className="mt-5 grid gap-2.5">
                <Link
                  href="/apply"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)]"
                >
                  Start Your Application
                  <IconArrow />
                </Link>
                <Link
                  href="/portal-login"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white"
                >
                  Portal Login
                </Link>
              </div>
            </div>
          </section>
        ) : null}

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
            A premium South African rent-to-own platform built around clarity,
            trust, and structured vehicle access.
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
            <Link
              href="/portal-login"
              className="text-[12px] text-blue-50/55"
            >
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