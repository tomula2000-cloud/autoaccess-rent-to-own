"use client";

import { useState, useEffect } from "react";

const ZANDI_WHATSAPP =
  "https://wa.me/27625305570?text=Hi%20Zandi%2C%20I%20have%20a%20question%20about%20Auto%20Access.";

export default function ZandiFloat() {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setTooltipVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [dismissed]);

  return (
    <div className="fixed bottom-6 right-4 z-[9999] flex flex-col items-end gap-2">
      <div
        className={`transition-all duration-500 ${
          tooltipVisible && !dismissed
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2 rounded-2xl border border-[#d59758]/30 bg-[#0b1532] px-4 py-2.5 shadow-[0_8px_24px_-6px_rgba(11,21,50,0.4)] max-w-[220px]">
          <span className="text-[12px] font-medium text-white leading-snug">
            Hi, I&apos;m Zandi from Auto Access 👋 How can I help?
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20"
            aria-label="Dismiss"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <a
        href={ZANDI_WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Zandi on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#d59758] to-[#e4ad72] shadow-[0_8px_24px_-6px_rgba(213,151,88,0.5)] transition hover:scale-105"
      >
        <span className="text-[22px] font-bold text-[#0b1532]">Z</span>
      </a>
    </div>
  );
}
