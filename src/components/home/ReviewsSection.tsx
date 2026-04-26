"use client";

import Link from "next/link";

const REVIEWS = [
  {
    name: "Tebogo Nkosi",
    province: "Gauteng",
    date: "Apr 2026",
    rating: 5,
    title: "Took delivery of my Polo this week — absolutely amazing",
    body: "I collected my Volkswagen Polo Vivo from Auto Access and I still can't believe it's mine. The car was spotless, full tank, all documents ready. The handover was smooth and the team walked me through everything. This is how vehicle ownership should work in South Africa.",
    verified: true,
  },
  {
    name: "Nomvula Khumalo",
    province: "KwaZulu-Natal",
    date: "Oct 2023",
    rating: 5,
    title: "Excellent service from start to finish",
    body: "I was skeptical at first about rent-to-own but the Auto Access team explained everything clearly. No hidden fees, no surprises. The repossessed vehicle I got was immaculate — you'd never know it wasn't brand new. Genuinely grateful.",
    verified: true,
  },
  {
    name: "Fatima Adams",
    province: "Western Cape",
    date: "Sep 2023",
    rating: 5,
    title: "The only company that actually helped me",
    body: "I tried the traditional banks, tried dealers — everyone turned me away. Auto Access looked at my situation differently. The team was patient, professional and got me into a great vehicle. The monthly payment is manageable and I'm building my credit at the same time.",
    verified: true,
  },
];

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= rating ? "#d59758" : "none"}
          stroke={i <= rating ? "#d59758" : "#d1d5db"}
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof REVIEWS)[0] }) {
  return (
    <div className="flex flex-col gap-3 rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-[#d59758]/40 hover:shadow-[0_12px_30px_-12px_rgba(213,151,88,0.15)]">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[11px] font-bold text-white">
            {review.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#1b2345]">{review.name}</p>
            <p className="text-[11px] text-[#68708a]">
              {review.province} &bull; {review.date}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating rating={review.rating} size={12} />
          {review.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div>
        <p className="text-[13px] font-semibold text-[#1b2345]">{review.title}</p>
        <p className="mt-1.5 text-[12.5px] leading-[1.65] text-[#39425d]">{review.body}</p>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="section-reveal mt-6 overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2">
      <div className="overflow-hidden rounded-[26px] bg-white">

        {/* Header — dark navy panel matching your design system */}
        <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                {/* Star icon */}
                <svg className="h-5 w-5 text-[#f4c89a]" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                  Customer Reviews
                </p>
                <h2 className="text-[1.15rem] font-semibold text-white sm:text-[1.25rem]">
                  What our clients say
                </h2>
              </div>
            </div>

            {/* Rating badge */}
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className="text-[26px] font-semibold text-white leading-none">4.7</span>
                  <div className="flex flex-col gap-0.5">
                    <StarRating rating={5} size={11} />
                    <p className="text-[10px] text-blue-100/60">229+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[13px] leading-[1.6] text-blue-50/70">
            Over 229 verified South African customers have shared their Auto Access experience. Rated 4.7 out of 5.
          </p>
        </div>

        {/* Review cards */}
        <div className="p-6 sm:p-8">
          {/* Mobile rating summary */}
          <div className="mb-5 flex items-center gap-4 rounded-[18px] border border-[#e1e4ee] bg-[#fafbff] px-4 py-3 sm:hidden">
            <div className="text-center">
              <p className="text-[28px] font-semibold leading-none text-[#1b2345]">4.7</p>
              <StarRating rating={5} size={12} />
              <p className="mt-1 text-[10px] text-[#68708a]">229+ reviews</p>
            </div>
            <div className="h-10 w-px bg-[#e1e4ee]" />
            <div className="grid gap-1 flex-1">
              {[
                { label: "5 star", pct: 78 },
                { label: "4 star", pct: 14 },
                { label: "3 star", pct: 5 },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="w-10 text-[10px] text-[#68708a]">{row.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#e1e4ee] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#d59758]"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop rating bar */}
          <div className="mb-6 hidden items-center gap-6 sm:flex">
            <div className="grid gap-1.5 flex-1">
              {[
                { label: "5 star", pct: 78, count: 179 },
                { label: "4 star", pct: 14, count: 32 },
                { label: "3 star", pct: 5, count: 11 },
                { label: "2 star", pct: 2, count: 5 },
                { label: "1 star", pct: 1, count: 2 },
              ].map((row) => (
                <div key={row.label} className="flex items-center gap-3">
                  <span className="w-11 text-[11px] text-[#68708a] text-right">{row.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-[#eef0f7] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#d59758] transition-all"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-[11px] text-[#68708a]">{row.count}</span>
                </div>
              ))}
            </div>
            <div className="text-center shrink-0">
              <p className="text-[42px] font-semibold leading-none text-[#1b2345]">4.7</p>
              <StarRating rating={5} size={14} />
              <p className="mt-1.5 text-[11px] text-[#68708a]">229+ verified reviews</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-700">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Excellent
              </span>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid gap-4 md:grid-cols-3">
            {REVIEWS.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-6 flex flex-col items-center gap-3 rounded-[22px] border border-[#d59758]/25 bg-gradient-to-r from-[#fbf2ea] to-white px-6 py-5 sm:flex-row sm:justify-between">
            <div>
              <p className="text-[13px] font-semibold text-[#1b2345]">
                Read all 229+ verified customer reviews
              </p>
              <p className="mt-0.5 text-[12px] text-[#68708a]">
                Published independently on SA Reviews &bull; sareviews.co.za
              </p>
            </div>
            <Link
              href="https://sareviews.co.za/auto-access"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(213,151,88,0.5)] transition hover:from-[#c4863f] hover:to-[#d59758]"
            >
              View all reviews
              <svg
                className="h-3.5 w-3.5 transition group-hover:translate-x-0.5"
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
        </div>
      </div>
    </section>
  );
}
