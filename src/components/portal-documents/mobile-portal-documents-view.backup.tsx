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

function IconFolder() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconLock() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconUpload() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg
      className="h-3.5 w-3.5"
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

function IconAlert() {
  return (
    <svg
      className="h-4 w-4"
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

function IconClock() {
  return (
    <svg
      className="h-4 w-4"
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

function IconFile() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

export default async function MobilePortalDocumentsView({
  searchParams,
}: PageProps) {
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
        ? "Upload latest 6 months statement."
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
        ? "Covered by the 6 months statement above."
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
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,222,0.08),transparent_55%),radial-gradient(circle_at_top_right,rgba(213,151,88,0.06),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-[430px] px-4 pb-8 pt-4">
        <div className="flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_8px_18px_-6px_rgba(27,35,69,0.5)]">
              <IconFolder />
            </div>
            <p className="text-[17px] font-semibold text-[#1b2345]">
              Auto<span className="text-[#d59758]">Access</span>
            </p>
          </Link>

          <Link
            href="/portal"
            className="rounded-full border border-[#2f67de] px-4 py-2 text-[12px] font-semibold text-[#2f67de]"
          >
            Dashboard
          </Link>
        </div>

        <section className="relative mt-4 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 pb-6 pt-7 shadow-[0_24px_60px_-20px_rgba(11,21,50,0.55)]">
          <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-[#2f67de]/25 blur-3xl" />
          <div className="absolute -bottom-10 right-0 h-36 w-36 rounded-full bg-[#d59758]/15 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-blue-200/90">
                Auto Access · Document Center
              </p>
            </div>

            <h1 className="mt-5 text-[1.9rem] font-semibold leading-[1.05] tracking-tight text-white">
              Complete your
              <br />
              <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                application documents.
              </span>
            </h1>

            <p className="mt-4 text-[14px] leading-7 text-blue-50/75">
              Securely submit your required documents and keep your application moving.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#f4c89a]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                {formatStatus(application.status)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-[10px] font-medium text-blue-50/85">
                Ref <span className="font-mono">{application.referenceNumber}</span>
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-[18px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100/75">
                  Submitted
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {submittedCount}
                  <span className="text-base text-blue-200/60">/{totalRequired}</span>
                </p>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100/75">
                  Completion
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {completionPct}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {params.success ? (
          <div className="mt-4 overflow-hidden rounded-[20px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-4 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.25)]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                <IconCheck />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Upload Successful
                </p>
                <p className="mt-1.5 text-[13px] font-semibold leading-6 text-emerald-900">
                  {params.success}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {params.error ? (
          <div className="mt-4 overflow-hidden rounded-[20px] border border-red-200 bg-gradient-to-r from-red-50 via-white to-rose-50 p-4 shadow-[0_8px_24px_-12px_rgba(220,38,38,0.22)]">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white">
                <IconAlert />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-700">
                  Upload Issue
                </p>
                <p className="mt-1.5 text-[13px] font-semibold leading-6 text-red-900">
                  {params.error}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <section className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[20px] border border-[#e1e4ee] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
              Preferred Vehicle
            </p>
            <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-5 text-[#1b2345]">
              {application.preferredVehicle}
            </p>
          </div>

          <div className="rounded-[20px] border border-[#e1e4ee] bg-white p-4 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
              Latest Upload
            </p>
            <p className="mt-2 line-clamp-2 text-[13px] font-semibold leading-5 text-[#1b2345]">
              {latestUploadedAt || "No uploads yet"}
            </p>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                  Checklist
                </p>
                <h2 className="text-[1.08rem] font-semibold text-white">
                  Required documents
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                {submittedCount}/{totalRequired}
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

          <div className="p-4">
            {isSelfEmployedFlow ? (
              <div className="mb-4 flex items-start gap-3 rounded-[16px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#d59758] shadow-sm">
                  <IconAlert />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                    Self-Employed Rule
                  </p>
                  <p className="mt-1.5 text-[13px] leading-6 text-[#39425d]">
                    Payslip is replaced with a 6 months bank statement for this application type.
                  </p>
                </div>
              </div>
            ) : null}

            <div className="space-y-2.5">
              {requiredDocs.map((doc, index) => (
                <div
                  key={doc.key}
                  className="rounded-[16px] border border-[#e8ecf5] bg-[#fbfcff] px-3.5 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[11px] font-semibold ${
                        doc.submitted
                          ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white"
                          : "bg-[#eef0f7] text-[#68708a]"
                      }`}
                    >
                      {doc.submitted ? <IconCheck /> : String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13.5px] font-semibold leading-5 text-[#1b2345]">
                            {doc.title}
                          </p>

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

                        <p className="text-[12px] leading-5 text-[#68708a]">
                          {doc.note}
                        </p>
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
                className="mt-4"
              >
                <button
                  type="submit"
                  disabled={!allRequiredSubmitted}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition ${
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
              <div className="mt-4 rounded-[18px] border border-amber-200 bg-gradient-to-r from-amber-50 via-white to-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white">
                    <IconLock />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">
                      Documents Stage Locked
                    </p>
                    <p className="mt-1.5 text-[13px] leading-6 text-[#39425d]">
                      {documentsLockMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#9cc0ff]">
              Encrypted
            </p>
            <h2 className="text-[1.08rem] font-semibold text-white">
              Secure upload vault
            </h2>
          </div>

          {!documentsStageLocked ? (
            <form
              action="/api/portal-documents"
              method="POST"
              encType="multipart/form-data"
              className="space-y-4 p-4"
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
                    <option value="PROOF_OF_RESIDENCE">Proof of Residence</option>
                    <option value="DRIVERS_LICENSE">Driver's License</option>
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

              <div className="rounded-[18px] border-2 border-dashed border-[#cdd5e8] bg-gradient-to-br from-[#fafbff] via-white to-[#f4f7ff] p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white shadow-[0_10px_24px_-8px_rgba(47,103,222,0.45)]">
                    <IconUpload />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-semibold text-[#1b2345]">
                      Choose files to upload
                    </p>
                    <p className="mt-1 text-[11.5px] text-[#68708a]">
                      PDF, JPG, PNG, WEBP · Multiple allowed
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
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(47,103,222,0.45)]"
                >
                  Upload Document(s)
                  <IconArrow />
                </button>

                <p className="mt-3 text-[11.5px] leading-5 text-[#68708a]">
                  On most phones, this supports files, photos, and camera capture.
                </p>
              </div>
            </form>
          ) : (
            <div className="p-4">
              <div className="rounded-[18px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
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
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1d2240] px-5 py-3 text-sm font-semibold text-white"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="mt-4 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                  Submitted Files
                </p>
                <h2 className="text-[1.08rem] font-semibold text-white">
                  Documents overview
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
                    application.documents.length > 0 ? "bg-emerald-500" : "bg-slate-400"
                  }`}
                />
                {application.documents.length > 0 ? "Submitted" : "Pending"}
              </span>
            </div>
          </div>

          <div className="p-4">
            {application.documents.length === 0 ? (
              <div className="rounded-[20px] border-2 border-dashed border-[#d7d9e2] bg-gradient-to-br from-[#fafbff] to-white p-6 text-center">
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
                    className="rounded-[16px] border border-[#e8ecf5] bg-[#fbfcff] px-3.5 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                        <IconFile />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[13.5px] font-semibold text-[#1b2345]">
                              {document.fileName}
                            </p>
                            <p className="mt-1 text-[11.5px] leading-5 text-[#68708a]">
                              {document.documentType.replaceAll("_", " ")}
                            </p>
                            <p className="mt-0.5 text-[11.5px] leading-5 text-[#68708a]">
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

        <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-[20px] border border-[#e1e4ee] bg-gradient-to-r from-[#fafbff] to-white px-5 py-4">
          <div className="flex items-center gap-3 text-center">
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
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1d2240] bg-[#1d2240] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a3563]"
          >
            Back to Dashboard
            <IconArrow />
          </Link>
        </div>
      </div>
    </main>
  );
}