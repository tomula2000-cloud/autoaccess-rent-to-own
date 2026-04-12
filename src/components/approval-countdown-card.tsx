"use client";

import { useEffect, useMemo, useState } from "react";

type CountdownMode = "approval" | "contract";

type ApprovalCountdownCardProps = {
  approvalValidUntil: string;
  mode?: CountdownMode;
};

type TimeLeft = {
  expired: boolean;
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function formatTimeLeft(target: Date): TimeLeft {
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return {
      expired: true,
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    expired: false,
    totalMs: diff,
    days,
    hours,
    minutes,
    seconds,
  };
}

function padNumber(value: number) {
  return String(value).padStart(2, "0");
}

export default function ApprovalCountdownCard({
  approvalValidUntil,
  mode = "approval",
}: ApprovalCountdownCardProps) {
  const target = useMemo(() => new Date(approvalValidUntil), [approvalValidUntil]);

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    expired: false,
    totalMs: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);

    const updateCountdown = () => {
      setTimeLeft(formatTimeLeft(target));
    };

    updateCountdown();

    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const isContractMode = mode === "contract";
  const isExpired = mounted ? timeLeft.expired : false;

  const final24Hours = mounted && !isExpired && timeLeft.totalMs <= 24 * 60 * 60 * 1000;

  const orangeWindow =
    mounted &&
    !isExpired &&
    !final24Hours &&
    !isContractMode &&
    timeLeft.totalMs <= 4 * 24 * 60 * 60 * 1000;

  const shellClass = isExpired
    ? "border-red-200 bg-gradient-to-br from-red-50 via-white to-red-100"
    : isContractMode
    ? final24Hours
      ? "border-red-200 bg-gradient-to-br from-red-50 via-white to-red-100"
      : "border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-100"
    : final24Hours
    ? "border-red-200 bg-gradient-to-br from-red-50 via-white to-red-100"
    : orangeWindow
    ? "border-orange-200 bg-gradient-to-br from-orange-50 via-white to-amber-100"
    : "border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-100";

  const headingClass = isExpired
    ? "text-red-900"
    : isContractMode
    ? final24Hours
      ? "text-red-900"
      : "text-orange-900"
    : final24Hours
    ? "text-red-900"
    : orangeWindow
    ? "text-orange-900"
    : "text-emerald-900";

  const badgeClass = isExpired
    ? "bg-red-100 text-red-700 border-red-200"
    : isContractMode
    ? final24Hours
      ? "bg-red-100 text-red-700 border-red-200"
      : "bg-orange-100 text-orange-700 border-orange-200"
    : final24Hours
    ? "bg-red-100 text-red-700 border-red-200"
    : orangeWindow
    ? "bg-orange-100 text-orange-700 border-orange-200"
    : "bg-emerald-100 text-emerald-700 border-emerald-200";

  const accentClass = isExpired
    ? "text-red-700"
    : isContractMode
    ? final24Hours
      ? "text-red-700"
      : "text-orange-700"
    : final24Hours
    ? "text-red-700"
    : orangeWindow
    ? "text-orange-700"
    : "text-emerald-700";

  const numberClass = isExpired
    ? "text-red-900"
    : isContractMode
    ? final24Hours
      ? "text-red-900"
      : "text-orange-900"
    : final24Hours
    ? "text-red-900"
    : orangeWindow
    ? "text-orange-900"
    : "text-emerald-900";

  const heading = isContractMode
    ? isExpired
      ? "Contract Period Closed"
      : final24Hours
      ? "Contract Completion Window Active"
      : "Contract Completion Period Active"
    : isExpired
    ? "Approval Period Closed"
    : final24Hours
    ? "Approval Period Closing"
    : orangeWindow
    ? "Approval Action Required"
    : "Approval in Principle Confirmed";

  const message = isContractMode
    ? isExpired
      ? "The contract completion period has expired. The client did not complete the required process within the active contract window."
      : final24Hours
      ? "Your contract has been issued and the 24-hour completion window is now active. Immediate action is required to complete payment and the remaining process before the contract expires."
      : "Your contract has been issued and the completion period is now active. Please complete the required payment and remaining process steps before the contract expiry time."
    : isExpired
    ? "The approval validity period for this application has expired. In accordance with application policy, a new application may only be submitted after 6 months from the expiry date."
    : final24Hours
    ? "Your approval remains active, but it is now within the final 24 hours of its validity period. Immediate action is required to prevent expiry."
    : orangeWindow
    ? "Your approval remains valid, however the remaining time is limited. To avoid expiry, please complete all outstanding requirements without delay."
    : "Your application has been approved in principle and remains within its active validity period. Please complete the remaining requirements before the approval period expires.";

  const blocks = [
    {
      label: "Days",
      value: mounted ? padNumber(timeLeft.days) : "--",
    },
    {
      label: "Hours",
      value: mounted ? padNumber(timeLeft.hours) : "--",
    },
    {
      label: "Minutes",
      value: mounted ? padNumber(timeLeft.minutes) : "--",
    },
    {
      label: "Seconds",
      value: mounted ? padNumber(timeLeft.seconds) : "--",
    },
  ];

  const safeExpiryDate = mounted ? target.toLocaleString() : "Loading...";

  const periodLabel = isContractMode ? "Contract Completion Window" : "Approval Validity Period";
  const validUntilLabel = isContractMode ? "Contract expires at" : "Approval valid until";

  const requiredFocusText = isContractMode
    ? "Complete the required payment, contract obligations, and any final internal verification steps before the active contract period ends."
    : "Complete all required documentation, payment obligations, and internal verification steps before the remaining approval validity period ends.";

  const policyNoticeText = isContractMode
    ? "Once a contract has been issued, the prior approval period no longer governs this stage. The issued contract is subject to strict completion within the active contract window."
    : "Approval in principle is valid for 12 days only and remains subject to completion of all required documentation, payment obligations, and internal verification within the active validity period.";

  return (
    <section
      className={`mb-6 overflow-hidden rounded-[26px] border p-5 shadow-[0_16px_45px_rgba(15,23,42,0.08)] sm:rounded-[30px] sm:p-6 ${shellClass}`}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <span
            className={`inline-flex rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] sm:text-xs sm:tracking-[0.24em] ${badgeClass}`}
          >
            {periodLabel}
          </span>

          <h2
            className={`mt-4 text-2xl font-bold tracking-tight sm:text-3xl ${headingClass}`}
          >
            {heading}
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-700 md:text-base">
            {message}
          </p>
        </div>

        <div className="rounded-[22px] border border-white/80 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-sm sm:rounded-[24px] sm:px-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
            {validUntilLabel}
          </p>
          <p className="mt-2 break-words text-sm font-semibold text-gray-900 sm:text-base">
            {safeExpiryDate}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {blocks.map((block) => (
          <div
            key={block.label}
            className="rounded-[20px] border border-white/80 bg-white/90 p-4 text-center shadow-sm sm:rounded-[24px] sm:p-5"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gray-500 sm:text-[11px] sm:tracking-[0.24em]">
              {block.label}
            </p>
            <p
              className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${numberClass}`}
            >
              {block.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[20px] border border-white/80 bg-white/90 p-4 shadow-sm sm:rounded-[24px] sm:p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
            Required focus
          </p>
          <p className={`mt-3 text-sm leading-7 ${accentClass}`}>
            {requiredFocusText}
          </p>
        </div>

        <div className="rounded-[20px] border border-white/80 bg-white/90 p-4 shadow-sm sm:rounded-[24px] sm:p-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gray-500">
            Policy Notice
          </p>
          <p className="mt-3 text-sm leading-7 text-gray-700">
            {policyNoticeText}
          </p>
        </div>
      </div>
    </section>
  );
}