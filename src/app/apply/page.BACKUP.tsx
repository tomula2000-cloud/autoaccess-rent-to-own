"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type SubmitState = "idle" | "processing" | "success";

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function ApplyPageContent() {
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
    if (prefilledVehicle) {
      setPreferredVehicle(prefilledVehicle);
    }
  }, [prefilledVehicle]);

  useEffect(() => {
    if (identityType === "SA_ID") {
      setIdentityNumber((prev) => digitsOnly(prev).slice(0, 13));
    }
  }, [identityType]);

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

  useEffect(() => {
    if (submitState === "processing" || submitState === "success") {
      overlayCardRef.current?.focus();
      overlayCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [submitState]);

  useEffect(() => {
    if (showSubmitNotice) {
      submitNoticeRef.current?.focus();
      submitNoticeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [showSubmitNotice]);

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
        headers: {
          "Content-Type": "application/json",
        },
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
    <main className="min-h-screen bg-[linear-gradient(135deg,#eef4ff_0%,#f8fbff_40%,#fff8f0_100%)] text-slate-900">
      <section className="relative overflow-hidden px-4 py-4 md:px-6 md:py-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-0 h-[320px] w-[320px] rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[280px] w-[280px] rounded-full bg-orange-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1240px] rounded-[34px] border border-white/40 bg-white/35 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-[18px] md:p-6">
          <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="relative overflow-hidden rounded-[28px] border border-white/50 bg-[linear-gradient(160deg,rgba(255,255,255,0.82),rgba(255,255,255,0.60))] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.10)] md:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-[220px] w-[220px] rounded-full bg-blue-200/30 blur-3xl" />

              <div className="relative">
                <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-bold text-[#0b2c73] shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,#0f5eff,#ff8a1d)] shadow-[0_0_0_6px_rgba(15,94,255,0.08)]" />
                  Flexible mobility for modern South Africans
                </div>

                <div className="max-w-[700px]">
                  <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-[clamp(2.1rem,4vw,3.65rem)] font-extrabold leading-[1.03] tracking-[-0.06em] text-slate-900">
                    Are you blacklisted, under debt review, or do you have a low
                    credit score?
                  </h1>
                </div>

                <div className="mt-5 inline-block max-w-full rounded-[18px] bg-[linear-gradient(135deg,#0f5eff,#2974ff_54%,#ff8a1d)] px-5 py-4 text-base font-extrabold text-white shadow-[0_14px_30px_rgba(15,94,255,0.22)] md:text-lg">
                  Welcome to Auto Access — your solution to affordable
                  rent-to-own vehicles.
                </div>

                <p className="mt-5 max-w-[720px] text-[1.03rem] leading-[1.72] text-slate-600">
                  Take control of your application process from start to finish.
                  Choose from a wide variety of vehicles, submit your
                  application online, upload your documents securely, and track
                  every stage through your portal with ease.
                </p>

                <div className="mt-6 flex flex-wrap gap-4">
                  <a
                    href="#application-form"
                    className="inline-flex items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#0f5eff,#2f73ff)] px-6 py-4 text-[0.98rem] font-extrabold text-white shadow-[0_14px_28px_rgba(15,94,255,0.24)] transition hover:-translate-y-0.5"
                  >
                    Apply Now
                  </a>

                  <a
                    href="#process-flow"
                    className="inline-flex items-center justify-center rounded-[14px] border border-blue-100 bg-white/85 px-6 py-4 text-[0.98rem] font-extrabold text-[#0b2c73] shadow-[0_10px_22px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
                  >
                    View Process
                  </a>
                </div>

                <div className="mt-7 grid gap-3 md:grid-cols-2">
                  <div className="flex gap-3 rounded-[16px] border border-white/60 bg-white/65 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                    <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(15,94,255,0.14),rgba(255,138,29,0.14))] font-extrabold text-[#0b2c73]">
                      01
                    </div>
                    <div>
                      <h3 className="text-[0.98rem] font-extrabold tracking-[-0.02em]">
                        Wide Vehicle Choice
                      </h3>
                      <p className="mt-1 text-[0.9rem] leading-6 text-slate-600">
                        Choose from quality vehicles suited for your lifestyle,
                        family, or business needs.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-[16px] border border-white/60 bg-white/65 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                    <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(15,94,255,0.14),rgba(255,138,29,0.14))] font-extrabold text-[#0b2c73]">
                      02
                    </div>
                    <div>
                      <h3 className="text-[0.98rem] font-extrabold tracking-[-0.02em]">
                        Online Application
                      </h3>
                      <p className="mt-1 text-[0.9rem] leading-6 text-slate-600">
                        Submit your application quickly through a clean and
                        convenient digital process.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-[16px] border border-white/60 bg-white/65 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                    <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(15,94,255,0.14),rgba(255,138,29,0.14))] font-extrabold text-[#0b2c73]">
                      03
                    </div>
                    <div>
                      <h3 className="text-[0.98rem] font-extrabold tracking-[-0.02em]">
                        Secure Portal Access
                      </h3>
                      <p className="mt-1 text-[0.9rem] leading-6 text-slate-600">
                        Log in, upload your documents, and stay updated from one
                        simple portal.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 rounded-[16px] border border-white/60 bg-white/65 p-4 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
                    <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,rgba(15,94,255,0.14),rgba(255,138,29,0.14))] font-extrabold text-[#0b2c73]">
                      04
                    </div>
                    <div>
                      <h3 className="text-[0.98rem] font-extrabold tracking-[-0.02em]">
                        Fast Approval Flow
                      </h3>
                      <p className="mt-1 text-[0.9rem] leading-6 text-slate-600">
                        A seamless process designed to help qualifying
                        applicants get on the road sooner.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 overflow-hidden rounded-[28px] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0.70))] shadow-[0_10px_30px_rgba(15,23,42,0.10)]">
                  <div className="relative h-[240px] overflow-hidden md:h-[260px]">
                    <img
                      src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80"
                      alt="Premium vehicle"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(11,44,115,0.72),rgba(15,94,255,0.28),rgba(255,138,29,0.22))]" />
                    <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                      <div className="max-w-md rounded-[20px] border border-white/30 bg-white/20 p-4 backdrop-blur-md">
                        <p className="text-[0.75rem] font-bold uppercase tracking-[0.22em] text-orange-200">
                          Featured Mobility Access
                        </p>
                        <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-white">
                          Vehicle access with premium structure and modern clarity
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/80">
                          Explore vehicle options, apply online, and continue
                          your journey through a secure digital client portal.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div id="process-flow" className="p-5 md:p-6">
                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-[1.22rem] font-bold tracking-[-0.03em]">
                      Seamless Process Flow
                    </h3>
                    <p className="mt-2 text-[0.94rem] leading-7 text-slate-600">
                      Submit your application, log in to your application portal,
                      upload your documents, get approved, and drive away with
                      confidence.
                    </p>

                    <div className="mt-4 grid gap-3">
                      {[
                        [
                          "1",
                          "Submit Application",
                          "Complete the application form to begin the process.",
                        ],
                        [
                          "2",
                          "Access Your Portal",
                          "Log in and manage your progress from one secure place.",
                        ],
                        [
                          "3",
                          "Upload Documents",
                          "Send the required documents directly through your portal.",
                        ],
                        [
                          "4",
                          "Get Approved",
                          "Our team reviews your details and updates your application status.",
                        ],
                        [
                          "5",
                          "Drive Away",
                          "Once approved, move forward and get on the road in no time.",
                        ],
                      ].map(([num, title, desc]) => (
                        <div
                          key={num}
                          className="grid grid-cols-[42px_1fr] gap-3 rounded-[16px] border border-slate-100 bg-white/75 p-3"
                        >
                          <div className="grid h-[42px] w-[42px] place-items-center rounded-[14px] bg-[linear-gradient(135deg,#0f5eff,#ff8a1d)] text-sm font-extrabold text-white shadow-[0_10px_20px_rgba(15,94,255,0.18)]">
                            {num}
                          </div>
                          <div>
                            <h4 className="text-[0.96rem] font-extrabold tracking-[-0.02em]">
                              {title}
                            </h4>
                            <p className="mt-1 text-[0.88rem] leading-6 text-slate-600">
                              {desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 text-center text-[0.85rem] text-slate-500">
                      Premium rent-to-own solutions designed around a
                      disciplined, modern process.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section
              id="application-form"
              className="relative rounded-[34px] border border-white bg-white/90 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.10)] backdrop-blur-xl md:p-8"
            >
              <div
                className={`transition-all duration-300 ${
                  submitState === "processing" ||
                  submitState === "success" ||
                  showSubmitNotice
                    ? "pointer-events-none opacity-35 blur-[1px]"
                    : "opacity-100"
                }`}
              >
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                    Application Form
                  </p>
                  <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                    Start your rent-to-own application
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base">
                    Complete your details below. The form is structured for quick
                    submission while still keeping the process professional and clear.
                  </p>
                </div>

                <form onSubmit={handleInitialSubmit} className="space-y-8">
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-gray-900">
                      Personal Information
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          placeholder="Enter full name"
                          required
                          disabled={formLocked}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          placeholder="Enter email address"
                          required
                          disabled={formLocked}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(digitsOnly(e.target.value).slice(0, 10))}
                          inputMode="numeric"
                          maxLength={10}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          placeholder="0711231212"
                          required
                          disabled={formLocked}
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          Enter a 10 digit South African phone number with no spaces.
                        </p>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Identity Type
                        </label>
                        <select
                          value={identityType}
                          onChange={(e) => setIdentityType(e.target.value)}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          disabled={formLocked}
                        >
                          <option value="SA_ID">South African ID</option>
                          <option value="PASSPORT">Passport</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          ID / Passport Number
                        </label>
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
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          placeholder={
                            identityType === "SA_ID"
                              ? "Enter 13 digit South African ID number"
                              : "Enter passport number"
                          }
                          required
                          disabled={formLocked}
                        />
                        {identityType === "SA_ID" ? (
                          <p className="mt-2 text-xs text-gray-500">
                            South African ID number must be exactly 13 digits.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-7">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">
                      Employment & Income
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Employment Status
                        </label>
                        <select
                          value={employmentStatus}
                          onChange={(e) => setEmploymentStatus(e.target.value)}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          disabled={formLocked}
                        >
                          <option value="EMPLOYED">Employed</option>
                          <option value="SELF_EMPLOYED">Self Employed</option>
                          <option value="CONTRACT">Contract</option>
                          <option value="BUSINESS_OWNER">Business Owner</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Monthly Income
                        </label>
                        <input
                          type="text"
                          value={monthlyIncome}
                          onChange={(e) => setMonthlyIncome(e.target.value)}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          placeholder="Enter monthly income"
                          required
                          disabled={formLocked}
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Salary Date
                        </label>
                        <input
                          type="text"
                          value={salaryDate}
                          onChange={(e) => setSalaryDate(e.target.value)}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          placeholder="e.g. 25th or month-end"
                          disabled={formLocked}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-7">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">
                      Vehicle & Address
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Preferred Vehicle
                        </label>
                        <input
                          type="text"
                          value={preferredVehicle}
                          onChange={(e) => setPreferredVehicle(e.target.value)}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          placeholder="Enter preferred vehicle"
                          required
                          disabled={formLocked}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Physical Address
                        </label>
                        <textarea
                          value={physicalAddress}
                          onChange={(e) => setPhysicalAddress(e.target.value)}
                          rows={3}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          placeholder="Enter physical address"
                          disabled={formLocked}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Additional Notes
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600"
                          placeholder="Add any relevant notes"
                          disabled={formLocked}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-7">
                    <label className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 h-4 w-4"
                        required
                        disabled={formLocked}
                      />
                      <span className="text-sm leading-6 text-gray-700">
                        I confirm that the information provided is true and correct,
                        and I agree to the application review process.
                      </span>
                    </label>
                  </div>

                  {message && submitState === "idle" ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-900">
                      {message}
                    </div>
                  ) : null}

                  <div className="flex flex-wrap gap-4">
                    <button
                      type="submit"
                      disabled={formLocked}
                      className="inline-flex rounded-full bg-blue-600 px-7 py-3 font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
                  </div>
                </form>
              </div>

              {showSubmitNotice ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                  <div
                    ref={submitNoticeRef}
                    tabIndex={-1}
                    className="w-full max-w-2xl rounded-[30px] border border-white bg-white p-6 shadow-[0_25px_70px_rgba(15,23,42,0.18)] outline-none md:p-8"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                      Important Applicant Notice
                    </p>

                    <h3 className="mt-3 text-2xl font-bold text-gray-900 md:text-3xl">
                      Please confirm before proceeding
                    </h3>

                    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <p className="text-sm leading-7 text-gray-700">
                        Auto Access may consider applications from clients with
                        adverse credit history, blacklisting, debt review, or
                        previous financial difficulties. However, all
                        applications remain subject to affordability assessment,
                        supporting documentation, internal review, payment
                        readiness, and company requirements.
                      </p>

                      <p className="mt-4 text-sm leading-7 text-gray-700">
                        Do not proceed unless you are financially prepared to
                        continue when required.
                      </p>

                      <p className="mt-4 text-sm leading-7 text-gray-700">
                        If approved in principle, the approval remains valid for{" "}
                        <span className="font-semibold">12 days only</span>. If
                        the required obligations are not completed within that
                        period, the approval may expire, and a new application
                        may only be submitted after{" "}
                        <span className="font-semibold">6 months</span>.
                      </p>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                      <button
                        type="button"
                        onClick={submitApplication}
                        className="inline-flex justify-center rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        I Understand and Wish to Proceed
                      </button>

                      <button
                        type="button"
                        onClick={handleWaitInstead}
                        className="inline-flex justify-center rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 hover:bg-gray-50"
                      >
                        I Prefer to Wait and Apply Later
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {submitState === "processing" ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                  <div
                    ref={overlayCardRef}
                    tabIndex={-1}
                    className="w-full max-w-md rounded-[30px] border border-white bg-white p-8 text-center shadow-[0_25px_70px_rgba(15,23,42,0.18)] outline-none"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                      Auto Access Rent To Own
                    </p>

                    <div className="mx-auto mt-5 h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                    <h3 className="mt-5 text-2xl font-bold text-gray-900">
                      Processing your application
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-gray-600">
                      Please wait while we process your submission.
                    </p>
                  </div>
                </div>
              ) : null}

              {submitState === "success" ? (
                <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                  <div
                    ref={overlayCardRef}
                    tabIndex={-1}
                    className="w-full max-w-xl rounded-[30px] border border-white bg-white p-8 shadow-[0_25px_70px_rgba(15,23,42,0.18)] outline-none"
                  >
                    <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
                      Auto Access Rent To Own
                    </p>

                    <div className="mx-auto mt-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-green-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.704 5.29a1 1 0 010 1.42l-7.2 7.2a1 1 0 01-1.415 0l-3-3a1 1 0 111.414-1.42l2.293 2.294 6.493-6.494a1 1 0 011.415 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>

                    <h3 className="mt-5 text-center text-3xl font-bold text-gray-900">
                      You are pre-approved
                    </h3>

                    <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-7 text-gray-600">
                      Your application has been successfully received and
                      pre-approved for the next review stage.
                    </p>

                    <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-center">
                      <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700">
                        Reference Number
                      </p>
                      <p className="mt-2 text-3xl font-bold text-blue-900">
                        {referenceNumber}
                      </p>
                    </div>

                    <div className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
                        Next Step
                      </p>
                      <p className="mt-3 text-sm leading-7 text-gray-700">
                        Your client portal login details will help you continue
                        with document uploads and progress tracking.
                      </p>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <Link
                        href="/portal-login"
                        className="inline-flex rounded-full bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                      >
                        Go to Client Portal
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </section>
          </section>
        </div>
      </section>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[linear-gradient(135deg,#eef4ff_0%,#f8fbff_40%,#fff8f0_100%)] text-slate-900">
          <section className="px-4 py-10 md:px-6 md:py-12">
            <div className="mx-auto max-w-[1240px] rounded-[34px] border border-white/40 bg-white/35 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-[18px] md:p-8">
              <div className="flex min-h-[420px] items-center justify-center rounded-[28px] border border-white/50 bg-white/70 p-8">
                <div className="text-center">
                  <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    Loading application page...
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      }
    >
      <ApplyPageContent />
    </Suspense>
  );
}