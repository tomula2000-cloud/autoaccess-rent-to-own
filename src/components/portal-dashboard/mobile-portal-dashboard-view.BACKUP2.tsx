import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApprovalCountdownCard from "@/components/approval-countdown-card";
import PortalApplicationProgressCard from "@/components/portal-application-progress-card";
import ContractReviewModal from "@/components/contract-review-modal";
import PortalMobileShell from "@/components/portal-mobile/portal-mobile-shell";
import PortalMobileTopbar from "@/components/portal-mobile/portal-mobile-topbar";
import PortalMobileHero from "@/components/portal-mobile/portal-mobile-hero";
import PortalMobileStatRow from "@/components/portal-mobile/portal-mobile-stat-row";
import PortalMobileSectionCard from "@/components/portal-mobile/portal-mobile-section-card";
import PortalMobileFooterBar from "@/components/portal-mobile/portal-mobile-footer-bar";
import { portalMobileThemes } from "@/components/portal-mobile/portal-mobile-theme";
import { getCompactCountdown } from "@/components/portal-mobile/portal-mobile-utils";

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

function getStatusExplanation(status: string) {
  switch (status) {
    case "APPLICATION_RECEIVED":
      return {
        title: "Application received",
        meaning: "Your profile has been created in our system.",
        nextStep: "Upload your documents to move to the next step.",
      };
    case "PRE_QUALIFICATION_REVIEW":
      return {
        title: "Under pre-qualification review",
        meaning: "Your information is under early-stage assessment.",
        nextStep: "Keep checking for updates while your application is reviewed.",
      };
    case "PRE_QUALIFIED":
      return {
        title: "Pre-qualified",
        meaning: "Your application passed the initial review stage.",
        nextStep: "Upload your documents to continue.",
      };
    case "AWAITING_DOCUMENTS":
      return {
        title: "Awaiting documents",
        meaning: "Supporting documents are required before proceeding.",
        nextStep: "Upload your required documents to keep things moving.",
      };
    case "DOCUMENTS_SUBMITTED":
      return {
        title: "Documents submitted",
        meaning: "Your files have been received and linked to your application.",
        nextStep: "Your documents are moving through the next review stage.",
      };
    case "DOCUMENTS_UNDER_REVIEW":
      return {
        title: "Documents under review",
        meaning: "Your documents are currently being reviewed.",
        nextStep: "Please wait while we prepare the next stage.",
      };
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return {
        title: "Additional documents required",
        meaning: "More supporting information is needed before proceeding.",
        nextStep: "Upload the additional documents requested.",
      };
    case "APPROVED_IN_PRINCIPLE":
      return {
        title: "Approved in principle",
        meaning: "Your application has been approved in principle.",
        nextStep: "Choose your vehicle before your approval window expires.",
      };
    case "CONTRACT_REQUESTED":
      return {
        title: "Contract requested",
        meaning: "Your contract request is awaiting admin review before issue.",
        nextStep: "The 24-hour completion window has not started yet.",
      };
    case "CONTRACT_ISSUED":
      return {
        title: "Contract issued",
        meaning: "Your contract has been issued and your completion stage is active.",
        nextStep: "Review, accept, and fulfil any payment requirements within the window.",
      };
    case "AWAITING_INVOICE":
      return {
        title: "Awaiting invoice",
        meaning: "Your contract has been accepted. Invoice release is pending.",
        nextStep: "Payment instructions will appear once the invoice is issued.",
      };
    case "INVOICE_ISSUED":
      return {
        title: "Invoice issued",
        meaning: "Your invoice has been released and payment is required.",
        nextStep: "Use the correct reference number and prepare your payment.",
      };
    case "AWAITING_PAYMENT":
      return {
        title: "Awaiting payment",
        meaning: "Payment is required before your application can continue.",
        nextStep: "Complete the required payment and keep proof of payment ready.",
      };
    case "PAYMENT_UNDER_VERIFICATION":
      return {
        title: "Payment under verification",
        meaning: "Your payment has been received and is being verified.",
        nextStep: "No action needed right now. Please wait for confirmation.",
      };
    case "PAYMENT_CONFIRMED":
      return {
        title: "Payment confirmed",
        meaning: "Your payment has been successfully confirmed.",
        nextStep: "Keep checking for the next milestone.",
      };
    case "COMPLETED":
      return {
        title: "Completed",
        meaning: "Your application process has been completed successfully.",
        nextStep: "No further action required unless our team contacts you.",
      };
    case "DECLINED":
      return {
        title: "Application update",
        meaning: "We are unable to proceed with your application at this stage.",
        nextStep: "Review any notes and contact the team if you need clarification.",
      };
    default:
      return {
        title: formatStatus(status),
        meaning: "Your application has been updated.",
        nextStep: "Please continue checking your portal for the latest progress.",
      };
  }
}

function getStatusLabel(status: string) {
  switch (status) {
    case "APPROVED_IN_PRINCIPLE":
      return "Approved";
    case "CONTRACT_REQUESTED":
      return "Contract Requested";
    case "CONTRACT_ISSUED":
      return "Contract Issued";
    case "CONTRACT_EXPIRED":
      return "Contract Expired";
    case "CONTRACT_CANCELLED":
      return "Contract Cancelled";
    case "AWAITING_INVOICE":
      return "Awaiting Invoice";
    case "INVOICE_ISSUED":
      return "Invoice Issued";
    case "PAYMENT_CONFIRMED":
    case "COMPLETED":
      return "Completed";
    case "DOCUMENTS_UNDER_REVIEW":
    case "PRE_QUALIFICATION_REVIEW":
    case "PAYMENT_UNDER_VERIFICATION":
      return "Pending Review";
    case "AWAITING_DOCUMENTS":
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return "Documents Needed";
    case "AWAITING_PAYMENT":
      return "Payment Needed";
    default:
      return formatStatus(status);
  }
}

function getProgressState(status: string) {
  switch (status) {
    case "APPLICATION_RECEIVED":
      return 18;
    case "PRE_QUALIFICATION_REVIEW":
      return 30;
    case "PRE_QUALIFIED":
      return 42;
    case "AWAITING_DOCUMENTS":
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return 55;
    case "DOCUMENTS_SUBMITTED":
      return 65;
    case "DOCUMENTS_UNDER_REVIEW":
      return 72;
    case "APPROVED_IN_PRINCIPLE":
      return 82;
    case "CONTRACT_REQUESTED":
      return 86;
    case "CONTRACT_ISSUED":
    case "AWAITING_INVOICE":
    case "INVOICE_ISSUED":
    case "AWAITING_PAYMENT":
      return 90;
    case "PAYMENT_UNDER_VERIFICATION":
      return 94;
    case "PAYMENT_CONFIRMED":
    case "COMPLETED":
      return 100;
    default:
      return 28;
  }
}

function getDashboardTheme(status: string) {
  switch (status) {
    case "APPROVED_IN_PRINCIPLE":
      return portalMobileThemes.approved;
    case "CONTRACT_REQUESTED":
    case "CONTRACT_ISSUED":
      return portalMobileThemes.contract;
    case "AWAITING_INVOICE":
    case "INVOICE_ISSUED":
      return portalMobileThemes.invoice;
    case "AWAITING_PAYMENT":
    case "PAYMENT_UNDER_VERIFICATION":
      return portalMobileThemes.payment;
    case "PAYMENT_CONFIRMED":
    case "COMPLETED":
      return portalMobileThemes.success;
    case "DECLINED":
    case "CONTRACT_EXPIRED":
    case "CONTRACT_CANCELLED":
      return portalMobileThemes.danger;
    default:
      return portalMobileThemes.neutral;
  }
}

function getHeroCopy(status: string) {
  switch (status) {
    case "APPROVED_IN_PRINCIPLE":
      return {
        eyebrow: "Auto Access · Client Portal",
        title: "Approval confirmed",
        description:
          "Your application has been approved in principle. Select your vehicle and prepare for the next completion stage.",
      };
    case "CONTRACT_REQUESTED":
      return {
        eyebrow: "Auto Access · Contract Stage",
        title: "Contract request submitted",
        description:
          "Your request has been received and is awaiting admin review before issue.",
      };
    case "CONTRACT_ISSUED":
      return {
        eyebrow: "Auto Access · Contract Issued",
        title: "Your contract has been issued",
        description:
          "Review the full contract, complete your digital acceptance, and continue within the active contract window.",
      };
    case "AWAITING_INVOICE":
      return {
        eyebrow: "Auto Access · Awaiting Invoice",
        title: "Contract accepted",
        description:
          "Your digital acceptance has been recorded. Keep checking your portal for invoice release.",
      };
    case "INVOICE_ISSUED":
      return {
        eyebrow: "Auto Access · Invoice Stage",
        title: "Your invoice has been released",
        description:
          "Review the payment summary and instructions carefully, then prepare your payment.",
      };
    case "PAYMENT_UNDER_VERIFICATION":
      return {
        eyebrow: "Auto Access · Verification",
        title: "Payment under verification",
        description:
          "Your payment has been received and is currently being verified.",
      };
    case "PAYMENT_CONFIRMED":
      return {
        eyebrow: "Auto Access · Completion",
        title: "Payment confirmed",
        description:
          "Your payment has been successfully confirmed and your application is progressing well.",
      };
    case "COMPLETED":
      return {
        eyebrow: "Auto Access · Completion",
        title: "Application completed",
        description: "Your portal journey has been completed successfully.",
      };
    default:
      return {
        eyebrow: "Auto Access · Client Portal",
        title: "Track your application",
        description:
          "Monitor your status, review next steps and manage your journey from one premium portal view.",
      };
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
      documents: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fileName: true,
          documentType: true,
          createdAt: true,
        },
      },
      statusLogs: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          toStatus: true,
          note: true,
          createdAt: true,
        },
      },
      selectedVehicle: {
        select: {
          id: true,
          title: true,
          featuredImage: true,
          depositAmount: true,
          monthlyPayment: true,
          yearModel: true,
          mileage: true,
          transmission: true,
          fuelType: true,
          slug: true,
        },
      },
    },
  });

  if (!application || application.email.toLowerCase() !== email.toLowerCase()) {
    redirect("/portal-login");
  }

  const statusInfo = getStatusExplanation(application.status);
  const statusLabel = getStatusLabel(application.status);
  const progressNumeric = getProgressState(application.status);

  const isApprovedInPrinciple = application.status === "APPROVED_IN_PRINCIPLE";
  const isContractRequested = application.status === "CONTRACT_REQUESTED";
  const isContractIssued = application.status === "CONTRACT_ISSUED";
  const isAwaitingInvoice = application.status === "AWAITING_INVOICE";
  const isInvoiceIssued = application.status === "INVOICE_ISSUED";
  const isContractAccepted = application.contractAccepted === true;

  const selectedVehicle = application.selectedVehicle;

  const contractDepositNum = application.contractDepositAmount
    ? parseMoney(application.contractDepositAmount)
    : 0;
  const contractLicensingNum = application.contractLicensingFee
    ? parseMoney(application.contractLicensingFee)
    : LICENSING_AND_REGISTRATION_FEE;
  const contractMonthlyNum = application.contractMonthlyPayment
    ? parseMoney(application.contractMonthlyPayment)
    : 0;
  const contractTotalNowNum = application.contractTotalPayableNow
    ? parseMoney(application.contractTotalPayableNow)
    : contractDepositNum + contractLicensingNum;

  const selectedVehicleDeposit = selectedVehicle
    ? parseMoney(selectedVehicle.depositAmount)
    : 0;
  const selectedVehicleMonthly = selectedVehicle
    ? parseMoney(selectedVehicle.monthlyPayment)
    : 0;
  const totalRequiredNow = selectedVehicle
    ? selectedVehicleDeposit + LICENSING_AND_REGISTRATION_FEE
    : 0;

  const displayVehicleTitle =
    application.contractVehicleTitle || selectedVehicle?.title || "—";
  const displayVehicleImage =
    application.contractVehicleImage || selectedVehicle?.featuredImage || null;
  const displayVehicleYear =
    application.contractVehicleYearModel || selectedVehicle?.yearModel || null;
  const displayVehicleTransmission =
    application.contractVehicleTransmission || selectedVehicle?.transmission || null;
  const displayVehicleFuelType =
    application.contractVehicleFuelType || selectedVehicle?.fuelType || null;

  const contractDataForModal = {
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

  const theme = getDashboardTheme(application.status);
  const heroCopy = getHeroCopy(application.status);

  const countdownText = isContractIssued
    ? getCompactCountdown(application.contractExpiresAt)
    : getCompactCountdown(application.approvalValidUntil);

  const showAnimatedActionCard =
    application.status === "DOCUMENTS_SUBMITTED" ||
    application.status === "DOCUMENTS_UNDER_REVIEW" ||
    application.status === "ADDITIONAL_DOCUMENTS_REQUIRED";

  const acceptedAtText = formatCompactDateTime(application.contractAcceptedAt);
  const contractIssuedAtText = formatCompactDateTime(application.contractIssuedAt);

  return (
    <PortalMobileShell>
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
          {
            label: "Progress",
            value: `${progressNumeric}%`,
            tone: "blue",
          },
          {
            label: "Documents",
            value: String(application.documents.length),
            tone: application.documents.length > 0 ? "green" : "default",
          },
          {
            label: "Stage",
            value: statusLabel,
          },
        ]}
      />

      {(isApprovedInPrinciple && application.approvalValidUntil) ||
      (isContractIssued && application.contractExpiresAt) ? (
        <div className="mt-4">
          {isApprovedInPrinciple && application.approvalValidUntil ? (
            <ApprovalCountdownCard
              approvalValidUntil={new Date(
                application.approvalValidUntil
              ).toISOString()}
            />
          ) : null}
          {isContractIssued && application.contractExpiresAt ? (
            <ApprovalCountdownCard
              approvalValidUntil={new Date(
                application.contractExpiresAt
              ).toISOString()}
              mode="contract"
            />
          ) : null}
        </div>
      ) : null}

      {/* ── Status Guidance ── */}
      <PortalMobileSectionCard eyebrow="Status Guidance" title="Your next step">
        <div className="space-y-2">

          {/* Compact meaning row — no timestamp here, timestamp lives in timeline */}
          <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] px-3.5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
              {statusInfo.title}
            </p>
            <p className="mt-1 text-[12.5px] leading-5 text-[#39425d]">
              {statusInfo.meaning}
            </p>
          </div>

          {isApprovedInPrinciple ? (
            <div className="rounded-[14px] border border-emerald-200 bg-emerald-50/70 p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                Action Required
              </p>
              <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">
                Choose your vehicle option to move to the next stage.
              </p>
              <Link
                href="/portal/select-vehicle"
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-3 text-sm font-semibold text-white"
              >
                Select Your Vehicle
              </Link>
            </div>
          ) : isContractRequested ? (
            <div className="rounded-[14px] border border-[#f1dfd1] bg-[#fbf2ea] px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">
                Awaiting Admin Issue
              </p>
              <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">
                The 24-hour contract window has not started yet.
              </p>
            </div>
          ) : isAwaitingInvoice ? (
            <div className="rounded-[14px] border border-emerald-200 bg-emerald-50/70 px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                Awaiting Invoice
              </p>
              <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">
                {statusInfo.nextStep}
              </p>
            </div>
          ) : isInvoiceIssued ? (
            <div className="rounded-[14px] border border-[#f1dfd1] bg-[#fbf2ea] px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">
                Payment Required
              </p>
              <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">
                Review the invoice guidance and keep proof of payment ready.
              </p>
            </div>
          ) : showAnimatedActionCard ? (
            <PortalApplicationProgressCard
              status={
                application.status as
                  | "DOCUMENTS_SUBMITTED"
                  | "DOCUMENTS_UNDER_REVIEW"
                  | "ADDITIONAL_DOCUMENTS_REQUIRED"
              }
            />
          ) : (
            <div className="rounded-[14px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">
                Next Step
              </p>
              <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">
                {statusInfo.nextStep}
              </p>
            </div>
          )}
        </div>
      </PortalMobileSectionCard>

      {/* ── Contract Review (unaccepted) ── */}
      {isContractIssued && !isContractAccepted ? (
        <PortalMobileSectionCard
          eyebrow="Contract Review"
          title="Review and accept contract"
        >
          <div className="space-y-2">
            <div className="rounded-[14px] border border-[#e7eaf2] bg-[#fafbff] p-3">
              {(application.contractVehicleImage || selectedVehicle?.featuredImage) && (
                <div className="overflow-hidden rounded-[12px] bg-[#f4f6fb]">
                  <img
                    src={
                      application.contractVehicleImage ||
                      selectedVehicle?.featuredImage ||
                      ""
                    }
                    alt={
                      application.contractVehicleTitle ||
                      selectedVehicle?.title ||
                      "Vehicle"
                    }
                    className="h-[110px] w-full object-cover"
                  />
                </div>
              )}

              <div className="mt-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
                    Contract Vehicle
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">
                    {application.contractVehicleTitle ||
                      selectedVehicle?.title ||
                      "—"}
                  </p>
                </div>
                {contractIssuedAtText ? (
                  <span className="shrink-0 rounded-full border border-[#f1dfd1] bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#c37d43]">
                    {contractIssuedAtText}
                  </span>
                ) : null}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-[12px] border border-[#eef0f7] bg-white px-3 py-2">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                    Required Now
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#1b2345]">
                    {formatCurrency(contractTotalNowNum)}
                  </p>
                </div>
                <div className="rounded-[12px] border border-[#eef0f7] bg-white px-3 py-2">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                    Monthly
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#1b2345]">
                    {formatCurrency(contractMonthlyNum)}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[14px] border border-[#f1dfd1] bg-[#fbf2ea] px-3.5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">
                Contract Notice
              </p>
              <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">
                Review the full contract and complete acceptance within the
                active 24-hour window.
              </p>
            </div>

            <ContractReviewModal contract={contractDataForModal} />
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── Contract Accepted ── */}
      {isContractIssued && isContractAccepted ? (
        <PortalMobileSectionCard
          eyebrow="Contract Acceptance"
          title="Digital acceptance recorded"
        >
          <div className="rounded-[14px] border border-emerald-200 bg-emerald-50/70 px-3.5 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">
                  Accepted
                </p>
                {application.contractAcceptedName ? (
                  <p className="mt-1 text-[12.5px] font-semibold text-[#1b2345]">
                    {application.contractAcceptedName}
                  </p>
                ) : null}
                <p className="mt-1 text-[12px] leading-5 text-[#39425d]">
                  Your digital contract acceptance has been recorded.
                </p>
              </div>
              {acceptedAtText ? (
                <span className="shrink-0 rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700">
                  {acceptedAtText}
                </span>
              ) : null}
            </div>
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── Vehicle Summary ── */}
      {(isContractRequested || isInvoiceIssued || isAwaitingInvoice) &&
      selectedVehicle ? (
        <PortalMobileSectionCard
          eyebrow="Vehicle Summary"
          title="Selected vehicle"
        >
          <div className="space-y-2">
            <div className="rounded-[14px] border border-[#e7eaf2] bg-[#fafbff] p-3">
              {(displayVehicleImage || selectedVehicle.featuredImage) && (
                <div className="overflow-hidden rounded-[12px] bg-[#f4f6fb]">
                  <img
                    src={displayVehicleImage || selectedVehicle.featuredImage}
                    alt={displayVehicleTitle}
                    className="h-[110px] w-full object-cover"
                  />
                </div>
              )}

              <p className="mt-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
                Vehicle
              </p>
              <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">
                {displayVehicleTitle}
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {displayVehicleYear ? (
                  <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#2f67de]">
                    {displayVehicleYear}
                  </span>
                ) : null}
                {displayVehicleTransmission ? (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                    {displayVehicleTransmission}
                  </span>
                ) : null}
                {displayVehicleFuelType ? (
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                    {displayVehicleFuelType}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-[12px] border border-[#e7eaf2] bg-white px-3 py-2.5">
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                  Deposit
                </p>
                <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">
                  {isInvoiceIssued || isAwaitingInvoice
                    ? formatCurrency(contractDepositNum)
                    : formatCurrency(selectedVehicleDeposit)}
                </p>
              </div>
              <div className="rounded-[12px] border border-[#e7eaf2] bg-white px-3 py-2.5">
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                  Monthly
                </p>
                <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">
                  {isInvoiceIssued || isAwaitingInvoice
                    ? formatCurrency(contractMonthlyNum)
                    : formatCurrency(selectedVehicleMonthly)}
                </p>
              </div>
              <div className="rounded-[12px] border border-[#e7eaf2] bg-white px-3 py-2.5">
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                  Licensing
                </p>
                <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">
                  {isInvoiceIssued || isAwaitingInvoice
                    ? formatCurrency(contractLicensingNum)
                    : formatCurrency(LICENSING_AND_REGISTRATION_FEE)}
                </p>
              </div>
              <div className="rounded-[12px] border border-[#dbe6ff] bg-[#eef4ff] px-3 py-2.5">
                <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#2f67de]">
                  Required Now
                </p>
                <p className="mt-1 text-[12px] font-semibold text-[#1b2345]">
                  {isInvoiceIssued || isAwaitingInvoice
                    ? formatCurrency(contractTotalNowNum)
                    : formatCurrency(totalRequiredNow)}
                </p>
              </div>
            </div>
          </div>
        </PortalMobileSectionCard>
      ) : null}

      {/* ── Applicant Summary — compressed single card ── */}
      <PortalMobileSectionCard
        eyebrow="Applicant"
        title="Profile and files"
      >
        <div className="space-y-2">
          {/* Unified profile block */}
          <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] divide-y divide-[#eef0f8]">
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                Name
              </p>
              <p className="text-right text-[12.5px] font-semibold text-[#1b2345]">
                {application.fullName}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                Email
              </p>
              <p className="min-w-0 break-words text-right text-[12px] font-semibold text-[#1b2345]">
                {application.email}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                Phone
              </p>
              <p className="text-right text-[12px] font-semibold text-[#1b2345]">
                {application.phone}
              </p>
            </div>
            <div className="flex items-center justify-between gap-3 px-3.5 py-2.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                Documents
              </p>
              <p className="text-right text-[12px] font-semibold text-[#1b2345]">
                {application.documents.length}
              </p>
            </div>
          </div>

          <Link
            href="/portal/documents"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-5 py-3 text-sm font-semibold text-white"
          >
            Manage Documents
          </Link>
        </div>
      </PortalMobileSectionCard>

      {/* ── Status Timeline ── */}
      <PortalMobileSectionCard
        eyebrow="Status Timeline"
        title="Progress journey"
        badge={`${application.statusLogs.length} updates`}
      >
        {application.statusLogs.length === 0 ? (
          <div className="rounded-[18px] border-2 border-dashed border-[#d7d9e2] bg-[#fafbff] p-6 text-center text-sm text-[#68708a]">
            No progress updates yet.
          </div>
        ) : (
          <div className="space-y-2">
            {application.statusLogs
              .slice(0, 2)
              .map((log: StatusLogItem, index: number) => (
                <div
                  key={log.id}
                  className={`rounded-[14px] border px-3.5 py-3 ${
                    index === 0
                      ? "border-[#dbe6ff] bg-gradient-to-br from-[#eef4ff] via-white to-white"
                      : "border-[#e3e6ef] bg-[#fafbfe]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-semibold text-[#1b2345]">
                        {formatStatus(log.toStatus)}
                      </p>
                      <p className="mt-0.5 text-[11px] text-[#68708a]">
                        {formatCompactDateTime(log.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${
                        index === 0
                          ? "border border-[#2f67de]/30 bg-[#2f67de] text-white"
                          : "border border-[#dbe6ff] bg-[#eef4ff] text-[#2f67de]"
                      }`}
                    >
                      {index === 0 ? "Latest" : "Update"}
                    </span>
                  </div>
                  {log.note ? (
                    <p className="mt-2 text-[12px] leading-5 text-[#4d546a]">
                      {log.note}
                    </p>
                  ) : null}
                </div>
              ))}

            {application.statusLogs.length > 2 ? (
              <details className="group rounded-[14px] border border-[#e1e4ee] bg-[#fafbff]">
                <summary className="flex cursor-pointer list-none items-center justify-center gap-2 px-4 py-3 text-[12px] font-semibold text-[#1b2345] marker:content-none">
                  View {application.statusLogs.length - 2} more update
                  {application.statusLogs.length - 2 > 1 ? "s" : ""}
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
                  {application.statusLogs
                    .slice(2)
                    .map((log: StatusLogItem) => (
                      <div
                        key={log.id}
                        className="rounded-[12px] border border-[#e3e6ef] bg-white px-3.5 py-3"
                      >
                        <p className="text-[12.5px] font-semibold text-[#1b2345]">
                          {formatStatus(log.toStatus)}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#68708a]">
                          {formatCompactDateTime(log.createdAt)}
                        </p>
                        {log.note ? (
                          <p className="mt-2 text-[12px] leading-5 text-[#4d546a]">
                            {log.note}
                          </p>
                        ) : null}
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