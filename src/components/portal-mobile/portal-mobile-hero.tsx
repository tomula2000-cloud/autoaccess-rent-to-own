import type { ReactNode } from "react";
import type { PortalMobileStageTheme } from "./portal-mobile-theme";

type PortalMobileHeroProps = {
  theme: PortalMobileStageTheme;
  eyebrow: string;
  title: string;
  description: string;
  statusLabel?: string;
  referenceNumber?: string;
  countdownText?: string | null;
  selectionText?: string | null;
  children?: ReactNode;
};

function IconClock() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export default function PortalMobileHero({
  theme,
  eyebrow,
  title,
  description,
  statusLabel,
  referenceNumber,
  countdownText,
  selectionText,
  children,
}: PortalMobileHeroProps) {
  const isUrgent = theme.urgentTimer === true;

  return (
    <section
      className={`relative mt-4 overflow-hidden rounded-[26px] px-4 pb-4 pt-5 ${theme.heroClassName}`}
    >
      <div className={`absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl ${theme.glowLeftClassName}`} />
      <div className={`absolute -bottom-10 right-0 h-32 w-32 rounded-full blur-3xl ${theme.glowRightClassName}`} />

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className={`inline-flex h-2 w-2 rounded-full ${isUrgent ? "animate-ping bg-red-300" : "animate-pulse bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.4)]"}`} />
          <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] ${theme.eyebrowTextClassName}`}>
            {eyebrow}
          </p>
        </div>

        <h1 className="mt-4 text-[1.6rem] font-semibold leading-[1.05] tracking-tight text-white">
          {title}
        </h1>

        <p className="mt-3 text-[13px] leading-6 text-white/80">
          {description}
        </p>

        {(statusLabel || referenceNumber) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {statusLabel ? (
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] ${theme.statusBadgeClassName}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isUrgent ? "animate-ping bg-red-300" : "bg-white/80"}`} />
                {statusLabel}
              </span>
            ) : null}

            {referenceNumber ? (
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium ${theme.refBadgeClassName}`}>
                Ref <span className="font-mono">{referenceNumber}</span>
              </span>
            ) : null}
          </div>
        )}

        {countdownText ? (
          <div className={`mt-3 inline-flex w-full items-center gap-2 rounded-[16px] px-3.5 py-3 backdrop-blur ${theme.timerBarClassName} ${isUrgent ? "animate-pulse" : ""}`}>
            <IconClock />
            <span className="font-semibold text-white">
              {isUrgent ? "⚠ Contract Window:" : "Timer:"}
            </span>
            <span className={`font-mono text-[13px] font-bold ${isUrgent ? "text-red-200" : ""}`}>
              {countdownText}
            </span>
          </div>
        ) : null}

        {selectionText ? (
          <div className={`mt-3 rounded-[16px] px-3.5 py-3 backdrop-blur ${theme.selectionCardClassName}`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/70">
              Current Selection
            </p>
            <p className="mt-1.5 text-[14px] font-semibold text-white">
              {selectionText}
            </p>
          </div>
        ) : null}

        {children ? <div className="mt-3">{children}</div> : null}
      </div>
    </section>
  );
}
