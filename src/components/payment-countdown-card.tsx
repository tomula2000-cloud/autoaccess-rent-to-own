"use client";

import { useEffect, useMemo, useState } from "react";

interface PaymentCountdownCardProps {
  contractAcceptedAt: string;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { expired: true, hours: 0, minutes: 0, seconds: 0, totalMs: 0, pct: 0 };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const pct = Math.max(0, Math.min(100, (diff / (24 * 60 * 60 * 1000)) * 100));
  return { expired: false, hours, minutes, seconds, totalMs: diff, pct };
}

function pad(n: number) { return String(n).padStart(2, "0"); }

export default function PaymentCountdownCard({ contractAcceptedAt }: PaymentCountdownCardProps) {
  const deadline = useMemo(() => {
    const d = new Date(contractAcceptedAt);
    d.setHours(d.getHours() + 24);
    return d;
  }, [contractAcceptedAt]);

  const [mounted, setMounted] = useState(false);
  const [t, setT] = useState(() => getTimeLeft(deadline));

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => setT(getTimeLeft(deadline)), 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!mounted) return null;

  const isUrgent = t.totalMs < 60 * 60 * 1000;
  const isWarning = !isUrgent && t.totalMs < 6 * 60 * 60 * 1000;
  const isExpired = t.expired;

  const color = isExpired || isUrgent ? "#e24b4a" : isWarning ? "#d97706" : "#d59758";
  const bgFrom = isExpired || isUrgent ? "#fef2f2" : isWarning ? "#fffbeb" : "#fffaf5";
  const borderColor = isExpired || isUrgent ? "#fecaca" : isWarning ? "#fde68a" : "#f1dfd1";
  const textColor = isExpired || isUrgent ? "#991b1b" : isWarning ? "#92400e" : "#92400e";

  return (
    <div className="overflow-hidden rounded-[20px] border shadow-[0_4px_16px_-6px_rgba(15,23,42,0.1)]"
      style={{borderColor, background:`linear-gradient(135deg, ${bgFrom}, white)`}}>
      {/* Header */}
      <div className="px-5 py-3.5 flex items-center justify-between gap-3" style={{borderBottom:`1px solid ${borderColor}`}}>
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{background:color+"20"}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{color}}>{isExpired ? "Payment Window Expired" : "Payment Window Active"}</p>
            <p className="text-[13px] font-semibold" style={{color:textColor}}>
              {isExpired ? "Your contract has been automatically cancelled" : isUrgent ? "Less than 1 hour remaining — act now" : isWarning ? "Under 6 hours remaining" : "Complete your payment within 24 hours"}
            </p>
          </div>
        </div>
        {!isExpired && (
          <div className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{background:color+"18", color}}>
            {isUrgent ? "URGENT" : isWarning ? "WARNING" : "ACTIVE"}
          </div>
        )}
      </div>

      {/* Timer */}
      <div className="px-5 py-4">
        {isExpired ? (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100">
              <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900">Payment window has closed.</p>
              <p className="mt-0.5 text-[12px] leading-5 text-red-700">Your contract has been automatically cancelled. Please contact Caleb to discuss your options.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-3">
              {[
                {val: pad(t.hours), label: "Hours"},
                {val: pad(t.minutes), label: "Minutes"},
                {val: pad(t.seconds), label: "Seconds"},
              ].map(({val, label}, i) => (
                <div key={label} className="flex items-end gap-3">
                  {i > 0 && <span className="mb-2 text-2xl font-bold" style={{color:color+"80"}}>:</span>}
                  <div className="text-center">
                    <div className="rounded-[10px] px-3 py-2 min-w-[52px]" style={{background:color+"12"}}>
                      <p className="text-[1.8rem] font-bold tabular-nums leading-none" style={{color}}>{val}</p>
                    </div>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em]" style={{color:color+"99"}}>{label}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Progress bar */}
            <div className="mt-4 h-1.5 w-full rounded-full overflow-hidden" style={{background:borderColor}}>
              <div className="h-full rounded-full transition-all duration-1000" style={{width:`${t.pct}%`, background:color}} />
            </div>
            <p className="mt-3 text-[12px] leading-5" style={{color:textColor}}>
              Your invoice will be released by our team. Once received, complete your deposit payment <strong>before this timer expires</strong> to secure your vehicle.
            </p>
            <div className="mt-3 flex gap-2">
              <a href="https://wa.me/27745462367?text=Hi%20Caleb%2C%20I%20have%20signed%20my%20contract%20and%20am%20ready%20to%20make%20payment.%20Please%20send%20my%20invoice." target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold text-white transition" style={{background:"#25d366"}}>
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.878-1.42A9.945 9.945 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>
                Message Caleb
              </a>
              <a href="tel:0212110015" className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[11px] font-bold transition" style={{borderColor:color+"44", color, background:color+"10"}}>
                📞 021 211 0015
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
