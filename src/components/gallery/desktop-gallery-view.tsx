import { prisma } from "@/lib/prisma";
import Link from "next/link";
import VehicleOfferCard from "@/components/vehicle-offer-card";

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

export default async function GalleryPage() {
  const vehicles: GalleryVehicleOffer[] = await prisma.vehicleOffer.findMany({
      where: {
        NOT: { featuredImage: { contains: 'unsplash' } },
      },
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
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

      <div className="px-4 py-6 sm:px-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          <div className="hidden md:block">
            <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] p-10 shadow-[0_30px_80px_-20px_rgba(11,21,50,0.55)]">
              <div className="absolute inset-0">
                <div className="absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-[#2f67de]/25 blur-3xl" />
                <div className="absolute -right-16 top-10 h-[340px] w-[340px] rounded-full bg-[#d59758]/15 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-200/90">
                      Auto Access · Showroom
                    </p>
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-[2.85rem]">
                    The collection.
                    <br />
                    <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                      Refined for South Africa.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-[15px] leading-7 text-blue-50/75">
                    Explore a curated range of premium rent-to-own vehicles with transparent pricing, clear monthly terms, and full offer detail behind every listing.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4c89a] backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                      Rent To Own
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-blue-50/80 backdrop-blur">
                      <span className="font-mono text-white tabular-nums">{vehicleCount}</span>{" "}
                      {vehicleCount === 1 ? "vehicle" : "vehicles"} available
                    </span>
                  </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[#2f67de]/30 blur-2xl" />
                    <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl">
                      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          stroke="url(#galleryGrad)"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray="276 276"
                        />
                        <defs>
                          <linearGradient id="galleryGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#7ea8ff" />
                            <stop offset="100%" stopColor="#f4c89a" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/70">
                          In Showroom
                        </p>
                        <p className="mt-1 text-4xl font-semibold tabular-nums text-white">
                          {vehicleCount}
                        </p>
                        <p className="mt-0.5 text-[10px] font-medium text-blue-200/60">
                          {vehicleCount === 1 ? "Active offer" : "Active offers"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="md:hidden text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2f67de]">
              Auto Access · Showroom
            </p>
            <h1 className="mt-3 text-[1.8rem] font-semibold tracking-tight text-[#1c2340]">
              Premium Vehicle Offers
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Browse a refined collection of vehicle opportunities with clear pricing and full details inside each offer.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-[#2f67de]/30 hover:shadow-[0_12px_30px_-12px_rgba(47,103,222,0.2)]">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-[#2f67de]/10 to-transparent blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white shadow-[0_8px_18px_-6px_rgba(47,103,222,0.5)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
                    <circle cx="6.5" cy="16.5" r="2.5" />
                    <circle cx="16.5" cy="16.5" r="2.5" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                    Vehicles Available
                  </p>
                  <p className="mt-1.5 text-xl font-semibold tabular-nums text-[#1b2345]">
                    {vehicleCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-emerald-300 hover:shadow-[0_12px_30px_-12px_rgba(16,185,129,0.2)]">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/10 to-transparent blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_8px_18px_-6px_rgba(16,185,129,0.5)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                    Rent-to-Own
                  </p>
                  <p className="mt-1.5 text-[0.95rem] font-semibold text-[#1b2345]">
                    Transparent terms
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-[#d59758]/30 hover:shadow-[0_12px_30px_-12px_rgba(213,151,88,0.2)]">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-[#d59758]/10 to-transparent blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#d59758] to-[#e4ad72] text-white shadow-[0_8px_18px_-6px_rgba(213,151,88,0.5)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                    Vetted Offers
                  </p>
                  <p className="mt-1.5 text-[0.95rem] font-semibold text-[#1b2345]">
                    Quality assured
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-[#1b2345]/30 hover:shadow-[0_12px_30px_-12px_rgba(27,35,69,0.2)]">
              <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-[#1b2345]/10 to-transparent blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_8px_18px_-6px_rgba(27,35,69,0.5)]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                    Fast Approval
                  </p>
                  <p className="mt-1.5 text-[0.95rem] font-semibold text-[#1b2345]">
                    Streamlined process
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2">
            <div className="overflow-hidden rounded-[26px] bg-white">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-7 sm:py-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                      <svg className="h-5 w-5 text-[#f4c89a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
                        <circle cx="6.5" cy="16.5" r="2.5" />
                        <circle cx="16.5" cy="16.5" r="2.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                        Curated Inventory
                      </p>
                      <h2 className="text-[1.1rem] font-semibold text-white sm:text-[1.25rem]">
                        Premium Vehicle Offers
                      </h2>
                    </div>
                  </div>
                  <span className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur sm:inline-flex">
                    <span className="tabular-nums">{vehicleCount}</span>{" "}
                    {vehicleCount === 1 ? "Listing" : "Listings"}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                {vehicles.length === 0 ? (
                  <div className="rounded-[22px] border-2 border-dashed border-[#d7d9e2] bg-gradient-to-br from-[#fafbff] to-white p-10 text-center sm:p-14">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eef0f7] text-[#68708a]">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
                        <circle cx="6.5" cy="16.5" r="2.5" />
                        <circle cx="16.5" cy="16.5" r="2.5" />
                      </svg>
                    </div>
                    <p className="mt-4 text-lg font-semibold text-[#1b2345]">
                      No vehicle offers available yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#68708a]">
                      Please check back soon for the latest rent-to-own listings.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {vehicles.map((offer: GalleryVehicleOffer) => (
                      <VehicleOfferCard key={offer.id} offer={offer} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {vehicles.length > 0 ? (
            <section className="relative mt-6 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] p-8 shadow-[0_30px_80px_-20px_rgba(11,21,50,0.55)] md:p-10">
              <div className="absolute inset-0">
                <div className="absolute -left-16 -top-16 h-[340px] w-[340px] rounded-full bg-[#2f67de]/25 blur-3xl" />
                <div className="absolute -right-16 -bottom-16 h-[300px] w-[300px] rounded-full bg-[#d59758]/15 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              <div className="relative grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#f4c89a] shadow-[0_0_12px_rgba(244,200,154,0.9)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f4c89a]">
                      Ready to drive
                    </p>
                  </div>
                  <h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-white md:text-4xl">
                    Found one you love?
                    <br />
                    <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                      Start your application.
                    </span>
                  </h2>
                  <p className="mt-4 max-w-lg text-[15px] leading-7 text-blue-50/75">
                    Begin a transparent, fast-tracked rent-to-own application and manage your journey from your secure portal.
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:items-end">
                  <Link
                    href="/apply"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.6)] transition hover:from-[#c4863f] hover:to-[#d59758] hover:shadow-[0_16px_36px_-10px_rgba(213,151,88,0.75)] lg:w-auto"
                  >
                    Start Your Application
                    <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                  <Link
                    href="/portal-login"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 lg:w-auto"
                  >
                    Portal Login
                  </Link>
                </div>
              </div>
            </section>
          ) : null}

          <footer className="mt-6 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-gradient-to-r from-[#fafbff] to-white">
            <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1.2fr_1fr] md:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_10px_24px_-8px_rgba(27,35,69,0.5)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
                    <circle cx="6.5" cy="16.5" r="2.5" />
                    <circle cx="16.5" cy="16.5" r="2.5" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#68708a]">
                    Auto Access
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-[#1b2345]">
                    Premium Rent-to-Own Vehicles · South Africa
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e1e4ee] bg-white px-4 py-2 text-xs font-semibold text-[#1b2345] transition hover:border-[#2f67de]/40 hover:text-[#2f67de]"
                >
                  Home
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e1e4ee] bg-white px-4 py-2 text-xs font-semibold text-[#1b2345] transition hover:border-[#2f67de]/40 hover:text-[#2f67de]"
                >
                  Showroom
                </Link>
                <Link
                  href="/apply"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e1e4ee] bg-white px-4 py-2 text-xs font-semibold text-[#1b2345] transition hover:border-[#2f67de]/40 hover:text-[#2f67de]"
                >
                  Apply
                </Link>
                <Link
                  href="/portal-login"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#1d2240] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#2a3563]"
                >
                  Portal
                </Link>
              </div>
            </div>
            <div className="border-t border-[#eef0f7] px-6 py-4 sm:px-8">
              <p className="text-center text-[11px] text-[#68708a] md:text-left">
                © {new Date().getFullYear()} Auto Access. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}