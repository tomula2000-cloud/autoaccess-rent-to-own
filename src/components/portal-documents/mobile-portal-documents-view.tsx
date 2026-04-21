import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import PortalMobileShell from "@/components/portal-mobile/portal-mobile-shell";
import PortalMobileTopbar from "@/components/portal-mobile/portal-mobile-topbar";
import PortalMobileHero from "@/components/portal-mobile/portal-mobile-hero";
import PortalMobileStatRow from "@/components/portal-mobile/portal-mobile-stat-row";
import PortalMobileSectionCard from "@/components/portal-mobile/portal-mobile-section-card";
import PortalMobileFooterBar from "@/components/portal-mobile/portal-mobile-footer-bar";
import { portalMobileThemes } from "@/components/portal-mobile/portal-mobile-theme";
import DocumentUploadWizard from "@/components/portal-documents/document-upload-wizard";

type DocumentItem = {
  id: string;
  fileName: string;
  documentType: string;
  createdAt: Date | string;
};

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
  submitted: boolean;
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatCompactDateTime(value: Date | string | null | undefined) {
  if (!value) return null;
  return new Date(value).toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getDocumentsTheme(status: string) {
  switch (status) {
    case "DOCUMENTS_SUBMITTED":
    case "DOCUMENTS_UNDER_REVIEW":
      return portalMobileThemes.invoice;
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return portalMobileThemes.contract;
    case "DECLINED":
      return portalMobileThemes.danger;
    case "COMPLETED":
    case "PAYMENT_CONFIRMED":
      return portalMobileThemes.success;
    default:
      return portalMobileThemes.neutral;
  }
}

function getDocumentsHeroCopy(status: string) {
  switch (status) {
    case "AWAITING_DOCUMENTS":
      return {
        eyebrow: "Auto Access · Document Center",
        title: "Upload your required documents",
        description:
          "Submit the supporting files needed to move your application into review.",
      };
    case "DOCUMENTS_SUBMITTED":
      return {
        eyebrow: "Auto Access · Document Center",
        title: "Documents submitted successfully",
        description:
          "Your uploads have been received and linked to your application.",
      };
    case "DOCUMENTS_UNDER_REVIEW":
      return {
        eyebrow: "Auto Access · Document Center",
        title: "Your documents are under review",
        description:
          "Our team is reviewing your submitted files and preparing the next step.",
      };
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return {
        eyebrow: "Auto Access · Document Center",
        title: "Additional documents required",
        description:
          "Please upload the outstanding supporting documents requested.",
      };
    default:
      return {
        eyebrow: "Auto Access · Document Center",
        title: "Complete your application documents",
        description:
          "Securely submit your required files and keep your application moving.",
      };
  }
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

function IconLock() {
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
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
    where: { referenceNumber },
    select: {
      id: true,
      referenceNumber: true,
      email: true,
      status: true,
      preferredVehicle: true,
      employmentStatus: true,
      documents: {
        orderBy: { createdAt: "desc" },
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
      submitted: submittedTypes.has("BANK_STATEMENT"),
    },
    {
      key: "PROOF_OF_RESIDENCE",
      title: "Proof of Residence",
      note: "One or more uploads if needed.",
      submitted: submittedTypes.has("PROOF_OF_RESIDENCE"),
    },
    {
      key: "DRIVERS_LICENSE",
      title: "Driver's License",
      note: "Single clear upload or photo.",
      submitted: submittedTypes.has("DRIVERS_LICENSE"),
    },
  ];

  const allRequiredSubmitted = requiredDocs.every((doc) => doc.submitted);
  const submittedCount = requiredDocs.filter((d) => d.submitted).length;
  const totalRequired = requiredDocs.length;
  const completionPct = Math.round((submittedCount / totalRequired) * 100);

  const documentsStageLockedStatuses = new Set([
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
    application.status === "DECLINED"
      ? "This application is no longer active. Document uploads are now locked."
      : "Your application has progressed beyond the document stage. Further uploads are locked.";

  const theme = getDocumentsTheme(application.status);
  const heroCopy = getDocumentsHeroCopy(application.status);

  return (
    <PortalMobileShell>
      <PortalMobileTopbar rightHref="/portal" rightLabel="Dashboard" />

      <PortalMobileHero
        theme={theme}
        eyebrow={heroCopy.eyebrow}
        title={heroCopy.title}
        description={heroCopy.description}
        statusLabel={formatStatus(application.status)}
        referenceNumber={application.referenceNumber}
        selectionText={application.preferredVehicle || "No preferred vehicle"}
      />

      {/* ── Success / Error banners ── */}
      {params.success ? (
        <div className="mt-4 overflow-hidden rounded-[16px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
              <IconCheck />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                Upload Successful
              </p>
              <p className="mt-1 text-[12.5px] font-semibold leading-5 text-emerald-900">
                {params.success}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {params.error ? (
        <div className="mt-4 overflow-hidden rounded-[16px] border border-red-200 bg-gradient-to-r from-red-50 via-white to-rose-50 p-3.5">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 text-white">
              <IconAlert />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">
                Upload Issue
              </p>
              <p className="mt-1 text-[12.5px] font-semibold leading-5 text-red-900">
                {params.error}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <PortalMobileStatRow
        items={[
          {
            label: "Submitted",
            value: `${submittedCount}/${totalRequired}`,
          },
          {
            label: "Complete",
            value: `${completionPct}%`,
            tone: "blue",
          },
          {
            label: "Uploads",
            value: application.documents.length > 0 ? "Received" : "Pending",
            tone: application.documents.length > 0 ? "green" : "default",
          },
        ]}
      />

      {/* ── Required Documents Checklist ── */}
      <PortalMobileSectionCard
        eyebrow="Checklist"
        title="Required documents"
        badge={`${submittedCount}/${totalRequired}`}
      >
        <div className="space-y-2">
          {isSelfEmployedFlow ? (
            <div className="rounded-[14px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">
                Self-Employed Rule
              </p>
              <p className="mt-1 text-[12px] leading-5 text-[#39425d]">
                Payslip is replaced with a 6-month bank statement for this
                application type.
              </p>
            </div>
          ) : null}

          {/* Compressed checklist — divided list instead of individual cards */}
          <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] divide-y divide-[#eef0f8]">
            {requiredDocs.map((doc, index) => (
              <div
                key={doc.key}
                className="flex items-center gap-3 px-3.5 py-2.5"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-semibold ${
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
                  <p className="text-[12.5px] font-semibold text-[#1b2345]">
                    {doc.title}
                  </p>
                  <p className="text-[11px] text-[#68708a]">{doc.note}</p>
                </div>

                {doc.submitted ? (
                  <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                    Done
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full border border-[#f1dfd1] bg-[#fbf2ea] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#c37d43]">
                    Needed
                  </span>
                )}
              </div>
            ))}
          </div>

          {!documentsStageLocked ? (
            <form action="/api/portal-documents/complete" method="POST">
              <button
                type="submit"
                disabled={!allRequiredSubmitted}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition ${
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
          ) : null}
        </div>
      </PortalMobileSectionCard>

      {/* ── Document Upload Wizard ── */}
      <PortalMobileSectionCard
        eyebrow="Encrypted"
        title="Secure upload vault"
      >
        <DocumentUploadWizard
          isSelfEmployedFlow={isSelfEmployedFlow}
          submittedTypes={Array.from(submittedTypes)}
          documentsStageLocked={documentsStageLocked}
          isMobile={true}
        />
      </PortalMobileSectionCard>

      {/* ── Submitted Files ── */}
      <PortalMobileSectionCard
        eyebrow="Submitted Files"
        title="Documents overview"
        badge={
          application.documents.length > 0
            ? `${application.documents.length} file${application.documents.length > 1 ? "s" : ""}`
            : "Pending"
        }
      >
        {application.documents.length === 0 ? (
          <div className="rounded-[14px] border-2 border-dashed border-[#d7d9e2] bg-[#fafbff] p-6 text-center">
            <p className="text-[13px] font-semibold text-[#1b2345]">
              No documents submitted yet
            </p>
            <p className="mt-1.5 text-[12px] leading-5 text-[#68708a]">
              Once submitted, your files will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {application.documents
              .slice(0, 3)
              .map((document: DocumentItem) => (
                <div
                  key={document.id}
                  className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] px-3.5 py-3"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                      <IconFile />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-semibold text-[#1b2345]">
                            {document.fileName}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#68708a]">
                            {document.documentType.replaceAll("_", " ")}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#68708a]">
                            {formatCompactDateTime(document.createdAt)}
                          </p>
                        </div>

                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Received
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {application.documents.length > 3 ? (
              <details className="group rounded-[14px] border border-[#e1e4ee] bg-[#fafbff]">
                <summary className="flex cursor-pointer list-none items-center justify-center gap-2 px-4 py-3 text-[12px] font-semibold text-[#1b2345] marker:content-none">
                  View {application.documents.length - 3} more file
                  {application.documents.length - 3 > 1 ? "s" : ""}
                  <svg
                    className="h-4 w-4 transition group-open:rotate-180"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>

                <div className="space-y-2 border-t border-[#e7eaf2] p-3">
                  {application.documents
                    .slice(3)
                    .map((document: DocumentItem) => (
                      <div
                        key={document.id}
                        className="rounded-[12px] border border-[#e8ecf5] bg-white px-3.5 py-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white">
                            <IconFile />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[12.5px] font-semibold text-[#1b2345]">
                              {document.fileName}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#68708a]">
                              {document.documentType.replaceAll("_", " ")}
                            </p>
                            <p className="mt-0.5 text-[11px] text-[#68708a]">
                              {formatCompactDateTime(document.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </details>
            ) : null}
          </div>
        )}
      </PortalMobileSectionCard>

      <PortalMobileFooterBar href="/portal" label="Back to Dashboard" />
    </PortalMobileShell>
  );
}