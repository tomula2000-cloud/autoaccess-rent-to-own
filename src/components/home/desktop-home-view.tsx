"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
type SubmitState = "idle" | "processing" | "success";

// ─── Helpers — UNCHANGED ─────────────────────────────────────────────────────
function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

// ─── Design tokens — system-aligned ──────────────────────────────────────────
const inputCls =
  "w-full rounded-2xl border border-[#dde1ee] bg-white px-4 py-3 text-[14px] text-[#1b2345] outline-none transition placeholder:text-[#a3aac0] focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

const selectCls =
  "w-full appearance-none rounded-2xl border border-[#dde1ee] bg-white px-4 py-3 pr-10 text-[14px] font-medium text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer";

const labelCls =
  "mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]";

// ─── Section divider inside form ──────────────────────────────────────────────
function FormSection({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 pb-2 pt-6">
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c37d43]">
        {label}
      </span>
      <span className="flex-1 border-t border-[#eef0f7]" />
    </div>
  );
}

// ─── Scroll-reveal hook — UNCHANGED ──────────────────────────────────────────
function useReveal(className = "section-reveal") {
  useEffect(() => {
    const els = document.querySelectorAll(`.${className}`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [className]);
}

// ─── Animated counter — same logic, restyled output ──────────────────────────
function AnimatedStat({
  target,
  suffix,
  label,
}: {
  target: number;
  suffix: string;
  label: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1400;
          const steps = 50;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-[2.8rem] font-semibold leading-none tracking-[-0.02em] tabular-nums text-[#1b2345]">
        {count.toLocaleString()}
        <span className="text-[#d59758]">{suffix}</span>
      </div>
      <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#68708a]">
        {label}
      </div>
    </div>
  );
}

// ─── SVG icons ───────────────────────────────────────────────────────────────
const IconArrow = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconCheck = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconLock = () => (
  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IconShield = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconCar = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
    <circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" />
  </svg>
);
const IconDoc = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);
const IconPortal = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);
const IconKey = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);
const IconStar = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconUsers = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
//  LOADING FALLBACK
// ─────────────────────────────────────────────────────────────────────────────
function HomePageFallback() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-[#eef0f7] border-t-[#2f67de]" />
          <p className="mt-4 text-[13px] text-[#68708a]">Loading…</p>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  INNER COMPONENT (contains useSearchParams)
// ─────────────────────────────────────────────────────────────────────────────
function HomePageContent() {
  // ── Search params — UNCHANGED ──
  const searchParams = useSearchParams();
  const prefilledVehicle = useMemo(
    () => searchParams.get("vehicle") ?? "",
    [searchParams]
  );

  // ── Form state — UNCHANGED ──
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [identityType, setIdentityType] = useState("SA_ID");
  const [identityNumber, setIdentityNumber] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("EMPLOYED");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [salaryDate, setSalaryDate] = useState("");
  const [preferredVehicle, setPreferredVehicle] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [showSubmitNotice, setShowSubmitNotice] = useState(false);

  const overlayCardRef = useRef<HTMLDivElement | null>(null);
  const submitNoticeRef = useRef<HTMLDivElement | null>(null);

  // ── Effects — UNCHANGED ──
  useEffect(() => {
    if (prefilledVehicle) setPreferredVehicle(prefilledVehicle);
  }, [prefilledVehicle]);

  useEffect(() => {
    if (identityType === "SA_ID")
      setIdentityNumber((prev) => digitsOnly(prev).slice(0, 13));
  }, [identityType]);

  useEffect(() => {
    if (submitState === "processing" || submitState === "success") {
      overlayCardRef.current?.focus();
      overlayCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [submitState]);

  useEffect(() => {
    if (showSubmitNotice) {
      submitNoticeRef.current?.focus();
      submitNoticeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [showSubmitNotice]);

  // ── Scroll reveal ──
  useReveal("section-reveal");
  useReveal("step-reveal");

  // ── Form helpers — UNCHANGED ──
  function resetForm() {
    setFullName(""); setEmail(""); setPhone("");
    setIdentityType("SA_ID"); setIdentityNumber("");
    setEmploymentStatus("EMPLOYED"); setMonthlyIncome("");
    setSalaryDate(""); setPreferredVehicle(prefilledVehicle);
    setPhysicalAddress(""); setNotes(""); setTermsAccepted(false);
  }

  const normalizedPhone = digitsOnly(phone);
  const normalizedIdentityNumber =
    identityType === "SA_ID" ? digitsOnly(identityNumber) : identityNumber.trim();
  const isValidSouthAfricanPhone = /^0\d{9}$/.test(normalizedPhone);
  const isValidSouthAfricanId =
    identityType !== "SA_ID" || /^\d{13}$/.test(normalizedIdentityNumber);

  // ── Submit — UNCHANGED ──
  async function submitApplication() {
    setLoading(true); setMessage(""); setSubmitState("processing");
    setReferenceNumber(""); setShowSubmitNotice(false);
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName, email, phone: normalizedPhone, identityType,
          identityNumber: normalizedIdentityNumber, employmentStatus,
          monthlyIncome, salaryDate, preferredVehicle, physicalAddress,
          notes, termsAccepted,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSubmitState("idle");
        setMessage(data.message || "Something went wrong while submitting your application.");
        setLoading(false); return;
      }
      await new Promise((resolve) => setTimeout(resolve, 2200));
      setReferenceNumber(data.referenceNumber || "");
      setSubmitState("success"); setLoading(false); resetForm();
    } catch (error) {
      console.error(error);
      setSubmitState("idle");
      setMessage("Something went wrong while submitting your application.");
      setLoading(false);
    }
  }

  // ── Validation — UNCHANGED ──
  function handleInitialSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setMessage("");
    if (!termsAccepted) {
      setMessage("Please confirm that the information provided is true and correct before continuing.");
      return;
    }
    if (!isValidSouthAfricanPhone) {
      setMessage("Phone number must be a valid 10 digit South African number, for example 0711231212.");
      return;
    }
    if (!isValidSouthAfricanId) {
      setMessage("South African ID number must be exactly 13 digits.");
      return;
    }
    setShowSubmitNotice(true);
  }

  // ── UNCHANGED ──
  function handleWaitInstead() {
    setShowSubmitNotice(false);
    window.location.href = "/";
  }

  const formLocked = loading || submitState === "success" || submitState === "processing";

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      {/* ============== AMBIENT BACKGROUND ============== */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,222,0.08),transparent_55%),radial-gradient(circle_at_top_right,rgba(213,151,88,0.06),transparent_50%)]" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(15,23,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="px-4 py-6 sm:px-6 md:py-10">
        <div className="mx-auto max-w-7xl">

          {/* ════════════════════════════════════════════════════
              § 1  PREMIUM HERO + APPLICATION FORM
          ════════════════════════════════════════════════════ */}
          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            {/* ── Left: brand panel ── */}
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] p-8 shadow-[0_30px_80px_-20px_rgba(11,21,50,0.55)] md:p-10 lg:p-12">
              {/* Atmosphere */}
              <div className="absolute inset-0">
                <div className="absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-[#2f67de]/25 blur-3xl" />
                <div className="absolute -right-16 top-10 h-[340px] w-[340px] rounded-full bg-[#d59758]/15 blur-3xl" />
                <div className="absolute -bottom-20 left-10 h-[280px] w-[280px] rounded-full bg-[#2f67de]/15 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.08]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                    backgroundSize: "32px 32px",
                  }}
                />
              </div>

              <div className="relative flex h-full flex-col justify-between gap-8">
                <div>
                  {/* Brand stamp */}
                  <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_10px_24px_-8px_rgba(27,35,69,0.6)]">
                      <IconCar />
                    </div>
                    <p className="text-[18px] font-semibold text-white">
                      Auto<span className="text-[#f4c89a]">Access</span>
                    </p>
                  </div>

                  {/* Eyebrow with pulse dot */}
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-200/90">
                      Auto Access · Rent-To-Own
                    </p>
                  </div>

                  {/* Headline */}
                  <h1 className="mt-6 max-w-[560px] text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-[2.85rem] lg:text-[3.1rem]">
                    Vehicle access for every South African,
                    <br />
                    <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                      regardless of credit.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-[480px] text-[15px] leading-7 text-blue-50/75">
                    Blacklisted, under debt review, or a low credit score? Auto Access offers structured rent-to-own vehicle solutions designed around your real financial situation — not just your credit history.
                  </p>

                  {/* CTAs — FIX: restored missing opening <a> tags */}
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a
                      href="#application-form"
                      className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.6)] transition hover:from-[#c4863f] hover:to-[#d59758] hover:shadow-[0_16px_36px_-10px_rgba(213,151,88,0.75)]"
                    >
                      Apply Now
                      <span className="transition group-hover:translate-x-0.5"><IconArrow /></span>
                    </a>
                    <a
                      href="#process-flow"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
                    >
                      How It Works
                    </a>
                  </div>

                  {/* Hero status chips */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4c89a] backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                      NCR Registered
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-blue-50/80 backdrop-blur">
                      <IconLock />
                      <span className="font-mono text-white">256-bit SSL</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-blue-50/80 backdrop-blur">
                      48hr Response
                    </span>
                  </div>
                </div>

                {/* Live Status panel + circular emblem */}
                <div className="relative mt-2 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
                  <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200/70">
                      Live Status
                    </p>
                    <p className="mt-2 text-[15px] font-semibold leading-snug text-white">
                      Applications open · Consultants reviewing this week
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      <p className="text-[12px] text-blue-50/70">
                        <span className="font-mono text-white tabular-nums">94%</span> approval rate this month
                      </p>
                    </div>
                  </div>

                  <div className="relative justify-self-end">
                    <div className="absolute inset-0 rounded-full bg-[#2f67de]/30 blur-2xl" />
                    <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl">
                      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" stroke="rgba(255,255,255,0.08)" strokeWidth="6" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="44"
                          stroke="url(#homeHeroGrad)"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(94 / 100) * 276} 276`}
                        />
                        <defs>
                          <linearGradient id="homeHeroGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#7ea8ff" />
                            <stop offset="100%" stopColor="#f4c89a" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="text-center">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-200/70">Approved</p>
                        <p className="mt-0.5 text-2xl font-semibold tabular-nums text-white">94%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right: application form ── */}
            <section
              id="application-form"
              className="relative overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2"
            >
              <div className="relative flex h-full flex-col rounded-[26px] bg-white">
                <div
                  className={`flex flex-1 flex-col transition-all duration-300 ${
                    submitState === "processing" || submitState === "success" || showSubmitNotice
                      ? "pointer-events-none opacity-35 blur-[1px]"
                      : "opacity-100"
                  }`}
                >
                  {/* Form header — dark navy bar */}
                  <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-5 sm:px-7">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                        <svg className="h-5 w-5 text-[#f4c89a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="9" y1="14" x2="15" y2="14" />
                          <line x1="9" y1="18" x2="15" y2="18" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                          Application Form
                        </p>
                        <h2 className="text-[1.15rem] font-semibold text-white sm:text-[1.25rem]">
                          Start your rent-to-own application
                        </h2>
                      </div>
                    </div>
                    <p className="mt-3 text-[13px] leading-[1.6] text-blue-50/70">
                      Complete your details below. One of our consultants will contact you within 48 hours.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleInitialSubmit} className="flex-1 overflow-y-auto px-6 pb-6 pt-2 sm:px-7">

                    <FormSection label="Personal Information" />
                    <div className="mt-3 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className={labelCls}>Full Name</label>
                        <input type="text" value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={inputCls} placeholder="Enter full name"
                          required disabled={formLocked} />
                      </div>
                      <div>
                        <label className={labelCls}>Email Address</label>
                        <input type="email" value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputCls} placeholder="Enter email address"
                          required disabled={formLocked} />
                      </div>
                      <div>
                        <label className={labelCls}>Phone Number</label>
                        <input type="text" value={phone}
                          onChange={(e) => setPhone(digitsOnly(e.target.value).slice(0, 10))}
                          inputMode="numeric" maxLength={10}
                          className={inputCls} placeholder="0711231212"
                          required disabled={formLocked} />
                        <p className="mt-1.5 text-[11px] text-[#68708a]">10 digit SA number, no spaces.</p>
                      </div>
                      <div>
                        <label className={labelCls}>Identity Type</label>
                        <div className="relative">
                          <select value={identityType}
                            onChange={(e) => setIdentityType(e.target.value)}
                            className={selectCls} disabled={formLocked}>
                            <option value="SA_ID">South African ID</option>
                            <option value="PASSPORT">Passport</option>
                          </select>
                          <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#68708a]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelCls}>ID / Passport Number</label>
                        <input type="text" value={identityNumber}
                          onChange={(e) =>
                            setIdentityNumber(
                              identityType === "SA_ID"
                                ? digitsOnly(e.target.value).slice(0, 13)
                                : e.target.value
                            )
                          }
                          inputMode={identityType === "SA_ID" ? "numeric" : "text"}
                          maxLength={identityType === "SA_ID" ? 13 : 30}
                          className={inputCls}
                          placeholder={
                            identityType === "SA_ID"
                              ? "Enter 13 digit South African ID number"
                              : "Enter passport number"
                          }
                          required disabled={formLocked} />
                        {identityType === "SA_ID" && (
                          <p className="mt-1.5 text-[11px] text-[#68708a]">Must be exactly 13 digits.</p>
                        )}
                      </div>
                    </div>

                    <FormSection label="Employment & Income" />
                    <div className="mt-3 grid gap-4 md:grid-cols-3">
                      <div>
                        <label className={labelCls}>Employment Status</label>
                        <div className="relative">
                          <select value={employmentStatus}
                            onChange={(e) => setEmploymentStatus(e.target.value)}
                            className={selectCls} disabled={formLocked}>
                            <option value="EMPLOYED">Employed</option>
                            <option value="SELF_EMPLOYED">Self Employed</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="BUSINESS_OWNER">Business Owner</option>
                            <option value="OTHER">Other</option>
                          </select>
                          <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#68708a]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <label className={labelCls}>Monthly Income</label>
                        <input type="text" value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(e.target.value)}
                          className={inputCls} placeholder="Enter monthly income"
                          required disabled={formLocked} />
                      </div>
                      <div>
                        <label className={labelCls}>Salary Date</label>
                        <input type="text" value={salaryDate}
                          onChange={(e) => setSalaryDate(e.target.value)}
                          className={inputCls} placeholder="25th / month-end"
                          disabled={formLocked} />
                      </div>
                    </div>

                    <FormSection label="Vehicle & Address" />
                    <div className="mt-3 grid gap-4">
                      <div>
                        <label className={labelCls}>Preferred Vehicle</label>
                        <input type="text" value={preferredVehicle}
                          onChange={(e) => setPreferredVehicle(e.target.value)}
                          className={inputCls} placeholder="Enter preferred vehicle"
                          required disabled={formLocked} />
                      </div>
                      <div>
                        <label className={labelCls}>Physical Address</label>
                        <textarea value={physicalAddress}
                          onChange={(e) => setPhysicalAddress(e.target.value)}
                          rows={2} className={inputCls}
                          placeholder="Enter physical address"
                          disabled={formLocked} />
                      </div>
                      <div>
                        <label className={labelCls}>Additional Notes</label>
                        <textarea value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={2} className={inputCls}
                          placeholder="Add any relevant notes"
                          disabled={formLocked} />
                      </div>
                    </div>

                    {/* Consent */}
                    <div className="mt-5">
                      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#dde1ee] bg-[#fafbff] px-4 py-4 transition hover:border-[#2f67de]/30 hover:bg-[#f4f7ff]">
                        <input type="checkbox" checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          className="mt-0.5 h-4 w-4 accent-[#2f67de]"
                          required disabled={formLocked} />
                        <span className="text-[12.5px] leading-[1.6] text-[#39425d]">
                          I confirm that the information provided is true and correct,
                          and I agree to the application review process.
                        </span>
                      </label>
                    </div>

                    {/* Error message */}
                    {message && submitState === "idle" ? (
                      <div className="mt-4 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-rose-50 px-4 py-3 text-[13px] font-semibold text-red-800">
                        {message}
                      </div>
                    ) : null}

                    {/* Submit */}
                    <div className="mt-6 flex flex-wrap items-center gap-4">
                      <button
                        type="submit"
                        disabled={formLocked}
                        className={`group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition ${
                          formLocked
                            ? "cursor-not-allowed bg-gradient-to-r from-[#a3b3d6] to-[#b8c6e2]"
                            : "bg-gradient-to-r from-[#2f67de] to-[#3f78ea] shadow-[0_14px_30px_-10px_rgba(47,103,222,0.5)] hover:from-[#2559c6] hover:to-[#3568d6] hover:shadow-[0_16px_36px_-10px_rgba(47,103,222,0.65)]"
                        }`}
                      >
                        {loading ? "Submitting…" : "Submit Application"}
                        <span className="transition group-hover:translate-x-0.5"><IconArrow /></span>
                      </button>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#68708a]">
                        <IconLock />
                        SSL Secured
                      </div>
                    </div>
                  </form>
                </div>

                {/* ══ OVERLAY: Submit Notice — UNCHANGED logic ══ */}
                {showSubmitNotice ? (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-5">
                    <div ref={submitNoticeRef} tabIndex={-1}
                      className="w-full max-w-xl overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)] outline-none">
                      <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                            <svg className="h-4 w-4 text-[#f4c89a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 16v-4M12 8h.01" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                              Important Applicant Notice
                            </p>
                            <h3 className="text-[1.1rem] font-semibold text-white">
                              Please confirm before proceeding
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="space-y-3.5 rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white px-5 py-4">
                          <p className="text-[13px] leading-[1.7] text-[#39425d]">
                            Auto Access may consider applications from clients with adverse credit history, blacklisting, debt review, or previous financial difficulties. However, all applications remain subject to affordability assessment, supporting documentation, internal review, payment readiness, and company requirements.
                          </p>
                          <p className="text-[13px] leading-[1.7] text-[#39425d]">
                            Do not proceed unless you are financially prepared to continue when required.
                          </p>
                          <p className="text-[13px] leading-[1.7] text-[#39425d]">
                            If approved in principle, the approval remains valid for{" "}
                            <span className="font-semibold text-[#1b2345]">12 days only</span>. If the required obligations are not completed within that period, the approval may expire, and a new application may only be submitted after{" "}
                            <span className="font-semibold text-[#1b2345]">6 months</span>.
                          </p>
                        </div>
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                          <button type="button" onClick={submitApplication}
                            className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(16,185,129,0.55)] transition hover:from-emerald-700 hover:to-emerald-800">
                            <IconCheck />
                            I Understand and Wish to Proceed
                          </button>
                          <button type="button" onClick={handleWaitInstead}
                            className="inline-flex items-center justify-center rounded-full border border-[#dde1ee] bg-white px-6 py-3 text-sm font-semibold text-[#68708a] transition hover:border-[#1b2345] hover:text-[#1b2345]">
                            I Prefer to Wait and Apply Later
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* ══ OVERLAY: Processing — UNCHANGED logic ══ */}
                {submitState === "processing" ? (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-5">
                    <div ref={overlayCardRef} tabIndex={-1}
                      className="w-full max-w-sm overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white text-center shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)] outline-none">
                      <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                          Auto Access · Rent To Own
                        </p>
                      </div>
                      <div className="p-8">
                        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-[#eef0f7] border-t-[#2f67de]" />
                        <h3 className="mt-6 text-[1.4rem] font-semibold tracking-tight text-[#1b2345]">
                          Processing your application
                        </h3>
                        <p className="mt-2 text-[13px] leading-[1.7] text-[#68708a]">
                          Please wait while we process your submission.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* ══ OVERLAY: Success — UNCHANGED logic ══ */}
                {submitState === "success" ? (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-5">
                    <div ref={overlayCardRef} tabIndex={-1}
                      className="w-full max-w-lg overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_30px_80px_-20px_rgba(15,23,42,0.35)] outline-none">
                      <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                            <svg className="h-4 w-4 text-[#f4c89a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                              Auto Access · Rent To Own
                            </p>
                            <h3 className="text-[1.1rem] font-semibold text-white">
                              Application Pre-Approved
                            </h3>
                          </div>
                        </div>
                      </div>
                      <div className="p-7 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_14px_30px_-10px_rgba(16,185,129,0.55)]">
                          <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <h3 className="mt-5 text-[1.7rem] font-semibold tracking-tight text-[#1b2345]">
                          You are pre-approved
                        </h3>
                        <p className="mx-auto mt-2 max-w-sm text-[13px] leading-[1.7] text-[#68708a]">
                          Your application has been successfully received and pre-approved for the next review stage.
                        </p>
                        <div className="mt-6 rounded-[18px] border border-[#e1e4ee] bg-gradient-to-br from-[#fafbff] to-white px-5 py-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#68708a]">
                            Reference Number
                          </p>
                          <p className="mt-2 font-mono text-[1.8rem] font-semibold tracking-tight text-[#1b2345]">
                            {referenceNumber}
                          </p>
                        </div>
                        <div className="mt-3 flex items-start gap-3 rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white px-5 py-4 text-left">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#d59758] shadow-sm">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                              Next Step
                            </p>
                            <p className="mt-1 text-[13px] leading-[1.7] text-[#39425d]">
                              Your client portal login details will help you continue with document uploads and progress tracking.
                            </p>
                          </div>
                        </div>
                        <div className="mt-6 flex justify-center">
                          <Link href="/portal-login"
                            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(47,103,222,0.5)] transition hover:from-[#2559c6] hover:to-[#3568d6]">
                            Go to Client Portal
                            <span className="transition group-hover:translate-x-0.5"><IconArrow /></span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </section>

          {/* ════════════════════════════════════════════════════
              § 2  TRUST KPI STRIP
          ════════════════════════════════════════════════════ */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <IconShield />, title: "NCA Compliant", body: "All applications processed under the National Credit Act", grad: "from-[#2f67de] to-[#4f86f7]", hover: "hover:border-[#2f67de]/30 hover:shadow-[0_12px_30px_-12px_rgba(47,103,222,0.2)]", orb: "from-[#2f67de]/10" },
              { icon: <IconLock />, title: "256-bit SSL", body: "Your personal and financial data is fully encrypted", grad: "from-[#1b2345] to-[#2a3563]", hover: "hover:border-[#1b2345]/30 hover:shadow-[0_12px_30px_-12px_rgba(27,35,69,0.2)]", orb: "from-[#1b2345]/10" },
              { icon: <IconCheck />, title: "No Deposit Required", body: "Access a vehicle without an upfront deposit requirement", grad: "from-emerald-500 to-emerald-600", hover: "hover:border-emerald-300 hover:shadow-[0_12px_30px_-12px_rgba(16,185,129,0.2)]", orb: "from-emerald-400/10" },
              { icon: <IconStar />, title: "48hr Response", body: "One of our consultants will contact you within 48 hours", grad: "from-[#d59758] to-[#e4ad72]", hover: "hover:border-[#d59758]/30 hover:shadow-[0_12px_30px_-12px_rgba(213,151,88,0.2)]", orb: "from-[#d59758]/10" },
            ].map(({ icon, title, body, grad, hover, orb }) => (
              <div key={title} className={`group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition ${hover}`}>
                <div className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${orb} to-transparent blur-2xl`} />
                <div className="relative flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white shadow-[0_8px_18px_-6px_rgba(47,103,222,0.5)]`}>
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                      {title}
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-[1.55] text-[#39425d]">
                      {body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ════════════════════════════════════════════════════
              § 3  STATS STRIP
          ════════════════════════════════════════════════════ */}
          <section className="mt-6 overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <div className="px-6 py-10 sm:px-10 sm:py-12">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#d59758]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c37d43]">
                    By The Numbers
                  </p>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1b2345] md:text-[1.8rem]">
                  A national platform built on real outcomes
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                <AnimatedStat target={12000} suffix="+" label="Vehicles Placed" />
                <AnimatedStat target={94}    suffix="%" label="Approval Rate" />
                <AnimatedStat target={48}    suffix="hr" label="Response Time" />
                <AnimatedStat target={9}     suffix="+"  label="Years Experience" />
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              § 4  WHO WE HELP
          ════════════════════════════════════════════════════ */}
          <section className="section-reveal mt-6 overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2">
            <div className="overflow-hidden rounded-[26px] bg-white">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-5 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                    <IconUsers />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                      Who We Help
                    </p>
                    <h2 className="text-[1.15rem] font-semibold text-white sm:text-[1.3rem]">
                      We understand your situation
                    </h2>
                  </div>
                </div>
                <p className="mt-3 max-w-2xl text-[13px] leading-[1.6] text-blue-50/70">
                  Traditional vehicle finance is not accessible to everyone. Auto Access was built specifically for South Africans who have been left behind by conventional lenders.
                </p>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid gap-5 md:grid-cols-3">
                  {[
                    {
                      tag: "Blacklisted",
                      headline: "Your name is on a credit bureau",
                      body: "Being blacklisted does not automatically disqualify you from accessing a vehicle. We evaluate your current affordability and situation, not only your credit history.",
                      grad: "from-[#d59758] to-[#e4ad72]",
                      chipBg: "border-[#f1dfd1] bg-[#fbf2ea] text-[#c37d43]",
                      hoverBorder: "hover:border-[#d59758]/30 hover:shadow-[0_12px_30px_-12px_rgba(213,151,88,0.2)]",
                      orb: "from-[#d59758]/10",
                      linkColor: "text-[#c37d43]",
                    },
                    {
                      tag: "Debt Review",
                      headline: "Currently under debt review",
                      body: "We understand that debt review is a responsible step toward financial recovery. We consider applications from clients navigating this process on a case-by-case basis.",
                      grad: "from-[#2f67de] to-[#4f86f7]",
                      chipBg: "border-[#dbe6ff] bg-[#eef4ff] text-[#2f67de]",
                      hoverBorder: "hover:border-[#2f67de]/30 hover:shadow-[0_12px_30px_-12px_rgba(47,103,222,0.2)]",
                      orb: "from-[#2f67de]/10",
                      linkColor: "text-[#2f67de]",
                    },
                    {
                      tag: "Low Credit Score",
                      headline: "Your credit score is below average",
                      body: "A low score is not a permanent verdict. We look at your full financial picture — your income, affordability, and commitment — to assess your application fairly.",
                      grad: "from-emerald-500 to-emerald-600",
                      chipBg: "border-emerald-200 bg-emerald-50 text-emerald-700",
                      hoverBorder: "hover:border-emerald-300 hover:shadow-[0_12px_30px_-12px_rgba(16,185,129,0.2)]",
                      orb: "from-emerald-400/10",
                      linkColor: "text-emerald-700",
                    },
                  ].map(({ tag, headline, body, grad, chipBg, hoverBorder, orb, linkColor }) => (
                    <div
                      key={tag}
                      className={`group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-6 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 ${hoverBorder}`}
                    >
                      <div className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${orb} to-transparent blur-2xl`} />
                      <div className="relative">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white shadow-[0_8px_18px_-6px_rgba(47,103,222,0.5)]`}>
                            <IconCheck />
                          </div>
                          <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${chipBg}`}>
                            {tag}
                          </span>
                        </div>
                        <h3 className="mt-5 text-[1.2rem] font-semibold leading-tight tracking-tight text-[#1b2345]">
                          {headline}
                        </h3>
                        <p className="mt-3 text-[13.5px] leading-[1.7] text-[#39425d]">{body}</p>
                        <a href="#application-form" className={`mt-5 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-[0.18em] ${linkColor} transition hover:opacity-80`}>
                          Apply Now <IconArrow />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              § 5  PROCESS FLOW
          ════════════════════════════════════════════════════ */}
          <section
            id="process-flow"
            className="relative mt-6 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] p-8 shadow-[0_30px_80px_-20px_rgba(11,21,50,0.55)] md:p-12"
          >
            <div className="absolute inset-0">
              <div className="absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-[#2f67de]/25 blur-3xl" />
              <div className="absolute -right-16 bottom-10 h-[340px] w-[340px] rounded-full bg-[#d59758]/15 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="inline-flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-200/90">
                    How It Works
                  </p>
                </div>
                <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-white md:text-[2.5rem]">
                  Your road to a vehicle,
                  <br />
                  <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                    step by step.
                  </span>
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-[14px] leading-[1.7] text-blue-50/70">
                  A structured five-step journey from application to the open road — designed for clarity, speed, and your confidence.
                </p>
              </div>

              <div className="relative mt-12 grid gap-6 md:grid-cols-5">
                <span className="pointer-events-none absolute left-[10%] right-[10%] top-[28px] hidden h-px bg-white/10 md:block" />

                {[
                  { num: "01", icon: <IconDoc />,    title: "Submit Application", desc: "Complete the online form to begin your journey.", active: true },
                  { num: "02", icon: <IconPortal />, title: "Access Your Portal",  desc: "Log in and manage your progress securely.", active: false },
                  { num: "03", icon: <IconDoc />,    title: "Upload Documents",    desc: "Send required documents through your portal.", active: false },
                  { num: "04", icon: <IconCheck />,  title: "Get Approved",        desc: "Our team reviews and updates your status.", active: false },
                  { num: "05", icon: <IconKey />,    title: "Drive Away",          desc: "Get on the road with confidence.", active: false },
                ].map(({ num, icon, title, desc, active }, i) => (
                  <div
                    key={num}
                    className="step-reveal relative z-10 text-center"
                    style={{ transitionDelay: `${i * 120}ms` }}
                  >
                    <div
                      className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border font-mono text-xs font-bold transition-all ${
                        active
                          ? "border-[#d59758]/40 bg-gradient-to-br from-[#d59758] to-[#e4ad72] text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.6)]"
                          : "border-white/15 bg-white/5 text-white/80 backdrop-blur"
                      }`}
                    >
                      {num}
                    </div>
                    <div className="mt-4 flex justify-center text-blue-200/70">{icon}</div>
                    <p className="mt-2 text-[13px] font-semibold text-white">{title}</p>
                    <p className="mt-1.5 text-[11.5px] leading-[1.6] text-blue-50/55">{desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex justify-center">
                <a href="#application-form"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.6)] transition hover:from-[#c4863f] hover:to-[#d59758]">
                  Start Your Application
                  <span className="transition group-hover:translate-x-0.5"><IconArrow /></span>
                </a>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              § 6  VEHICLE SHOWCASE
          ════════════════════════════════════════════════════ */}
          <section className="section-reveal mt-6 overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2">
            <div className="overflow-hidden rounded-[26px] bg-white">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                      <IconCar />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                        Vehicle Selection
                      </p>
                      <h2 className="text-[1.15rem] font-semibold text-white sm:text-[1.3rem]">
                        Sample monthly rates
                      </h2>
                    </div>
                  </div>
                  <Link href="/gallery"
                    className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:bg-white/15 sm:inline-flex">
                    View full gallery
                    <IconArrow />
                  </Link>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="grid gap-5 md:grid-cols-3">
                  {[
                    { tag: "Most Popular", cat: "Sedan",          name: "Mid-Range Sedan",    price: "R 2,850", grad: "from-[#2f67de] to-[#4f86f7]", orb: "from-[#2f67de]/10", hover: "hover:border-[#2f67de]/30" },
                    { tag: "SUV",          cat: "SUV / Crossover", name: "Compact SUV",       price: "R 3,990", grad: "from-[#d59758] to-[#e4ad72]", orb: "from-[#d59758]/10", hover: "hover:border-[#d59758]/30" },
                    { tag: "Bakkie",       cat: "Bakkie / Pickup", name: "Double Cab Bakkie", price: "R 4,750", grad: "from-emerald-500 to-emerald-600", orb: "from-emerald-400/10", hover: "hover:border-emerald-300" },
                  ].map(({ tag, cat, name, price, grad, orb, hover }) => (
                    <div
                      key={name}
                      className={`group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 ${hover} hover:shadow-[0_24px_50px_-18px_rgba(47,103,222,0.25)]`}
                    >
                      {/* Vehicle illustrated header */}
                      <div className={`relative flex h-40 items-center justify-center bg-gradient-to-br ${grad}`}>
                        <div className="absolute inset-0">
                          <div
                            className="absolute inset-0 opacity-[0.12]"
                            style={{
                              backgroundImage:
                                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                              backgroundSize: "20px 20px",
                            }}
                          />
                          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
                        </div>
                        <svg className="relative w-32 opacity-90" viewBox="0 0 200 80" fill="none">
                          <rect x="20" y="30" width="160" height="30" rx="8" fill="white" fillOpacity="0.95" />
                          <ellipse cx="55" cy="62" rx="14" ry="14" fill="white" />
                          <ellipse cx="145" cy="62" rx="14" ry="14" fill="white" />
                          <path d="M40 30 L70 10 L130 10 L160 30" stroke="white" strokeWidth="3" fill="rgba(255,255,255,0.2)" />
                        </svg>
                        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                          {tag}
                        </div>
                      </div>

                      <div className="relative p-5">
                        <div className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${orb} to-transparent blur-2xl`} />
                        <div className="relative">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">{cat}</p>
                          <p className="mt-1 text-[1.1rem] font-semibold text-[#1b2345]">{name}</p>
                          <div className="mt-3 flex items-baseline gap-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">from</span>
                            <span className="text-[1.6rem] font-semibold tabular-nums text-[#1b2345]">{price}</span>
                            <span className="text-[11px] text-[#68708a]">/ month</span>
                          </div>
                          <a href="#application-form"
                            className="group/cta mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_12px_26px_-10px_rgba(47,103,222,0.55)] transition hover:from-[#2559c6] hover:to-[#3568d6]">
                            Enquire About This Vehicle
                            <span className="transition group-hover/cta:translate-x-0.5"><IconArrow /></span>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              § 7  TRUST & COMPLIANCE
          ════════════════════════════════════════════════════ */}
          <section className="section-reveal mt-6 overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2">
            <div className="rounded-[26px] bg-white p-6 sm:p-8">
              <div className="text-center">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#d59758]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c37d43]">
                    Why Trust Auto Access
                  </p>
                </div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1b2345] md:text-[2.2rem]">
                  Built on compliance, transparency, and trust.
                </h2>
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-4">
                {[
                  { icon: <IconShield />, title: "NCR Registered", body: "Auto Access is a registered credit provider under the National Credit Regulator.", grad: "from-[#2f67de] to-[#4f86f7]", hover: "hover:border-[#2f67de]/30 hover:shadow-[0_12px_30px_-12px_rgba(47,103,222,0.2)]", orb: "from-[#2f67de]/10" },
                  { icon: <IconDoc />, title: "POPIA Compliant", body: "Your personal information is handled in full compliance with South African data protection law.", grad: "from-[#d59758] to-[#e4ad72]", hover: "hover:border-[#d59758]/30 hover:shadow-[0_12px_30px_-12px_rgba(213,151,88,0.2)]", orb: "from-[#d59758]/10" },
                  { icon: <IconLock />, title: "256-bit SSL", body: "All form submissions and portal interactions are encrypted with industry-standard SSL.", grad: "from-emerald-500 to-emerald-600", hover: "hover:border-emerald-300 hover:shadow-[0_12px_30px_-12px_rgba(16,185,129,0.2)]", orb: "from-emerald-400/10" },
                  { icon: <IconStar />, title: "No Hidden Fees", body: "Our process is transparent. You will always know exactly what to expect before signing anything.", grad: "from-[#1b2345] to-[#2a3563]", hover: "hover:border-[#1b2345]/30 hover:shadow-[0_12px_30px_-12px_rgba(27,35,69,0.2)]", orb: "from-[#1b2345]/10" },
                ].map(({ icon, title, body, grad, hover, orb }) => (
                  <div key={title} className={`group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition ${hover}`}>
                    <div className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${orb} to-transparent blur-2xl`} />
                    <div className="relative">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white shadow-[0_8px_18px_-6px_rgba(47,103,222,0.5)]`}>
                        {icon}
                      </div>
                      <h3 className="mt-4 text-[14px] font-semibold text-[#1b2345]">{title}</h3>
                      <p className="mt-2 text-[12.5px] leading-[1.65] text-[#68708a]">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              § 8  FINAL CTA
          ════════════════════════════════════════════════════ */}
          <section
            className="section-reveal relative mt-6 overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] p-10 shadow-[0_30px_80px_-20px_rgba(11,21,50,0.55)] md:p-14"
          >
            <div className="absolute inset-0">
              <div className="absolute -left-16 -top-16 h-[340px] w-[340px] rounded-full bg-[#2f67de]/25 blur-3xl" />
              <div className="absolute -right-16 -bottom-16 h-[300px] w-[300px] rounded-full bg-[#d59758]/15 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <div className="relative mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-3">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#f4c89a] shadow-[0_0_12px_rgba(244,200,154,0.9)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#f4c89a]">
                  Ready to Begin
                </p>
              </div>
              <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight text-white md:text-[2.85rem]">
                Your vehicle is closer
                <br />
                <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                  than you think.
                </span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-blue-50/75">
                Submit your application today and let our team work with your situation. A consultant will contact you within 48 hours to guide you through the next steps.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="#application-form"
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.6)] transition hover:from-[#c4863f] hover:to-[#d59758]">
                  Apply Now — It&apos;s Free
                  <span className="transition group-hover:translate-x-0.5"><IconArrow /></span>
                </a>
                <Link href="/portal-login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10">
                  Go to Client Portal
                </Link>
              </div>
            </div>
          </section>

          {/* ════════════════════════════════════════════════════
              § 9  FOOTER
          ════════════════════════════════════════════════════ */}
          <footer className="mt-6 overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#0b1532] to-[#060e24]">
            <div className="px-8 py-12">
              <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
                {/* Brand */}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_10px_24px_-8px_rgba(27,35,69,0.5)]">
                      <IconCar />
                    </div>
                    <div className="text-[20px] font-semibold text-white">
                      Auto<span className="text-[#f4c89a]">Access</span>
                    </div>
                  </div>
                  <p className="mt-4 max-w-[240px] text-[12.5px] leading-[1.7] text-blue-50/55">
                    South Africa&apos;s trusted rent-to-own vehicle platform. Vehicle access for every South African.
                  </p>
                  <div className="mt-5 flex gap-2">
                    <a href="https://wa.me/27870126734" target="_blank" rel="noreferrer" aria-label="WhatsApp"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-300">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-4 w-4 fill-current">
                        <path d="M19.11 17.21c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.59.14-.17.27-.68.87-.83 1.05-.15.18-.3.2-.57.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.33-1.57-1.48-1.84-.15-.27-.02-.41.11-.54.12-.12.27-.3.41-.45.14-.15.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.59-1.43-.81-1.96-.21-.5-.43-.43-.59-.44h-.5c-.18 0-.45.07-.68.34-.23.27-.89.87-.89 2.12 0 1.25.91 2.45 1.03 2.62.12.16 1.78 2.72 4.31 3.82.6.26 1.08.42 1.45.54.61.19 1.17.16 1.61.1.49-.07 1.58-.65 1.8-1.28.22-.63.22-1.17.15-1.28-.06-.11-.24-.18-.5-.32Z" />
                        <path d="M16.03 3.2c-7.06 0-12.79 5.73-12.79 12.79 0 2.25.58 4.44 1.69 6.37L3 29l6.82-1.78a12.8 12.8 0 0 0 6.21 1.6h.01c7.05 0 12.79-5.74 12.79-12.79S23.09 3.2 16.03 3.2Zm0 23.45h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.05 1.06 1.08-3.95-.26-.4a10.6 10.6 0 1 1 9.03 5Z" />
                      </svg>
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" aria-label="Facebook"
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.78-3.88 1.1 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
                      </svg>
                    </a>
                  </div>
                </div>

                {/* Quick links */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                    Quick Links
                  </p>
                  <div className="mt-4 grid gap-2.5">
                    {[
                      { href: "/",             label: "Home" },
                      { href: "/gallery",      label: "Vehicle Gallery" },
                      { href: "/apply",        label: "Apply Now" },
                      { href: "/portal-login", label: "Client Portal Login" },
                    ].map(({ href, label }) => (
                      <Link key={href} href={href}
                        className="text-[13px] text-blue-50/55 transition hover:text-white">
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Services */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                    Services
                  </p>
                  <div className="mt-4 grid gap-2.5">
                    {[
                      "Rent-to-Own Vehicles",
                      "Blacklisted Applicants",
                      "Debt Review Clients",
                      "Low Credit Score",
                      "Document Portal",
                    ].map((item) => (
                      <span key={item} className="text-[13px] text-blue-50/55">{item}</span>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                    Contact
                  </p>
                  <div className="mt-4 grid gap-3">
                    <a href="tel:0870126734"
                      className="flex items-center gap-2.5 text-[13px] text-blue-50/55 transition hover:text-white">
                      <svg className="h-3.5 w-3.5 shrink-0 text-[#f4c89a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63 19.79 19.79 0 01.12 1 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6z" />
                      </svg>
                      087 012 6734
                    </a>
                    <a href="https://wa.me/27870126734" target="_blank" rel="noreferrer"
                      className="flex items-center gap-2.5 text-[13px] text-blue-50/55 transition hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-3.5 w-3.5 shrink-0 fill-[#f4c89a]">
                        <path d="M19.11 17.21c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.59.14-.17.27-.68.87-.83 1.05-.15.18-.3.2-.57.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.33-1.57-1.48-1.84-.15-.27-.02-.41.11-.54.12-.12.27-.3.41-.45.14-.15.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.59-1.43-.81-1.96-.21-.5-.43-.43-.59-.44h-.5c-.18 0-.45.07-.68.34-.23.27-.89.87-.89 2.12 0 1.25.91 2.45 1.03 2.62.12.16 1.78 2.72 4.31 3.82.6.26 1.08.42 1.45.54.61.19 1.17.16 1.61.1.49-.07 1.58-.65 1.8-1.28.22-.63.22-1.17.15-1.28-.06-.11-.24-.18-.5-.32Z" />
                        <path d="M16.03 3.2c-7.06 0-12.79 5.73-12.79 12.79 0 2.25.58 4.44 1.69 6.37L3 29l6.82-1.78a12.8 12.8 0 0 0 6.21 1.6h.01c7.05 0 12.79-5.74 12.79-12.79S23.09 3.2 16.03 3.2Zm0 23.45h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.05 1.06 1.08-3.95-.26-.4a10.6 10.6 0 1 1 9.03 5Z" />
                      </svg>
                      WhatsApp Us
                    </a>
                    <p className="text-[12px] leading-[1.6] text-blue-50/40">
                      Mon – Fri, 08:00 – 17:00
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-white/10 px-8 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] text-blue-50/35">
                  © {new Date().getFullYear()} Auto Access (Pty) Ltd · NCR Registered · POPIA Compliant
                </p>
                <div className="flex gap-5">
                  {["Privacy Policy", "Terms of Service", "NCR Registration"].map((item) => (
                    <a key={item} href="#" className="text-[11px] text-blue-50/35 transition hover:text-white/70">
                      {item}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  EXPORTED WRAPPER (Suspense boundary for useSearchParams)
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <Suspense fallback={<HomePageFallback />}>
      <HomePageContent />
    </Suspense>
  );
}
