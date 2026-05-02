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

function getStatusMeta(status: string) {
  switch (status) {
    case "AVAILABLE":
      return { label: "Available", dot: "bg-[#f4c89a] shadow-[0_0_10px_rgba(244,200,154,0.7)]" };
    case "UNDER_OFFER":
      return { label: "Under Offer", dot: "bg-amber-400" };
    case "SOLD":
      return { label: "Sold", dot: "bg-red-400" };
    default:
      return { label: status.replaceAll("_", " "), dot: "bg-slate-400" };
  }
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
  const { label: statusLabel, dot: statusDot } = getStatusMeta(offer.status);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#0d1b35] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)] transition duration-300 hover:-translate-y-1 hover:border-[#d59758]/30 hover:shadow-[0_32px_70px_-16px_rgba(213,151,88,0.18)]">

      {/* ── IMAGE ── */}
      <Link href={`/gallery/${offer.slug}`} className="block">
        <div className="relative overflow-hidden">

          {/* Year pill */}
          <div className="absolute left-4 top-4 z-20">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d59758] backdrop-blur-sm">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {offer.yearModel}
            </span>
          </div>

          {/* Status pill */}
          <div className="absolute right-4 top-4 z-20">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span className={`h-1.5 w-1.5 rounded-full ${statusDot} ${isAvailable ? "animate-pulse" : ""}`} />
              {statusLabel}
            </span>
          </div>

          {/* Vehicle image */}
          <div className="aspect-[16/10] w-full overflow-hidden bg-[#091526]">
            <img
              src={offer.featuredImage}
              alt={offer.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
              loading="lazy"
            />
          </div>

          {/* Bottom navy gradient — bleeds into card body */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0d1b35] via-[#0d1b35]/60 to-transparent" />
        </div>
      </Link>

      {/* ── BODY ── */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-1">

        {/* Eyebrow */}
        <div className="flex items-center gap-2">
          <span className="h-px w-5 bg-[#d59758]/60" />
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#d59758]/80">
            Auto Access · Rent-To-Own
          </p>
        </div>

        {/* Title */}
        <Link href={`/gallery/${offer.slug}`}>
          <h3 className="mt-2 line-clamp-2 h-[3.1rem] text-[1.05rem] font-semibold leading-tight tracking-tight text-white transition-colors duration-150 group-hover:text-[#d59758]">
            {offer.title}
          </h3>
        </Link>

        {/* Spec strip — Mileage / Gearbox / Fuel */}
        <div className="mt-4 grid grid-cols-3 divide-x divide-white/[0.07] rounded-[14px] border border-white/[0.07] bg-white/[0.04]">
          {/* Mileage */}
          <div className="flex flex-col items-center gap-1.5 px-1 py-3 text-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d59758]/10">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d59758" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#5a7098]">
              Mileage
            </p>
            <p className="text-[11px] font-semibold tabular-nums text-white">
              {offer.mileage}
            </p>
          </div>

          {/* Gearbox */}
          <div className="flex flex-col items-center gap-1.5 px-1 py-3 text-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d59758]/10">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d59758" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#5a7098]">
              Gearbox
            </p>
            <p className="text-[11px] font-semibold text-white">
              {formatTransmission(offer.transmission)}
            </p>
          </div>

          {/* Fuel */}
          <div className="flex flex-col items-center gap-1.5 px-1 py-3 text-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d59758]/10">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#d59758" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="22" x2="15" y2="22" />
                <line x1="4" y1="9" x2="14" y2="9" />
                <path d="M14 22V4a2 2 0 00-2-2H6a2 2 0 00-2 2v18" />
                <path d="M14 13h2a2 2 0 012 2v2a2 2 0 002 2 2 2 0 002-2V9.83a2 2 0 00-.59-1.42L18 5" />
              </svg>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#5a7098]">
              Fuel
            </p>
            <p className="text-[11px] font-semibold text-white">
              {formatFuelType(offer.fuelType)}
            </p>
          </div>
        </div>

        {/* Pricing block — Monthly highlighted, Deposit secondary */}
        <div className="mt-4 flex items-center justify-between gap-3 rounded-[14px] border border-[#d59758]/20 bg-[#d59758]/[0.07] px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d59758]/70">
              Monthly
            </p>
            <p className="mt-0.5 truncate text-[1.3rem] font-bold tabular-nums leading-tight text-[#d59758]">
              {formatCurrency(offer.monthlyPayment)}
            </p>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-200/50">
              Deposit
            </p>
            <p className="mt-0.5 truncate text-[0.95rem] font-semibold tabular-nums leading-tight text-white">
              {formatCurrency(offer.depositAmount)}
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link
          href={`/gallery/${offer.slug}`}
          className={`group/cta mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold tracking-wide transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b35] ${
            isAvailable
              ? "bg-gradient-to-r from-[#d59758] to-[#e4ad72] text-[#0d1b35] shadow-[0_10px_28px_-8px_rgba(213,151,88,0.5)] hover:from-[#c4863f] hover:to-[#d59758] hover:shadow-[0_14px_34px_-8px_rgba(213,151,88,0.7)] focus-visible:ring-[#d59758]"
              : isUnderOffer
              ? "border border-[#d59758]/30 bg-[#d59758]/10 text-[#d59758] hover:bg-[#d59758]/20 focus-visible:ring-[#d59758]"
              : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 focus-visible:ring-white/40"
          }`}
        >
          {isAvailable ? "Apply Now" : isUnderOffer ? "Reserved · View" : "View Details"}
          <svg
            className="h-4 w-4 transition-transform duration-150 group-hover/cta:translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
