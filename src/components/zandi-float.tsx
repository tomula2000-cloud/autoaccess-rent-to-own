"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const ZANDI_WHATSAPP =
  "https://wa.me/27625305570?text=Hi%20Zandi%2C%20I%20have%20a%20question%20about%20Auto%20Access.";

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
  const soundPlayed = useRef(false);

  useEffect(() => {
    setMounted(true);
    if (dismissed) return;

    // 2s -> show greeting + sound
    const t1 = setTimeout(() => {
      setStage("greeting");
      if (!soundPlayed.current) {
        playNotification();
        soundPlayed.current = true;
      }
    }, 2000);

    // 7s -> hide greeting
    const t2 = setTimeout(() => {
      setStage("hidden");
    }, 7000);

    // 17s -> show subtle "Online" after a pause
    const t3 = setTimeout(() => {
      setStage("online");
    }, 17000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [dismissed]);

  if (pathname?.startsWith("/admin")) return null;

  const tooltipVisible = !dismissed && (stage === "greeting" || stage === "online");

  return (
    <div className="fixed bottom-24 right-4 z-[9999] flex flex-col items-end gap-3 md:bottom-6">
      {/* Tooltip */}
      <div
        className={`transition-all duration-500 ${
          tooltipVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
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

      {/* Bubble */}
      <a
        href={ZANDI_WHATSAPP}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Zandi on WhatsApp"
        className={`relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full ring-2 ring-white shadow-[0_8px_28px_-4px_rgba(11,21,50,0.4)] transition-all duration-500 hover:scale-110 hover:shadow-[0_12px_32px_-4px_rgba(213,151,88,0.6)] ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
      >
        <Image
          src="/zandi.jpg"
          alt="Zandi Auto Access Assistant"
          width={80}
          height={80}
          className="h-full w-full object-cover"
          priority
        />
        {/* Online indicator */}
        <span className="absolute bottom-0.5 right-0.5 flex h-2.5 w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e] opacity-75"></span>
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#22c55e] ring-2 ring-white"></span>
        </span>
      </a>
    </div>
  );
}
