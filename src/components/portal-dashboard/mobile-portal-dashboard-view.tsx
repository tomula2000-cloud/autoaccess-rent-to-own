import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApprovalCountdownCard from "@/components/approval-countdown-card";
import PortalApplicationProgressCard from "@/components/portal-application-progress-card";
import ContractReviewModal from "@/components/contract-review-modal";

type MobilePortalDashboardViewProps = {
  referenceNumber: string;
};

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

function getStatusExplanation(status: string) {
  switch (status) {
    case "APPLICATION_RECEIVED":
      return {
        title: "Application received",
        meaning:
          "We have received your application and created your profile in our system.",
        nextStep:
          "To proceed to next step with your application upload your documents.",
      };

    case "PRE_QUALIFICATION_REVIEW":
      return {
        title: "Under pre-qualification review",
        meaning: "Your information is currently under early-stage assessment.",
        nextStep:
          "Please keep checking for updates while your application is under review.",
      };

    case "PRE_QUALIFIED":
      return {
        title: "Pre-qualified",
        meaning:
          "Your application has passed the initial review stage successfully.",
        nextStep:
          "To proceed to next step with your application upload your documents.",
      };

    case "AWAITING_DOCUMENTS":
      return {
        title: "Awaiting documents",
        meaning:
          "Your application requires supporting documents before it can continue.",
        nextStep:
          "To proceed to next step with your application upload your documents.",
      };

    case "DOCUMENTS_SUBMITTED":
      return {
        title: "Documents submitted",
        meaning:
          "Your uploaded files have been received and linked to your application.",
        nextStep:
          "Your submitted documents are now moving through the next review stage.",
      };

    case "DOCUMENTS_UNDER_REVIEW":
      return {
        title: "Documents under review",
        meaning: "Your documents are currently being reviewed.",
        nextStep:
          "Please wait while we review your submitted documents and prepare the next stage.",
      };

    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return {
        title: "Additional documents required",
        meaning: "More supporting information is needed before proceeding.",
        nextStep:
          "Additional documents are still required before your application can continue.",
      };

    case "APPROVED_IN_PRINCIPLE":
      return {
        title: "Approved in principle",
        meaning:
          "Your application has progressed positively and has been approved in principle.",
        nextStep:
          "Choose your vehicle option and prepare for the next completion steps before approval expires.",
      };

    case "CONTRACT_REQUESTED":
      return {
        title: "Contract requested",
        meaning:
          "Your contract request has been submitted and is awaiting admin review before issue.",
        nextStep:
          "Please keep checking your portal. Once the contract is issued, a strict 24-hour completion period will begin.",
      };

    case "CONTRACT_ISSUED":
      return {
        title: "Contract issued",
        meaning:
          "Your contract has been issued and your completion stage is now active.",
        nextStep:
          "Review the full contract, complete your digital acceptance, and fulfil any outstanding payment requirements within the active contract period.",
      };

    case "CONTRACT_EXPIRED":
      return {
        title: "Contract expired",
        meaning:
          "The issued contract expired before completion of the required payment or final process.",
        nextStep:
          "Please wait for further guidance from admin regarding your application outcome.",
      };

    case "CONTRACT_CANCELLED":
      return {
        title: "Contract cancelled",
        meaning: "The contract stage has been cancelled on your application.",
        nextStep:
          "Please check your portal updates or contact support if you need clarification.",
      };

    case "AWAITING_INVOICE":
      return {
        title: "Awaiting invoice",
        meaning:
          "Your contract has been accepted and your application is now awaiting the release of your invoice by our team.",
        nextStep:
          "Please keep checking your portal. Once the invoice is issued, further payment instructions will be provided.",
      };

    case "INVOICE_ISSUED":
      return {
        title: "Invoice issued",
        meaning:
          "Your invoice has now been released and payment is required to proceed with the next completion stage.",
        nextStep:
          "Review your invoice guidance carefully, use the correct reference number, and prepare your payment using the instructions shown below.",
      };

    case "AWAITING_PAYMENT":
      return {
        title: "Awaiting payment",
        meaning: "Payment is required before your application can continue.",
        nextStep:
          "Complete the required payment and keep proof ready if needed.",
      };

    case "PAYMENT_UNDER_VERIFICATION":
      return {
        title: "Payment under verification",
        meaning:
          "Your payment information has been received and is being verified.",
        nextStep:
          "No further action is usually needed right now. Please wait for confirmation.",
      };

    case "PAYMENT_CONFIRMED":
      return {
        title: "Payment confirmed",
        meaning: "Your payment has been successfully confirmed.",
        nextStep:
          "Your application is progressing well. Keep checking for the next milestone.",
      };

    case "COMPLETED":
      return {
        title: "Completed",
        meaning:
          "Your application process has been completed successfully.",
        nextStep:
          "No further action is currently required unless our team contacts you.",
      };

    case "DECLINED":
      return {
        title: "Application update",
        meaning:
          "We are unable to proceed with your application at this stage.",
        nextStep:
          "Review any notes in your portal and contact the team if you need clarification.",
      };

    default:
      return {
        title: formatStatus(status),
        meaning: "Your application has been updated.",
        nextStep:
          "Please continue checking your portal for the latest progress.",
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
      return {
        total: "18%",
        gradient: "from-[#2f67de] to-[#4f86f7]",
        glow: "shadow-[0_0_18px_rgba(47,103,222,0.45)]",
      };
    case "PRE_QUALIFICATION_REVIEW":
      return {
        total: "30%",
        gradient: "from-[#2f67de] to-[#5f8ff2]",
        glow: "shadow-[0_0_18px_rgba(47,103,222,0.45)]",
      };
    case "PRE_QUALIFIED":
      return {
        total: "42%",
        gradient: "from-[#3f6fe0] to-[#d59758]",
        glow: "shadow-[0_0_18px_rgba(213,151,88,0.35)]",
      };
    case "AWAITING_DOCUMENTS":
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
      return {
        total: "55%",
        gradient: "from-[#d59758] to-[#e4ad72]",
        glow: "shadow-[0_0_18px_rgba(213,151,88,0.45)]",
      };
    case "DOCUMENTS_SUBMITTED":
      return {
        total: "65%",
        gradient: "from-[#2f67de] to-[#6fb482]",
        glow: "shadow-[0_0_18px_rgba(47,103,222,0.35)]",
      };
    case "DOCUMENTS_UNDER_REVIEW":
      return {
        total: "72%",
        gradient: "from-[#2f67de] to-[#8aa8f7]",
        glow: "shadow-[0_0_18px_rgba(47,103,222,0.45)]",
      };
    case "APPROVED_IN_PRINCIPLE":
      return {
        total: "82%",
        gradient: "from-[#4b8f66] to-[#6fb482]",
        glow: "shadow-[0_0_18px_rgba(111,180,130,0.45)]",
      };
    case "CONTRACT_REQUESTED":
      return {
        total: "86%",
        gradient: "from-[#4b8f66] to-[#d59758]",
        glow: "shadow-[0_0_18px_rgba(213,151,88,0.3)]",
      };
    case "CONTRACT_ISSUED":
    case "AWAITING_INVOICE":
    case "INVOICE_ISSUED":
    case "AWAITING_PAYMENT":
      return {
        total: "90%",
        gradient: "from-[#d59758] to-[#efbb85]",
        glow: "shadow-[0_0_18px_rgba(213,151,88,0.45)]",
      };
    case "PAYMENT_UNDER_VERIFICATION":
      return {
        total: "94%",
        gradient: "from-[#2f67de] to-[#6fb482]",
        glow: "shadow-[0_0_18px_rgba(47,103,222,0.35)]",
      };
    case "PAYMENT_CONFIRMED":
    case "COMPLETED":
      return {
        total: "100%",
        gradient: "from-[#4b8f66] to-[#6fb482]",
        glow: "shadow-[0_0_22px_rgba(111,180,130,0.55)]",
      };
    default:
      return {
        total: "28%",
        gradient: "from-[#2f67de] to-[#4f86f7]",
        glow: "shadow-[0_0_18px_rgba(47,103,222,0.45)]",
      };
  }
}

function getTimelineTone(status: string) {
  switch (status) {
    case "COMPLETED":
    case "PAYMENT_CONFIRMED":
    case "APPROVED_IN_PRINCIPLE":
      return {
        dot: "bg-[#6fb482]",
        ring: "border-[#d4eddc]",
      };
    case "CONTRACT_REQUESTED":
    case "CONTRACT_ISSUED":
    case "AWAITING_DOCUMENTS":
    case "ADDITIONAL_DOCUMENTS_REQUIRED":
    case "AWAITING_PAYMENT":
    case "AWAITING_INVOICE":
    case "INVOICE_ISSUED":
      return {
        dot: "bg-[#d59758]",
        ring: "border-[#f1dfd1]",
      };
    case "DECLINED":
    case "CONTRACT_EXPIRED":
    case "CONTRACT_CANCELLED":
      return {
        dot: "bg-[#d35b5b]",
        ring: "border-[#f1caca]",
      };
    default:
      return {
        dot: "bg-[#2f67de]",
        ring: "border-[#d8e4ff]",
      };
  }
}

const LICENSING_AND_REGISTRATION_FEE = 1850;

function MobilePortalHero({
  application,
  statusInfo,
  statusLabel,
  isApprovedInPrinciple,
  isContractRequested,
  isContractIssued,
  isAwaitingInvoice,
  isInvoiceIssued,
}: {
  application: {
    referenceNumber: string;
    status: string;
  };
  statusInfo: {
    title: string;
    meaning: string;
    nextStep: string;
  };
  statusLabel: string;
  isApprovedInPrinciple: boolean;
  isContractRequested: boolean;
  isContractIssued: boolean;
  isAwaitingInvoice: boolean;
  isInvoiceIssued: boolean;
}) {
  const isWarmStage =
    isContractRequested ||
    isContractIssued ||
    isInvoiceIssued ||
    application.status === "AWAITING_PAYMENT";

  const isGreenStage = isApprovedInPrinciple || isAwaitingInvoice;

  return (
    <section
      className={`relative overflow-hidden rounded-[28px] border shadow-[0_20px_50px_-18px_rgba(15,23,42,0.22)] ${
        isGreenStage
          ? "border-emerald-200/60 bg-gradient-to-br from-[#0a3b2a] via-[#0f5239] to-[#137a52]"
          : isWarmStage
          ? "border-[#f1dfd1] bg-gradient-to-br from-[#fffaf5] via-[#fffdfb] to-[#fbf2ea]"
          : "border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375]"
      } p-5`}
    >
      <div className="absolute inset-0">
        <div
          className={`absolute -left-10 -top-10 h-40 w-40 rounded-full blur-3xl ${
            isGreenStage
              ? "bg-emerald-400/20"
              : isWarmStage
              ? "bg-[#f4c89a]/25"
              : "bg-[#2f67de]/25"
          }`}
        />
        <div
          className={`absolute -right-8 bottom-0 h-32 w-32 rounded-full blur-3xl ${
            isGreenStage ? "bg-green-300/15" : "bg-[#d59758]/15"
          }`}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-2 w-2 animate-pulse rounded-full ${
              isGreenStage
                ? "bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]"
                : isWarmStage
                ? "bg-[#d59758] shadow-[0_0_12px_rgba(213,151,88,0.7)]"
                : "bg-[#7ea8ff] shadow-[0_0_12px_rgba(126,168,255,0.9)]"
            }`}
          />
          <p
            className={`text-[10px] font-semibold uppercase tracking-[0.28em] ${
              isGreenStage
                ? "text-emerald-200/90"
                : isWarmStage
                ? "text-[#c37d43]"
                : "text-blue-200/90"
            }`}
          >
            Auto Access · Client Portal
          </p>
        </div>

        <h1
          className={`mt-4 text-[1.9rem] font-semibold leading-[1.02] tracking-tight ${
            isGreenStage
              ? "text-white"
              : isWarmStage
              ? "text-[#1b2345]"
              : "text-white"
          }`}
        >
          {isApprovedInPrinciple ? (
            <>
              Approval <span className="text-emerald-300">confirmed.</span>
              <br />
              Continue your journey.
            </>
          ) : isContractRequested ? (
            <>
              Contract request
              <br />
              <span className="text-[#d59758]">submitted successfully.</span>
            </>
          ) : isContractIssued ? (
            <>
              Contract issued.
              <br />
              <span className="text-[#d59758]">Completion stage active.</span>
            </>
          ) : isAwaitingInvoice ? (
            <>
              Contract accepted.
              <br />
              <span className="text-emerald-300">Awaiting invoice.</span>
            </>
          ) : isInvoiceIssued ? (
            <>
              Your invoice has
              <br />
              <span className="text-[#d59758]">been released.</span>
            </>
          ) : application.status === "AWAITING_PAYMENT" ? (
            <>
              Payment is now
              <br />
              <span className="text-[#d59758]">required to continue.</span>
            </>
          ) : application.status === "PAYMENT_UNDER_VERIFICATION" ? (
            <>
              Payment under
              <br />
              <span className="text-[#9cc0ff]">verification.</span>
            </>
          ) : application.status === "PAYMENT_CONFIRMED" ||
            application.status === "COMPLETED" ? (
            <>
              Payment confirmed.
              <br />
              <span className="text-emerald-300">Progress secured.</span>
            </>
          ) : (
            <>
              Welcome back,
              <br />
              <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                track your application.
              </span>
            </>
          )}
        </h1>

        <p
          className={`mt-4 text-[13px] leading-6 ${
            isGreenStage
              ? "text-emerald-50/80"
              : isWarmStage
              ? "text-[#4d546a]"
              : "text-blue-50/75"
          }`}
        >
          {statusInfo.meaning} {statusInfo.nextStep}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] ${
              isGreenStage
                ? "border border-emerald-300/40 bg-emerald-500/15 text-emerald-100"
                : isWarmStage
                ? "border border-[#f1dfd1] bg-white text-[#c37d43]"
                : "border border-white/15 bg-white/5 text-white/90 backdrop-blur"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isGreenStage
                  ? "bg-emerald-300"
                  : isWarmStage
                  ? "bg-[#d59758]"
                  : "bg-[#7ea8ff]"
              }`}
            />
            {statusLabel}
          </span>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[10px] font-medium ${
              isGreenStage
                ? "border border-white/15 bg-white/5 text-emerald-50/90"
                : isWarmStage
                ? "border border-[#f1dfd1] bg-white text-[#4d546a]"
                : "border border-white/15 bg-white/5 text-blue-50/85"
            }`}
          >
            Ref <span className="font-mono">{application.referenceNumber}</span>
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2">
          {isApprovedInPrinciple ? (
            <>
              <Link
                href="/portal/select-vehicle"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0f5239] shadow-[0_14px_30px_-10px_rgba(255,255,255,0.35)]"
              >
                Choose Your Vehicle
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur"
              >
                View Full Gallery
              </Link>
            </>
          ) : isContractIssued ? (
            <a
              href="#contract-review-section"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b2345] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(27,35,69,0.32)]"
            >
              Review Contract
            </a>
          ) : isInvoiceIssued || application.status === "AWAITING_PAYMENT" ? (
            <a
              href="#invoice-payment-section"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b2345] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(27,35,69,0.32)]"
            >
              Review Payment Stage
            </a>
          ) : (
            <a
              href="#portal-progress-section"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1b2345] shadow-[0_14px_30px_-10px_rgba(255,255,255,0.2)]"
            >
              View Progress
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default async function MobilePortalDashboardView({
  referenceNumber,
}: MobilePortalDashboardViewProps) {
  const cookieStore = await cookies();
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
  const progress = getProgressState(application.status);
  const approvalValidUntilIso = application.approvalValidUntil
    ? new Date(application.approvalValidUntil).toISOString()
    : null;
  const contractExpiresAtIso = application.contractExpiresAt
    ? new Date(application.contractExpiresAt).toISOString()
    : null;

  const showAnimatedActionCard =
    application.status === "DOCUMENTS_SUBMITTED" ||
    application.status === "DOCUMENTS_UNDER_REVIEW" ||
    application.status === "ADDITIONAL_DOCUMENTS_REQUIRED";

  const isApprovedInPrinciple = application.status === "APPROVED_IN_PRINCIPLE";
  const isContractRequested = application.status === "CONTRACT_REQUESTED";
  const isContractIssued = application.status === "CONTRACT_ISSUED";
  const isAwaitingInvoice = application.status === "AWAITING_INVOICE";
  const isInvoiceIssued = application.status === "INVOICE_ISSUED";
  const isContractAccepted = application.contractAccepted === true;

  const progressNumeric = parseInt(progress.total.replace("%", ""), 10);

  const journeyStages = [
    { label: "Application", threshold: 18 },
    { label: "Review", threshold: 35 },
    { label: "Documents", threshold: 60 },
    { label: "Approval", threshold: 82 },
    { label: "Completion", threshold: 100 },
  ];

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
    application.contractVehicleTransmission ||
    selectedVehicle?.transmission ||
    null;
  const displayVehicleFuelType =
    application.contractVehicleFuelType || selectedVehicle?.fuelType || null;
  const displayVehicleMileage =
    application.contractVehicleMileage || selectedVehicle?.mileage || null;

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

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-4 py-6 text-black">
      <div className="mx-auto max-w-md space-y-4">
        <MobilePortalHero
          application={application}
          statusInfo={statusInfo}
          statusLabel={statusLabel}
          isApprovedInPrinciple={isApprovedInPrinciple}
          isContractRequested={isContractRequested}
          isContractIssued={isContractIssued}
          isAwaitingInvoice={isAwaitingInvoice}
          isInvoiceIssued={isInvoiceIssued}
        />

        {(application.status === "APPROVED_IN_PRINCIPLE" && approvalValidUntilIso) ? (
          <ApprovalCountdownCard approvalValidUntil={approvalValidUntilIso} />
        ) : null}

        {(application.status === "CONTRACT_ISSUED" && contractExpiresAtIso) ? (
          <ApprovalCountdownCard
            approvalValidUntil={contractExpiresAtIso}
            mode="contract"
          />
        ) : null}

        <section
          id="portal-progress-section"
          className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_10px_28px_-12px_rgba(15,23,42,0.10)]"
        >
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">
              Application Progress
            </p>
            <h2 className="mt-1 text-[1.05rem] font-semibold text-white">
              Your journey at a glance
            </h2>
          </div>

          <div className="p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                  Current Stage
                </p>
                <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                  {statusInfo.title}
                </p>
              </div>
              <div className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1.5 text-xs font-semibold text-[#2f67de]">
                {progress.total}
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-[#eef0f7]">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${progress.gradient} ${progress.glow}`}
                style={{ width: progress.total }}
              />
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {journeyStages.map((stage) => {
                const active = progressNumeric >= stage.threshold;
                return (
                  <div key={stage.label} className="text-center">
                    <div
                      className={`mx-auto h-2.5 w-2.5 rounded-full ${
                        active ? "bg-[#2f67de]" : "bg-[#d7dce9]"
                      }`}
                    />
                    <p
                      className={`mt-2 text-[10px] leading-4 ${
                        active ? "font-semibold text-[#1b2345]" : "text-[#8a93ab]"
                      }`}
                    >
                      {stage.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                Next Step
              </p>
              <p className="mt-2 text-sm leading-6 text-[#39425d]">
                {statusInfo.nextStep}
              </p>
            </div>
          </div>
        </section>

        {showAnimatedActionCard ? (
          <PortalApplicationProgressCard
            status={
              application.status as
                | "DOCUMENTS_SUBMITTED"
                | "DOCUMENTS_UNDER_REVIEW"
                | "ADDITIONAL_DOCUMENTS_REQUIRED"
            }
          />
        ) : null}

        {(selectedVehicle || application.contractVehicleTitle) && (
          <section className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_10px_28px_-12px_rgba(15,23,42,0.10)]">
            <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">
                Vehicle Summary
              </p>
              <h2 className="mt-1 text-[1.05rem] font-semibold text-white">
                Selected vehicle details
              </h2>
            </div>

            <div className="p-4">
              {displayVehicleImage ? (
                <div className="overflow-hidden rounded-[18px] border border-[#eef0f7]">
                  <img
                    src={displayVehicleImage}
                    alt={displayVehicleTitle}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : null}

              <h3 className="mt-4 text-lg font-semibold tracking-tight text-[#1b2345]">
                {displayVehicleTitle}
              </h3>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {displayVehicleYear ? (
                  <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                      Year
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                      {displayVehicleYear}
                    </p>
                  </div>
                ) : null}
                {displayVehicleTransmission ? (
                  <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                      Transmission
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                      {displayVehicleTransmission}
                    </p>
                  </div>
                ) : null}
                {displayVehicleFuelType ? (
                  <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                      Fuel Type
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                      {displayVehicleFuelType}
                    </p>
                  </div>
                ) : null}
                {displayVehicleMileage ? (
                  <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-3 py-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                      Mileage
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                      {displayVehicleMileage}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        )}

        {isContractIssued && !isContractAccepted ? (
          <section
            id="contract-review-section"
            className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_10px_28px_-12px_rgba(15,23,42,0.10)]"
          >
            <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">
                Contract Review
              </p>
              <h2 className="mt-1 text-[1.05rem] font-semibold text-white">
                Review and accept contract
              </h2>
            </div>

            <div className="p-4 space-y-4">
              <div className="rounded-[18px] border border-[#f1dfd1] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                  Contract Notice
                </p>
                <p className="mt-2 text-sm leading-6 text-[#39425d]">
                  Your contract has been formally issued. A strict 24-hour completion
                  window now applies.
                </p>
              </div>

              <div>
                <ContractReviewModal contract={contractDataForModal} />
              </div>

              <form action="/api/portal/accept-contract" method="POST" className="space-y-4">
                <label className="flex cursor-pointer items-start gap-3 rounded-[16px] border border-[#e1e4ee] bg-[#fafbff] p-4">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    value="yes"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#d59758]"
                  />
                  <span className="text-sm leading-6 text-[#39425d]">
                    I confirm that I have reviewed the full contract and understand
                    the active completion period.
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-[16px] border border-[#e1e4ee] bg-[#fafbff] p-4">
                  <input
                    type="checkbox"
                    name="confirmedDetails"
                    value="yes"
                    required
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#d59758]"
                  />
                  <span className="text-sm leading-6 text-[#39425d]">
                    I confirm that my details and selected vehicle information are correct.
                  </span>
                </label>

                <div className="rounded-[16px] border border-[#e1e4ee] bg-white p-4">
                  <label
                    htmlFor="acceptedName"
                    className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]"
                  >
                    Digital Signature
                  </label>
                  <input
                    type="text"
                    id="acceptedName"
                    name="acceptedName"
                    required
                    placeholder="Type your full legal name"
                    className="mt-3 w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-4 py-3 text-sm font-medium text-[#1b2345] placeholder-[#a3aac0] outline-none transition focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#c37d43] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)]"
                >
                  Accept Contract and Continue
                </button>
              </form>
            </div>
          </section>
        ) : null}

        {isContractIssued && isContractAccepted ? (
          <section className="overflow-hidden rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 shadow-[0_10px_28px_-12px_rgba(16,185,129,0.15)]">
            <div className="border-b border-emerald-100 bg-gradient-to-r from-[#0a3b2a] to-[#0f5239] px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200">
                Contract Acceptance
              </p>
              <h2 className="mt-1 text-[1.05rem] font-semibold text-white">
                Digital acceptance recorded
              </h2>
            </div>

            <div className="p-4">
              <p className="text-sm leading-6 text-[#39425d]">
                Your contract acceptance has been recorded successfully.
              </p>
              {application.contractAcceptedName ? (
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Signed by{" "}
                  <span className="font-mono normal-case tracking-normal text-[#1b2345]">
                    {application.contractAcceptedName}
                  </span>
                </p>
              ) : null}
              {application.contractAcceptedAt ? (
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                  Accepted on{" "}
                  <span className="font-mono normal-case tracking-normal text-[#1b2345]">
                    {new Date(application.contractAcceptedAt).toLocaleString()}
                  </span>
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {(isApprovedInPrinciple ||
          isContractIssued ||
          isInvoiceIssued ||
          application.status === "AWAITING_PAYMENT" ||
          isAwaitingInvoice) && (
          <section
            id="invoice-payment-section"
            className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_10px_28px_-12px_rgba(15,23,42,0.10)]"
          >
            <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">
                Completion Summary
              </p>
              <h2 className="mt-1 text-[1.05rem] font-semibold text-white">
                Payment and readiness
              </h2>
            </div>

            <div className="p-4">
              <div className="space-y-3 rounded-[18px] border border-[#eef0f7] bg-[#fafbff] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#68708a]">Deposit</span>
                  <span className="text-sm font-semibold text-[#1b2345]">
                    {formatCurrency(contractDepositNum || selectedVehicleDeposit)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-[#68708a]">Licensing & Registration</span>
                  <span className="text-sm font-semibold text-[#1b2345]">
                    {formatCurrency(
                      contractLicensingNum || LICENSING_AND_REGISTRATION_FEE
                    )}
                  </span>
                </div>

                <div className="border-t border-[#e8edf7] pt-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-[#1b2345]">
                    Total Required Now
                  </span>
                  <span className="text-lg font-semibold text-[#2f67de]">
                    {formatCurrency(contractTotalNowNum || totalRequiredNow)}
                  </span>
                </div>

                <div className="border-t border-[#e8edf7] pt-3 flex items-center justify-between gap-3">
                  <span className="text-sm text-[#68708a]">First Monthly Instalment</span>
                  <span className="text-sm font-semibold text-[#1b2345]">
                    {formatCurrency(contractMonthlyNum || selectedVehicleMonthly)}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                  Readiness Reminder
                </p>
                <p className="mt-2 text-sm leading-6 text-[#39425d]">
                  Always use your correct application reference and keep proof of
                  payment ready for the verification stage.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_10px_28px_-12px_rgba(15,23,42,0.10)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">
              Account Overview
            </p>
            <h2 className="mt-1 text-[1.05rem] font-semibold text-white">
              Portal information
            </h2>
          </div>

          <div className="p-4 space-y-3">
            <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                Applicant
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                {application.fullName}
              </p>
            </div>

            <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                Email
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1b2345] break-all">
                {application.email}
              </p>
            </div>

            <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                Phone
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                {application.phone}
              </p>
            </div>

            <div className="rounded-[16px] border border-[#eef0f7] bg-[#fafbff] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                Reference Number
              </p>
              <p className="mt-1 font-mono text-sm font-semibold text-[#1b2345]">
                {application.referenceNumber}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_10px_28px_-12px_rgba(15,23,42,0.10)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">
              Status Timeline
            </p>
            <h2 className="mt-1 text-[1.05rem] font-semibold text-white">
              Progress journey
            </h2>
          </div>

          <div className="p-4">
            {application.statusLogs.length === 0 ? (
              <div className="rounded-[18px] border-2 border-dashed border-[#d7d9e2] bg-[#fafbff] p-6 text-center text-sm text-[#68708a]">
                No progress updates yet.
              </div>
            ) : (
              <div className="relative space-y-5">
                <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#dbe6ff] via-[#e4e8f3] to-transparent" />

                {application.statusLogs.map((log: StatusLogItem, index: number) => {
                  const tone = getTimelineTone(log.toStatus);
                  const isLatest = index === 0;

                  return (
                    <div key={log.id} className="relative flex gap-4">
                      <div className="relative z-10 flex w-8 shrink-0 justify-center">
                        <div
                          className={`relative flex h-8 w-8 items-center justify-center rounded-full border-4 bg-white ${tone.ring} ${
                            isLatest ? "ring-4 ring-[#2f67de]/10" : ""
                          }`}
                        >
                          <div
                            className={`h-2.5 w-2.5 rounded-full ${tone.dot} ${
                              isLatest ? "animate-pulse" : ""
                            }`}
                          />
                        </div>
                      </div>

                      <div
                        className={`min-w-0 flex-1 rounded-[18px] border p-4 ${
                          isLatest
                            ? "border-[#dbe6ff] bg-gradient-to-br from-[#eef4ff] via-white to-white shadow-[0_8px_20px_-10px_rgba(47,103,222,0.25)]"
                            : "border-[#e3e6ef] bg-[#fafbfe]"
                        }`}
                      >
                        <div className="flex flex-col gap-2">
                          <p className="break-words text-sm font-semibold text-[#1b2345]">
                            {formatStatus(log.toStatus)}
                          </p>
                          <p className="break-words text-xs text-[#68708a]">
                            {new Date(log.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="mt-3 break-words text-sm leading-6 text-[#4d546a]">
                          {log.note || "No additional note provided."}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col items-center justify-between gap-4 rounded-[20px] border border-[#e1e4ee] bg-gradient-to-r from-[#fafbff] to-white px-5 py-4">
          <div className="flex items-center gap-3 text-center">
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
                Auto Access · Encrypted Portal
              </p>
            </div>
          </div>

          <form action="/api/portal-logout" method="post" className="w-full">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1d2240] bg-[#1d2240] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a3563]"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}