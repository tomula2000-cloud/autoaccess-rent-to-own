import Link from "next/link";

type VehicleListingCardProps = {
  offer: {
    id: string;
    slug: string;
    title: string;
    featuredImage: string;
    monthlyPayment: string;
    yearModel: string;
    mileage: string;
    status: string;
  };
};

function formatCurrency(value: string) {
  const num = Number(value.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return `R ${value}`;
  return `R ${num.toLocaleString("en-ZA")}`;
}

function getStatusLabel(status: string) {
  const map: Record<string, { label: string; dot: string }> = {
    AVAILABLE: { label: "Available", dot: "bg-emerald-400" },
    UNDER_OFFER: { label: "Under Offer", dot: "bg-amber-400" },
    SOLD: { label: "Sold", dot: "bg-red-400" },
  };
  return map[status] ?? { label: status, dot: "bg-slate-400" };
}

export default function VehicleListingCard({ offer }: VehicleListingCardProps) {
  const { label: statusLabel, dot: statusDot } = getStatusLabel(offer.status);
  const isAvailable = offer.status === "AVAILABLE";

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#0d1b35] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)] transition duration-300 hover:-translate-y-1 hover:border-[#d59758]/30 hover:shadow-[0_32px_70px_-16px_rgba(213,151,88,0.15)] cursor-pointer">

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

          {/* Car image */}
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

        {/* Vehicle name */}
        <Link href={`/gallery/${offer.slug}`}>
          <h3 className="mt-2 line-clamp-2 h-[3.1rem] text-[1.12rem] font-semibold leading-tight tracking-tight text-white transition-colors duration-150 group-hover:text-[#d59758]">
            {offer.title}
          </h3>
        </Link>

        {/* Spec strip */}
        <div className="mt-4 flex items-center gap-4 rounded-[14px] border border-white/[0.07] bg-white/[0.04] px-4 py-3">

          {/* Year */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d59758]/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d59758" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#5a7098]">Year</p>
              <p className="text-[12px] font-semibold tabular-nums text-white">{offer.yearModel}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-white/[0.07]" />

          {/* Mileage */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#d59758]/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d59758" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#5a7098]">Mileage</p>
              <p className="text-[12px] font-semibold tabular-nums text-white">{offer.mileage}</p>
            </div>
          </div>
        </div>

        {/* Monthly price block */}
        <div className="mt-4 flex items-center justify-between rounded-[14px] border border-[#d59758]/20 bg-[#d59758]/[0.07] px-4 py-3.5">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#d59758]/70">Monthly Payment</p>
            <p className="mt-0.5 text-[1.4rem] font-bold tabular-nums leading-tight text-[#d59758]">
              {formatCurrency(offer.monthlyPayment)}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d59758]/30 bg-[#d59758]/10">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d59758" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          </div>
        </div>

        {/* Apply Now CTA */}
        <Link
          href={`/gallery/${offer.slug}`}
          className="group/cta mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-5 py-3 text-sm font-bold tracking-wide text-[#0d1b35] shadow-[0_10px_28px_-8px_rgba(213,151,88,0.5)] transition duration-200 hover:from-[#c4863f] hover:to-[#d59758] hover:shadow-[0_14px_34px_-8px_rgba(213,151,88,0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d59758] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b35]"
        >
          Apply Now
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
