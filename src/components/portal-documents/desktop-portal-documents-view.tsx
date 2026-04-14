import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type DocumentItem = {
  id: string;
  fileName: string;
  documentType: string;
  createdAt: Date | string;
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

type PageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

type RequiredDocItem = {
  key: string;
  title: string;
  note: string;
  tone: string;
  submitted: boolean;
};

function IconCheck() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function IconFile() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export default async function PortalDocumentsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};

  const cookieStore = await cookies();
  const referenceNumber = cookieStore.get("autoaccess_portal_ref")?.value;
  const email = cookieStore.get("autoaccess_portal_email")?.value;
  const applicationId = cookieStore.get("autoaccess_portal_application_id")?.value;

  if (!referenceNumber || !email || !applicationId) {
    redirect("/portal-login");
  }

  const application = await prisma.application.findUnique({
    where: {
      referenceNumber,
    },
    select: {
      id: true,
      referenceNumber: true,
      email: true,
      status: true,
      preferredVehicle: true,
      employmentStatus: true,
      documents: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          fileName: true,
          documentType: true,
          createdAt: true,
        },
      },
    },
  });

  if (
    !application ||
    application.id !== applicationId ||
    application.email.toLowerCase() !== email.toLowerCase()
  ) {
    redirect("/portal-login");
  }

  const isSelfEmployedFlow =
    application.employmentStatus === "SELF_EMPLOYED" ||
    application.employmentStatus === "BUSINESS_OWNER";

  const submittedTypes = new Set(
    application.documents.map((doc: DocumentItem) => doc.documentType)
  );

  const requiredDocs: RequiredDocItem[] = [
    {
      key: "ID_DOCUMENT",
      title: "ID Document / Passport",
      note: "Single clear upload or photo.",
      tone: "border-blue-100 bg-blue-50 text-blue-700",
      submitted:
        submittedTypes.has("ID_DOCUMENT") || submittedTypes.has("PASSPORT"),
    },
    {
      key: isSelfEmployedFlow ? "BANK_STATEMENT_6_MONTHS" : "PROOF_OF_INCOME",
      title: isSelfEmployedFlow
        ? "6 Months Bank Statement"
        : "Proof of Income / Payslip",
      note: isSelfEmployedFlow
        ? "Please upload a bank statement covering the latest 6 months."
        : "Upload multiple pages if needed.",
      tone: "border-orange-100 bg-orange-50 text-orange-700",
      submitted: isSelfEmployedFlow
        ? submittedTypes.has("BANK_STATEMENT")
        : submittedTypes.has("PROOF_OF_INCOME"),
    },
    {
      key: "BANK_STATEMENT",
      title: "Bank Statement",
      note: isSelfEmployedFlow
        ? "This requirement is covered by the 6 Months Bank Statement above."
        : "Multiple pages are allowed.",
      tone: "border-emerald-100 bg-emerald-50 text-emerald-700",
      submitted: submittedTypes.has("BANK_STATEMENT"),
    },
    {
      key: "PROOF_OF_RESIDENCE",
      title: "Proof of Residence",
      note: "One or more uploads if needed.",
      tone: "border-violet-100 bg-violet-50 text-violet-700",
      submitted: submittedTypes.has("PROOF_OF_RESIDENCE"),
    },
    {
      key: "DRIVERS_LICENSE",
      title: "Driver's License",
      note: "Single clear upload or photo.",
      tone: "border-slate-200 bg-slate-50 text-slate-700",
      submitted: submittedTypes.has("DRIVERS_LICENSE"),
    },
  ];

  const allRequiredSubmitted = requiredDocs.every((doc) => doc.submitted);
  const submittedCount = requiredDocs.filter((d) => d.submitted).length;
  const totalRequired = requiredDocs.length;
  const completionPct = Math.round((submittedCount / totalRequired) * 100);

  const latestUploadedAt =
    application.documents.length > 0
      ? new Date(application.documents[0].createdAt).toLocaleString()
      : null;

  const documentsStageLockedStatuses = new Set([
    "APPROVED_IN_PRINCIPLE",
    "AWAITING_INVOICE",
    "INVOICE_ISSUED",
    "AWAITING_PAYMENT",
    "PAYMENT_UNDER_VERIFICATION",
    "PAYMENT_CONFIRMED",
    "COMPLETED",
    "DECLINED",
  ]);

  const documentsStageLocked = documentsStageLockedStatuses.has(
    application.status
  );

  const documentsLockMessage =
    application.status === "APPROVED_IN_PRINCIPLE"
      ? "Your application has already moved beyond document collection. The upload section is now locked."
      : application.status === "DECLINED"
      ? "This application is no longer active. Document uploads are now locked."
      : "Your application has already progressed beyond the document stage. Further uploads are now locked.";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] px-4 py-6 text-black sm:px-6 md:py-8">
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

      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-8 py-8 shadow-[0_28px_72px_-18px_rgba(11,21,50,0.55)] md:px-10">
          <div className="absolute inset-0">
            <div className="absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full bg-[#2f67de]/25 blur-3xl" />
            <div className="absolute -right-16 top-10 h-[320px] w-[320px] rounded-full bg-[#d59758]/15 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
          </div>

          <div className="relative grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-200/90">
                  Auto Access · Document Center
                </p>
              </div>

              <h1 className="mt-4 text-4xl font-semibold leading-[1.03] tracking-tight text-white md:text-[2.65rem]">
                Complete your
                <br />
                <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                  application documents.
                </span>
              </h1>

              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-blue-50/75">
                Securely submit your required documents in an encrypted
                environment, track completion, and keep your application moving
                without delays.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4c89a] backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                  {formatStatus(application.status)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-blue-50/80 backdrop-blur">
                  Ref{" "}
                  <span className="font-mono text-white">
                    {application.referenceNumber}
                  </span>
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100/75">
                  Submitted
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {submittedCount}
                  <span className="text-base text-blue-200/60">/{totalRequired}</span>
                </p>
              </div>

              <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100/75">
                  Completion
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${
                        allRequiredSubmitted
                          ? "bg-gradient-to-r from-emerald-400 to-emerald-300"
                          : "bg-gradient-to-r from-[#7ea8ff] to-[#f4c89a]"
                      }`}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    {completionPct}%
                  </span>
                </div>
              </div>

              <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100/75">
                  Latest Upload
                </p>
                <p className="mt-2 text-[13px] font-semibold leading-5 text-white/90">
                  {latestUploadedAt || "No uploads yet"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {params.success ? (
          <div className="mt-5 rounded-[20px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-4 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.3)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                <IconCheck />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Upload Successful
                </p>
                <p className="mt-1.5 text-sm font-semibold text-emerald-900">
                  {params.success}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-5 rounded-[20px] border border-red-200 bg-gradient-to-r from-red-50 via-white to-rose-50 p-4 shadow-[0_8px_24px_-12px_rgba(220,38,38,0.22)]">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white">
                <IconAlert />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-700">
                  Upload Issue
                </p>
                <p className="mt-1.5 text-sm font-semibold text-red-900">
                  {params.error}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-5 grid gap-5 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="space-y-5">
            <section className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_10px_28px_-14px_rgba(15,23,42,0.10)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                      Checklist
                    </p>
                    <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">
                      Required Documents
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                    {submittedCount}/{totalRequired}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {isSelfEmployedFlow ? (
                  <div className="mb-4 flex items-start gap-3 rounded-[16px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#d59758] shadow-sm">
                      <IconAlert />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                        Self-Employed / Business Owner Rule
                      </p>
                      <p className="mt-1.5 text-sm leading-6 text-[#39425d]">
                        For this application type, the payslip requirement is replaced with a 6 Months Bank Statement.
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2.5">
                  {requiredDocs.map((doc, index) => (
                    <div
                      key={doc.key}
                      className="rounded-[16px] border border-[#e8ecf5] bg-[#fbfcff] px-4 py-3.5 transition hover:border-[#dbe2f2]"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold ${
                            doc.submitted
                              ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                              : "bg-[#eef0f7] text-[#68708a]"
                          }`}
                        >
                          {doc.submitted ? (
                            <IconCheck />
                          ) : (
                            String(index + 1).padStart(2, "0")
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[14px] font-semibold text-[#1b2345]">
                                {doc.title}
                              </p>
                              <p className="mt-1 text-[12.5px] leading-5 text-[#68708a]">
                                {doc.note}
                              </p>
                            </div>

                            {doc.submitted ? (
                              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Submitted
                              </span>
                            ) : (
                              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#f1dfd1] bg-[#fbf2ea] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#c37d43]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d59758]" />
                                Awaiting
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {!documentsStageLocked ? (
                  <form
                    action="/api/portal-documents/complete"
                    method="POST"
                    className="mt-5"
                  >
                    <button
                      type="submit"
                      disabled={!allRequiredSubmitted}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition ${
                        allRequiredSubmitted
                          ? "bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-[0_14px_30px_-10px_rgba(16,185,129,0.45)] hover:from-emerald-700 hover:to-emerald-800"
                          : "cursor-not-allowed bg-gradient-to-r from-[#a3b3d6] to-[#b8c6e2]"
                      }`}
                    >
                      {allRequiredSubmitted
                        ? "Confirm All Documents Submitted"
                        : "Submit all required documents first"}
                    </button>
                  </form>
                ) : (
                  <div className="mt-5 rounded-[18px] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                        <IconLock />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                          Documents Stage Locked
                        </p>
                        <p className="mt-1.5 text-sm leading-6 text-[#39425d]">
                          {documentsLockMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_10px_28px_-14px_rgba(15,23,42,0.10)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                      Submitted Files
                    </p>
                    <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">
                      Documents Overview
                    </h2>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${
                      application.documents.length > 0
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-600"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        application.documents.length > 0
                          ? "bg-emerald-500"
                          : "bg-slate-400"
                      }`}
                    />
                    {application.documents.length > 0 ? "Submitted" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {application.documents.length === 0 ? (
                  <div className="rounded-[20px] border-2 border-dashed border-[#d7d9e2] bg-gradient-to-br from-[#fafbff] to-white p-8 text-center">
                    <p className="text-base font-semibold text-[#1b2345]">
                      No documents submitted yet
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#68708a]">
                      Once submitted, your files will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {application.documents.map((document: DocumentItem) => (
                      <div
                        key={document.id}
                        className="rounded-[16px] border border-[#e8ecf5] bg-[#fbfcff] px-4 py-3.5"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                            <IconFile />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-[14px] font-semibold text-[#1b2345]">
                                  {document.fileName}
                                </p>
                                <p className="mt-1 text-[12px] leading-5 text-[#68708a]">
                                  {document.documentType.replaceAll("_", " ")}
                                </p>
                                <p className="mt-0.5 text-[12px] leading-5 text-[#68708a]">
                                  {new Date(document.createdAt).toLocaleString()}
                                </p>
                              </div>

                              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Received
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div className="space-y-5">
            <section className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_10px_28px_-14px_rgba(15,23,42,0.10)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9cc0ff]">
                  Encrypted
                </p>
                <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">
                  Secure Upload Vault
                </h2>
              </div>

              {!documentsStageLocked ? (
                <form
                  action="/api/portal-documents"
                  method="POST"
                  encType="multipart/form-data"
                  className="space-y-4 p-5 sm:p-6"
                >
                  <div>
                    <label
                      htmlFor="documentType"
                      className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]"
                    >
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#eef4ff] text-[#2f67de]">
                        <IconFile />
                      </span>
                      Document Type
                    </label>

                    <div className="relative">
                      <select
                        id="documentType"
                        name="documentType"
                        defaultValue="ID_DOCUMENT"
                        className="w-full appearance-none rounded-2xl border border-[#dde1ee] bg-white px-4 py-3.5 pr-10 text-sm font-medium text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                      >
                        <option value="ID_DOCUMENT">ID Document</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="PROOF_OF_INCOME" disabled={isSelfEmployedFlow}>
                          {isSelfEmployedFlow
                            ? "Proof of Income / Payslip (Not applicable)"
                            : "Proof of Income / Payslip"}
                        </option>
                        <option value="BANK_STATEMENT">
                          {isSelfEmployedFlow
                            ? "6 Months Bank Statement"
                            : "Bank Statement"}
                        </option>
                        <option value="PROOF_OF_RESIDENCE">
                          Proof of Residence
                        </option>
                        <option value="DRIVERS_LICENSE">
                          Driver's License
                        </option>
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

                  <div className="rounded-[20px] border-2 border-dashed border-[#cdd5e8] bg-gradient-to-br from-[#fafbff] via-white to-[#f4f7ff] p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white shadow-[0_10px_24px_-8px_rgba(47,103,222,0.45)]">
                        <IconUpload />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#1b2345]">
                          Choose files to upload
                        </p>
                        <p className="mt-1 text-[12px] text-[#68708a]">
                          PDF, JPG, PNG, WEBP · Multiple files allowed
                        </p>
                      </div>
                    </div>

                    <input
                      type="file"
                      name="files"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.webp,image/*"
                      required
                      className="w-full cursor-pointer rounded-xl border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-[#eef4ff] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#2f67de]"
                    />

                    <button
                      type="submit"
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(47,103,222,0.45)] transition hover:from-[#2559c6] hover:to-[#3568d6]"
                    >
                      Upload Document(s)
                    </button>

                    <p className="mt-3 text-[12px] leading-6 text-[#68708a]">
                      On most devices, this supports files, photos and camera capture.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="p-5 sm:p-6">
                  <div className="rounded-[20px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
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
                          {documentsLockMessage}
                        </p>
                      </div>
                    </div>

                    <Link
                      href="/portal"
                      className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1d2240] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a3563]"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-[24px] border border-[#e1e4ee] bg-white p-5 shadow-[0_10px_28px_-14px_rgba(15,23,42,0.10)] sm:p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#68708a]">
                Quick Summary
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                    Reference
                  </p>
                  <p className="mt-1 font-mono text-[13px] font-semibold text-[#1b2345]">
                    {application.referenceNumber}
                  </p>
                </div>

                <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                    Current Status
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">
                    {formatStatus(application.status)}
                  </p>
                </div>

                <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                    Preferred Vehicle
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">
                    {application.preferredVehicle}
                  </p>
                </div>
              </div>
            </section>

            <div className="flex flex-col items-center justify-between gap-4 rounded-[20px] border border-[#e1e4ee] bg-gradient-to-r from-[#fafbff] to-white px-5 py-4 sm:flex-row">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2f67de]">
                  <IconLock />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                    Secure Session
                  </p>
                  <p className="text-sm font-semibold text-[#1b2345]">
                    Auto Access · Document Portal
                  </p>
                </div>
              </div>

              <Link
                href="/portal"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1d2240] bg-[#1d2240] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a3563] sm:w-auto"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}