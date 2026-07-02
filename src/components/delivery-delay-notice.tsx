"use client";
import { useEffect, useState } from "react";

interface DeliveryDelayNoticeProps {
  storageKey?: string;
}

export default function DeliveryDelayNotice({ storageKey = "aa_delivery_delay_notice_dismissed" }: DeliveryDelayNoticeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Reappears on every visit until the cutoff date passes.
    // We do NOT persist a permanent dismiss - closing only hides it for this page view.
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-[24px] border border-amber-300 bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
        <button
          onClick={() => setVisible(false)}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f6fb] text-[#68708a] transition hover:bg-[#e8ecf5]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Delivery Update — Please Read</p>
          </div>
        </div>

        <div className="mt-4 space-y-3 text-[13px] leading-6 text-[#3a4256]">
          <p>
            Due to the mass protests currently taking place across South Africa this week, our transport partner made the decision to temporarily pause vehicle deliveries. This was purely a safety precaution — for your vehicle, and for our drivers, some of whom are foreign nationals and were placed at heightened risk during the unrest.
          </p>
          <p>
            Your delivery is being rescheduled to next Tuesday. We will confirm the exact new delivery date before the end of this week.
          </p>
          <p>
            Your vehicle is safe, your order has not been affected in any other way, and our team will keep you updated as soon as the new date is confirmed.
          </p>
          <p className="font-semibold text-[#1b2345]">
            Thank you for your patience and understanding.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-[#eef0f7] pt-4">
          <a
            href="https://wa.me/27610490061"
            target="_blank"
            rel="noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            WhatsApp Us
          </a>
          <button
            onClick={() => setVisible(false)}
            className="inline-flex flex-1 items-center justify-center rounded-full bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:opacity-90"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
