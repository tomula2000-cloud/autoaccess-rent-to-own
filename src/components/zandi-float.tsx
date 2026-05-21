"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const ZANDI_WHATSAPP =
  "https://wa.me/27625305570?text=Hi%20Zandi%2C%20I%20have%20a%20question%20about%20Auto%20Access.";

const CALEB_WHATSAPP =
  "https://wa.me/27745462367?text=Hi%20Caleb%2C%20I%20have%20been%20approved%20on%20Auto%20Access%20and%20need%20help%20with%20my%20next%20steps.";

function playNotification() {
  try {
    const AudioCtx =
      (window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext?: typeof AudioContext })
        .AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes: [number, number][] = [
      [825.5, 0],
      [1307.7, 0.12],
    ];
    notes.forEach(([freq, start]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + 0.15);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + 0.15);
    });
  } catch {
    // silently fail
  }
}

export default function ZandiFloat() {
  const pathname = usePathname();
  const [stage, setStage] = useState<"hidden" | "greeting" | "online">("hidden");
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [waving, setWaving] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const soundPlayed = useRef(false);

  const isPortal = pathname?.startsWith("/portal");

  const portalStatus = typeof document !== "undefined"
    ? document.cookie.split(";").find(c => c.trim().startsWith("autoaccess_portal_status="))?.split("=")[1] || ""
    : "";

  const APPROVED_STATUSES = [
    "APPROVED_IN_PRINCIPLE","CONTRACT_REQUESTED","CONTRACT_ISSUED",
    "AWAITING_INVOICE","INVOICE_ISSUED","AWAITING_PAYMENT",
    "PAYMENT_UNDER_VERIFICATION","PAYMENT_VERIFIED","COMPLETED"
  ];
  const showCaleb = isPortal && APPROVED_STATUSES.includes(portalStatus);

  useEffect(() => {
    setMounted(true);
    if (isPortal) {
      // Slide in after 1s
      const t1 = setTimeout(() => setSlideIn(true), 1000);
      // Start waving after 1.5s
      const t2 = setTimeout(() => setWaving(true), 1500);
      // Stop waving after 3s
      const t3 = setTimeout(() => setWaving(false), 3000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }

    if (dismissed) return;
    const t1 = setTimeout(() => {
      setStage("greeting");
      if (!soundPlayed.current) {
        playNotification();
        soundPlayed.current = true;
      }
    }, 2000);
    const t2 = setTimeout(() => setStage("hidden"), 7000);
    const t3 = setTimeout(() => setStage("online"), 17000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [dismissed, isPortal]);

  if (pathname?.startsWith("/admin")) return null;

  // ── CALEB PORTAL FLOAT ──
  if (showCaleb) {
    return (
      <div
        className="fixed bottom-6 right-4 z-[9999] flex flex-col items-end gap-2"
        style={{
          transform: slideIn ? "translateY(0)" : "translateY(120px)",
          opacity: slideIn ? 1 : 0,
          transition: "transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.5s ease",
        }}
      >
        {/* Greeting card */}
        {mounted && slideIn && (
          <div
            className="relative flex items-start gap-3 rounded-[18px] bg-white p-3.5 shadow-[0_12px_40px_-8px_rgba(11,21,50,0.25)] ring-1 ring-[#0b1532]/8 max-w-[230px]"
            style={{
              animation: "fadeSlideUp 0.5s ease 0.3s both",
            }}
          >
            <style>{`
              @keyframes fadeSlideUp {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
              }
              @keyframes wave {
                0%,100% { transform: rotate(0deg); }
                20% { transform: rotate(25deg); }
                40% { transform: rotate(-10deg); }
                60% { transform: rotate(20deg); }
                80% { transform: rotate(-5deg); }
              }
            `}</style>
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-[#d59758]/50 shadow-sm">
              <Image src="/caleb.jpg" alt="Caleb" width={36} height={36} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#d59758]">Your Service Champion</p>
              <p className="mt-0.5 text-[12px] font-semibold text-[#1b2345] leading-snug">
                Hi! I&apos;m Caleb{" "}
                <span style={{ display: "inline-block", animation: waving ? "wave 0.8s ease infinite" : "none", transformOrigin: "70% 70%" }}>
                  👋
                </span>
              </p>
              <p className="mt-0.5 text-[11px] text-[#64748b] leading-snug">
                I&apos;m here to help you every step of the way. Tap to chat!
              </p>
            </div>
          </div>
        )}

        {/* Caleb bubble */}
        <div className="flex items-center gap-2 self-end">
          <div className="flex items-center gap-1.5 rounded-full bg-[#1b2345] px-3 py-1.5 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse"></span>
            <span className="text-[10px] font-bold text-white tracking-wide">Caleb · Online</span>
          </div>
          <a
            href={CALEB_WHATSAPP}
            target="_blank"
            rel="noreferrer"
            aria-label="Chat with Caleb on WhatsApp"
            className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ring-[3px] ring-[#d59758] shadow-[0_8px_28px_-4px_rgba(213,151,88,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_36px_-4px_rgba(213,151,88,0.7)]"
          >
            <Image
              src="/caleb.jpg"
              alt="Caleb Auto Access Advisor"
              width={56}
              height={56}
              className="h-full w-full object-cover"
              priority
            />
            <span className="absolute bottom-0.5 right-0.5 flex h-3 w-3">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e] opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[#22c55e] ring-2 ring-white"></span>
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
      <div
        className={`transition-all duration-500 ${
          tooltipVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        {stage === "greeting" ? (
          <div className="relative flex items-center gap-2.5 rounded-[16px] bg-white px-3.5 py-2.5 shadow-[0_8px_28px_-8px_rgba(11,21,50,0.25)] backdrop-blur-xl ring-1 ring-[#0b1532]/10 max-w-[240px]">
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full ring-2 ring-[#d59758]/40">
              <Image src="/zandi.jpg" alt="Zandi" width={32} height={32} className="h-full w-full object-cover" />
            </div>
            <span className="text-[12px] font-medium text-[#0b1532] leading-snug">
              Hi, I&apos;m Zandi 👋 How can I help?
            </span>
            <button
              onClick={() => setDismissed(true)}
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f1f3f8] text-[#68708a] hover:bg-[#e6e9ef]"
              aria-label="Dismiss"
            >
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
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
        className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white shadow-[0_8px_28px_-4px_rgba(11,21,50,0.4)] transition-all duration-500 hover:scale-110 hover:shadow-[0_12px_32px_-4px_rgba(213,151,88,0.6)] ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <Image src="/zandi.jpg" alt="Zandi Auto Access Assistant" width={80} height={80} className="h-full w-full object-cover" priority />
        <span className="absolute bottom-0.5 right-0.5 flex h-2.5 w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e] opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e] ring-2 ring-white"></span>
        </span>
      </a>
    </div>
  );
}
