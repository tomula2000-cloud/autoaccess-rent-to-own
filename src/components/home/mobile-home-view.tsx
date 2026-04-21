"use client";
import type { ReactNode } from "react";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type SubmitState = "idle" | "processing" | "success";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

const inputCls =
  "w-full rounded-2xl border border-[#dde1ee] bg-white px-4 py-3 text-[14px] text-[#1b2345] outline-none transition placeholder:text-[#a3aac0] focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

const selectCls =
  "w-full appearance-none rounded-2xl border border-[#dde1ee] bg-white px-4 py-3 pr-10 text-[14px] font-medium text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 cursor-pointer";

const labelCls =
  "mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]";

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
      <div className="text-[2rem] font-semibold leading-none tracking-[-0.02em] tabular-nums text-[#1b2345]">
        {count.toLocaleString()}
        <span className="text-[#d59758]">{suffix}</span>
      </div>
      <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
        {label}
      </div>
    </div>
  );
}

const IconArrow = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
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
    <circle cx="6.5" cy="16.5" r="2.5" />
    <circle cx="16.5" cy="16.5" r="2.5" />
  </svg>
);

const IconDoc = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const IconPortal = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
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

function MobileHomeFallback() {
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

function MobileHomeContent({ featuredVehiclesSlot }: { featuredVehiclesSlot?: ReactNode }) {
  const searchParams = useSearchParams();
  const prefilledVehicle = useMemo(
    () => searchParams.get("vehicle") ?? "",
    [searchParams]
  );

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

  useEffect(() => {
    if (prefilledVehicle) setPreferredVehicle(prefilledVehicle);
  }, [prefilledVehicle]);

  useEffect(() => {
    if (identityType === "SA_ID") {
      setIdentityNumber((prev) => digitsOnly(prev).slice(0, 13));
    }
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

  useReveal("section-reveal");
  useReveal("step-reveal");

  function resetForm() {
    setFullName("");
    setEmail("");
    setPhone("");
    setIdentityType("SA_ID");
    setIdentityNumber("");
    setEmploymentStatus("EMPLOYED");
    setMonthlyIncome("");
    setSalaryDate("");
    setPreferredVehicle(prefilledVehicle);
    setPhysicalAddress("");
    setNotes("");
    setTermsAccepted(false);
  }

  const normalizedPhone = digitsOnly(phone);
  const normalizedIdentityNumber =
    identityType === "SA_ID" ? digitsOnly(identityNumber) : identityNumber.trim();
  const isValidSouthAfricanPhone = /^0\d{9}$/.test(normalizedPhone);
  const isValidSouthAfricanId =
    identityType !== "SA_ID" || /^\d{13}$/.test(normalizedIdentityNumber);

  async function submitApplication() {
    setLoading(true);
    setMessage("");
    setSubmitState("processing");
    setReferenceNumber("");
    setShowSubmitNotice(false);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: normalizedPhone,
          identityType,
          identityNumber: normalizedIdentityNumber,
          employmentStatus,
          monthlyIncome,
          salaryDate,
          preferredVehicle,
          physicalAddress,
          notes,
          termsAccepted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitState("idle");
        setMessage(
          data.message || "Something went wrong while submitting your application."
        );
        setLoading(false);
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 2200));
      setReferenceNumber(data.referenceNumber || "");
      setSubmitState("success");
      setLoading(false);
      resetForm();
    } catch (error) {
      console.error(error);
      setSubmitState("idle");
      setMessage("Something went wrong while submitting your application.");
      setLoading(false);
    }
  }

  function handleInitialSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!termsAccepted) {
      setMessage(
        "Please confirm that the information provided is true and correct before continuing."
      );
      return;
    }

    if (!isValidSouthAfricanPhone) {
      setMessage(
        "Phone number must be a valid 10 digit South African number, for example 0711231212."
      );
      return;
    }

    if (!isValidSouthAfricanId) {
      setMessage("South African ID number must be exactly 13 digits.");
      return;
    }

    setShowSubmitNotice(true);
  }

  function handleWaitInstead() {
    setShowSubmitNotice(false);
    window.location.href = "/";
  }

  const formLocked =
    loading || submitState === "success" || submitState === "processing";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,222,0.08),transparent_55%),radial-gradient(circle_at_top_right,rgba(213,151,88,0.06),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-[430px] px-4 pb-24 pt-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_8px_18px_-6px_rgba(27,35,69,0.5)]">
              <IconCar />
            </div>
            <p className="text-[17px] font-semibold text-[#1b2345]">
              Auto<span className="text-[#d59758]">Access</span>
            </p>
          </Link>

          <Link
            href="/portal-login"
            className="rounded-full border border-[#2f67de] px-4 py-2 text-[12px] font-semibold text-[#2f67de]"
          >
            Client Portal
          </Link>
        </div>

        <section className="relative mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 pb-6 pt-7 shadow-[0_24px_60px_-20px_rgba(11,21,50,0.55)]">
          <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-[#2f67de]/25 blur-3xl" />
          <div className="absolute -bottom-10 right-0 h-36 w-36 rounded-full bg-[#d59758]/15 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-200/90">
                Auto Access · Rent-To-Own
              </p>
            </div>

            <h1 className="mt-5 text-[2rem] font-semibold leading-[1.05] tracking-tight text-white">
              Vehicle access for every South African,
              <br />
              <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                regardless of credit.
              </span>
            </h1>

            <p className="mt-4 text-[14px] leading-7 text-blue-50/75">
              Structured rent-to-own vehicle solutions designed around your real
              financial situation, not only your credit history.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f4c89a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                NCR Registered
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-medium text-blue-50/80">
                <IconLock />
                256-bit SSL
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-medium text-blue-50/80">
                48hr Response
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href="#application-form"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.6)]"
              >
                Apply Now
                <IconArrow />
              </a>
              <a
                href="#process-flow"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-5 py-3.5 text-sm font-semibold text-white"
              >
                Process
              </a>
            </div>
          </div>
        </section>

        <section className="section mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] border border-[#e1e4ee] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white">
                <IconShield />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
                  Secure
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[#39425d]">
                  Protected application process.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#e1e4ee] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-white">
                <IconPortal />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
                  Portal
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[#39425d]">
                  Track every next step clearly.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#e1e4ee] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#059669] text-white">
                <IconKey />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
                  Flexible
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[#39425d]">
                  Built for real-world affordability.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#e1e4ee] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d59758] to-[#e4ad72] text-white">
                <IconDoc />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
                  Structured
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[#39425d]">
                  Professional review and response flow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="application-form"
          className="section-reveal mt-4 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]"
        >
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
              Application Form
            </p>
            <h2 className="mt-1 text-[1.15rem] font-semibold text-white">
              Start your rent-to-own application
            </h2>
            <p className="mt-3 text-[13px] leading-[1.6] text-blue-50/70">
              Complete your details below. One of our consultants will contact you within 48 hours.
            </p>
          </div>

          <div
            className={`transition-all duration-300 ${
              submitState === "processing" ||
              submitState === "success" ||
              showSubmitNotice
                ? "pointer-events-none opacity-35 blur-[1px]"
                : "opacity-100"
            }`}
          >
            <form onSubmit={handleInitialSubmit} className="px-5 pb-6 pt-2">
              <FormSection label="Personal Information" />
              <div className="mt-3 grid gap-4">
                <div>
                  <label className={labelCls}>Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputCls}
                    placeholder="Enter full name"
                    required
                    disabled={formLocked}
                  />
                </div>

                <div>
                  <label className={labelCls}>Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls}
                    placeholder="Enter email address"
                    required
                    disabled={formLocked}
                  />
                </div>

                <div>
                  <label className={labelCls}>Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(digitsOnly(e.target.value).slice(0, 10))}
                    inputMode="numeric"
                    maxLength={10}
                    className={inputCls}
                    placeholder="0711231212"
                    required
                    disabled={formLocked}
                  />
                  <p className="mt-1.5 text-[11px] text-[#68708a]">
                    10 digit SA number, no spaces.
                  </p>
                </div>

                <div>
                  <label className={labelCls}>Identity Type</label>
                  <div className="relative">
                    <select
                      value={identityType}
                      onChange={(e) => setIdentityType(e.target.value)}
                      className={selectCls}
                      disabled={formLocked}
                    >
                      <option value="SA_ID">South African ID</option>
                      <option value="PASSPORT">Passport</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#68708a]"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>ID / Passport Number</label>
                  <input
                    type="text"
                    value={identityNumber}
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
                    required
                    disabled={formLocked}
                  />
                </div>
              </div>

              <FormSection label="Employment & Income" />
              <div className="mt-3 grid gap-4">
                <div>
                  <label className={labelCls}>Employment Status</label>
                  <div className="relative">
                    <select
                      value={employmentStatus}
                      onChange={(e) => setEmploymentStatus(e.target.value)}
                      className={selectCls}
                      disabled={formLocked}
                    >
                      <option value="EMPLOYED">Employed</option>
                      <option value="SELF_EMPLOYED">Self Employed</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="BUSINESS_OWNER">Business Owner</option>
                      <option value="OTHER">Other</option>
                    </select>
                    <svg
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#68708a]"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Monthly Income</label>
                  <input
                    type="text"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className={inputCls}
                    placeholder="Enter monthly income"
                    required
                    disabled={formLocked}
                  />
                </div>

                <div>
                  <label className={labelCls}>Salary Date</label>
                  <input
                    type="text"
                    value={salaryDate}
                    onChange={(e) => setSalaryDate(e.target.value)}
                    className={inputCls}
                    placeholder="25th / month-end"
                    disabled={formLocked}
                  />
                </div>
              </div>

              <FormSection label="Vehicle & Address" />
              <div className="mt-3 grid gap-4">
                <div>
                  <label className={labelCls}>Preferred Vehicle</label>
                  <input
                    type="text"
                    value={preferredVehicle}
                    onChange={(e) => setPreferredVehicle(e.target.value)}
                    className={inputCls}
                    placeholder="Enter preferred vehicle"
                    required
                    disabled={formLocked}
                  />
                </div>

                <div>
                  <label className={labelCls}>Physical Address</label>
                  <textarea
                    value={physicalAddress}
                    onChange={(e) => setPhysicalAddress(e.target.value)}
                    rows={2}
                    className={inputCls}
                    placeholder="Enter physical address"
                    disabled={formLocked}
                  />
                </div>

                <div>
                  <label className={labelCls}>Additional Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className={inputCls}
                    placeholder="Add any relevant notes"
                    disabled={formLocked}
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[#dde1ee] bg-[#fafbff] px-4 py-4 transition hover:border-[#2f67de]/30 hover:bg-[#f4f7ff]">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#2f67de]"
                    required
                    disabled={formLocked}
                  />
                  <span className="text-[12.5px] leading-[1.6] text-[#39425d]">
                    I confirm that the information provided is true and correct,
                    and I agree to the application review process.
                  </span>
                </label>
              </div>

              {message && submitState === "idle" ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={formLocked}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)]"
              >
                Continue Application
                <IconArrow />
              </button>
            </form>
          </div>

          {showSubmitNotice ? (
            <div className="border-t border-[#eef0f7] bg-[#fbfcff] p-5" ref={submitNoticeRef} tabIndex={-1}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c37d43]">
                Final Confirmation
              </p>
              <h3 className="mt-2 text-lg font-semibold text-[#1b2345]">
                Submit your application now?
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#39425d]">
                Your details look ready. Once submitted, your application enters review and a reference number will be generated.
              </p>
              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  onClick={submitApplication}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(47,103,222,0.45)]"
                >
                  {loading ? "Submitting..." : "Yes, Submit Application"}
                </button>
                <button
                  type="button"
                  onClick={handleWaitInstead}
                  disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#dbe1ee] bg-white px-6 py-4 text-sm font-semibold text-[#1b2345]"
                >
                  Not Yet
                </button>
              </div>
            </div>
          ) : null}

          {(submitState === "processing" || submitState === "success") && (
            <div
              ref={overlayCardRef}
              tabIndex={-1}
              className="border-t border-[#eef0f7] bg-[#fbfcff] p-5"
            >
              {submitState === "processing" ? (
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-[3px] border-[#eef0f7] border-t-[#2f67de]" />
                  <p className="mt-4 text-lg font-semibold text-[#1b2345]">
                    Processing your application
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#68708a]">
                    Please wait while we securely submit your details.
                  </p>
                </div>
              ) : (
                <div className="-mx-5 -my-5 overflow-hidden rounded-none">
                  <div className="bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
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
                        <h3 className="text-[1rem] font-semibold text-white">
                          Application Pre-Approved
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#fbfcff] px-5 py-6 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_12px_26px_rgba(16,185,129,0.3)]">
                      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>

                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-[#1b2345]">
                      You are pre-approved
                    </h3>
                    <p className="mx-auto mt-2 max-w-sm text-[13px] leading-[1.7] text-[#68708a]">
                      Your application has been successfully received and pre-approved for the next review stage.
                    </p>

                    <div className="mt-5 rounded-[16px] border border-[#e1e4ee] bg-gradient-to-br from-[#fafbff] to-white px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#68708a]">
                        Reference Number
                      </p>
                      <p className="mt-1.5 font-mono text-[1.4rem] font-semibold tracking-tight text-[#1b2345]">
                        {referenceNumber}
                      </p>
                    </div>

                    <div className="mt-3 flex items-start gap-3 rounded-[16px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white px-4 py-3 text-left">
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
                        <p className="mt-1 text-[12px] leading-[1.6] text-[#39425d]">
                          Your client portal login details will help you continue with document uploads and progress tracking.
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3">
                      <Link
                        href="/portal-login"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-6 py-4 text-sm font-semibold text-white"
                      >
                        Go to Client Portal
                      </Link>
                      <a
                        href="/"
                        className="inline-flex w-full items-center justify-center rounded-full border border-[#dbe1ee] bg-white px-6 py-4 text-sm font-semibold text-[#1b2345]"
                      >
                        Return Home
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="section mt-4 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
          <div className="px-5 py-8">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2">
                <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[#d59758]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c37d43]">
                  By The Numbers
                </p>
              </div>
              <h2 className="mt-3 text-[1.45rem] font-semibold tracking-tight text-[#1b2345]">
                Real outcomes. Real vehicle access.
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <AnimatedStat target={12000} suffix="+" label="Vehicles Placed" />
              <AnimatedStat target={94} suffix="%" label="Approval Rate" />
              <AnimatedStat target={48} suffix="hr" label="Response Time" />
              <AnimatedStat target={9} suffix="+" label="Years Experience" />
            </div>
          </div>
        </section>

        <section className="section-reveal mt-4 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#f4c89a]">
                <IconUsers />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                  Who We Help
                </p>
                <h2 className="text-[1.1rem] font-semibold text-white">
                  We understand your situation
                </h2>
              </div>
            </div>
            <p className="mt-3 text-[13px] leading-[1.6] text-blue-50/70">
              Built specifically for South Africans left behind by conventional lenders.
            </p>
          </div>

          <div className="p-4 space-y-3">
            {[
              {
                tag: "Blacklisted",
                headline: "Your name is on a credit bureau",
                body: "We evaluate your current affordability and situation, not only your credit history.",
                grad: "from-[#d59758] to-[#e4ad72]",
              },
              {
                tag: "Debt Review",
                headline: "Currently under debt review",
                body: "We understand this is often part of financial recovery and consider applications case by case.",
                grad: "from-[#2f67de] to-[#4f86f7]",
              },
              {
                tag: "Low Credit Score",
                headline: "Your score does not tell the full story",
                body: "Many clients can still qualify where traditional finance would reject them immediately.",
                grad: "from-[#10b981] to-[#059669]",
              },
            ].map((item) => (
              <div
                key={item.tag}
                className="rounded-[18px] border border-[#e1e4ee] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.grad} text-white`}
                  >
                    <IconStar />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                      {item.tag}
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-[#1b2345]">
                      {item.headline}
                    </h3>
                    <p className="mt-2 text-[12.5px] leading-6 text-[#39425d]">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="process-flow"
          className="section-reveal mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-7 shadow-[0_24px_60px_-20px_rgba(11,21,50,0.45)]"
        >
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
              Process Flow
            </p>
            <h2 className="mt-3 text-[1.55rem] font-semibold leading-[1.15] text-white">
              From application to
              <br />
              <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                vehicle access
              </span>
            </h2>
          </div>

          <div className="relative mt-7 space-y-5 pl-8">
            <div className="absolute left-3 top-4 bottom-4 w-px bg-white/10" />

            {[
              {
                num: "01",
                title: "Submit your application",
                body: "Complete a structured application with your personal and affordability details.",
                active: true,
              },
              {
                num: "02",
                title: "Consultant review",
                body: "Your application is reviewed and matched to the next suitable stage.",
                active: false,
              },
              {
                num: "03",
                title: "Client portal access",
                body: "Track status updates, upload documents, and continue your journey securely.",
                active: false,
              },
            ].map((step) => (
              <div key={step.num} className="relative">
                <div
                  className={`absolute -left-8 top-0 flex h-7 w-7 items-center justify-center rounded-[10px] border text-[11px] font-semibold ${
                    step.active
                      ? "border-transparent bg-gradient-to-br from-[#d59758] to-[#e4ad72] text-white shadow-[0_8px_20px_-6px_rgba(213,151,88,0.5)]"
                      : "border-white/12 bg-white/5 text-white/70"
                  }`}
                >
                  {step.num}
                </div>
                <h3 className="text-sm font-semibold text-white">{step.title}</h3>
                <p className="mt-1 text-[12.5px] leading-6 text-blue-50/60">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7">
            <a
              href="#application-form"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)]"
            >
              Start Application
              <IconArrow />
            </a>
          </div>
        </section>

        <section className="section-reveal mt-4">
          {featuredVehiclesSlot}
        </section>

        <footer className="section mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0b1532] to-[#060e24] px-5 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a]">
              <IconCar />
            </div>
            <p className="text-[16px] font-semibold text-white">
              Auto<span className="text-[#f4c89a]">Access</span>
            </p>
          </div>

          <p className="mt-4 text-[12px] leading-6 text-blue-50/45">
            A premium South African rent-to-own platform built around clarity,
            trust, and structured access to vehicles.
          </p>

          <div className="mt-5 flex flex-wrap gap-4">
            <Link href="/portal-login" className="text-[12px] text-blue-50/55">
              Client Portal
            </Link>
            <Link href="/gallery" className="text-[12px] text-blue-50/55">
              Gallery
            </Link>
            <a href="#application-form" className="text-[12px] text-blue-50/55">
              Apply
            </a>
          </div>

          <div className="mt-5 border-t border-white/10 pt-4">
            <p className="text-[11px] text-blue-50/35">
              © {new Date().getFullYear()} Auto Access (Pty) Ltd · NCR Registered · POPIA Compliant
            </p>
          </div>
        </footer>

        <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[430px] border-t border-[#e1e4ee] bg-white/95 px-4 py-3 backdrop-blur">
          <a
            href="#application-form"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)]"
          >
            Apply Now
            <IconArrow />
          </a>
        </div>
      </div>
    </main>
  );
}

export default function MobileHomeView({ featuredVehiclesSlot }: { featuredVehiclesSlot?: ReactNode }) {
  return (
    <Suspense fallback={<MobileHomeFallback />}>
      <MobileHomeContent featuredVehiclesSlot={featuredVehiclesSlot} />
    </Suspense>
  );
}