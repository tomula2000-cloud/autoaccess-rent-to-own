"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const TYPING_LINES = [
  "Flexible vehicle access for serious South African clients.",
  "Premium rent-to-own solutions with a structured process.",
  "Apply, track progress, and move forward with confidence.",
];

type FeaturedOffer = {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  depositAmount: string;
  monthlyPayment: string;
  yearModel: string;
  status: string;
};

type HomeHeroProps = {
  featuredOffers: FeaturedOffer[];
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

export default function HomeHero({ featuredOffers }: HomeHeroProps) {
  const [lineIndex, setLineIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const activeLine = useMemo(() => TYPING_LINES[lineIndex], [lineIndex]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && displayed.length < activeLine.length) {
      timeout = setTimeout(() => {
        setDisplayed(activeLine.slice(0, displayed.length + 1));
      }, 40);
    } else if (!isDeleting && displayed.length === activeLine.length) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1800);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => {
        setDisplayed(activeLine.slice(0, displayed.length - 1));
      }, 20);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setLineIndex((prev) => (prev + 1) % TYPING_LINES.length);
    }

    return () => clearTimeout(timeout);
  }, [activeLine, displayed, isDeleting]);

  const marqueeOffers =
    featuredOffers.length > 0
      ? [...featuredOffers, ...featuredOffers, ...featuredOffers]
      : [];

  return (
    <section className="relative overflow-hidden bg-[#0f172a] text-white">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=80"
          alt="Premium vehicles in a modern lifestyle setting"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(251,146,60,0.12),transparent_28%),linear-gradient(135deg,rgba(2,6,23,0.92),rgba(15,23,42,0.88),rgba(30,41,59,0.84))]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-14 md:pb-14 md:pt-18">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.34em] text-orange-300">
              Auto Access Rent To Own
            </p>

            <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Vehicle access with premium structure and modern clarity.
            </h1>

            <div className="mt-5 min-h-[3.5rem] max-w-3xl text-lg leading-8 text-slate-200 md:text-xl">
              <span>{displayed}</span>
              <span className="ml-1 inline-block h-6 w-[2px] translate-y-1 animate-pulse bg-orange-300" />
            </div>

            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
              Explore available vehicle offers, apply through a disciplined digital
              process, and continue your journey through a professional Client
              Portal Login experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/apply"
                className="inline-flex rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.32)] transition hover:bg-blue-700"
              >
                Apply Now
              </Link>

              <Link
                href="/gallery"
                className="inline-flex rounded-full border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white transition hover:bg-white/16"
              >
                View Gallery
              </Link>

              <Link
                href="/portal-login"
                className="inline-flex rounded-full border border-white/15 bg-transparent px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Client Portal Login
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/8 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-200">
                  Structured
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Clear path from application to next-step progression.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-200">
                  Visible
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Offers, pricing, and client actions presented more clearly.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/8 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-200">
                  Professional
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  Premium digital experience designed to build trust quickly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {marqueeOffers.length > 0 ? (
          <div className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-white/8 p-4 shadow-[0_12px_45px_rgba(0,0,0,0.14)] backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-300">
                  Featured Offers
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Current opportunities moving across the frame.
                </p>
              </div>

              <Link
                href="/gallery"
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                View All
              </Link>
            </div>

            <div className="overflow-hidden">
              <div className="flex min-w-max animate-[marquee_28s_linear_infinite] gap-4">
                {marqueeOffers.map((offer, index) => (
                  <Link
                    key={`${offer.id}-${index}`}
                    href={`/gallery/${offer.slug}`}
                    className="w-[280px] shrink-0 overflow-hidden rounded-[24px] border border-white/10 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-1"
                  >
                    <div className="relative">
                      <div className="aspect-[16/10] w-full bg-slate-100">
                        <img
                          src={offer.featuredImage}
                          alt={offer.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="absolute left-3 top-3">
                        <span className="rounded-full border border-white/80 bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-700">
                          {offer.yearModel}
                        </span>
                      </div>

                      <div className="absolute right-3 top-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${getStatusBadgeClass(
                            offer.status
                          )}`}
                        >
                          {formatStatus(offer.status)}
                        </span>
                      </div>
                    </div>

                    <div className="p-4 text-slate-900">
                      <h3 className="line-clamp-2 text-xl font-bold leading-tight">
                        {offer.title}
                      </h3>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700">
                            Deposit
                          </p>
                          <p className="mt-1 text-base font-bold text-slate-900">
                            {offer.depositAmount}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Monthly
                          </p>
                          <p className="mt-1 text-base font-bold text-slate-900">
                            {offer.monthlyPayment}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}