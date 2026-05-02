"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Vehicle {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  monthlyPayment: string;
  yearModel: string;
  transmission: string;
  fuelType: string;
}

interface MarqueeProps {
  vehicles: Vehicle[];
  variant?: "desktop" | "mobile";
}

function formatCurrency(value: string) {
  const num = Number(value.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return `R ${value}`;
  return `R ${num.toLocaleString("en-ZA")}`;
}

export default function HomeFeaturedVehiclesMarquee({
  vehicles,
  variant = "desktop",
}: MarqueeProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (vehicles.length === 0) return null;

  // Ensure the marquee always has at least 6 distinct slots,
  // then double the result so the loop is seamless.
  let base = vehicles;
  while (base.length < 6) {
    base = base.concat(vehicles);
  }
  const displayCards = base.concat(base);

  const isMobile = variant === "mobile";
  const cardWidthClass = isMobile ? "w-[260px]" : "w-[320px]";
  const imageHeightClass = isMobile ? "h-40" : "h-48";
  const trackGap = isMobile ? "12px" : "20px";
  const duration = isMobile ? "45s" : "55s";
  const headlineSize = isMobile
    ? "text-[1.6rem]"
    : "text-3xl md:text-[2.5rem]";

  return (
    <div
      ref={sectionRef}
      className="relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <style>{`
        @keyframes featuredMarqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .featured-marquee-track-${variant} {
          display: flex;
          width: max-content;
          gap: ${trackGap};
          animation: featuredMarqueeScroll ${duration} linear infinite;
          will-change: transform;
        }
        .featured-marquee-mask-${variant}:hover .featured-marquee-track-${variant} {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .featured-marquee-track-${variant} { animation: none; }
        }
      `}</style>

      {/* Section heading */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#d59758] shadow-[0_0_10px_rgba(213,151,88,0.7)]" />
          <p className={`font-bold uppercase tracking-[0.28em] text-[#c37d43] ${isMobile ? "text-[9px]" : "text-[10px]"}`}>
            Featured Inventory
          </p>
        </div>
        <h2 className={`mt-3 font-semibold leading-[1.1] tracking-tight text-[#1b2345] ${headlineSize}`}>
          Drive Away{" "}
          <span className="bg-gradient-to-r from-[#d59758] via-[#e4ad72] to-[#d59758] bg-clip-text text-transparent">
            Today.
          </span>
        </h2>
      </div>

      {/* Marquee */}
      <div
        className={`featured-marquee-mask-${variant} relative ${isMobile ? "mt-6" : "mt-8"}`}
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
        }}
      >
        <div className={`featured-marquee-track-${variant}`}>
          {displayCards.map((vehicle, i) => (
            <Link
              key={`${vehicle.id}-${i}`}
              href={`/gallery/${vehicle.slug}`}
              aria-hidden={i >= base.length}
              tabIndex={i >= base.length ? -1 : undefined}
              className={`group relative flex shrink-0 ${cardWidthClass} flex-col overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#0d1b35] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)] transition duration-300 hover:-translate-y-1 hover:border-[#d59758]/30 hover:shadow-[0_32px_70px_-16px_rgba(213,151,88,0.18)]`}
            >
              {/* Image */}
              <div className={`relative ${imageHeightClass} overflow-hidden bg-[#091526]`}>
                <img
                  src={vehicle.featuredImage}
                  alt={vehicle.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                />

                {/* Year pill */}
                <div className="absolute left-3 top-3 z-20">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#d59758] backdrop-blur-sm">
                    {vehicle.yearModel}
                  </span>
                </div>

                {/* Status pill — gold pulse on Available */}
                <div className="absolute right-3 top-3 z-20">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#f4c89a] shadow-[0_0_8px_rgba(244,200,154,0.7)]" />
                    Available
                  </span>
                </div>

                {/* Bottom navy gradient bleed */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d1b35] via-[#0d1b35]/55 to-transparent" />
              </div>

              {/* Body */}
              <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
                {/* Eyebrow */}
                <div className="flex items-center gap-1.5">
                  <span className="h-px w-3.5 bg-[#d59758]/60" />
                  <p className="text-[8px] font-bold uppercase tracking-[0.22em] text-[#d59758]/80">
                    Auto Access · Rent-To-Own
                  </p>
                </div>

                {/* Title */}
                <h3 className="mt-1.5 line-clamp-1 text-[14px] font-semibold tracking-tight text-white transition-colors duration-150 group-hover:text-[#d59758]">
                  {vehicle.title}
                </h3>

                {/* Spec chips */}
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-blue-100/70">
                    {vehicle.transmission}
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-blue-100/70">
                    {vehicle.fuelType}
                  </span>
                </div>

                {/* Monthly price */}
                <div className="mt-3 rounded-[12px] border border-[#d59758]/20 bg-[#d59758]/[0.07] px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#d59758]/70">
                    Monthly From
                  </p>
                  <p className="mt-0.5 text-[18px] font-bold tabular-nums leading-none text-[#d59758]">
                    {formatCurrency(vehicle.monthlyPayment)}
                  </p>
                </div>

                {/* CTA */}
                <span className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-4 py-2 text-[11px] font-bold tracking-wide text-[#0d1b35] shadow-[0_8px_18px_-6px_rgba(213,151,88,0.5)] transition group-hover:from-[#c4863f] group-hover:to-[#d59758]">
                  View Vehicle
                  <svg className="h-3 w-3 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* View Full Gallery CTA */}
      <div className={`flex justify-center ${isMobile ? "mt-6" : "mt-8"}`}>
        <Link
          href="/gallery"
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-7 py-3.5 text-sm font-bold tracking-wide text-[#0d1b35] shadow-[0_14px_30px_-10px_rgba(213,151,88,0.6)] transition hover:from-[#c4863f] hover:to-[#d59758] hover:shadow-[0_16px_36px_-10px_rgba(213,151,88,0.75)]"
        >
          View Full Gallery
          <svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
