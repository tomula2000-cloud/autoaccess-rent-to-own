"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────

type Props = {
  status: string;
  fullName: string;
  referenceNumber: string;
  approvalValidUntil?: Date | string | null;
  documentsCount: number;
  createdAt: Date | string;
  isMobile?: boolean;
};

// ── Status config ─────────────────────────────────────────────────────────────

type StatusConfig = {
  badge: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaStyle: "primary" | "orange" | "green" | "red";
  journeyStage: number; // 0-5
};

function getStatusConfig(status: string, daysRemaining: number | null): StatusConfig {
  switch (status) {
    case "APPLICATION_RECEIVED":
      return {
        badge: "Application Received",
        headline: "Your application has been received.",
        description: "We've received your application and it's in the queue for initial review. You'll hear from us soon — usually within 24 hours.",
        ctaLabel: "Continue to submit documents →",
        ctaHref: "/portal/documents",
        ctaStyle: "orange",
        journeyStage: 0,
      };
    case "PRE_QUALIFICATION_REVIEW":
      return {
        badge: "Under Initial Review",
        headline: "Your application is being reviewed.",
        description: "Our team is going through your initial details. This usually takes 24–48 hours. We'll notify you as soon as there's an update.",
        ctaLabel: "Continue to submit documents →",
        ctaHref: "/portal/documents",
        ctaStyle: "orange",
        journeyStage: 0,
      };
    case "PRE_QUALIFIED":
      return {
        badge: "Pre-Qualified",
        headline: "You've pre-qualified — great news!",
        description: "You've passed our initial assessment. The next step is to upload your supporting documents so we can complete the review.",
        ctaLabel: "Continue to submit documents →",
        ctaHref: "/portal/documents",
        ctaStyle: "orange",
        journeyStage: 1,
      };
    case "AWAITING_DOCUMENTS":
      return {
        badge: "Documents Needed",
        headline: "We're waiting for your documents.",
        description: "Please upload your supporting documents to keep your application moving forward. Every day counts.",
        ctaLabel: "Continue to submit documents →",
        ctaHref: "/portal/documents",
        ctaStyle: "orange",
        journeyStage: 1,
      };
    case "DOCUMENTS_SUBMITTED":
      return {
        badge: "Documents Received",
        headline: "Documents received — thank you.",
        description: "We've received all your documents and they're queued for review. Our team will assess your submission within 24–48 hours.",
        ctaLabel: "Track my application",
        ctaHref: "/portal",
        ctaStyle: "primary",
        journeyStage: 1,
      };
    case "DOCUMENTS_UNDER_REVIEW":
      return {
        badge: "Under Review",
        headline: "We're carefully reviewing your documents.",
        description: "Our team is assessing your submission. You'll receive an update within 24–48 hours. There's nothing more you need to do right now.",
        ctaLabel: "Track my application",
        ctaHref: "/portal",
        ctaStyle: "primary",
        journeyStage: 1,
      };
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return {
        badge: "Action Required",
        headline: "A few more documents are needed.",
        description: "Our team has reviewed your submission and identified some outstanding documents. Please upload them as soon as possible to continue.",
        ctaLabel: "Continue to submit documents →",
        ctaHref: "/portal/documents",
        ctaStyle: "orange",
        journeyStage: 1,
      };
    case "APPROVED_IN_PRINCIPLE":
      return {
        badge: "Approved in Principle",
        headline: daysRemaining !== null
          ? `You're approved — ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining.`
          : "You're approved in principle!",
        description: "Congratulations! You've met our assessment criteria. Select your preferred vehicle now — your approval window is active and will expire soon.",
        ctaLabel: "Select my vehicle →",
        ctaHref: "/portal/select-vehicle",
        ctaStyle: "green",
        journeyStage: 2,
      };
    case "CONTRACT_REQUESTED":
      return {
        badge: "Contract Being Prepared",
        headline: "Your contract is being prepared.",
        description: "Your contract request has been received and our team is preparing the documentation. We'll notify you as soon as it's ready to review.",
        ctaLabel: "Track my application",
        ctaHref: "/portal",
        ctaStyle: "primary",
        journeyStage: 3,
      };
    case "CONTRACT_ISSUED":
      return {
        badge: "Contract Ready",
        headline: "Your contract is ready to review.",
        description: "Your rent-to-own contract has been issued. Please review it carefully and sign it in your portal to proceed to the payment stage.",
        ctaLabel: "Review & sign contract →",
        ctaHref: "/portal",
        ctaStyle: "orange",
        journeyStage: 3,
      };
    case "AWAITING_INVOICE":
      return {
        badge: "Contract Signed",
        headline: "Contract signed — invoice coming.",
        description: "Thank you for signing your contract. Our team is now preparing your invoice. You'll be notified as soon as it's ready.",
        ctaLabel: "Track my application",
        ctaHref: "/portal",
        ctaStyle: "primary",
        journeyStage: 3,
      };
    case "INVOICE_ISSUED":
      return {
        badge: "Invoice Ready",
        headline: "Your invoice is ready.",
        description: "Your invoice has been issued. Please make payment before the due date to secure your vehicle and move to the final stage.",
        ctaLabel: "View invoice & pay →",
        ctaHref: "/portal",
        ctaStyle: "orange",
        journeyStage: 4,
      };
    case "AWAITING_PAYMENT":
      return {
        badge: "Payment Due",
        headline: "We're awaiting your payment.",
        description: "Your invoice is due. Complete your payment to keep your application active and move to the final delivery stage.",
        ctaLabel: "Complete payment →",
        ctaHref: "/portal",
        ctaStyle: "orange",
        journeyStage: 4,
      };
    case "PAYMENT_UNDER_VERIFICATION":
      return {
        badge: "Payment Verifying",
        headline: "Payment received — verifying now.",
        description: "We've received your payment and our team is verifying it. This usually takes up to 24 hours. You're nearly there.",
        ctaLabel: "Track my application",
        ctaHref: "/portal",
        ctaStyle: "primary",
        journeyStage: 4,
      };
    case "PAYMENT_CONFIRMED":
      return {
        badge: "Payment Confirmed",
        headline: "Payment confirmed — almost there!",
        description: "Your payment has been confirmed. We're now arranging your vehicle for delivery. Our team will be in touch with delivery details.",
        ctaLabel: "View my details",
        ctaHref: "/portal",
        ctaStyle: "green",
        journeyStage: 5,
      };
    case "COMPLETED":
      return {
        badge: "Complete",
        headline: "Welcome to Auto Access!",
        description: "Your application is complete and your vehicle has been assigned. Welcome to the Auto Access family — enjoy the ride.",
        ctaLabel: "View my details",
        ctaHref: "/portal",
        ctaStyle: "green",
        journeyStage: 5,
      };
    case "DECLINED":
      return {
        badge: "Application Update",
        headline: "An update on your application.",
        description: "Unfortunately your application was not successful at this time. Please contact our support team for more information and to discuss your options.",
        ctaLabel: "Contact support",
        ctaHref: "https://wa.me/27870126734",
        ctaStyle: "red",
        journeyStage: 0,
      };
    default:
      return {
        badge: "In Progress",
        headline: "Your application is in progress.",
        description: "Our team is working on your application. You'll receive an update as soon as there's progress to report.",
        ctaLabel: "Track my application",
        ctaHref: "/portal",
        ctaStyle: "primary",
        journeyStage: 0,
      };
  }
}

// ── Journey stages ────────────────────────────────────────────────────────────

const JOURNEY_STAGES = [
  { label: "Applied", sub: "Application received" },
  { label: "Documents", sub: "Upload & review" },
  { label: "Approval", sub: "Decision" },
  { label: "Vehicle", sub: "Select your vehicle" },
  { label: "Contract & Payment", sub: "Sign & pay" },
  { label: "Complete", sub: "Vehicle delivered" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const first = name.split(" ")[0];
  if (hour < 12) return `Good morning, ${first}.`;
  if (hour < 17) return `Good afternoon, ${first}.`;
  return `Good evening, ${first}.`;
}

function getDaysRemaining(until: Date | string | null | undefined): number | null {
  if (!until) return null;
  const diff = new Date(until).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(value: Date | string): string {
  return new Date(value).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── CTA button styles ─────────────────────────────────────────────────────────

const ctaStyles = {
  primary: "bg-[#0a1f4e] text-white hover:bg-[#1446cc]",
  orange: "bg-[#e8720c] text-white hover:bg-[#c55e08]",
  green: "bg-emerald-600 text-white hover:bg-emerald-700",
  red: "bg-red-600 text-white hover:bg-red-700",
};

// ── Stat tile ─────────────────────────────────────────────────────────────────

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex-1 rounded-[16px] border border-[#e8ecf5] bg-white px-4 py-3 shadow-sm">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#8b7e68]">{label}</p>
      <p className="mt-1 font-mono text-[17px] font-semibold tracking-tight text-[#0a1f4e]">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-[#8b7e68]">{sub}</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function PortalDashboardHero({
  status,
  fullName,
  referenceNumber,
  approvalValidUntil,
  documentsCount,
  createdAt,
  isMobile = false,
}: Props) {
  const [greeting, setGreeting] = useState("");
  const daysRemaining = getDaysRemaining(approvalValidUntil);
  const config = getStatusConfig(status, daysRemaining);

  useEffect(() => {
    setGreeting(getGreeting(fullName));
  }, [fullName]);

  // ── Stat tiles content ───────────────────────────────────────────────────

  function getStats(): { label: string; value: string; sub?: string }[] {
    const stage = config.journeyStage;
    if (stage <= 1) {
      return [
        { label: "Documents", value: `${documentsCount}`, sub: documentsCount === 0 ? "None uploaded" : "Uploaded" },
        { label: "Response", value: "24–48h", sub: "Expected" },
      ];
    }
    if (status === "APPROVED_IN_PRINCIPLE") {
      return [
        { label: "Approval", value: daysRemaining !== null ? `${daysRemaining}d` : "Active", sub: "Days remaining" },
        { label: "Documents", value: `${documentsCount}`, sub: "Submitted" },
      ];
    }
    if (stage === 3) {
      return [
        { label: "Contract", value: "Issued", sub: "Ready to review" },
        { label: "Stage", value: "4 of 6", sub: "Contract" },
      ];
    }
    if (stage === 4) {
      return [
        { label: "Payment", value: "Due", sub: "Invoice issued" },
        { label: "Stage", value: "5 of 6", sub: "Payment" },
      ];
    }
    if (stage === 5) {
      return [
        { label: "Status", value: "Done", sub: "Application complete" },
        { label: "Stage", value: "6 of 6", sub: "Complete" },
      ];
    }
    return [
      { label: "Applied", value: formatDate(createdAt), sub: "Start date" },
      { label: "Reference", value: referenceNumber, sub: "Your ref" },
    ];
  }

  const stats = getStats();

  return (
    <div className={isMobile ? "space-y-3" : "mb-8 space-y-4"}>
      {/* ── Top bar: mono ref + avatar ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-medium tracking-[0.14em] text-[#8b7e68] uppercase">Ref</span>
          <span className="font-mono text-[13px] font-semibold text-[#0a1f4e]">{referenceNumber}</span>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a1f4e] text-[13px] font-semibold text-white">
          {fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
        </div>
      </div>

      {/* ── Greeting ── */}
      {greeting && (
        <div>
          <p className="text-[12px] font-medium text-[#8b7e68]">Auto Access · Client Portal</p>
          <h1
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="mt-1 text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-[#0a1f4e]"
          >
            {greeting.split(",")[0]},<br />
            <em className="font-normal not-italic text-[#e8720c]">{greeting.split(",")[1]?.trim()}</em>
          </h1>
        </div>
      )}

      {/* ── Status card ── */}
      <div className="overflow-hidden rounded-[24px] border border-[#ece7de] bg-gradient-to-br from-[#fff8f0] to-[#fff5eb] shadow-[0_8px_24px_-12px_rgba(232,114,12,0.15)]">
        {/* Badge row */}
        <div className="flex items-center justify-between border-b border-[#ece7de] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e8720c] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e8720c]" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b55a05]">
              {config.badge}
            </span>
          </div>
          <span className="font-mono text-[10px] font-medium text-[#8b7e68] uppercase tracking-[0.1em]">
            {formatDate(createdAt)}
          </span>
        </div>

        {/* Content */}
        <div className="p-5">
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="text-[22px] font-medium leading-[1.2] tracking-[-0.01em] text-[#0a1f4e]"
          >
            {config.headline}
          </h2>
          <p className="mt-2 text-[13.5px] leading-[1.6] text-[#4a3f2e]">
            {config.description}
          </p>

          {/* CTA button */}
          <Link
            href={config.ctaHref}
            className={`mt-4 inline-flex w-full items-center justify-between rounded-full px-5 py-3.5 text-[13px] font-semibold transition-colors ${ctaStyles[config.ctaStyle]}`}
          >
            <span>{config.ctaLabel}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Stat tiles (Concept 1 compact) ── */}
      <div className="flex gap-2.5">
        {stats.map((s) => (
          <StatTile key={s.label} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </div>

      {/* ── Journey timeline (Concept 2 vertical dots) ── */}
      <div className="overflow-hidden rounded-[20px] border border-[#ece7de] bg-white">
        <div className="border-b border-[#ece7de] px-4 py-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8b7e68]">
              Your Journey
            </p>
            <p className="font-mono text-[10px] font-medium text-[#8b7e68]">
              Stage {config.journeyStage + 1} of {JOURNEY_STAGES.length}
            </p>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#f0ebe3]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#e8720c] to-[#f4a864] transition-all duration-700"
              style={{ width: `${Math.round(((config.journeyStage + 1) / JOURNEY_STAGES.length) * 100)}%` }}
            />
          </div>
        </div>

        <div className="relative px-4 py-3">
          {/* Vertical line */}
          <div className="absolute left-[27px] top-5 bottom-5 w-[2px] bg-[#f0ebe3]" />

          <div className="space-y-3">
            {JOURNEY_STAGES.map((stage, i) => {
              const done = i < config.journeyStage;
              const current = i === config.journeyStage;
              const upcoming = i > config.journeyStage;
              return (
                <div key={stage.label} className="relative flex items-start gap-3.5 pl-0">
                  {/* Dot */}
                  <div className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    done
                      ? "border-emerald-500 bg-emerald-500"
                      : current
                      ? "border-[#e8720c] bg-[#e8720c] shadow-[0_0_0_4px_rgba(232,114,12,0.15)]"
                      : "border-[#ddd7ce] bg-white"
                  }`}>
                    {done ? (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : current ? (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ddd7ce]" />
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1 pb-1 pt-0.5">
                    <p className={`text-[13px] font-semibold leading-none ${
                      done ? "text-[#8b7e68] line-through decoration-[#c5bfb4]/50" : current ? "text-[#0a1f4e]" : "text-[#b5a88f]"
                    }`}>
                      {stage.label}
                    </p>
                    {current && (
                      <p className="mt-1 text-[11px] text-[#e8720c] font-medium">{stage.sub} · In progress</p>
                    )}
                  </div>

                  {/* Status indicator */}
                  {done && (
                    <span className="shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                      Done
                    </span>
                  )}
                  {current && (
                    <span className="shrink-0 rounded-full bg-[#fff3e6] border border-[#f1dfd1] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#b55a05]">
                      Now
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
