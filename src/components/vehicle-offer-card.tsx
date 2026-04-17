import Link from "next/link";

type VehicleOfferCardProps = {
  offer: {
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
};

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "AVAILABLE":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "UNDER_OFFER":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "SOLD":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatTransmission(value: string) {
  return value === "AUTOMATIC" ? "Automatic" : "Manual";
}

function formatFuelType(value: string) {
  return value === "DIESEL" ? "Diesel" : "Petrol";
}

function formatCurrency(value: string) {
  const num = Number(value.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return `R ${value}`;
  return `R ${num.toLocaleString("en-ZA")}`;
}

export default function VehicleOfferCard({ offer }: VehicleOfferCardProps) {
  const isAvailable = offer.status === "AVAILABLE";
  const isUnderOffer = offer.status === "UNDER_OFFER";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.1)] transition duration-300 hover:-translate-y-1 hover:border-[#2f67de]/30 hover:shadow-[0_24px_50px_-18px_rgba(47,103,222,0.25)]">
      {/* ============== IMAGE BLOCK ============== */}
      <Link href={`/gallery/${offer.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#f7f8fa]">
          {/* Year glass chip */}
          <div className="absolute left-4 top-4 z-20">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b2345] shadow-[0_8px_20px_-8px_rgba(15,23,42,0.3)] backdrop-blur">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {offer.yearModel}
            </span>
          </div>

          {/* Status glass chip — uses existing getStatusBadgeClass */}
          <div className="absolute right-4 top-4 z-20">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] shadow-[0_8px_20px_-8px_rgba(15,23,42,0.3)] backdrop-blur ${getStatusBadgeClass(
                offer.status
              )}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isAvailable
                    ? "bg-emerald-500 animate-pulse"
                    : isUnderOffer
                    ? "bg-amber-500"
                    : "bg-red-500"
                }`}
              />
              {formatStatus(offer.status)}
            </span>
          </div>

          {/* Image */}
          <div className="aspect-[16/10] w-full overflow-hidden">
            <img
              src={offer.featuredImage}
              alt={offer.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
            />
          </div>

          {/* Bottom gradient overlay for premium depth */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b1532]/55 via-[#0b1532]/15 to-transparent" />
        </div>
      </Link>

      {/* ============== BODY ============== */}
      <div className="flex flex-1 flex-col p-5">
        {/* Eyebrow */}
        <div className="flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#d59758]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c37d43]">
            Rent-To-Own · Auto Access
          </p>
        </div>

        {/* Title */}
        <h3 className="mt-2 h-[3.2rem] overflow-hidden text-[1.15rem] font-semibold leading-tight tracking-tight text-[#1b2345] line-clamp-2">
          {offer.title}
        </h3>

        {/* ============== PRICE TILES — KPI tile language ============== */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          {/* Deposit */}
          <div className="group/tile relative overflow-hidden rounded-[18px] border border-[#e1e4ee] bg-white p-4 transition hover:border-[#2f67de]/30">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-gradient-to-br from-[#2f67de]/10 to-transparent blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white shadow-[0_6px_14px_-4px_rgba(47,103,222,0.5)] text-[11px] font-bold">
                  R
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                  Deposit
                </p>
              </div>
              <p className="mt-2 whitespace-nowrap text-[1.1rem] font-bold tabular-nums leading-tight text-[#1b2345]">
                {formatCurrency(offer.depositAmount)}
              </p>
            </div>
          </div>

          {/* Monthly */}
          <div className="group/tile relative overflow-hidden rounded-[18px] border border-[#e1e4ee] bg-white p-4 transition hover:border-[#d59758]/30">
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-gradient-to-br from-[#d59758]/10 to-transparent blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#d59758] to-[#e4ad72] text-white shadow-[0_6px_14px_-4px_rgba(213,151,88,0.5)] text-[11px] font-bold">
                  R
                </div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                  Monthly
                </p>
              </div>
              <p className="mt-2 whitespace-nowrap text-[1.1rem] font-bold tabular-nums leading-tight text-[#1b2345]">
                {formatCurrency(offer.monthlyPayment)}
              </p>
            </div>
          </div>
        </div>

        {/* ============== SPEC STRIP — monochrome icon language ============== */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-[#eef0f7] rounded-[18px] border border-[#e1e4ee] bg-[#fafbff]">
          {/* Mileage */}
          <div className="flex flex-col items-center gap-1.5 px-2 py-3 text-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef4ff] text-[#2f67de]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
              Mileage
            </p>
            <p className="text-[12px] font-semibold tabular-nums text-[#1b2345]">
              {offer.mileage}
            </p>
          </div>

          {/* Gearbox */}
          <div className="flex flex-col items-center gap-1.5 px-2 py-3 text-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
              Gearbox
            </p>
            <p className="text-[12px] font-semibold text-[#1b2345]">
              {formatTransmission(offer.transmission)}
            </p>
          </div>

          {/* Fuel */}
          <div className="flex flex-col items-center gap-1.5 px-2 py-3 text-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-[#d59758]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="22" x2="15" y2="22" />
                <line x1="4" y1="9" x2="14" y2="9" />
                <path d="M14 22V4a2 2 0 00-2-2H6a2 2 0 00-2 2v18" />
                <path d="M14 13h2a2 2 0 012 2v2a2 2 0 002 2 2 2 0 002-2V9.83a2 2 0 00-.59-1.42L18 5" />
              </svg>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
              Fuel
            </p>
            <p className="text-[12px] font-semibold text-[#1b2345]">
              {formatFuelType(offer.fuelType)}
            </p>
          </div>
        </div>

        {/* ============== BOTTOM CTA ============== */}
        <Link
          href={`/gallery/${offer.slug}`}
          className={`group/cta mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
            isAvailable
              ? "bg-gradient-to-r from-[#2f67de] to-[#3f78ea] text-white shadow-[0_12px_26px_-10px_rgba(47,103,222,0.55)] hover:from-[#2559c6] hover:to-[#3568d6] hover:shadow-[0_16px_32px_-10px_rgba(47,103,222,0.7)]"
              : isUnderOffer
              ? "bg-gradient-to-r from-[#d59758] to-[#e4ad72] text-white shadow-[0_12px_26px_-10px_rgba(213,151,88,0.55)] hover:from-[#c4863f] hover:to-[#d59758]"
              : "border border-[#1d2240] bg-[#1d2240] text-white hover:bg-[#2a3563]"
          }`}
        >
          View Offer Details
          <svg
            className="h-4 w-4 transition group-hover/cta:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </article>
  );
}