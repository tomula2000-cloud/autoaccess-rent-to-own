"use client";

import { useState, useRef, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type DocumentType =
  | "ID_DOCUMENT"
  | "PASSPORT"
  | "PROOF_OF_INCOME"
  | "BANK_STATEMENT"
  | "PROOF_OF_RESIDENCE"
  | "DRIVERS_LICENSE"
  | "OTHER";

type WizardStep = {
  id: string;
  documentType: DocumentType | null; // null = identity picker step
  title: string;
  subtitle: string;
  multiPage: boolean;
  optional: boolean;
};

type UploadSlot = {
  id: string;
  file: File | null;
  uploading: boolean;
  done: boolean;
  error: string | null;
};

type Props = {
  isSelfEmployedFlow: boolean;
  submittedTypes: string[];
  documentsStageLocked: boolean;
  isMobile?: boolean;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2);
}

function emptySlot(): UploadSlot {
  return { id: uid(), file: null, uploading: false, done: false, error: null };
}

function buildSteps(isSelfEmployed: boolean): WizardStep[] {
  return [
    {
      id: "identity",
      documentType: null, // handled specially via identityChoice
      title: "Identity Document",
      subtitle: "Upload your South African ID or Passport.",
      multiPage: false,
      optional: false,
    },
    {
      id: "drivers_license",
      documentType: "DRIVERS_LICENSE",
      title: "Driver's License",
      subtitle: "A clear photo or scan of the front of your license.",
      multiPage: false,
      optional: false,
    },
    {
      id: "proof_of_residence",
      documentType: "PROOF_OF_RESIDENCE",
      title: "Proof of Residence",
      subtitle: "Utility bill, bank letter, or official address confirmation.",
      multiPage: false,
      optional: false,
    },
    ...(isSelfEmployed
      ? []
      : [
          {
            id: "payslip",
            documentType: "PROOF_OF_INCOME" as DocumentType,
            title: "Proof of Income / Payslip",
            subtitle: "Upload your latest payslip. Add pages for multi-page payslips.",
            multiPage: true,
            optional: false,
          },
        ]),
    {
      id: "bank_statement",
      documentType: "BANK_STATEMENT",
      title: isSelfEmployed ? "6 Months Bank Statement" : "Bank Statement",
      subtitle: isSelfEmployed
        ? "Upload all pages covering the latest 6 months."
        : "Upload your latest bank statement. Add pages as needed.",
      multiPage: true,
      optional: false,
    },
    {
      id: "other",
      documentType: "OTHER",
      title: "Any Other Documents",
      subtitle: "Upload any additional supporting documents if required.",
      multiPage: false,
      optional: true,
    },
  ];
}

function isStepDone(step: WizardStep, submittedTypes: string[], identityChoice: "ID_DOCUMENT" | "PASSPORT"): boolean {
  if (step.id === "identity") {
    return submittedTypes.includes("ID_DOCUMENT") || submittedTypes.includes("PASSPORT");
  }
  if (step.documentType === null) return false;
  return submittedTypes.includes(step.documentType);
}

function firstIncompleteIndex(steps: WizardStep[], submittedTypes: string[]): number {
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (step.id === "identity") {
      if (!submittedTypes.includes("ID_DOCUMENT") && !submittedTypes.includes("PASSPORT")) return i;
    } else if (step.documentType && !submittedTypes.includes(step.documentType)) {
      return i;
    }
  }
  return steps.length - 1; // default to last step if all done
}

// ── Icons ────────────────────────────────────────────────────────────────────

function IconCheck({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconUpload({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconPlus({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconLock({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function IconSpinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function DocumentUploadWizard({
  isSelfEmployedFlow,
  submittedTypes: initialSubmittedTypes,
  documentsStageLocked,
  isMobile = false,
}: Props) {
  const steps = buildSteps(isSelfEmployedFlow);
  const [submittedTypes, setSubmittedTypes] = useState<string[]>(initialSubmittedTypes);
  const [identityChoice, setIdentityChoice] = useState<"ID_DOCUMENT" | "PASSPORT">("ID_DOCUMENT");
  const [currentStep, setCurrentStep] = useState(() => firstIncompleteIndex(steps, initialSubmittedTypes));
  const [slots, setSlots] = useState<UploadSlot[]>([emptySlot()]);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [finishing, setFinishing] = useState(false);
  const [finished, setFinished] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const isIdentityStep = step.id === "identity";

  // A step is already done if the doc type was already uploaded in a previous session
  const stepAlreadyDone = isStepDone(step, submittedTypes, identityChoice);

  // Next is enabled when: step already done, OR at least one slot has a file selected
  const hasAnyFile = slots.some((s) => s.file !== null);
  const allSlotsDone = slots.every((s) => s.done);
  const anyUploading = slots.some((s) => s.uploading);

  // For identity step: also need identity type selected (always true since default exists)
  const nextEnabled = stepAlreadyDone || (hasAnyFile && !anyUploading);

  // ── Slot management ────────────────────────────────────────────────────────

  function updateSlot(id: string, patch: Partial<UploadSlot>) {
    setSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function addSlot() {
    setSlots((prev) => [...prev, emptySlot()]);
  }

  function handleFileChange(slotId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    updateSlot(slotId, { file, done: false, error: null });
  }

  // ── Upload logic ───────────────────────────────────────────────────────────

  const uploadSlot = useCallback(
    async (slot: UploadSlot): Promise<boolean> => {
      if (!slot.file || slot.done) return true;

      const docType: DocumentType =
        isIdentityStep ? identityChoice : (step.documentType as DocumentType);

      updateSlot(slot.id, { uploading: true, error: null });

      try {
        const fd = new FormData();
        fd.append("documentType", docType);
        fd.append("files", slot.file);

        const res = await fetch("/api/portal-documents", {
          method: "POST",
          body: fd,
          redirect: "manual",
        });

        // API returns a 303 redirect on success or error
        // response.type === "opaqueredirect" means it was a redirect (success or error redirect)
        // We check the redirected URL for error param
        if (res.type === "opaqueredirect" || res.status === 303 || res.ok || res.status === 0) {
          updateSlot(slot.id, { uploading: false, done: true });
          return true;
        } else {
          const text = await res.text().catch(() => "Upload failed.");
          updateSlot(slot.id, { uploading: false, error: text || "Upload failed." });
          return false;
        }
      } catch {
        updateSlot(slot.id, { uploading: false, error: "Network error. Please try again." });
        return false;
      }
    },
    [isIdentityStep, identityChoice, step.documentType]
  );

  // ── Navigation ─────────────────────────────────────────────────────────────

  async function handleNext() {
    setGlobalError(null);

    if (stepAlreadyDone) {
      // Step was already done — just advance
      advanceStep();
      return;
    }

    // Upload all pending slots
    const results = await Promise.all(
      slots.filter((s) => s.file && !s.done).map(uploadSlot)
    );

    if (results.some((r) => !r)) {
      setGlobalError("One or more uploads failed. Please try again.");
      return;
    }

    // Mark doc type as submitted locally so progress updates
    const docType = isIdentityStep ? identityChoice : step.documentType;
    if (docType) {
      setSubmittedTypes((prev) => [...prev.filter((t) => t !== docType), docType]);
    }

    advanceStep();
  }

  function advanceStep() {
    setSlots([emptySlot()]);
    setGlobalError(null);
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  async function handleFinish() {
    setGlobalError(null);
    setFinishing(true);

    // Upload any pending files on the last step (optional)
    if (hasAnyFile && !allSlotsDone) {
      const results = await Promise.all(
        slots.filter((s) => s.file && !s.done).map(uploadSlot)
      );
      if (results.some((r) => !r)) {
        setGlobalError("Upload failed. Please try again or finish without uploading.");
        setFinishing(false);
        return;
      }
    }

    // Fire complete endpoint
    try {
      await fetch("/api/portal-documents/complete", { method: "POST", redirect: "manual" });
    } catch {
      // non-blocking
    }

    setFinished(true);
    setFinishing(false);
    // Redirect to portal after short delay
    setTimeout(() => {
      window.location.href = "/portal";
    }, 1500);
  }

  // ── Locked state ───────────────────────────────────────────────────────────

  if (documentsStageLocked) {
    return (
      <div className={`rounded-[20px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5`}>
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <IconLock />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
              Uploads Locked
            </p>
            <p className="mt-1.5 text-sm font-semibold text-[#1b2345]">
              This document stage has been closed.
            </p>
            <p className="mt-1 text-[13px] leading-6 text-[#4d546a]">
              Your application has already progressed beyond the document stage. Further uploads are now locked.
            </p>
          </div>
        </div>
        <a
          href="/portal"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1d2240] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a3563]"
        >
          Go to Dashboard
        </a>
      </div>
    );
  }

  // ── Finished state ─────────────────────────────────────────────────────────

  if (finished) {
    return (
      <div className="rounded-[20px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_12px_26px_rgba(16,185,129,0.3)]">
          <IconCheck className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-[#1b2345]">All documents submitted!</h3>
        <p className="mt-2 text-sm text-[#68708a]">Redirecting you to your dashboard…</p>
      </div>
    );
  }

  // ── Progress bar ───────────────────────────────────────────────────────────

  const completedSteps = steps.filter((s) => isStepDone(s, submittedTypes, identityChoice)).length;
  const progressPct = Math.round((completedSteps / steps.length) * 100);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Progress bar + step counter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
            Step {currentStep + 1} of {steps.length}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
            {progressPct}% complete
          </p>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eef0f7]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2f67de] to-[#4f86f7] transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Step pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {steps.map((s, i) => {
            const done = isStepDone(s, submittedTypes, identityChoice);
            const active = i === currentStep;
            return (
              <div
                key={s.id}
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold transition ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                    ? "bg-[#2f67de] text-white"
                    : "bg-[#eef0f7] text-[#68708a]"
                }`}
              >
                {done ? <IconCheck className="h-3 w-3" /> : i + 1}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step card */}
      <div className="overflow-hidden rounded-[20px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.10)]">
        {/* Header */}
        <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9cc0ff]">
            {step.optional ? "Optional" : "Required"} · Document {currentStep + 1}
          </p>
          <h3 className="mt-0.5 text-[1rem] font-semibold text-white">
            {step.title}
          </h3>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-[13px] leading-6 text-[#68708a]">{step.subtitle}</p>

          {/* Already submitted notice */}
          {stepAlreadyDone && (
            <div className="flex items-center gap-3 rounded-[14px] border border-emerald-200 bg-emerald-50 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                <IconCheck />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-700">Already Submitted</p>
                <p className="mt-0.5 text-[12.5px] text-emerald-800">
                  This document was already uploaded. You can proceed to the next step.
                </p>
              </div>
            </div>
          )}

          {/* Identity picker (Step 1 only) */}
          {isIdentityStep && !stepAlreadyDone && (
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
                Select Identity Type
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["ID_DOCUMENT", "PASSPORT"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setIdentityChoice(type)}
                    className={`rounded-[14px] border-2 px-4 py-3 text-[13px] font-semibold transition ${
                      identityChoice === type
                        ? "border-[#2f67de] bg-[#eef4ff] text-[#2f67de]"
                        : "border-[#e1e4ee] bg-white text-[#68708a] hover:border-[#c5d3f0]"
                    }`}
                  >
                    {type === "ID_DOCUMENT" ? "SA ID Document" : "Passport"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upload slots */}
          {!stepAlreadyDone && (
            <div className="space-y-3">
              {slots.map((slot, slotIndex) => (
                <div
                  key={slot.id}
                  className={`rounded-[16px] border-2 border-dashed p-4 transition ${
                    slot.done
                      ? "border-emerald-300 bg-emerald-50"
                      : slot.error
                      ? "border-red-300 bg-red-50"
                      : "border-[#cdd5e8] bg-gradient-to-br from-[#fafbff] via-white to-[#f4f7ff]"
                  }`}
                >
                  {slot.done ? (
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
                        <IconCheck />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-emerald-800">
                          {slot.file?.name || "Uploaded"}
                        </p>
                        <p className="text-[11px] text-emerald-600">Uploaded successfully</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white shadow-[0_8px_20px_-6px_rgba(47,103,222,0.4)]">
                          <IconUpload />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#1b2345]">
                            {step.multiPage && slotIndex > 0 ? `Page ${slotIndex + 1}` : "Choose file"}
                          </p>
                          <p className="text-[11px] text-[#68708a]">PDF, JPG, PNG, WEBP</p>
                        </div>
                      </div>

                      <input
                        ref={(el) => { fileInputRefs.current[slot.id] = el; }}
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp,image/*"
                        onChange={(e) => handleFileChange(slot.id, e)}
                        className="w-full cursor-pointer rounded-xl border border-[#dde1ee] bg-white px-4 py-2.5 text-sm text-[#1b2345] outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-[#eef4ff] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#2f67de]"
                      />

                      {slot.error && (
                        <p className="mt-2 text-[12px] text-red-600">{slot.error}</p>
                      )}

                      {slot.uploading && (
                        <div className="mt-2 flex items-center gap-2 text-[12px] text-[#2f67de]">
                          <IconSpinner className="h-3.5 w-3.5" />
                          Uploading…
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}

              {/* Add more pages button (steps 4 & 5) */}
              {step.multiPage && (
                <button
                  type="button"
                  onClick={addSlot}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#dbe6ff] bg-[#f0f5ff] px-5 py-2.5 text-[13px] font-semibold text-[#2f67de] transition hover:bg-[#dbe6ff]"
                >
                  <IconPlus />
                  Add another page
                </button>
              )}
            </div>
          )}

          {/* Global error */}
          {globalError && (
            <p className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {globalError}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCurrentStep((s) => s - 1);
                  setSlots([emptySlot()]);
                  setGlobalError(null);
                }}
                className="inline-flex items-center justify-center rounded-full border border-[#dde1ee] bg-white px-5 py-3 text-[13px] font-semibold text-[#1b2345] transition hover:bg-[#f4f6fb]"
              >
                Back
              </button>
            )}

            {isLastStep ? (
              <button
                type="button"
                onClick={handleFinish}
                disabled={finishing}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3 text-[13px] font-semibold text-white shadow-[0_12px_26px_-8px_rgba(16,185,129,0.4)] transition hover:from-emerald-700 hover:to-emerald-800 disabled:opacity-60"
              >
                {finishing ? (
                  <>
                    <IconSpinner className="h-4 w-4" />
                    Finishing…
                  </>
                ) : (
                  "Finish & Submit All Documents"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={!nextEnabled || anyUploading}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold text-white transition ${
                  nextEnabled && !anyUploading
                    ? "bg-gradient-to-r from-[#2f67de] to-[#3f78ea] shadow-[0_12px_26px_-8px_rgba(47,103,222,0.4)] hover:from-[#2559c6] hover:to-[#3568d6]"
                    : "cursor-not-allowed bg-gradient-to-r from-[#a3b3d6] to-[#b8c6e2]"
                }`}
              >
                {anyUploading ? (
                  <>
                    <IconSpinner className="h-4 w-4" />
                    Uploading…
                  </>
                ) : stepAlreadyDone ? (
                  "Next →"
                ) : hasAnyFile ? (
                  "Upload & Next →"
                ) : (
                  "Select a file to continue"
                )}
              </button>
            )}
          </div>

          {step.optional && !isLastStep && (
            <p className="text-center text-[11px] text-[#68708a]">
              This step is optional. You can skip by clicking Finish below if you have no other documents.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
