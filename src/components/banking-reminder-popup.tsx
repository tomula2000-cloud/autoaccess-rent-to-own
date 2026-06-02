"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function BankingReminderPopup() {
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = window.setTimeout(() => setShow(true), 400);
    return () => window.clearTimeout(timer);
  }, []);

  function goToBanking() {
    setShow(false);
    const el = document.getElementById("banking-details-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  if (!mounted || !show) return null;

  const popup = (
    <div className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[460px] overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="bg-gradient-to-r from-[#92400e] to-[#b45309] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15">
              <svg className="h-6 w-6 text-amber-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">Action Required</p>
              <h3 className="text-[1.05rem] font-semibold text-white">Complete your banking details</h3>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm leading-7 text-[#39425d]">
            You have signed your contract, but your <strong className="text-[#1b2345]">banking details have not been submitted yet</strong>.
          </p>
          <p className="mt-3 text-sm leading-7 text-[#39425d]">
            Please complete your banking details now to receive your invoice and secure your vehicle.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              onClick={goToBanking}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#c37d43] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(213,151,88,0.5)] transition hover:from-[#c37d43] hover:to-[#b86e35]"
            >
              Continue to Banking Details
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setShow(false)}
              className="text-[12px] font-semibold text-[#68708a] transition hover:text-[#1b2345]"
            >
              I&apos;ll do it shortly
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(popup, document.body);
}
