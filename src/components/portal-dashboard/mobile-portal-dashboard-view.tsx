import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApprovalCountdownCard from "@/components/approval-countdown-card";
import PortalApplicationProgressCard from "@/components/portal-application-progress-card";
import ContractReviewModal from "@/components/contract-review-modal";
import InvoiceDownloadButton from "@/components/invoice-download-button";
import ProofOfPaymentUpload from "@/components/proof-of-payment-upload";
import PortalMobileShell from "@/components/portal-mobile/portal-mobile-shell";
import PortalMobileTopbar from "@/components/portal-mobile/portal-mobile-topbar";
import PortalMobileHero from "@/components/portal-mobile/portal-mobile-hero";
import PortalMobileStatRow from "@/components/portal-mobile/portal-mobile-stat-row";
import PortalMobileSectionCard from "@/components/portal-mobile/portal-mobile-section-card";
import PortalMobileFooterBar from "@/components/portal-mobile/portal-mobile-footer-bar";
import { portalMobileThemes } from "@/components/portal-mobile/portal-mobile-theme";
import { getCompactCountdown } from "@/components/portal-mobile/portal-mobile-utils";
import PortalStatusPoller from "@/components/portal-status-poller";

type StatusLogItem = {
  id: string;
  toStatus: string;
  note: string | null;
  createdAt: Date | string;
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function parseMoney(value: string) {
  const cleaned = value.replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
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

function getStatusLabel(status: string) {
  switch (status) {
    case "APPROVED_IN_PRINCIPLE": return "Approved";
    case "CONTRACT_REQUESTED": return "Contract Requested";
    case "CONTRACT_ISSUED": return "Contract Issued";
    case "CONTRACT_EXPIRED": return "Contract Expired";
    case "CONTRACT_CANCELLED": return "Contract Cancelled";
    case "AWAITING_INVOICE": return "Awaiting Invoice";
    case "INVOICE_ISSUED": return "Invoice Issued";
    case "PAYMENT_CONFIRMED":
    case "COMPLETED": return "Completed";
    case "DOCUMENTS_UNDER_REVIEW":
    case "PRE_QUALIFICATION_REVIEW":
    case "PAYMENT_UNDER_VERIFICATION": return "Pending Review";
    case "AWAITING_DOCUMENTS":
    case "ADDITIONAL_DOCUMENTS_REQUIRED": return "Documents Needed";
    case "AWAITING_PAYMENT": return "Payment Needed";
    default: return formatStatus(status);
  }
}

function getProgressState(status: string) {
  switch (status) {
    case "APPLICATION_RECEIVED": return 18;
    case "PRE_QUALIFICATION_REVIEW": return 30;
    case "PRE_QUALIFIED": return 42;
    case "AWAITING_DOCUMENTS":
    case "ADDITIONAL_DOCUMENTS_REQUIRED": return 55;
    case "DOCUMENTS_SUBMITTED": return 65;
    case "DOCUMENTS_UNDER_REVIEW": return 72;
    case "APPROVED_IN_PRINCIPLE": return 82;
    case "CONTRACT_REQUESTED": return 86;
    case "CONTRACT_ISSUED":
    case "AWAITING_INVOICE":
    case "INVOICE_ISSUED":
    case "AWAITING_PAYMENT": return 90;
    case "PAYMENT_UNDER_VERIFICATION": return 94;
    case "PAYMENT_CONFIRMED":
    case "COMPLETED": return 100;
    default: return 28;
  }
}

function getDashboardTheme(status: string) {
  switch (status) {
    case "APPROVED_IN_PRINCIPLE": return portalMobileThemes.approved;
    case "CONTRACT_REQUESTED":
    case "CONTRACT_ISSUED":
    case "AWAITING_INVOICE":
    case "INVOICE_ISSUED":
    case "AWAITING_PAYMENT":
    case "PAYMENT_UNDER_VERIFICATION": return portalMobileThemes.contract;
    case "PAYMENT_CONFIRMED":
    case "COMPLETED": return portalMobileThemes.success;
    case "DECLINED":
    case "CONTRACT_EXPIRED":
    case "CONTRACT_CANCELLED": return portalMobileThemes.danger;
    default: return portalMobileThemes.neutral;
  }
}

function getHeroCopy(status: string) {
  switch (status) {
    case "APPLICATION_RECEIVED":
      return { eyebrow: "Auto Access · Client Portal", title: "Application received", description: "Your profile has been created. Upload your documents to move to the next step." };
    case "PRE_QUALIFICATION_REVIEW":
      return { eyebrow: "Auto Access · Client Portal", title: "Under review", description: "Your information is under early-stage assessment. Keep checking for updates." };
    case "PRE_QUALIFIED":
      return { eyebrow: "Auto Access · Client Portal", title: "Pre-qualified", description: "Your application passed the initial review. Upload your documents to continue." };
    case "AWAITING_DOCUMENTS":
      return { eyebrow: "Auto Access · Document Stage", title: "Documents required", description: "Upload your supporting documents to keep your application moving." };
    case "DOCUMENTS_SUBMITTED":
      return { eyebrow: "Auto Access · Document Stage", title: "Documents submitted", description: "Your files have been received and linked to your application." };
    case "DOCUMENTS_UNDER_REVIEW":
      return { eyebrow: "Auto Access · Document Stage", title: "Documents under review", description: "Our team is reviewing your submitted files and preparing the next step." };
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return { eyebrow: "Auto Access · Document Stage", title: "Additional documents needed", description: "More supporting documents are required before your application can continue." };
    case "APPROVED_IN_PRINCIPLE":
      return { eyebrow: "Auto Access · Client Portal", title: "Approval confirmed", description: "Your application has been approved in principle. Select your vehicle before your approval expires." };
    case "CONTRACT_REQUESTED":
      return { eyebrow: "Auto Access · Contract Stage", title: "Contract request submitted", description: "Your request has been received and is awaiting admin review before issue." };
    case "CONTRACT_ISSUED":
      return { eyebrow: "Auto Access · Contract Issued", title: "Your contract has been issued", description: "Review the full contract, complete your digital acceptance, and continue within the active window." };
    case "AWAITING_INVOICE":
      return { eyebrow: "Auto Access · Awaiting Invoice", title: "Contract accepted", description: "Your digital acceptance has been recorded. Keep checking your portal for invoice release." };
    case "INVOICE_ISSUED":
      return { eyebrow: "Auto Access · Invoice Stage", title: "Your invoice has been released", description: "Review the payment summary and instructions carefully, then prepare your payment." };
    case "AWAITING_PAYMENT":
      return { eyebrow: "Auto Access · Payment Stage", title: "Payment required", description: "Complete your payment using the correct reference number and keep proof of payment ready." };
    case "PAYMENT_UNDER_VERIFICATION":
      return { eyebrow: "Auto Access · Verification", title: "Payment under verification", description: "Your payment has been received and is currently being verified." };
    case "PAYMENT_CONFIRMED":
      return { eyebrow: "Auto Access · Completion", title: "Payment confirmed", description: "Your payment has been successfully confirmed and your application is progressing well." };
    case "COMPLETED":
      return { eyebrow: "Auto Access · Completion", title: "Application completed", description: "Your portal journey has been completed successfully. Welcome to Auto Access." };
    case "DECLINED":
      return { eyebrow: "Auto Access · Application Update", title: "Application update", description: "We are unable to proceed with your application at this stage. Please review any notes below." };
    case "CONTRACT_EXPIRED":
      return { eyebrow: "Auto Access · Contract Expired", title: "Contract window expired", description: "Your contract completion window has expired. Please contact our team for assistance." };
    case "CONTRACT_CANCELLED":
      return { eyebrow: "Auto Access · Cancelled", title: "Contract cancelled", description: "Your contract has been cancelled. Please contact our team if you have any questions." };
    default:
      return { eyebrow: "Auto Access · Client Portal", title: "Track your application", description: "Monitor your status, review next steps and manage your journey from one premium portal view." };
  }
}

const LICENSING_AND_REGISTRATION_FEE = 1850;

export default async function MobilePortalDashboardView() {
  const cookieStore = await cookies();
  const referenceNumber = cookieStore.get("autoaccess_portal_ref")?.value;
  const email = cookieStore.get("autoaccess_portal_email")?.value;

  if (!referenceNumber || !email) {
    redirect("/portal-login");
  }

  const application = await prisma.application.findUnique({
    where: { referenceNumber },
    select: {
      id: true,
      referenceNumber: true,
      fullName: true,
      email: true,
      phone: true,
      status: true,
      preferredVehicle: true,
      selectedVehicleId: true,
      approvalValidUntil: true,
      contractRequestedAt: true,
      contractIssuedAt: true,
      contractExpiresAt: true,
      contractCancelledAt: true,
      contractAccepted: true,
      contractAcceptedAt: true,
      contractAcceptedName: true,
      contractSignatureImage: true,
      contractSignedAt: true,
      createdAt: true,
      contractVehicleTitle: true,
      contractVehicleImage: true,
      contractVehicleYearModel: true,
      contractVehicleMileage: true,
      contractVehicleTransmission: true,
      contractVehicleFuelType: true,
      contractDepositAmount: true,
      contractLicensingFee: true,
      contractMonthlyPayment: true,
      contractTotalPayableNow: true,
      contractTerm: true,
      contractClientFullName: true,
      contractClientEmail: true,
      contractClientPhone: true,
      contractClientIdentityType: true,
      contractClientIdentityNumber: true,
      contractClientAddress: true,
      contractTerms: true,
      clientBankName: true,
      clientAccountHolder: true,
      clientAccountNumber: true,
      clientAccountType: true,
      clientBranchCode: true,
      invoiceNumber: true,
      invoiceIssuedAt: true,
      invoiceDueAt: true,
      invoiceDepositAmount: true,
      invoiceLicensingFee: true,
      invoiceMonthlyAmount: true,
      invoiceTotalDue: true,
      invoiceBankName: true,
      invoiceBankHolder: true,
      invoiceBankAccount: true,
      invoiceBankBranch: true,
      invoiceBankType: true,
      invoicePaymentReference: true,
      invoiceTerms: true,
      invoiceSentAt: true,
      proofOfPaymentUrls: true,
      proofOfPaymentSubmittedAt: true,
      clientPaymentCompletedAt: true,
      clientBankSubmittedAt: true,
      clientBankConfirmed: true,
      documents: {
        orderBy: { createdAt: "desc" },
        select: { id: true, fileName: true, documentType: true, createdAt: true },
      },
      statusLogs: {
        orderBy: { createdAt: "desc" },
        select: { id: true, toStatus: true, note: true, createdAt: true },
      },
      selectedVehicle: {
        select: {
          id: true, title: true, featuredImage: true, depositAmount: true,
          monthlyPayment: true, yearModel: true, mileage: true,
          transmission: true, fuelType: true, slug: true,
        },
      },
    },
  });

  if (!application || application.email.toLowerCase() !== email.toLowerCase()) {
    redirect("/portal-login");
  }

  const statusLabel = getStatusLabel(application.status);
  const progressNumeric = getProgressState(application.status);
  const theme = getDashboardTheme(application.status);
  const heroCopy = getHeroCopy(application.status);

  const isApplicationReceived = application.status === "APPLICATION_RECEIVED";
  const isPreQualified = application.status === "PRE_QUALIFIED";
  const isAwaitingDocs = application.status === "AWAITING_DOCUMENTS";
  const isAdditionalDocs = application.status === "ADDITIONAL_DOCUMENTS_REQUIRED";
  const isDocsSubmitted = application.status === "DOCUMENTS_SUBMITTED";
  const isDocsUnderReview = application.status === "DOCUMENTS_UNDER_REVIEW";
  const isApprovedInPrinciple = application.status === "APPROVED_IN_PRINCIPLE";
  const isContractRequested = application.status === "CONTRACT_REQUESTED";
  const isContractIssued = application.status === "CONTRACT_ISSUED";
  const isAwaitingInvoice = application.status === "AWAITING_INVOICE";
  const isInvoiceIssued = application.status === "INVOICE_ISSUED";
  const isAwaitingPayment = application.status === "AWAITING_PAYMENT";
  const isPaymentUnderVerification = application.status === "PAYMENT_UNDER_VERIFICATION";
  const isPaymentConfirmed = application.status === "PAYMENT_CONFIRMED";
  const isCompleted = application.status === "COMPLETED";
  const isDeclined = application.status === "DECLINED";
  const isContractExpired = application.status === "CONTRACT_EXPIRED";
  const isContractCancelled = application.status === "CONTRACT_CANCELLED";
  const isContractAccepted = application.contractAccepted === true;

  const selectedVehicle = application.selectedVehicle;

  const contractDepositNum = application.contractDepositAmount ? parseMoney(application.contractDepositAmount) : 0;
  const contractLicensingNum = application.contractLicensingFee ? parseMoney(application.contractLicensingFee) : LICENSING_AND_REGISTRATION_FEE;
  const contractMonthlyNum = application.contractMonthlyPayment ? parseMoney(application.contractMonthlyPayment) : 0;
  const contractTotalNowNum = application.contractTotalPayableNow ? parseMoney(application.contractTotalPayableNow) : contractDepositNum + contractLicensingNum;

  const selectedVehicleDeposit = selectedVehicle ? parseMoney(selectedVehicle.depositAmount) : 0;
  const selectedVehicleMonthly = selectedVehicle ? parseMoney(selectedVehicle.monthlyPayment) : 0;
  const totalRequiredNow = selectedVehicle ? selectedVehicleDeposit + LICENSING_AND_REGISTRATION_FEE : 0;

  const displayVehicleTitle = application.contractVehicleTitle || selectedVehicle?.title || "—";
  const displayVehicleImage = application.contractVehicleImage || selectedVehicle?.featuredImage || null;
  const displayVehicleYear = application.contractVehicleYearModel || selectedVehicle?.yearModel || null;
  const displayVehicleTransmission = application.contractVehicleTransmission || selectedVehicle?.transmission || null;
  const displayVehicleFuelType = application.contractVehicleFuelType || selectedVehicle?.fuelType || null;

  const contractDataForModal = {
    id: application.id,
    contractAccepted: application.contractAccepted,
    contractSignatureImage: application.contractSignatureImage,
    contractSignedAt: application.contractSignedAt,
    referenceNumber: application.referenceNumber,
    contractVehicleTitle: application.contractVehicleTitle,
    contractVehicleImage: application.contractVehicleImage,
    contractVehicleYearModel: application.contractVehicleYearModel,
    contractVehicleMileage: application.contractVehicleMileage,
    contractVehicleTransmission: application.contractVehicleTransmission,
    contractVehicleFuelType: application.contractVehicleFuelType,
    contractDepositAmount: application.contractDepositAmount,
    contractLicensingFee: application.contractLicensingFee,
    contractMonthlyPayment: application.contractMonthlyPayment,
    contractTotalPayableNow: application.contractTotalPayableNow,
    contractTerm: application.contractTerm,
    contractClientFullName: application.contractClientFullName,
    contractClientEmail: application.contractClientEmail,
    contractClientPhone: application.contractClientPhone,
    contractClientIdentityType: application.contractClientIdentityType,
    contractClientIdentityNumber: application.contractClientIdentityNumber,
    contractClientAddress: application.contractClientAddress,
    contractTerms: application.contractTerms,
    contractIssuedAt: application.contractIssuedAt,
  };

  const countdownText = (isContractIssued || isAwaitingInvoice || isInvoiceIssued || isAwaitingPayment || isPaymentUnderVerification)
    ? getCompactCountdown(application.contractExpiresAt)
    : getCompactCountdown(application.approvalValidUntil);

  const needsDocuments = isApplicationReceived || isPreQualified || isAwaitingDocs || isAdditionalDocs;
  const showAnimatedCard = isDocsSubmitted || isDocsUnderReview || isAdditionalDocs;
  const acceptedAtText = formatCompactDateTime(application.contractAcceptedAt);
  const contractIssuedAtText = formatCompactDateTime(application.contractIssuedAt);

  return (
    <PortalMobileShell>
      <PortalStatusPoller currentStatus={application.status} referenceNumber={application.referenceNumber} />
      <PortalMobileTopbar rightHref="/portal/documents" rightLabel="Documents" />

      <PortalMobileHero
        theme={theme}
        eyebrow={heroCopy.eyebrow}
        title={heroCopy.title}
        description={heroCopy.description}
        statusLabel={statusLabel}
        referenceNumber={application.referenceNumber}
        countdownText={countdownText}
        selectionText={application.preferredVehicle || "No preferred vehicle"}
      />

      <PortalMobileStatRow
        items={[
          { label: "Progress", value: `${progressNumeric}%`, tone: "blue" },
          { label: "Documents", value: String(application.documents.length), tone: application.documents.length > 0 ? "green" : "default" },
          { label: "Stage", value: statusLabel },
        ]}
      />


      {/* ── DOCUMENTS STAGE ── */}
      {needsDocuments ? (
        <PortalMobileSectionCard eyebrow="Action Required" title="Upload your documents">
          <div className="space-y-2">
            <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
                {isAdditionalDocs ? "Additional Documents Needed" : "Documents Required"}
              </p>
              <p className="mt-1 text-[12.5px] leading-5 text-[#39425d]">
                {isAdditionalDocs
                  ? "More supporting documents have been requested. Please upload them to continue."
                  : "Upload your supporting documents to move your application into the review stage."}
              </p>
            </div>
            {isAdditionalDocs ? (
              <div className="rounded-[14px] border border-red-200 bg-red-50/70 px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">Urgent</p>
                <p className="mt-1 text-[12px] leading-5 text-red-900">Additional documents are still outstanding. Please upload them as soon as possible.</p>
              </div>
            ) : null}
            <Link href="/portal/documents" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(47,103,222,0.4)]">
              Upload Documents
            </Link>
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── DOCUMENTS REVIEW STAGE ── */}
      {showAnimatedCard ? (
        <PortalMobileSectionCard eyebrow="Document Stage" title="Document progress">
          <PortalApplicationProgressCard
            status={application.status as "DOCUMENTS_SUBMITTED" | "DOCUMENTS_UNDER_REVIEW" | "ADDITIONAL_DOCUMENTS_REQUIRED"}
          />
        </PortalMobileSectionCard>
      ) : null}

      {/* ── APPROVED - SELECT VEHICLE ── */}
      {isApprovedInPrinciple ? (
        <PortalMobileSectionCard eyebrow="Action Required" title="Select your vehicle">
          <div className="space-y-2">
            <div className="rounded-[14px] border border-emerald-200 bg-emerald-50/70 px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Approval Active</p>
              <p className="mt-1 text-[12.5px] leading-5 text-[#39425d]">Your application has been approved in principle. Choose your vehicle before your approval window expires.</p>
            </div>
            <Link href="/portal/select-vehicle" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.4)]">
              Select Your Vehicle
            </Link>
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── CONTRACT REQUESTED ── */}
      {isContractRequested ? (
        <PortalMobileSectionCard eyebrow="Contract Stage" title="Contract request submitted">
          <div className="rounded-[14px] border border-[#f1dfd1] bg-[#fbf2ea] px-3.5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">Awaiting Admin Issue</p>
            <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">Your contract request has been received. The 24-hour completion window will begin once the contract is issued.</p>
          </div>
          {selectedVehicle ? (
            <div className="mt-2 rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] divide-y divide-[#eef0f8]">
              <div className="px-3.5 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Selected Vehicle</p>
                <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">{selectedVehicle.title}</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#eef0f8]">
                <div className="px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Deposit</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">{formatCurrency(selectedVehicleDeposit)}</p>
                </div>
                <div className="px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Monthly</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">{formatCurrency(selectedVehicleMonthly)}</p>
                </div>
              </div>
            </div>
          ) : null}
        </PortalMobileSectionCard>
      ) : null}

      {/* ── CONTRACT ISSUED ── */}
      {isContractIssued ? (
        <PortalMobileSectionCard eyebrow="Contract Stage" title="Review and sign your contract">
          <div className="space-y-2">
            {!isContractAccepted ? (
              <>
                <div className="rounded-[14px] border border-[#f1dfd1] bg-[#fbf2ea] px-3.5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">Action Required</p>
                  <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">Review the full contract carefully, complete your digital acceptance, and fulfil any outstanding payment requirements within the active 24-hour window.</p>
                </div>
                <div className="rounded-[14px] border border-[#e7eaf2] bg-[#fafbff] p-3">
                  {displayVehicleImage ? (
                    <div className="overflow-hidden rounded-[12px] bg-[#f4f6fb]">
                      <img src={displayVehicleImage} alt={displayVehicleTitle} className="h-[110px] w-full object-cover" />
                    </div>
                  ) : null}
                  <div className="mt-2.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">Contract Vehicle</p>
                      <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">{displayVehicleTitle}</p>
                    </div>
                    {contractIssuedAtText ? (
                      <span className="shrink-0 rounded-full border border-[#f1dfd1] bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#c37d43]">{contractIssuedAtText}</span>
                    ) : null}
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="rounded-[12px] border border-[#eef0f7] bg-white px-3 py-2">
                      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Required Now</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#1b2345]">{formatCurrency(contractTotalNowNum)}</p>
                    </div>
                    <div className="rounded-[12px] border border-[#eef0f7] bg-white px-3 py-2">
                      <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Monthly</p>
                      <p className="mt-1 text-[11px] font-semibold text-[#1b2345]">{formatCurrency(contractMonthlyNum)}</p>
                    </div>
                  </div>
                </div>
                <ContractReviewModal contract={contractDataForModal} />
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-5 py-3 text-sm font-semibold text-[#2f67de]">
                  Download Contract (PDF)
                </button>
                <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">Digital Contract Acceptance</p>
                  <p className="mt-1 text-[12px] leading-5 text-[#68708a]">Review the full contract above then complete your digital acceptance below.</p>
                  <form action="/api/portal/accept-contract" method="POST" className="mt-3 space-y-3">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">Full Legal Name</label>
                      <input
                        type="text"
                        name="acceptedName"
                        required
                        placeholder="Type your full legal name exactly"
                        className="w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-[13px] text-[#1b2345] outline-none transition placeholder:text-[#a3aac0] focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                      />
                    </div>
                    <label className="flex items-start gap-3 rounded-[12px] border border-[#e8ecf5] bg-white p-3">
                      <input type="checkbox" name="acceptedTerms" value="yes" required className="mt-0.5 h-4 w-4 accent-[#2f67de]" />
                      <span className="text-[12px] leading-5 text-[#39425d]">I have read and agree to the full terms and conditions of this Vehicle Rental Agreement.</span>
                    </label>
                    <label className="flex items-start gap-3 rounded-[12px] border border-[#e8ecf5] bg-white p-3">
                      <input type="checkbox" name="confirmedDetails" value="yes" required className="mt-0.5 h-4 w-4 accent-[#2f67de]" />
                      <span className="text-[12px] leading-5 text-[#39425d]">I confirm that all my personal and financial details in this contract are correct.</span>
                    </label>
                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(213,151,88,0.5)]"
                    >
                      Confirm & Accept Contract
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="rounded-[14px] border border-emerald-200 bg-emerald-50/70 px-3.5 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Contract Accepted</p>
                    {application.contractAcceptedName ? (
                      <p className="mt-1 text-[12.5px] font-semibold text-[#1b2345]">{application.contractAcceptedName}</p>
                    ) : null}
                    <p className="mt-1 text-[12px] leading-5 text-[#39425d]">Your digital contract acceptance has been recorded.</p>
                  </div>
                  {acceptedAtText ? (
                    <span className="shrink-0 rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">{acceptedAtText}</span>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── AWAITING INVOICE ── */}
      {isAwaitingInvoice ? (
        <PortalMobileSectionCard eyebrow="Invoice Stage" title="Awaiting invoice release">
          <div className="space-y-2">
            <div className="rounded-[14px] border border-emerald-200 bg-emerald-50/70 px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Contract Accepted</p>
              </div>
              <p className="mt-1.5 text-[12px] leading-5 text-[#39425d]">Your digital acceptance has been recorded. Please submit your banking details below so our team can verify and issue your invoice promptly.</p>
            </div>

            {application.clientBankSubmittedAt ? (
              <div className="overflow-hidden rounded-[16px] border border-[#dde1ec] bg-white p-4 shadow-[0_4px_14px_-8px_rgba(27,35,69,0.1)]">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-[#c9973a]">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c9973a] opacity-40" />
                    </span>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c9973a]">Awaiting Invoice</p>
                  </div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#8a9bbf]">Stage 3 of 5</p>
                </div>

                {/* Title */}
                <p className="text-[15px] font-bold text-[#1b2345]" style={{ fontFamily: "Georgia, serif" }}>Our team is preparing your invoice</p>
                <p className="mt-1 text-[12px] leading-5 text-[#5a6480]">Your banking details have been received and are being verified. Your official payment invoice will follow shortly.</p>

                {/* Progress track */}
                <div className="relative mt-5 mb-4 h-1 overflow-hidden rounded-full bg-[#eef0f5]">
                  <div className="absolute left-0 top-0 h-full rounded-full bg-[#1b2345]" style={{ width: "62%" }} />
                  <div className="absolute top-0 h-full animate-[aa-shimmer_2s_ease-in-out_infinite]" style={{ left: "62%", width: "30%", background: "linear-gradient(90deg, transparent, #c9973a, transparent)" }} />
                </div>

                {/* Stages */}
                <div className="grid grid-cols-4 gap-1">
                  {/* Contract - done */}
                  <div className="text-center">
                    <div className="relative z-10 mx-auto -mt-4 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1b2345] bg-[#1b2345]">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="#c9973a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-[#1b2345]">Contract</p>
                    <p className="text-[9px] text-[#8a9bbf]">Signed</p>
                  </div>
                  {/* Banking - done */}
                  <div className="text-center">
                    <div className="relative z-10 mx-auto -mt-4 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#1b2345] bg-[#1b2345]">
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="#c9973a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-[#1b2345]">Banking</p>
                    <p className="text-[9px] text-[#8a9bbf]">Received</p>
                  </div>
                  {/* Invoice - active */}
                  <div className="text-center">
                    <div className="relative z-10 mx-auto -mt-4 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#c9973a] bg-white">
                      <span className="absolute inset-[-6px] rounded-full border-2 border-[#c9973a] opacity-50 animate-ping" />
                      <span className="h-2 w-2 rounded-full bg-[#c9973a]" />
                    </div>
                    <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-[#c9973a]">Invoice</p>
                    <p className="text-[9px] text-[#8a9bbf]">In progress</p>
                  </div>
                  {/* Payment - pending */}
                  <div className="text-center">
                    <div className="relative z-10 mx-auto -mt-4 h-7 w-7 rounded-full border-2 border-[#dde1ec] bg-white" />
                    <p className="mt-1.5 text-[9px] font-bold uppercase tracking-wider text-[#8a9bbf]">Payment</p>
                    <p className="text-[9px] text-[#8a9bbf]">Upcoming</p>
                  </div>
                </div>

                {/* Info banner */}
                <div className="mt-4 flex items-start gap-2.5 rounded-r-[10px] border-l-[3px] border-[#c9973a] bg-[#f8f6f0] px-3 py-2.5">
                  <svg className="h-4 w-4 shrink-0 text-[#c9973a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <p className="text-[11.5px] leading-5 text-[#5a6480]">
                    <span className="font-bold text-[#1b2345]">Important: </span>
                    Your invoice will be released shortly. Payment must be completed before the contract timer above expires — please keep an eye on your countdown.
                  </p>
                </div>

                {/* Banking recap */}
                <div className="mt-3 rounded-[12px] border border-[#e8ecf5] bg-[#fafbfd] p-3">
                  <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#8a9bbf]">Your Payment Account (Submitted)</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11.5px]"><span className="text-[#8a9bbf]">Bank</span><span className="font-bold text-[#1b2345]">{application.clientBankName}</span></div>
                    <div className="flex justify-between text-[11.5px]"><span className="text-[#8a9bbf]">Account Holder</span><span className="font-bold text-[#1b2345]">{application.clientAccountHolder}</span></div>
                    <div className="flex justify-between text-[11.5px]"><span className="text-[#8a9bbf]">Account Type</span><span className="font-bold text-[#1b2345]">{application.clientAccountType}</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">Banking Details Required</p>
                <p className="mt-1 text-[12px] leading-5 text-[#68708a]">Please select your bank and provide your account details. Payment must be made from this account only.</p>
                <form action="/api/portal/submit-banking" method="POST" className="mt-3 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Select Your Bank</label>
                    <div className="relative">
                      <select name="clientBankName" required className="w-full appearance-none rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-[13px] text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10">
                        <option value="">-- Select your bank --</option>
                        <option value="ABSA Bank">ABSA Bank</option>
                        <option value="Capitec Bank">Capitec Bank</option>
                        <option value="First National Bank (FNB)">First National Bank (FNB)</option>
                        <option value="Nedbank">Nedbank</option>
                        <option value="Standard Bank">Standard Bank</option>
                        <option value="African Bank">African Bank</option>
                        <option value="Bidvest Bank">Bidvest Bank</option>
                        <option value="Discovery Bank">Discovery Bank</option>
                        <option value="Investec Bank">Investec Bank</option>
                        <option value="TymeBank">TymeBank</option>
                        <option value="Ubank">Ubank</option>
                        <option value="Other">Other</option>
                      </select>
                      <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#68708a]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Account Holder Name</label>
                    <input type="text" name="clientAccountHolder" required placeholder="Full name as on bank account" className="w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-[13px] text-[#1b2345] outline-none transition placeholder:text-[#a3aac0] focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Account Number</label>
                    <input type="text" name="clientAccountNumber" required placeholder="Enter account number" inputMode="numeric" className="w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-[13px] text-[#1b2345] outline-none transition placeholder:text-[#a3aac0] focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Account Type</label>
                    <div className="relative">
                      <select name="clientAccountType" required className="w-full appearance-none rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-[13px] text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10">
                        <option value="">-- Select account type --</option>
                        <option value="Cheque Account">Cheque Account</option>
                        <option value="Savings Account">Savings Account</option>
                        <option value="Transmission Account">Transmission Account</option>
                      </select>
                      <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#68708a]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Branch Code</label>
                    <input type="text" name="clientBranchCode" required placeholder="Enter branch code" inputMode="numeric" className="w-full rounded-[12px] border border-[#dde1ee] bg-white px-4 py-3 text-[13px] text-[#1b2345] outline-none transition placeholder:text-[#a3aac0] focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10" />
                  </div>
                  <div className="rounded-[12px] border border-amber-200 bg-amber-50/70 px-3.5 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">Important Notice</p>
                    <p className="mt-1 text-[12px] leading-5 text-amber-900">Payment must be made exclusively from the bank account submitted above. Any payment received from a different account will not be processed and may result in delays to your application.</p>
                  </div>
                  <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(47,103,222,0.4)]">
                    Submit Banking Details
                  </button>
                </form>
              </div>
            )}
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── INVOICE ISSUED ── */}
      {isInvoiceIssued || isAwaitingPayment ? (
        <PortalMobileSectionCard eyebrow="Invoice & Payment" title="Your invoice">
          <div className="space-y-2">
            <div className="rounded-[14px] border border-[#dbe6ff] bg-[#eef4ff] px-3.5 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f67de]">Invoice Reference</p>
                <span className="rounded-full border border-[#dbe6ff] bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#2f67de]">{application.referenceNumber}</span>
              </div>
            </div>
            <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] divide-y divide-[#eef0f8]">
              <div className="px-3.5 py-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Vehicle</p>
                <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">{displayVehicleTitle}</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#eef0f8]">
                <div className="px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Deposit</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">{formatCurrency(contractDepositNum)}</p>
                </div>
                <div className="px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Licensing</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">{formatCurrency(contractLicensingNum)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#eef0f8]">
                <div className="px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Monthly</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">{formatCurrency(contractMonthlyNum)}</p>
                </div>
                <div className="px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2f67de]">Total Due Now</p>
                  <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">{formatCurrency(contractTotalNowNum)}</p>
                </div>
              </div>
            </div>
            <div className="rounded-[14px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">Payment Instructions</p>
              <p className="mt-1.5 text-[12px] leading-5 text-[#39425d]">Use reference number <span className="font-semibold text-[#1b2345]">{application.referenceNumber}</span> when making payment. Keep your proof of payment ready.</p>
            </div>
            {/* Invoice banking details from DB */}
            {application.invoiceBankName ? (
              <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">Payment Details</p>
                  {application.invoiceNumber && (
                    <span className="rounded-full bg-[#1b2345] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#c9973a]">{application.invoiceNumber}</span>
                  )}
                </div>
                {application.invoiceDueAt && (
                  <div className="mb-2 rounded-[10px] border border-[#c9973a]/30 bg-[#fff8ee] px-3 py-2">
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#c9973a]">Payment Due</p>
                    <p className="mt-0.5 text-[12px] font-bold text-[#1b2345]">{new Date(application.invoiceDueAt).toLocaleString("en-ZA", { dateStyle: "full", timeStyle: "short" })}</p>
                  </div>
                )}
                <p className="mb-2 text-[11px] leading-5 text-[#68708a]">Make payment to the account below using your reference number as the payment reference.</p>
                <div className="divide-y divide-[#eef0f8] rounded-[12px] border border-[#e8ecf5] bg-white">
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <p className="text-[11px] text-[#68708a]">Bank</p>
                    <p className="text-[11px] font-semibold text-[#1b2345]">{application.invoiceBankName}</p>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <p className="text-[11px] text-[#68708a]">Account Name</p>
                    <p className="text-[11px] font-semibold text-[#1b2345]">{application.invoiceBankHolder}</p>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <p className="text-[11px] text-[#68708a]">Account Number</p>
                    <p className="font-mono text-[11px] font-bold text-[#1b2345]">{application.invoiceBankAccount}</p>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <p className="text-[11px] text-[#68708a]">Branch Code</p>
                    <p className="font-mono text-[11px] font-bold text-[#1b2345]">{application.invoiceBankBranch}</p>
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <p className="text-[11px] text-[#68708a]">Account Type</p>
                    <p className="text-[11px] font-semibold text-[#1b2345]">{application.invoiceBankType}</p>
                  </div>
                  <div className="flex items-center justify-between bg-[#fff8ee] px-3 py-2.5">
                    <p className="text-[11px] font-bold text-[#c9973a]">Payment Reference</p>
                    <p className="font-mono text-[11px] font-bold text-[#c9973a]">{application.invoicePaymentReference || application.referenceNumber}</p>
                  </div>
                </div>
                {application.invoiceTotalDue && (
                  <div className="mt-2 flex items-center justify-between rounded-[10px] bg-[#1b2345] px-3.5 py-2.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8a9bbf]">Total Due Now</p>
                    <p className="text-[16px] font-bold text-[#c9973a]">R {application.invoiceTotalDue}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] p-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1b2345]">Payment Details</p>
                <p className="mt-1 text-[12px] text-[#68708a]">Banking details will appear here once your invoice is issued.</p>
              </div>
            )}

            {/* Download Invoice */}
            {application.invoiceNumber && (
              <InvoiceDownloadButton
                invoiceNumber={application.invoiceNumber}
                referenceNumber={application.referenceNumber}
                invoiceIssuedAt={application.invoiceIssuedAt ? String(application.invoiceIssuedAt) : null}
                invoiceDueAt={application.invoiceDueAt ? String(application.invoiceDueAt) : null}
                invoiceDepositAmount={application.invoiceDepositAmount}
                invoiceLicensingFee={application.invoiceLicensingFee}
                invoiceMonthlyAmount={application.invoiceMonthlyAmount}
                invoiceTotalDue={application.invoiceTotalDue}
                invoiceBankName={application.invoiceBankName}
                invoiceBankHolder={application.invoiceBankHolder}
                invoiceBankAccount={application.invoiceBankAccount}
                invoiceBankBranch={application.invoiceBankBranch}
                invoiceBankType={application.invoiceBankType}
                invoicePaymentReference={application.invoicePaymentReference}
                invoiceTerms={application.invoiceTerms}
              />
            )}

            {/* Proof of Payment Upload + Confirmation */}
            <ProofOfPaymentUpload
              initialFiles={(application.proofOfPaymentUrls as any[]) || []}
              paymentCompletedAt={application.clientPaymentCompletedAt}
            />

            {/* Delivery details popup */}
            <details className="group rounded-[14px] border border-[#e1e4ee] bg-[#fafbff]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 marker:content-none">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a]">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>
                  </div>
                  <p className="text-[13px] font-semibold text-[#1b2345]">View Delivery Details</p>
                </div>
                <svg className="h-4 w-4 shrink-0 text-[#68708a] transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
              </summary>
              <div className="border-t border-[#e7eaf2] p-4 space-y-3">
                <div className="rounded-[12px] border border-[#e8ecf5] bg-white p-3.5">
                  <p className="text-[12px] leading-5 text-[#39425d]">Upon successful payment confirmation, please allow <span className="font-semibold text-[#1b2345]">3 to 5 working days</span> for the following to be completed before delivery:</p>
                  <div className="mt-3 space-y-2">
                    {["Vehicle licensing and registration", "Roadworthy certificate and compliance", "Insurance activation and documentation", "Tracker installation and activation", "Final vehicle inspection and handover"].map((item) => (
                      <div key={item} className="flex items-center gap-2.5">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eef4ff]">
                          <svg className="h-3 w-3 text-[#2f67de]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                        <p className="text-[12px] text-[#39425d]">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[12px] border border-[#dbe6ff] bg-[#eef4ff] px-3.5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#2f67de]">Delivery Coordination</p>
                  <p className="mt-1 text-[12px] leading-5 text-[#39425d]">Our team will contact you directly to confirm delivery arrangements once your payment has been verified and all compliance requirements completed.</p>
                </div>
              </div>
            </details>
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── PAYMENT VERIFICATION ── */}
      {isPaymentUnderVerification ? (
        <PortalMobileSectionCard eyebrow="Payment Stage" title="Payment under verification">
          <div className="rounded-[14px] border border-[#dbe6ff] bg-[#eef4ff] px-3.5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f67de]">Verifying Payment</p>
            <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">Your payment information has been received and is currently being verified. No further action is required at this stage.</p>
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── PAYMENT CONFIRMED / COMPLETED ── */}
      {isPaymentConfirmed || isCompleted ? (
        <PortalMobileSectionCard eyebrow="Completion" title="Application completed">
          <div className="space-y-2">
            <div className="rounded-[14px] border border-emerald-200 bg-emerald-50/70 px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">{isCompleted ? "Completed" : "Payment Confirmed"}</p>
              <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">{isCompleted ? "Your application process has been completed successfully. Welcome to Auto Access." : "Your payment has been successfully confirmed and your application is progressing to the final stage."}</p>
            </div>
            {displayVehicleTitle !== "—" ? (
              <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Your Vehicle</p>
                <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">{displayVehicleTitle}</p>
              </div>
            ) : null}
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── DECLINED / EXPIRED / CANCELLED ── */}
      {isDeclined || isContractExpired || isContractCancelled ? (
        <PortalMobileSectionCard eyebrow="Application Update" title="Status update">
          <div className="rounded-[14px] border border-red-200 bg-red-50/70 px-3.5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">
              {isDeclined ? "Application Declined" : isContractExpired ? "Contract Expired" : "Contract Cancelled"}
            </p>
            <p className="mt-1.5 text-[12.5px] leading-5 text-red-900">
              {isDeclined ? "We are unable to proceed with your application at this stage. Please review any notes in your portal or contact our team for clarification."
                : isContractExpired ? "Your contract completion window has expired. Please contact our team for further assistance."
                : "Your contract has been cancelled. Please contact our team if you have any questions."}
            </p>
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── Applicant Summary ── */}
      <PortalMobileSectionCard eyebrow="Applicant" title="Profile and files">
        <div className="space-y-2">
          <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] divide-y divide-[#eef0f8]">
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Name</p>
              <p className="text-right text-[12.5px] font-semibold text-[#1b2345]">{application.fullName}</p>
            </div>
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Email</p>
              <p className="min-w-0 break-words text-right text-[12px] font-semibold text-[#1b2345]">{application.email}</p>
            </div>
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Phone</p>
              <p className="text-right text-[12px] font-semibold text-[#1b2345]">{application.phone}</p>
            </div>
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">Documents</p>
              <p className="text-right text-[12px] font-semibold text-[#1b2345]">{application.documents.length}</p>
            </div>
          </div>
          <Link href="/portal/documents" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-5 py-3 text-sm font-semibold text-white">
            Manage Documents
          </Link>
        </div>
      </PortalMobileSectionCard>

      {/* ── Status Timeline ── */}
      <PortalMobileSectionCard eyebrow="Status Timeline" title="Progress journey" badge={`${application.statusLogs.length} updates`}>
        {application.statusLogs.length === 0 ? (
          <div className="rounded-[18px] border-2 border-dashed border-[#d7d9e2] bg-[#fafbff] p-6 text-center text-sm text-[#68708a]">
            No progress updates yet.
          </div>
        ) : (
          <div className="space-y-2">
            {application.statusLogs.slice(0, 2).map((log: StatusLogItem, index: number) => (
              <div key={log.id} className={`rounded-[14px] border px-3.5 py-3 ${index === 0 ? "border-[#dbe6ff] bg-gradient-to-br from-[#eef4ff] via-white to-white" : "border-[#e3e6ef] bg-[#fafbfe]"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-[#1b2345]">{formatStatus(log.toStatus)}</p>
                    <p className="mt-0.5 text-[11px] text-[#68708a]">{formatCompactDateTime(log.createdAt)}</p>
                  </div>
                  <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${index === 0 ? "border border-[#2f67de]/30 bg-[#2f67de] text-white" : "border border-[#dbe6ff] bg-[#eef4ff] text-[#2f67de]"}`}>
                    {index === 0 ? "Latest" : "Update"}
                  </span>
                </div>
                {log.note ? <p className="mt-2 text-[12px] leading-5 text-[#4d546a]">{log.note}</p> : null}
              </div>
            ))}
            {application.statusLogs.length > 2 ? (
              <details className="group rounded-[14px] border border-[#e1e4ee] bg-[#fafbff]">
                <summary className="flex cursor-pointer list-none items-center justify-center gap-2 px-4 py-3 text-[12px] font-semibold text-[#1b2345] marker:content-none">
                  View {application.statusLogs.length - 2} more update{application.statusLogs.length - 2 > 1 ? "s" : ""}
                  <svg className="h-4 w-4 transition group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </summary>
                <div className="space-y-2 border-t border-[#e7eaf2] p-3">
                  {application.statusLogs.slice(2).map((log: StatusLogItem) => (
                    <div key={log.id} className="rounded-[12px] border border-[#e3e6ef] bg-white px-3.5 py-3">
                      <p className="text-[12.5px] font-semibold text-[#1b2345]">{formatStatus(log.toStatus)}</p>
                      <p className="mt-0.5 text-[11px] text-[#68708a]">{formatCompactDateTime(log.createdAt)}</p>
                      {log.note ? <p className="mt-2 text-[12px] leading-5 text-[#4d546a]">{log.note}</p> : null}
                    </div>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        )}
      </PortalMobileSectionCard>

      <PortalMobileFooterBar href="/portal" label="Stay in Portal" />
    </PortalMobileShell>
  );
}
