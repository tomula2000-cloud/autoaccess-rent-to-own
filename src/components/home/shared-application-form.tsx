"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

type SubmitState = "idle" | "processing" | "success";

type SharedApplicationFormProps = {
  compact?: boolean;
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

function SharedApplicationFormFallback({
  compact = false,
}: SharedApplicationFormProps) {
  const shellClass = compact
    ? "relative rounded-[24px] border border-white/70 bg-white/92 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl"
    : "relative rounded-[34px] border border-white bg-white/90 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.10)] backdrop-blur-xl md:p-8";

  return (
    <section id="application-form" className={shellClass}>
      <div className="flex min-h-[220px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
          <p className="mt-4 text-sm text-gray-600">Loading application form...</p>
        </div>
      </div>
    </section>
  );
}

function SharedApplicationFormContent({
  compact = false,
}: SharedApplicationFormProps) {
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

  const shellClass = compact
    ? "relative rounded-[24px] border border-white/70 bg-white/92 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.10)] backdrop-blur-xl"
    : "relative rounded-[34px] border border-white bg-white/90 p-6 shadow-[0_18px_55px_rgba(15,23,42,0.10)] backdrop-blur-xl md:p-8";

  const headingClass = compact
    ? "mt-2 text-[1.45rem] font-bold text-gray-900"
    : "mt-3 text-3xl font-bold text-gray-900 md:text-4xl";

  const formSpacing = compact ? "space-y-4" : "space-y-8";
  const sectionPadding = compact
    ? "border-t border-gray-200 pt-4"
    : "border-t border-gray-200 pt-7";
  const inputClass = compact
    ? "w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-600"
    : "w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600";

  return (
    <section id="application-form" className={shellClass}>
      <div
        className={`transition-all duration-300 ${
          submitState === "processing" ||
          submitState === "success" ||
          showSubmitNotice
            ? "pointer-events-none opacity-35 blur-[1px]"
            : "opacity-100"
        }`}
      >
        <div className={compact ? "mb-4" : "mb-6"}>
          <p
            className={
              compact
                ? "text-[10px] font-bold uppercase tracking-[0.24em] text-orange-500"
                : "text-xs font-bold uppercase tracking-[0.3em] text-orange-500"
            }
          >
            Application Form
          </p>

          <h2 className={headingClass}>Start your rent-to-own application</h2>

          <p
            className={
              compact
                ? "mt-2 text-sm leading-6 text-gray-600"
                : "mt-3 max-w-2xl text-sm leading-6 text-gray-600 md:text-base"
            }
          >
            Complete your details below. The form is structured for quick
            submission while still keeping the process professional and clear.
          </p>
        </div>

        <form onSubmit={handleInitialSubmit} className={formSpacing}>
          <div>
            <h3
              className={
                compact
                  ? "mb-3 text-base font-bold text-gray-900"
                  : "mb-4 text-lg font-bold text-gray-900"
              }
            >
              Personal Information
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClass}
                  placeholder="Enter full name"
                  required
                  disabled={formLocked}
                />
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="Enter email address"
                  required
                  disabled={formLocked}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(digitsOnly(e.target.value).slice(0, 10))
                  }
                  inputMode="numeric"
                  maxLength={10}
                  className={inputClass}
                  placeholder="0711231212"
                  required
                  disabled={formLocked}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Identity Type
                </label>
                <select
                  value={identityType}
                  onChange={(e) => setIdentityType(e.target.value)}
                  className={inputClass}
                  disabled={formLocked}
                >
                  <option value="SA_ID">SA ID</option>
                  <option value="PASSPORT">Passport</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
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
                  className={inputClass}
                  placeholder={
                    identityType === "SA_ID"
                      ? "Enter 13 digit ID number"
                      : "Enter passport number"
                  }
                  required
                  disabled={formLocked}
                />
                {identityType === "SA_ID" ? (
                  <p className="mt-1 text-[11px] text-gray-500">
                    Must be exactly 13 digits.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className={sectionPadding}>
            <h3
              className={
                compact
                  ? "mb-3 text-base font-bold text-gray-900"
                  : "mb-4 text-lg font-bold text-gray-900"
              }
            >
              Employment & Income
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Employment Status
                </label>
                <select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  className={inputClass}
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
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Monthly Income
                </label>
                <input
                  type="text"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className={inputClass}
                  placeholder="Monthly income"
                  required
                  disabled={formLocked}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Salary Date
                </label>
                <input
                  type="text"
                  value={salaryDate}
                  onChange={(e) => setSalaryDate(e.target.value)}
                  className={inputClass}
                  placeholder="25th / month-end"
                  disabled={formLocked}
                />
              </div>
            </div>
          </div>

          <div className={sectionPadding}>
            <h3
              className={
                compact
                  ? "mb-3 text-base font-bold text-gray-900"
                  : "mb-4 text-lg font-bold text-gray-900"
              }
            >
              Vehicle & Address
            </h3>

            <div className="grid gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Preferred Vehicle
                </label>
                <input
                  type="text"
                  value={preferredVehicle}
                  onChange={(e) => setPreferredVehicle(e.target.value)}
                  className={inputClass}
                  placeholder="Enter preferred vehicle"
                  required
                  disabled={formLocked}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Physical Address
                </label>
                <textarea
                  value={physicalAddress}
                  onChange={(e) => setPhysicalAddress(e.target.value)}
                  rows={compact ? 2 : 3}
                  className={inputClass}
                  placeholder="Enter physical address"
                  disabled={formLocked}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={compact ? 2 : 3}
                  className={inputClass}
                  placeholder="Add any relevant notes"
                  disabled={formLocked}
                />
              </div>
            </div>
          </div>

          <div className={sectionPadding}>
            <label
              className={
                compact
                  ? "flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3"
                  : "flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4"
              }
            >
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4"
                required
                disabled={formLocked}
              />
              <span
                className={
                  compact
                    ? "text-xs leading-5 text-gray-700"
                    : "text-sm leading-6 text-gray-700"
                }
              >
                I confirm that the information provided is true and correct,
                and I agree to the application review process.
              </span>
            </label>
          </div>

          {message && submitState === "idle" ? (
            <div
              className={
                compact
                  ? "rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
                  : "rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-medium text-red-900"
              }
            >
              {message}
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={formLocked}
              className={
                compact
                  ? "inline-flex rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  : "inline-flex rounded-full bg-blue-600 px-7 py-3 font-semibold text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)] transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              }
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>

      {showSubmitNotice ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-4">
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

            <div className="mt-2.5 sm:mt-5 rounded-[16px] border border-gray-200 bg-gray-50 p-3 sm:p-5">
              <p className="text-sm leading-7 text-gray-700">
                Auto Access may consider applications from clients with adverse
                credit history, blacklisting, debt review, or previous
                financial difficulties. However, all applications remain subject
                to affordability assessment, supporting documentation, internal
                review, payment readiness, and company requirements.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-700">
                Do not proceed unless you are financially prepared to continue
                when required.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-700">
                If approved in principle, the approval remains valid for{" "}
                <span className="font-semibold">12 days only</span>. If the
                required obligations are not completed within that period, the
                approval may expire, and a new application may only be
                submitted after <span className="font-semibold">6 months</span>.
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
        <div className="absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-4">
          <div
            ref={overlayCardRef}
            tabIndex={-1}
            className="w-full max-w-md rounded-[24px] sm:rounded-[30px] border border-white bg-white p-5 sm:p-8 text-center shadow-[0_25px_70px_rgba(15,23,42,0.18)] outline-none"
          >
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              Auto Access Rent To Own
            </p>

            <div className="mx-auto mt-5 h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <h3 className="mt-4 text-xl sm:text-2xl font-bold text-gray-900">
              Processing your application
            </h3>

            <p className="mt-3 text-sm leading-7 text-gray-600">
              Please wait while we process your submission.
            </p>
          </div>
        </div>
      ) : null}

      {submitState === "success" ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center p-3 sm:p-4">
          <div
            ref={overlayCardRef}
            tabIndex={-1}
            className="w-full max-w-xl rounded-[24px] sm:rounded-[30px] border border-white bg-white p-5 sm:p-8 shadow-[0_25px_70px_rgba(15,23,42,0.18)] outline-none"
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

            <h3 className="mt-3 sm:mt-5 text-center text-xl sm:text-3xl font-bold text-gray-900">
              You are pre-approved
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-center text-sm leading-7 text-gray-600">
              Your application has been successfully received and pre-approved
              for the next review stage.
            </p>

            <div className="mt-3 sm:mt-6 rounded-[16px] border border-blue-200 bg-blue-50 p-3 sm:p-5 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-700">
                Reference Number
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-900">
                {referenceNumber}
              </p>
            </div>

            <div className="mt-2.5 sm:mt-5 rounded-[16px] border border-gray-200 bg-gray-50 p-3 sm:p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">
                Next Step
              </p>
              <p className="mt-3 text-sm leading-7 text-gray-700">
                Your client portal login details will help you continue with
                document uploads and progress tracking.
              </p>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-center">
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
  );
}

export default function SharedApplicationForm(props: SharedApplicationFormProps) {
  return (
    <Suspense fallback={<SharedApplicationFormFallback compact={props.compact} />}>
      <SharedApplicationFormContent {...props} />
    </Suspense>
  );
}