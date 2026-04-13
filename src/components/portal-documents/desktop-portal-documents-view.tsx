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
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] px-4 py-6 text-black sm:px-6 md:py-10">
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
        <div className="hidden md:block">
          <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] p-10 shadow-[0_30px_80px_-20px_rgba(11,21,50,0.55)]">
            <div className="absolute inset-0">
              <div className="absolute -left-20 -top-20 h-[420px] w-[420px] rounded-full bg-[#2f67de]/25 blur-3xl" />
              <div className="absolute -right-16 top-10 h-[340px] w-[340px] rounded-full bg-[#d59758]/15 blur-3xl" />
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-blue-200/90">
                    Auto Access · Document Center
                  </p>
                </div>

                <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-[2.85rem]">
                  Secure document
                  <br />
                  <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                    submission center.
                  </span>
                </h1>

                <p className="mt-5 max-w-xl text-[15px] leading-7 text-blue-50/75">
                  Upload your required documents in a secure, encrypted environment.
                  Multi-page files may be submitted in parts and tracked from this
                  premium workspace.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
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

              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#2f67de]/30 blur-2xl" />
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] backdrop-blur-xl">
                    <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="44"
                        stroke="url(#docGrad)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${(completionPct / 100) * 276} 276`}
                      />
                      <defs>
                        <linearGradient id="docGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#7ea8ff" />
                          <stop
                            offset="100%"
                            stopColor={allRequiredSubmitted ? "#6fb482" : "#f4c89a"}
                          />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="text-center">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/70">
                        Submitted
                      </p>
                      <p className="mt-1 text-3xl font-semibold tabular-nums text-white">
                        {submittedCount}
                        <span className="text-lg text-blue-200/60">/{totalRequired}</span>
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium text-blue-200/60">
                        {completionPct}% complete
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-6 overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2">
          <div className="rounded-[26px] bg-white p-5 md:p-7">
            <div className="md:hidden text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2f67de]">
                Auto Access Document Center
              </p>
              <h1 className="mt-3 text-[1.7rem] font-semibold tracking-tight text-[#1c2340]">
                Upload Your Documents
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                Upload the required documents for your application. Multi-page files
                may be submitted in parts.
              </p>
            </div>

            {params.success ? (
              <div className="mt-5 overflow-hidden rounded-[20px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-5 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.3)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_8px_18px_-6px_rgba(16,185,129,0.55)]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-700">
                      Upload Successful
                    </p>
                    <p className="mt-1.5 break-words text-sm font-semibold text-emerald-900">
                      {params.success}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            {params.error ? (
              <div className="mt-5 overflow-hidden rounded-[20px] border border-red-200 bg-gradient-to-r from-red-50 via-white to-rose-50 p-5 shadow-[0_8px_24px_-12px_rgba(220,38,38,0.3)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_8px_18px_-6px_rgba(220,38,38,0.5)]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-red-700">
                      Upload Issue
                    </p>
                    <p className="mt-1.5 break-words text-sm font-semibold text-red-900">
                      {params.error}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-[#2f67de]/30 hover:shadow-[0_12px_30px_-12px_rgba(47,103,222,0.2)]">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-[#2f67de]/10 to-transparent blur-2xl" />
                <div className="relative flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white shadow-[0_8px_18px_-6px_rgba(47,103,222,0.5)]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 11H7a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-2" />
                      <rect x="9" y="3" width="6" height="8" rx="1" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                      Reference
                    </p>
                    <p className="mt-1.5 break-words font-mono text-[0.95rem] font-semibold text-[#1b2345]">
                      {application.referenceNumber}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-[#d59758]/30 hover:shadow-[0_12px_30px_-12px_rgba(213,151,88,0.2)]">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-[#d59758]/10 to-transparent blur-2xl" />
                <div className="relative flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#d59758] to-[#e4ad72] text-white shadow-[0_8px_18px_-6px_rgba(213,151,88,0.5)]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                      Current Status
                    </p>
                    <p className="mt-1.5 break-words text-[0.95rem] font-semibold text-[#1b2345]">
                      {formatStatus(application.status)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-emerald-300 hover:shadow-[0_12px_30px_-12px_rgba(16,185,129,0.2)]">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/10 to-transparent blur-2xl" />
                <div className="relative flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_8px_18px_-6px_rgba(16,185,129,0.5)]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
                      <circle cx="6.5" cy="16.5" r="2.5" />
                      <circle cx="16.5" cy="16.5" r="2.5" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                      Preferred Vehicle
                    </p>
                    <p className="mt-1.5 break-words text-[0.95rem] font-semibold text-[#1b2345]">
                      {application.preferredVehicle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-[#1b2345]/30 hover:shadow-[0_12px_30px_-12px_rgba(27,35,69,0.2)]">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-[#1b2345]/10 to-transparent blur-2xl" />
                <div className="relative flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_8px_18px_-6px_rgba(27,35,69,0.5)]">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="9" y1="15" x2="15" y2="15" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                      Submitted
                    </p>
                    <p className="mt-1.5 text-[0.95rem] font-semibold text-[#1b2345]">
                      <span className="text-xl font-semibold tabular-nums">
                        {submittedCount}
                      </span>
                      <span className="text-[#68708a]"> / {totalRequired} required</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-gradient-to-br from-white to-[#fafbff] shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                        <svg
                          className="h-4 w-4 text-[#f4c89a]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 11l3 3L22 4" />
                          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                          Checklist
                        </p>
                        <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">
                          Required Documents
                        </h2>
                      </div>
                    </div>
                    <span className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur sm:inline-flex">
                      <span className="tabular-nums">
                        {submittedCount}/{totalRequired}
                      </span>{" "}
                      Submitted
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        allRequiredSubmitted
                          ? "bg-gradient-to-r from-emerald-400 to-emerald-300"
                          : "bg-gradient-to-r from-[#7ea8ff] to-[#f4c89a]"
                      }`}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  {isSelfEmployedFlow ? (
                    <div className="mb-5 flex items-start gap-3 rounded-[16px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#d59758] shadow-sm">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                          Self-Employed / Business Owner Rule
                        </p>
                        <p className="mt-1.5 text-sm leading-6 text-[#39425d]">
                          For this application type, the payslip requirement is
                          replaced with a 6 Months Bank Statement.
                        </p>
                      </div>
                    </div>
                  ) : null}

                  <div className="divide-y divide-[#eef0f7]">
                    {requiredDocs.map((doc, index) => (
                      <div
                        key={doc.key}
                        className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-semibold tabular-nums transition ${
                            doc.submitted
                              ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_6px_14px_-4px_rgba(16,185,129,0.5)]"
                              : "bg-[#eef0f7] text-[#68708a]"
                          }`}
                        >
                          {doc.submitted ? (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            String(index + 1).padStart(2, "0")
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#1b2345]">
                                {doc.title}
                              </p>
                              <p className="mt-1 text-[13px] leading-6 text-[#68708a]">
                                {doc.note}
                              </p>
                            </div>

                            {doc.submitted ? (
                              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Submitted
                              </span>
                            ) : (
                              <span className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-[#f1dfd1] bg-[#fbf2ea] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d59758]" />
                                Awaiting
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!documentsStageLocked ? (
                    <form
                      action="/api/portal-documents/complete"
                      method="POST"
                      className="mt-6 border-t border-[#eef0f7] pt-5"
                    >
                      <button
                        type="submit"
                        disabled={!allRequiredSubmitted}
                        className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white transition ${
                          allRequiredSubmitted
                            ? "bg-gradient-to-r from-emerald-600 to-emerald-700 shadow-[0_14px_30px_-10px_rgba(16,185,129,0.55)] hover:from-emerald-700 hover:to-emerald-800 hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.7)]"
                            : "cursor-not-allowed bg-gradient-to-r from-[#a3b3d6] to-[#b8c6e2]"
                        }`}
                      >
                        {allRequiredSubmitted ? (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Confirm All Documents Submitted
                            <svg
                              className="h-4 w-4 transition group-hover:translate-x-0.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="5" y1="12" x2="19" y2="12" />
                              <polyline points="12 5 19 12 12 19" />
                            </svg>
                          </>
                        ) : (
                          "I have submitted all my documents"
                        )}
                      </button>
                      {!allRequiredSubmitted ? (
                        <p className="mt-3 text-center text-[13px] leading-6 text-[#68708a]">
                          Submit every required document above to enable final
                          confirmation.
                        </p>
                      ) : null}
                    </form>
                  ) : (
                    <div className="mt-6 border-t border-[#eef0f7] pt-5">
                      <div className="rounded-[18px] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-[0_8px_18px_-6px_rgba(245,158,11,0.45)]">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0110 0v4" />
                            </svg>
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
                    </div>
                  )}
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                        <svg
                          className="h-4 w-4 text-[#9cc0ff]"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9cc0ff]">
                          Encrypted
                        </p>
                        <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">
                          Secure Upload Vault
                        </h2>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      Secure
                    </span>
                  </div>
                </div>

                {!documentsStageLocked ? (
                  <form
                    action="/api/portal-documents"
                    method="POST"
                    encType="multipart/form-data"
                    className="space-y-5 p-5 sm:p-6"
                  >
                    <div>
                      <label
                        htmlFor="documentType"
                        className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#eef4ff] text-[#2f67de]">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </span>
                        Document Type
                      </label>

                      <div className="relative">
                        <select
                          id="documentType"
                          name="documentType"
                          defaultValue="ID_DOCUMENT"
                          className="w-full appearance-none rounded-2xl border border-[#dde1ee] bg-white px-4 py-3.5 pr-10 text-sm font-medium text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 sm:text-base"
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
                            Driver&apos;s License
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

                    <div className="flex items-start gap-3 rounded-[16px] border border-[#dbe6ff] bg-gradient-to-r from-[#eef4ff] to-white p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#2f67de] shadow-sm">
                        <svg
                          width="14"
                          height="14"
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
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f67de]">
                          Encrypted Upload Channel
                        </p>
                        <p className="mt-1 text-[13px] leading-6 text-[#39425d]">
                          Choose a file from your device or use a camera-enabled
                          phone to capture and upload directly.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-[#fbf2ea] text-[#d59758]">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </span>
                        Upload File
                      </label>

                      <div className="rounded-[20px] border-2 border-dashed border-[#cdd5e8] bg-gradient-to-br from-[#fafbff] via-white to-[#f4f7ff] p-5 transition hover:border-[#2f67de]/50 hover:bg-[#f4f7ff]">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                          <div className="min-w-0 flex-1">
                            <div className="mb-3 flex items-center gap-3">
                              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white shadow-[0_12px_28px_-8px_rgba(47,103,222,0.5)]">
                                <svg
                                  width="20"
                                  height="20"
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
                              className="w-full cursor-pointer rounded-xl border border-[#dde1ee] bg-white px-4 py-3 text-sm text-[#1b2345] outline-none transition file:mr-3 file:rounded-lg file:border-0 file:bg-[#eef4ff] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#2f67de] hover:file:bg-[#dbe6ff] focus:border-[#2f67de] sm:text-base"
                            />
                          </div>

                          <button
                            type="submit"
                            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(47,103,222,0.5)] transition hover:from-[#2559c6] hover:to-[#3568d6] hover:shadow-[0_16px_36px_-10px_rgba(47,103,222,0.65)] lg:w-auto"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            Upload Document(s)
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-[12px] leading-6 text-[#68708a]">
                        On most phones, this single option allows access to files,
                        photos and camera capture.
                      </p>
                    </div>
                  </form>
                ) : (
                  <div className="p-5 sm:p-6">
                    <div className="rounded-[20px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-[0_10px_24px_-8px_rgba(245,158,11,0.5)]">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
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

                      <div className="mt-5">
                        <Link
                          href="/portal"
                          className="inline-flex items-center gap-2 rounded-full bg-[#1d2240] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2a3563]"
                        >
                          Go to Dashboard
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                      <svg
                        className="h-4 w-4 text-[#f4c89a]"
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
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                        Submitted Files
                      </p>
                      <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">
                        Submission Status
                      </h2>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] backdrop-blur ${
                      application.documents.length > 0
                        ? "border-emerald-300/40 bg-emerald-500/15 text-emerald-200"
                        : "border-white/20 bg-white/10 text-white"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        application.documents.length > 0
                          ? "bg-emerald-300"
                          : "bg-white/60"
                      }`}
                    />
                    {application.documents.length > 0 ? "Submitted" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                {application.documents.length === 0 ? (
                  <div className="rounded-[20px] border-2 border-dashed border-[#d7d9e2] bg-gradient-to-br from-[#fafbff] to-white p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef0f7] text-[#68708a]">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <p className="mt-3 text-base font-semibold text-[#1b2345]">
                      No documents submitted yet
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[#68708a]">
                      Once submitted, your files will be marked here as received.
                    </p>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-[20px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 sm:p-6">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
                    <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-green-200/30 blur-3xl" />

                    <div className="relative">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.55)]">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                            Vault Status
                          </p>
                          <p className="mt-1 text-base font-semibold text-emerald-900 sm:text-lg">
                            Documents successfully received
                          </p>
                          <p className="mt-1 text-[13px] leading-6 text-[#4d546a]">
                            Your uploaded files have been received securely and linked
                            to your application.
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/80 bg-white/90 p-4 backdrop-blur">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                              Files Submitted
                            </p>
                          </div>
                          <p className="mt-2 text-3xl font-semibold tabular-nums text-[#1b2345]">
                            {application.documents.length}
                          </p>
                        </div>

                        <div className="rounded-2xl border border-white/80 bg-white/90 p-4 backdrop-blur">
                          <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[#2f67de]">
                              <svg
                                width="13"
                                height="13"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                              Latest Submission
                            </p>
                          </div>
                          <p className="mt-2 break-words text-sm font-semibold text-[#1b2345]">
                            {latestUploadedAt || "Received"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 rounded-2xl border border-white/80 bg-white/90 p-4 backdrop-blur">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-[#d59758]">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                              <line x1="7" y1="7" x2="7.01" y2="7" />
                            </svg>
                          </div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                            Submitted Document Types
                          </p>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {application.documents.map((document: DocumentItem) => (
                            <span
                              key={document.id}
                              className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700"
                            >
                              <svg
                                width="11"
                                height="11"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                              </svg>
                              {formatStatus(document.documentType)}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-[20px] border border-[#e1e4ee] bg-gradient-to-r from-[#fafbff] to-white px-5 py-4 sm:flex-row">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2f67de]">
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
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">
                    Secure Session
                  </p>
                  <p className="text-sm font-semibold text-[#1b2345]">
                    Auto Access · Encrypted Document Vault
                  </p>
                </div>
              </div>

              <Link
                href="/portal"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1d2240] bg-[#1d2240] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a3563] sm:w-auto"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}