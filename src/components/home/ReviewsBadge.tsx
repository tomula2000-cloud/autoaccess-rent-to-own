"use client";

import Link from "next/link";

interface ReviewsBadgeProps {
  /** Position on screen. Defaults to bottom-right */
  position?: "bottom-right" | "bottom-left" | "top-right";
  /** Use a smaller compact version for the portal */
  compact?: boolean;
}

export default function ReviewsBadge({
  position = "bottom-right",
  compact = false,
}: ReviewsBadgeProps) {
  const posClass =
    position === "bottom-left"
      ? "bottom-20 left-4"
      : position === "top-right"
      ? "top-20 right-4"
      : "bottom-20 right-4";

  if (compact) {
    // Inline highlight strip for the portal
    return (
      <Link
        href="https://sareviews.co.za/auto-access"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-2.5 rounded-[14px] border border-[#d59758]/30 bg-gradient-to-r from-[#fbf2ea] to-white px-3.5 py-2.5 shadow-[0_2px_8px_-2px_rgba(213,151,88,0.2)] transition hover:border-[#d59758]/60 hover:shadow-[0_4px_12px_-2px_rgba(213,151,88,0.3)]"
      >
        {/* Stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="#d59758">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
        <div className="h-3 w-px bg-[#e8d5bb]" />
        <span className="text-[11px] font-semibold text-[#c37d43]">
          4.7 on SA Reviews
        </span>
        <svg
          className="h-3 w-3 text-[#d59758] transition group-hover:translate-x-0.5"
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
    );
  }

  // Floating badge for mobile homepage
  return (
    <Link
      href="https://sareviews.co.za/auto-access"
      target="_blank"
      rel="noopener noreferrer"
      className={`group fixed ${posClass} z-40 flex items-center gap-2 rounded-2xl border border-[#d59758]/30 bg-white/95 px-3.5 py-2.5 shadow-[0_4px_20px_-4px_rgba(28,26,23,0.2),0_0_0_1px_rgba(213,151,88,0.1)] backdrop-blur-sm transition hover:shadow-[0_6px_24px_-4px_rgba(28,26,23,0.25)] active:scale-95`}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      {/* Green dot — live indicator */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>

      <div className="flex flex-col">
        {/* Stars row */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="#d59758">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
          <span className="ml-1 text-[11px] font-bold text-[#1b2345]">4.7</span>
        </div>
        {/* Label */}
        <span className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#68708a] leading-none mt-0.5">
          229+ reviews
        </span>
      </div>

      {/* SA Reviews logo text */}
      <div className="ml-0.5 border-l border-[#e8e5df] pl-2.5">
        <span className="text-[10px] font-bold text-[#1b2345] leading-none">SA</span>
        <span className="text-[10px] font-bold text-[#d59758] leading-none">Reviews</span>
      </div>
    </Link>
  );
}
