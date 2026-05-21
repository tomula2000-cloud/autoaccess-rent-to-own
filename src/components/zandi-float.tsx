"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const CALEB_WHATSAPP = "https://wa.me/27745462367?text=Hi%20Caleb%2C%20I%20have%20a%20question%20about%20my%20Auto%20Access%20application.";
const ZANDI_WHATSAPP = "https://wa.me/27625305570?text=Hi%20Zandi%2C%20I%20have%20a%20question%20about%20Auto%20Access.";

const APPROVED_STATUSES = [
  "APPROVED_IN_PRINCIPLE","CONTRACT_REQUESTED","CONTRACT_ISSUED",
  "AWAITING_INVOICE","INVOICE_ISSUED","AWAITING_PAYMENT",
  "PAYMENT_UNDER_VERIFICATION","PAYMENT_VERIFIED","COMPLETED"
];

function CalebGreeting({ waving }: { waving: boolean }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const run = () => {
      setShow(true);
      const hide = setTimeout(() => setShow(false), 5000);
      return hide;
    };
    let hide = run();
    const loop = setInterval(() => { hide = run(); }, 15000);
    return () => { clearTimeout(hide); clearInterval(loop); };
  }, []);

  if (!show) return null;

  return (
    <div
      className="flex items-center gap-2 rounded-[12px] bg-white p-2 ring-1 ring-[#0b1532]/10 max-w-[185px] shadow-[0_6px_18px_-4px_rgba(11,21,50,0.18)]"
      style={{ animation: "cardIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
    >
      <div className="h-7 w-7 shrink-0 overflow-hidden rounded-full ring-2 ring-[#d59758]/50">
        <Image src="/caleb.jpg" alt="Caleb" width={28} height={28} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#d59758]">Your Service Champion</p>
        <p className="text-[10px] font-semibold text-[#1b2345] leading-tight">
          Hi! I&apos;m Caleb{" "}
          <span style={{ display: "inline-block", animation: waving ? "waveHand 0.8s ease infinite" : "none", transformOrigin: "70% 70%" }}>
            {String.fromCodePoint(0x1F44B)}
          </span>
        </p>
        <p className="text-[9px] text-[#64748b]">Tap to chat!</p>
      </div>
    </div>
  );
}

export default function ZandiFloat() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [showCaleb, setShowCaleb] = useState(false);
  const [waving, setWaving] = useState(false);
  const [stage, setStage] = useState<"hidden"|"greeting"|"online">("hidden");
  const [dismissed, setDismissed] = useState(false);
  const soundPlayed = useRef(false);

  const isPortal = pathname?.startsWith("/portal");
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    setMounted(true);
    // Read portal status cookie client-side only
    if (isPortal) {
      const statusCookie = document.cookie
        .split(";")
        .find(c => c.trim().startsWith("autoaccess_portal_status="))
        ?.split("=")[1] || "";
      setShowCaleb(APPROVED_STATUSES.includes(statusCookie));
    }
  }, [isPortal]);

  useEffect(() => {
    if (!mounted || !showCaleb) return;
    // Start waving after 1s
    const t1 = setTimeout(() => setWaving(true), 1000);
    const t2 = setTimeout(() => setWaving(false), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mounted, showCaleb]);

  useEffect(() => {
    if (isPortal || dismissed || !mounted) return;
    const t1 = setTimeout(() => setStage("greeting"), 2000);
    const t2 = setTimeout(() => setStage("hidden"), 7000);
    const t3 = setTimeout(() => setStage("online"), 17000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [isPortal, dismissed, mounted]);

  if (!mounted) return null;
  if (isAdmin) return null;

  // ── CALEB PORTAL FLOAT ──
  if (showCaleb) {
    return (
      <div className="fixed bottom-4 right-3 z-[9999] flex flex-col items-end gap-1.5">
        <style>{`
          @keyframes waveHand {
            0%,100% { transform: rotate(0deg); }
            20% { transform: rotate(22deg); }
            40% { transform: rotate(-8deg); }
            60% { transform: rotate(18deg); }
            80% { transform: rotate(-4deg); }
          }
          @keyframes cardIn {
            from { opacity: 0; transform: translateX(14px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>
        <CalebGreeting waving={waving} />
        <div className="flex items-center gap-1.5 self-end">
          <div className="flex items-center gap-1 rounded-full bg-[#1b2345] px-2 py-1 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
            <span className="text-[9px] font-bold text-white tracking-wide">Caleb</span>
          </div>
          <a
            href={CALEB_WHATSAPP}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with Caleb on WhatsApp"
            className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full ring-2 ring-[#d59758] shadow-[0_6px_20px_-4px_rgba(213,151,88,0.5)] transition-all duration-300 hover:scale-110"
          >
            <Image src="/caleb.jpg" alt="Caleb" width={44} height={44} className="h-full w-full object-cover" priority />
            <span className="absolute bottom-0.5 right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e] ring-1 ring-white"></span>
            </span>
          </a>
        </div>
      </div>
    );
  }

  // ── ZANDI DEFAULT FLOAT ──
  const tooltipVisible = !dismissed && (stage === "greeting" || stage === "online");

  return (
    <div className="fixed bottom-24 right-4 z-[9999] flex flex-col items-end gap-3 md:bottom-6">
      <div className={`transition-all duration-500 ${tooltipVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"}`}>
        {stage === "greeting" ? (
          <div className="relative flex items-center gap-2.5 rounded-[16px] bg-white px-3.5 py-2.5 shadow-[0_8px_28px_-8px_rgba(11,21,50,0.25)] backdrop-blur-xl ring-1 ring-[#0b1532]/10 max-w-[240px]">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-[#d59758]/40">
              <Image src="/zandi.jpg" alt="Zandi" width={32} height={32} className="h-full w-full object-cover" />
            </div>
            <span className="text-[12px] font-medium text-[#0b1532] leading-snug">Hi, I&apos;m Zandi 👋 How can I help?</span>
            <button onClick={() => setDismissed(true)} className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f1f3f8] text-[#68708a] hover:bg-[#e6e9ef]" aria-label="Dismiss">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        ) : stage === "online" ? (
          <div className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 shadow-[0_4px_12px_-4px_rgba(11,21,50,0.15)] ring-1 ring-[#0b1532]/8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e]"></span>
            <span className="text-[10px] font-medium text-[#0b1532]">Zandi is online</span>
          </div>
        ) : null}
      </div>
      <a
        href={ZANDI_WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Zandi on WhatsApp"
        className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white shadow-[0_8px_28px_-4px_rgba(11,21,50,0.4)] transition-all duration-500 hover:scale-110 hover:shadow-[0_12px_32px_-4px_rgba(213,151,88,0.6)] ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
      >
        <Image src="/zandi.jpg" alt="Zandi" width={80} height={80} className="h-full w-full object-cover" priority />
        <span className="absolute bottom-0.5 right-0.5 flex h-2.5 w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e] opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e] ring-2 ring-white"></span>
        </span>
      </a>
    </div>
  );
}
