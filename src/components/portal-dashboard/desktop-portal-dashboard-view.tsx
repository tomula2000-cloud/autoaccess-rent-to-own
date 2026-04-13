import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApprovalCountdownCard from "@/components/approval-countdown-card";
import PortalApplicationProgressCard from "@/components/portal-application-progress-card";
import ContractReviewModal from "@/components/contract-review-modal";

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

export default async function ClientPortalPage() {
  const cookieStore = await cookies();
  const referenceNumber = cookieStore.get("autoaccess_portal_ref")?.value;
  const email = cookieStore.get("autoaccess_portal_email")?.value;

  if (!referenceNumber || !email) {
    redirect("/portal-login");
  }

  const application = await prisma.application.findUnique({
    where: {
      referenceNumber,
    },
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
      statusLogs: {
        orderBy: {
          createdAt: "desc",
        },
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
          {isApprovedInPrinciple ? (
            <section className="relative overflow-hidden rounded-[36px] border border-emerald-200/60 bg-gradient-to-br from-[#0a3b2a] via-[#0f5239] to-[#137a52] p-10 shadow-[0_30px_80px_-20px_rgba(16,80,55,0.45)]">
              <div className="absolute inset-0">
                <div className="absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="absolute -right-16 top-10 h-[320px] w-[320px] rounded-full bg-green-300/15 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.07]"
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
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200/90">
                      Auto Access · Client Portal
                    </p>
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-[2.85rem]">
                    Approval <span className="text-emerald-300">Confirmed.</span>
                    <br />
                    Your journey continues.
                  </h1>

                  <p className="mt-5 max-w-xl text-[15px] leading-7 text-emerald-50/80">
                    Your application has been approved in principle. Select your
                    preferred vehicle option and prepare for the next completion
                    steps within the active approval period.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      {statusLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-emerald-50/80 backdrop-blur">
                      Ref{" "}
                      <span className="font-mono text-white">
                        {application.referenceNumber}
                      </span>
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      href="/portal/select-vehicle"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[#0f5239] shadow-[0_14px_30px_-10px_rgba(255,255,255,0.35)] transition hover:-translate-y-px hover:bg-emerald-50"
                    >
                      Choose Your Vehicle
                      <svg
                        className="h-4 w-4"
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
                    </Link>

                    <Link
                      href="/gallery"
                      className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
                    >
                      View Full Gallery
                    </Link>
                  </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/30 blur-2xl" />
                    <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-emerald-300/40 bg-gradient-to-br from-emerald-500/30 to-emerald-700/40 backdrop-blur-xl">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_20px_50px_-10px_rgba(16,185,129,0.6)]">
                        <svg
                          className="h-14 w-14 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : isContractRequested ? (
            <section className="relative overflow-hidden rounded-[36px] border border-[#f1dfd1] bg-gradient-to-br from-[#fffaf5] via-[#fffdfb] to-[#fbf2ea] p-10 shadow-[0_30px_80px_-20px_rgba(213,151,88,0.28)]">
              <div className="absolute inset-0">
                <div className="absolute -left-20 -top-20 h-[360px] w-[360px] rounded-full bg-[#f4c89a]/20 blur-3xl" />
                <div className="absolute -right-16 top-10 h-[300px] w-[300px] rounded-full bg-[#d59758]/12 blur-3xl" />
              </div>

              <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#d59758] shadow-[0_0_12px_rgba(213,151,88,0.7)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c37d43]">
                      Auto Access · Contract Stage
                    </p>
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-[#1b2345] md:text-[2.85rem]">
                    Contract request
                    <br />
                    <span className="text-[#d59758]">
                      submitted successfully.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#4d546a]">
                    Your request has been received and is currently awaiting
                    admin review. Once your contract is issued, the original
                    approval period will no longer apply and a strict 24-hour
                    completion window will begin.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#f1dfd1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c37d43]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d59758]" />
                      {statusLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#f1dfd1] bg-white px-4 py-2 text-xs font-medium text-[#4d546a]">
                      Ref{" "}
                      <span className="font-mono text-[#1b2345]">
                        {application.referenceNumber}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#f1dfd1] bg-white/90 p-6 shadow-[0_16px_36px_-16px_rgba(213,151,88,0.22)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c37d43]">
                    Waiting For
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-[#1b2345]">
                    Contract Issue
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#4d546a]">
                    No 24-hour countdown is active yet. It will begin only after
                    admin formally issues the contract.
                  </p>
                </div>
              </div>
            </section>
          ) : isContractIssued ? (
            <section className="relative overflow-hidden rounded-[36px] border border-[#f1dfd1] bg-gradient-to-br from-[#fffaf5] via-[#fffdfb] to-[#fbf2ea] p-10 shadow-[0_30px_80px_-20px_rgba(213,151,88,0.28)]">
              <div className="absolute inset-0">
                <div className="absolute -left-20 -top-20 h-[360px] w-[360px] rounded-full bg-[#f4c89a]/20 blur-3xl" />
                <div className="absolute -right-16 top-10 h-[300px] w-[300px] rounded-full bg-[#d59758]/12 blur-3xl" />
              </div>

              <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#d59758] shadow-[0_0_12px_rgba(213,151,88,0.7)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c37d43]">
                      Auto Access · Contract Issued
                    </p>
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-[#1b2345] md:text-[2.85rem]">
                    Your contract has
                    <br />
                    <span className="text-[#d59758]">been issued.</span>
                  </h1>

                  <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#4d546a]">
                    Your completion stage is now active. Please review the full
                    contract, complete your digital acceptance, and fulfil all
                    outstanding payment requirements within the contract window
                    currently assigned to your application.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#f1dfd1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c37d43]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d59758]" />
                      {statusLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#f1dfd1] bg-white px-4 py-2 text-xs font-medium text-[#4d546a]">
                      Ref{" "}
                      <span className="font-mono text-[#1b2345]">
                        {application.referenceNumber}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#f1dfd1] bg-white/90 p-6 shadow-[0_16px_36px_-16px_rgba(213,151,88,0.22)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c37d43]">
                    Completion Stage
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-[#1b2345]">
                    {isContractAccepted
                      ? "Contract Accepted"
                      : "Review & Accept Contract"}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#4d546a]">
                    {isContractAccepted
                      ? "Your contract has been digitally accepted. Awaiting invoice release."
                      : "Review the full contract carefully, then complete your digital acceptance below."}
                  </p>
                </div>
              </div>
            </section>
          ) : isAwaitingInvoice ? (
            <section className="relative overflow-hidden rounded-[36px] border border-emerald-200/60 bg-gradient-to-br from-[#0a3b2a] via-[#0f5239] to-[#137a52] p-10 shadow-[0_30px_80px_-20px_rgba(16,80,55,0.45)]">
              <div className="absolute inset-0">
                <div className="absolute -left-20 -top-20 h-[380px] w-[380px] rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="absolute -right-16 top-10 h-[320px] w-[320px] rounded-full bg-green-300/15 blur-3xl" />
                <div
                  className="absolute inset-0 opacity-[0.07]"
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
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-emerald-200/90">
                      Auto Access · Contract Accepted
                    </p>
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-[2.85rem]">
                    Contract accepted.
                    <br />
                    <span className="text-emerald-300">Awaiting invoice.</span>
                  </h1>

                  <p className="mt-5 max-w-xl text-[15px] leading-7 text-emerald-50/80">
                    Your digital contract acceptance has been recorded. Your
                    application is now awaiting the release of your invoice by
                    our team. Please continue checking your portal for the next
                    milestone.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      {statusLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-emerald-50/80 backdrop-blur">
                      Ref{" "}
                      <span className="font-mono text-white">
                        {application.referenceNumber}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  <div className="relative">
                    <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/30 blur-2xl" />
                    <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-emerald-300/40 bg-gradient-to-br from-emerald-500/30 to-emerald-700/40 backdrop-blur-xl">
                      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_20px_50px_-10px_rgba(16,185,129,0.6)]">
                        <svg
                          className="h-14 w-14 text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ) : isInvoiceIssued ? (
            <section className="relative overflow-hidden rounded-[36px] border border-[#f1dfd1] bg-gradient-to-br from-[#fffaf5] via-[#fffdfb] to-[#fbf2ea] p-10 shadow-[0_30px_80px_-20px_rgba(213,151,88,0.28)]">
              <div className="absolute inset-0">
                <div className="absolute -left-20 -top-20 h-[360px] w-[360px] rounded-full bg-[#f4c89a]/20 blur-3xl" />
                <div className="absolute -right-16 top-10 h-[300px] w-[300px] rounded-full bg-[#d59758]/12 blur-3xl" />
              </div>

              <div className="relative grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[#d59758] shadow-[0_0_12px_rgba(213,151,88,0.7)]" />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#c37d43]">
                      Auto Access · Invoice Issued
                    </p>
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-[#1b2345] md:text-[2.85rem]">
                    Your invoice has
                    <br />
                    <span className="text-[#d59758]">been released.</span>
                  </h1>

                  <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#4d546a]">
                    Your invoice stage is now active. Please review the payment
                    summary and instructions carefully, use your correct
                    application reference, and prepare payment to proceed with
                    the next step.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#f1dfd1] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#c37d43]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d59758]" />
                      {statusLabel}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#f1dfd1] bg-white px-4 py-2 text-xs font-medium text-[#4d546a]">
                      Ref{" "}
                      <span className="font-mono text-[#1b2345]">
                        {application.referenceNumber}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="rounded-[28px] border border-[#f1dfd1] bg-white/90 p-6 shadow-[0_16px_36px_-16px_rgba(213,151,88,0.22)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c37d43]">
                    Payment Stage
                  </p>
                  <p className="mt-3 text-2xl font-semibold text-[#1b2345]">
                    Awaiting Client Payment
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#4d546a]">
                    Review your invoice guidance below, make payment using the
                    correct reference number, and keep proof of payment ready for
                    the verification stage.
                  </p>
                </div>
              </div>
            </section>
          ) : (
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
                      Auto Access · Client Portal
                    </p>
                  </div>

                  <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-[2.85rem]">
                    Track your application
                    <br />
                    <span className="bg-gradient-to-r from-[#9cc0ff] via-white to-[#f4c89a] bg-clip-text text-transparent">
                      in real time.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-[15px] leading-7 text-blue-50/75">
                    Monitor your status, review next steps and manage your
                    rent-to-own journey from one premium command centre — built
                    for clarity, speed and trust.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4c89a] backdrop-blur">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a]" />
                      {statusLabel}
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
                      <svg
                        className="absolute inset-0 -rotate-90"
                        viewBox="0 0 100 100"
                      >
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
                          stroke="url(#heroGrad)"
                          strokeWidth="6"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${
                            (progressNumeric / 100) * 276
                          } 276`}
                        />
                        <defs>
                          <linearGradient
                            id="heroGrad"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#7ea8ff" />
                            <stop offset="100%" stopColor="#f4c89a" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-200/70">
                          Progress
                        </p>
                        <p className="mt-1 text-3xl font-semibold tabular-nums text-white">
                          {progress.total}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="mt-6 overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2">
          <div className="rounded-[26px] bg-white p-5 md:p-7">
            <div className="md:hidden text-center">
              {isApprovedInPrinciple ? (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
                    Auto Access Client Portal
                  </p>
                  <div className="mx-auto mt-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-2xl text-white shadow-[0_12px_26px_rgba(16,185,129,0.3)]">
                    ✓
                  </div>
                  <h1 className="mt-4 text-[1.7rem] font-semibold tracking-tight text-[#1c2340]">
                    Approval Confirmed
                  </h1>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                    Track your current status, monitor progress, and manage your
                    next steps from one premium portal view.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2f67de]">
                    Auto Access Client Portal
                  </p>
                  <h1 className="mt-3 text-[1.7rem] font-semibold tracking-tight text-[#1c2340]">
                    Track Your Application Progress
                  </h1>
                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                    Monitor your status, review next steps and manage your
                    journey from one premium portal view.
                  </p>
                </>
              )}
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-gradient-to-br from-white via-[#fafbff] to-[#f4f7ff] p-5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#2f67de]">
                    Application Progress
                  </p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-4xl font-semibold tabular-nums tracking-tight text-[#1b2345] sm:text-5xl">
                      {progress.total}
                    </span>
                    <span className="text-sm font-medium text-[#68708a]">
                      complete
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1 sm:items-end">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                    Current Status
                  </span>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold ${
                      isApprovedInPrinciple || isAwaitingInvoice
                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border border-[#f1dfd1] bg-[#fbf2ea] text-[#c37d43]"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                        isApprovedInPrinciple || isAwaitingInvoice
                          ? "bg-emerald-500"
                          : "bg-[#d59758]"
                      }`}
                    />
                    {statusLabel}
                  </span>
                </div>
              </div>

              <div className="relative mt-6">
                <div className="h-2.5 overflow-hidden rounded-full bg-[#e4e8f3]">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${progress.gradient} ${progress.glow} transition-all duration-1000`}
                    style={{ width: progress.total }}
                  />
                </div>
                <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-1">
                  {journeyStages.map((stage) => {
                    const reached = progressNumeric >= stage.threshold;
                    return (
                      <div
                        key={stage.label}
                        className={`h-3 w-3 rounded-full border-2 transition-all ${
                          reached
                            ? "border-white bg-[#2f67de] shadow-[0_0_0_2px_rgba(47,103,222,0.25)]"
                            : "border-[#cdd3e3] bg-white"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 hidden justify-between sm:flex">
                {journeyStages.map((stage) => {
                  const reached = progressNumeric >= stage.threshold;
                  return (
                    <span
                      key={stage.label}
                      className={`text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        reached ? "text-[#2f67de]" : "text-[#a3aac0]"
                      }`}
                    >
                      {stage.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-[#2f67de]/30 hover:shadow-[0_12px_30px_-12px_rgba(47,103,222,0.2)]">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-[#2f67de]/10 to-transparent blur-2xl" />
                <div className="relative flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white shadow-[0_8px_18px_-6px_rgba(47,103,222,0.5)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11H7a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-2" /><rect x="9" y="3" width="6" height="8" rx="1" /></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">Reference Number</p>
                    <p className="mt-1.5 break-words font-mono text-[1rem] font-semibold text-[#1b2345]">{application.referenceNumber}</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-[#d59758]/30 hover:shadow-[0_12px_30px_-12px_rgba(213,151,88,0.2)]">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-[#d59758]/10 to-transparent blur-2xl" />
                <div className="relative flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#d59758] to-[#e4ad72] text-white shadow-[0_8px_18px_-6px_rgba(213,151,88,0.5)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">Current Status</p>
                    <p className="mt-1.5 break-words text-[0.95rem] font-semibold text-[#1b2345]">{formatStatus(application.status)}</p>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:border-emerald-300 hover:shadow-[0_12px_30px_-12px_rgba(16,185,129,0.2)] sm:col-span-2 lg:col-span-1">
                <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400/10 to-transparent blur-2xl" />
                <div className="relative flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_8px_18px_-6px_rgba(16,185,129,0.5)]">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" /><circle cx="6.5" cy="16.5" r="2.5" /><circle cx="16.5" cy="16.5" r="2.5" /></svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">Preferred Vehicle</p>
                    <p className="mt-1.5 break-words text-[0.95rem] font-semibold text-[#1b2345]">{application.preferredVehicle}</p>
                  </div>
                </div>
              </div>
            </div>

            {application.status === "APPROVED_IN_PRINCIPLE" && approvalValidUntilIso ? (
              <div className="mt-5"><ApprovalCountdownCard approvalValidUntil={approvalValidUntilIso} /></div>
            ) : null}

            {application.status === "CONTRACT_ISSUED" && contractExpiresAtIso ? (
              <div className="mt-5"><ApprovalCountdownCard approvalValidUntil={contractExpiresAtIso} mode="contract" /></div>
            ) : null}

            {isContractIssued && !isContractAccepted ? (
              <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                  <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Contract Review</p>
                    <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Issued Contract Summary</h2>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="overflow-hidden rounded-[18px] border border-[#e7eaf2] bg-[#fafbff]">
                      {application.contractVehicleImage ? (
                        <div className="overflow-hidden bg-[#f4f6fb]"><img src={application.contractVehicleImage} alt={application.contractVehicleTitle || "Vehicle"} className="h-[220px] w-full object-cover" /></div>
                      ) : selectedVehicle?.featuredImage ? (
                        <div className="overflow-hidden bg-[#f4f6fb]"><img src={selectedVehicle.featuredImage} alt={selectedVehicle.title} className="h-[220px] w-full object-cover" /></div>
                      ) : null}
                      <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Contract Vehicle</p>
                        <p className="mt-2 text-lg font-semibold text-[#1b2345]">{application.contractVehicleTitle || selectedVehicle?.title || "—"}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {(application.contractVehicleYearModel || selectedVehicle?.yearModel) && (<span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f67de]">{application.contractVehicleYearModel || selectedVehicle?.yearModel}</span>)}
                          {(application.contractVehicleTransmission || selectedVehicle?.transmission) && (<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">{application.contractVehicleTransmission || selectedVehicle?.transmission}</span>)}
                          {(application.contractVehicleFuelType || selectedVehicle?.fuelType) && (<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">{application.contractVehicleFuelType || selectedVehicle?.fuelType}</span>)}
                          {application.contractTerm && (<span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">{application.contractTerm} months</span>)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-[18px] border border-[#f1dfd1] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Contract Notice</p>
                      <p className="mt-2 text-sm leading-6 text-[#39425d]">Your contract has been formally issued and your completion stage is now active. The original approval period no longer applies from this point forward.</p>
                      <p className="mt-3 text-sm leading-6 text-[#39425d]">A strict <span className="font-semibold text-[#1b2345]">24-hour completion window</span> is now active. You are required to review the full contract, complete the digital acceptance below and fulfil all outstanding payment requirements within this period.</p>
                      <p className="mt-3 text-sm leading-6 text-[#39425d]">Failure to complete within the active contract period may result in the expiry or cancellation of your contract stage, which could affect the outcome of your application.</p>
                    </div>
                    <div className="mt-4"><ContractReviewModal contract={contractDataForModal} /></div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                  <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Action Required</p>
                    <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Digital Contract Acceptance</h2>
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="rounded-[18px] border border-[#e7eaf2] bg-white p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Financial Summary</p>
                      <div className="mt-3 space-y-3">
                        <div className="flex items-center justify-between gap-3"><span className="text-sm text-[#68708a]">Deposit</span><span className="text-sm font-semibold text-[#1b2345]">{formatCurrency(contractDepositNum)}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="text-sm text-[#68708a]">Licensing &amp; Registration Fee</span><span className="text-sm font-semibold text-[#1b2345]">{formatCurrency(contractLicensingNum)}</span></div>
                        <div className="border-t border-[#eef0f7] pt-3"><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-[#1b2345]">Total Required Now</span><span className="text-lg font-semibold text-[#2f67de]">{formatCurrency(contractTotalNowNum)}</span></div></div>
                        <div className="flex items-center justify-between gap-3 border-t border-[#eef0f7] pt-3"><span className="text-sm text-[#68708a]">First Monthly Instalment</span><span className="text-sm font-semibold text-[#1b2345]">{formatCurrency(contractMonthlyNum)}</span></div>
                      </div>
                    </div>
                    <form action="/api/portal/accept-contract" method="POST" className="mt-5 space-y-4">
                      <label className="flex cursor-pointer items-start gap-3 rounded-[16px] border border-[#e1e4ee] bg-[#fafbff] p-4 transition hover:border-[#d59758]/50 hover:bg-[#fffaf5]"><input type="checkbox" name="acceptedTerms" value="yes" required className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#d59758]" /><span className="text-sm leading-6 text-[#39425d]">I confirm that I have read and reviewed the full Vehicle Rental Agreement and that I understand my contract has been formally issued with a strict <span className="font-semibold text-[#1b2345]">24-hour completion window</span>. I acknowledge that failure to complete within this period may result in the expiry or cancellation of my contract stage.</span></label>
                      <label className="flex cursor-pointer items-start gap-3 rounded-[16px] border border-[#e1e4ee] bg-[#fafbff] p-4 transition hover:border-[#d59758]/50 hover:bg-[#fffaf5]"><input type="checkbox" name="confirmedDetails" value="yes" required className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#d59758]" /><span className="text-sm leading-6 text-[#39425d]">I have reviewed and confirm that my personal details and selected vehicle information on record are correct and accurately reflect my application.</span></label>
                      <div className="rounded-[16px] border border-[#e1e4ee] bg-white p-4"><label htmlFor="acceptedName" className="block text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Digital Signature</label><p className="mt-1 text-xs leading-5 text-[#68708a]">Type your full legal name below to act as your digital signature and confirm your acceptance of this contract.</p><input type="text" id="acceptedName" name="acceptedName" required placeholder="Type your full legal name" className="mt-3 w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-4 py-3 text-sm font-medium text-[#1b2345] placeholder-[#a3aac0] outline-none ring-0 transition focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20" /></div>
                      <div className="rounded-[16px] border-l-4 border-[#2f67de] bg-gradient-to-r from-[#eef4ff] to-white p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f67de]">Important Notice</p><p className="mt-2 text-sm leading-6 text-[#39425d]">By submitting this form you are digitally accepting the terms of your issued Vehicle Rental Agreement. Your acceptance will be securely recorded along with a timestamp and your full name as provided above.</p><p className="mt-2 text-sm leading-6 text-[#39425d]">Upon successful contract acceptance, your application will move to <span className="font-semibold text-[#1b2345]">Awaiting Invoice</span>. Your invoice will be released later by admin, and only then will payment instructions appear in your portal.</p></div>
                      <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#c37d43] px-6 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)] transition hover:from-[#c37d43] hover:to-[#b86e35] hover:shadow-[0_16px_36px_-10px_rgba(213,151,88,0.7)]"><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>Accept Contract and Continue</button>
                    </form>
                  </div>
                </div>
              </div>
            ) : null}

            {isContractIssued && isContractAccepted ? (
              <div className="mt-5 overflow-hidden rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.15)]">
                <div className="border-b border-emerald-100 bg-gradient-to-r from-[#0a3b2a] to-[#0f5239] px-5 py-4 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200">Contract Acceptance</p><h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Digital Acceptance Recorded</h2></div>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.55)]"><svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                    <div className="min-w-0 flex-1">
                      <p className="text-lg font-semibold text-emerald-900">Contract accepted successfully.</p>
                      <p className="mt-2 text-sm leading-6 text-[#4d546a]">Your digital contract acceptance has been recorded and securely timestamped. No further action is required at this step.</p>
                      <p className="mt-2 text-sm leading-6 text-[#4d546a]">Your application has now moved to <span className="font-semibold text-[#1b2345]">Awaiting Invoice</span>. Please continue checking your portal while our team prepares and releases your invoice.</p>
                      {application.contractAcceptedName ? (<p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Signed by <span className="font-mono normal-case tracking-normal text-[#1b2345]">{application.contractAcceptedName}</span></p>) : null}
                      {application.contractAcceptedAt ? (<p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Accepted on <span className="font-mono normal-case tracking-normal text-[#1b2345]">{new Date(application.contractAcceptedAt).toLocaleString()}</span></p>) : null}
                    </div>
                  </div>
                  <div className="mt-5 border-t border-emerald-100 pt-5"><ContractReviewModal contract={contractDataForModal} /></div>
                </div>
              </div>
            ) : null}

            {isAwaitingInvoice ? (
              <div className="mt-5 space-y-5">
                <div className="overflow-hidden rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.15)]">
                  <div className="border-b border-emerald-100 bg-gradient-to-r from-[#0a3b2a] to-[#0f5239] px-5 py-4 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200">Contract Accepted</p><h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Digital Acceptance Recorded</h2></div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.55)]"><svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-lg font-semibold text-emerald-900">Contract accepted successfully.</p>
                        <p className="mt-2 text-sm leading-6 text-[#4d546a]">Your digital contract acceptance has been recorded and securely timestamped. Your application is now awaiting the release of your invoice by our team.</p>
                        {application.contractAcceptedName ? (<p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Signed by <span className="font-mono normal-case tracking-normal text-[#1b2345]">{application.contractAcceptedName}</span></p>) : null}
                        {application.contractAcceptedAt ? (<p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Accepted on <span className="font-mono normal-case tracking-normal text-[#1b2345]">{new Date(application.contractAcceptedAt).toLocaleString()}</span></p>) : null}
                      </div>
                    </div>
                    <div className="mt-5 border-t border-emerald-100 pt-5"><ContractReviewModal contract={contractDataForModal} /></div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-[24px] border border-[#f1dfd1] bg-gradient-to-br from-[#fffaf5] via-white to-[#fbf2ea] shadow-[0_8px_24px_-12px_rgba(213,151,88,0.15)]">
                  <div className="border-b border-[#f1dfd1] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Next Milestone</p><h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Awaiting Invoice Release</h2></div>
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d59758] to-[#c37d43] text-white shadow-[0_10px_24px_-8px_rgba(213,151,88,0.45)]"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Pending Admin Action</p>
                        <p className="mt-2 text-sm leading-6 text-[#39425d]">Your contract acceptance has been completed. Our team is now preparing your invoice. Once the invoice is released, further payment instructions and details will appear in your portal.</p>
                        <p className="mt-3 text-sm leading-6 text-[#39425d]">No further action is required from you at this stage. Please continue checking your portal for the next update.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {isInvoiceIssued ? (
              <div className="mt-5 space-y-5">
                <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                  <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                    <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Vehicle Summary</p><h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Invoice Stage Vehicle Details</h2></div>
                    <div className="p-5 sm:p-6">
                      <div className="overflow-hidden rounded-[18px] border border-[#e7eaf2] bg-[#fafbff]">
                        {displayVehicleImage ? (<div className="overflow-hidden bg-[#f4f6fb]"><img src={displayVehicleImage} alt={displayVehicleTitle} className="h-[240px] w-full object-cover" /></div>) : null}
                        <div className="p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Vehicle</p>
                          <p className="mt-2 text-lg font-semibold text-[#1b2345]">{displayVehicleTitle}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {displayVehicleYear ? (<span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f67de]">{displayVehicleYear}</span>) : null}
                            {displayVehicleTransmission ? (<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">{displayVehicleTransmission}</span>) : null}
                            {displayVehicleFuelType ? (<span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">{displayVehicleFuelType}</span>) : null}
                            {application.contractTerm ? (<span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">{application.contractTerm} months</span>) : null}
                          </div>
                          {displayVehicleMileage ? (<div className="mt-4 rounded-[14px] border border-[#eef0f7] bg-white px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Mileage</p><p className="mt-1 text-sm font-semibold text-[#1b2345]">{displayVehicleMileage}</p></div>) : null}
                        </div>
                      </div>
                      <div className="mt-4 rounded-[18px] border border-[#f1dfd1] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Invoice Notice</p>
                        <p className="mt-2 text-sm leading-6 text-[#39425d]">Your invoice has now been released. Please review the full payment summary and follow the official payment guidance shown in your portal.</p>
                        <p className="mt-3 text-sm leading-6 text-[#39425d]">Always use the correct reference number <span className="font-semibold text-[#1b2345]">{application.referenceNumber}</span> when preparing payment so your transaction can be linked correctly to your application.</p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                    <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Payment Summary</p><h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Invoice Breakdown</h2></div>
                    <div className="space-y-4 p-5 sm:p-6">
                      <div className="space-y-3 rounded-[18px] border border-[#e7eaf2] bg-white p-4">
                        <div className="flex items-center justify-between gap-3"><span className="text-sm text-[#68708a]">Deposit</span><span className="text-sm font-semibold text-[#1b2345]">{formatCurrency(contractDepositNum)}</span></div>
                        <div className="flex items-center justify-between gap-3"><span className="text-sm text-[#68708a]">Licensing &amp; Registration Fee</span><span className="text-sm font-semibold text-[#1b2345]">{formatCurrency(contractLicensingNum)}</span></div>
                        <div className="border-t border-[#eef0f7] pt-3"><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-[#1b2345]">Total Required Now</span><span className="text-lg font-semibold text-[#2f67de]">{formatCurrency(contractTotalNowNum)}</span></div></div>
                        <div className="flex items-center justify-between gap-3 border-t border-[#eef0f7] pt-3"><span className="text-sm text-[#68708a]">First Monthly Instalment</span><span className="text-sm font-semibold text-[#1b2345]">{formatCurrency(contractMonthlyNum)}</span></div>
                      </div>
                      <div className="rounded-[18px] border border-[#f1dfd1] bg-gradient-to-r from-[#fffaf5] to-white p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Payment Instructions</p>
                        <div className="mt-3 space-y-3 text-sm leading-6 text-[#39425d]">
                          <p><span className="font-semibold text-[#1b2345]">Payment Method:</span> Follow only the approved invoice payment instructions provided by Auto Access.</p>
                          <p><span className="font-semibold text-[#1b2345]">Payment Reference:</span> Use your application reference <span className="font-mono font-semibold text-[#1b2345]">{application.referenceNumber}</span> exactly as shown.</p>
                          <p><span className="font-semibold text-[#1b2345]">Important Payment Note:</span> Ensure your payment details are entered correctly so verification can be completed without delays.</p>
                          <p><span className="font-semibold text-[#1b2345]">Timing Note:</span> Keep proof of payment ready after completing your transaction, as it may be required during review and verification.</p>
                        </div>
                      </div>
                      <div className="rounded-[18px] border-l-4 border-[#2f67de] bg-gradient-to-r from-[#eef4ff] to-white p-4"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f67de]">Proof of Payment Guidance</p><p className="mt-2 text-sm leading-6 text-[#39425d]">Once payment has been made, keep your proof of payment ready for the verification stage. Upload or submission handling can be completed in the next build step if not yet enabled in this portal.</p></div>
                      <div className="rounded-[18px] border border-[#f1dfd1] bg-[#fbf2ea] px-4 py-3"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Current Status</p><p className="mt-1 text-sm font-semibold text-[#1b2345]">Awaiting your payment</p></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {isApprovedInPrinciple ? (
              <div className="mt-5 rounded-[22px] border border-emerald-200 bg-gradient-to-r from-emerald-50 via-white to-green-50 p-5 shadow-[0_12px_28px_-14px_rgba(16,185,129,0.2)]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Vehicle Selection Open</p>
                    <h3 className="mt-2 text-lg font-semibold text-[#1b2345]">Your approval is active. You can now choose your vehicle.</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4d546a]">Only qualifying vehicle options should be selected before your approval period expires. Continue now to review your available options and proceed to the next completion stage.</p>
                  </div>
                  <Link href="/portal/select-vehicle" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(16,185,129,0.55)] transition hover:from-emerald-700 hover:to-emerald-800 hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.7)]">Choose Your Vehicle<svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
                </div>
              </div>
            ) : null}

            {isContractRequested && selectedVehicle ? (
              <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                  <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Selected Vehicle</p><h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Contract Request Summary</h2></div>
                  <div className="p-5 sm:p-6">
                    <div className="overflow-hidden rounded-[18px] border border-[#e7eaf2] bg-[#fafbff]">
                      <div className="overflow-hidden bg-[#f4f6fb]"><img src={selectedVehicle.featuredImage} alt={selectedVehicle.title} className="h-[260px] w-full object-cover" /></div>
                      <div className="p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Vehicle Details</p>
                        <p className="mt-2 text-lg font-semibold text-[#1b2345]">{selectedVehicle.title}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f67de]">{selectedVehicle.yearModel}</span>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">{selectedVehicle.transmission}</span>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">{selectedVehicle.fuelType}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-[18px] border border-[#f1dfd1] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Contract Request Notice</p>
                      <p className="mt-2 text-sm leading-6 text-[#39425d]">Your contract request has been submitted successfully and is now awaiting admin review.</p>
                      <p className="mt-3 text-sm leading-6 text-[#39425d]">The strict 24-hour completion countdown has <span className="font-semibold text-[#1b2345]">not started yet</span>. It will only begin once the contract is formally issued by admin.</p>
                      <p className="mt-3 text-sm leading-6 text-[#39425d]">Please remain ready to proceed promptly once the contract is issued.</p>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                  <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Financial Summary</p><h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Expected Payment Summary</h2></div>
                  <div className="space-y-4 p-5 sm:p-6">
                    <div className="space-y-3 rounded-[18px] border border-[#e7eaf2] bg-white p-4">
                      <div className="flex items-center justify-between gap-3"><span className="text-sm text-[#68708a]">Deposit</span><span className="text-sm font-semibold text-[#1b2345]">{formatCurrency(selectedVehicleDeposit)}</span></div>
                      <div className="flex items-center justify-between gap-3"><span className="text-sm text-[#68708a]">Licensing & Registration Fee</span><span className="text-sm font-semibold text-[#1b2345]">{formatCurrency(LICENSING_AND_REGISTRATION_FEE)}</span></div>
                      <div className="border-t border-[#eef0f7] pt-3"><div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-[#1b2345]">Total Required Now</span><span className="text-lg font-semibold text-[#2f67de]">{formatCurrency(totalRequiredNow)}</span></div></div>
                      <div className="flex items-center justify-between gap-3 border-t border-[#eef0f7] pt-3"><span className="text-sm text-[#68708a]">First Monthly Instalment</span><span className="text-sm font-semibold text-[#1b2345]">{formatCurrency(selectedVehicleMonthly)}</span></div>
                    </div>
                    <div className="rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Readiness Reminder</p>
                      <p className="mt-2 text-sm leading-6 text-[#39425d]">Once the contract is issued, the earlier approval window will fall away and the formal contract timeline will govern the transaction.</p>
                      <p className="mt-3 text-sm leading-6 text-[#39425d]">Please ensure you remain ready with <span className="font-semibold text-[#1b2345]">{formatCurrency(totalRequiredNow)}</span> for deposit and licensing/registration, while your first monthly instalment of <span className="font-semibold text-[#1b2345]">{formatCurrency(selectedVehicleMonthly)}</span> remains payable next calendar month.</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-gradient-to-br from-white to-[#fafbff] shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 backdrop-blur"><svg className="h-4.5 w-4.5 text-[#f4c89a]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Status Guidance</p><h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">Your next step</h2></div>
                  </div>
                  <span className="hidden rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur sm:inline-flex">{isAwaitingInvoice ? "Awaiting Admin" : isInvoiceIssued ? "Payment Required" : "Action Required"}</span>
                </div>
              </div>
              <div className="grid gap-4 p-5 sm:p-6">
                {!isApprovedInPrinciple && !isContractRequested && !isAwaitingInvoice && !isInvoiceIssued ? (
                  <div className="rounded-[18px] border border-[#e4e7f0] bg-white p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef4ff] text-[#2f67de]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg></div>
                      <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">What this means</p><p className="mt-2 text-sm leading-6 text-[#39425d]">{statusInfo.meaning}</p></div>
                    </div>
                  </div>
                ) : null}

                {isApprovedInPrinciple ? (
                  <div className="relative overflow-hidden rounded-[20px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 sm:p-6">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.55)]"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                        <div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Action Required</p><p className="mt-1.5 text-sm leading-6 text-[#1b2345] sm:text-[15px]">Please choose your vehicle option to proceed with the next stage of your approved application.</p></div>
                      </div>
                      <Link href="/portal/select-vehicle" className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(16,185,129,0.55)] transition hover:from-emerald-700 hover:to-emerald-800 hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.7)] sm:w-auto">Select Your Vehicle<svg className="h-4 w-4 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
                    </div>
                  </div>
                ) : isContractRequested ? (
                  <div className="relative overflow-hidden rounded-[20px] border border-[#f1dfd1] bg-gradient-to-br from-[#fffaf5] via-white to-[#fbf2ea] p-5 sm:p-6">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f4c89a]/25 blur-3xl" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d59758] to-[#c37d43] text-white shadow-[0_10px_24px_-8px_rgba(213,151,88,0.45)]"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4" /><path d="M21 12c.55 0 1 .45 1 1v6a2 2 0 01-2 2H4a2 2 0 01-2-2v-6c0-.55.45-1 1-1" /><path d="M7 10V7a5 5 0 0110 0v3" /></svg></div>
                      <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Contract Request Submitted</p><p className="mt-1.5 text-sm leading-6 text-[#1b2345] sm:text-[15px]">Your contract request is now awaiting admin review and issue. The strict 24-hour completion window has not yet started and will only begin after the contract is formally issued.</p></div>
                    </div>
                  </div>
                ) : isAwaitingInvoice ? (
                  <div className="relative overflow-hidden rounded-[20px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 sm:p-6">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-200/40 blur-3xl" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.55)]"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                      <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">Awaiting Invoice</p><p className="mt-1.5 text-sm leading-6 text-[#1b2345] sm:text-[15px]">{statusInfo.nextStep}</p></div>
                    </div>
                  </div>
                ) : isInvoiceIssued ? (
                  <div className="relative overflow-hidden rounded-[20px] border border-[#f1dfd1] bg-gradient-to-br from-[#fffaf5] via-white to-[#fbf2ea] p-5 sm:p-6">
                    <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#f4c89a]/25 blur-3xl" />
                    <div className="relative flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#d59758] to-[#c37d43] text-white shadow-[0_10px_24px_-8px_rgba(213,151,88,0.45)]"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15V8a2 2 0 00-2-2H7l-4 4v9a2 2 0 002 2h14a2 2 0 002-2z" /><path d="M3 10h4a2 2 0 002-2V4" /></svg></div>
                      <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Invoice Issued</p><p className="mt-1.5 text-sm leading-6 text-[#1b2345] sm:text-[15px]">Payment is now required. Review the invoice guidance, use the correct reference number, and keep proof of payment ready for the next verification stage.</p></div>
                    </div>
                  </div>
                ) : showAnimatedActionCard ? (
                  <PortalApplicationProgressCard status={application.status as "DOCUMENTS_SUBMITTED" | "DOCUMENTS_UNDER_REVIEW" | "ADDITIONAL_DOCUMENTS_REQUIRED"} />
                ) : (
                  <div className="rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4 sm:p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#d59758] shadow-sm"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg></div>
                      <div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Action Required</p><p className="mt-2 text-sm leading-6 text-[#39425d]">{statusInfo.nextStep}</p></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between gap-3 border-b border-[#eef0f7] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#2f67de] to-[#4f86f7] text-white shadow-[0_8px_18px_-6px_rgba(47,103,222,0.5)]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">Profile</p><h2 className="text-[1.02rem] font-semibold text-[#1b2345] sm:text-[1.1rem]">Applicant Summary</h2></div>
                  </div>
                  <Link href="/portal/documents" className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_18px_-6px_rgba(47,103,222,0.45)] transition hover:from-[#2559c6] hover:to-[#3568d6]">Documents<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg></Link>
                </div>
                <div className="divide-y divide-[#eef0f7]">
                  <div className="flex items-start gap-4 px-5 py-4 sm:px-6"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#eef4ff] text-[#2f67de]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Full Name</p><p className="mt-1 break-words text-sm font-semibold text-[#1b2345]">{application.fullName}</p></div></div>
                  <div className="flex items-start gap-4 px-5 py-4 sm:px-6"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Email Address</p><p className="mt-1 break-words text-sm font-semibold text-[#1b2345]">{application.email}</p></div></div>
                  <div className="flex items-start gap-4 px-5 py-4 sm:px-6"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg></div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Phone Number</p><p className="mt-1 break-words text-sm font-semibold text-[#1b2345]">{application.phone}</p></div></div>
                  <div className="flex items-start gap-4 px-5 py-4 sm:px-6"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#d59758]"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg></div><div className="min-w-0 flex-1"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Application Created</p><p className="mt-1 break-words text-sm font-semibold text-[#1b2345]">{new Date(application.createdAt).toLocaleString()}</p></div></div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <div className="flex items-center justify-between gap-3 border-b border-[#eef0f7] px-5 py-4 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#d59758] to-[#e4ad72] text-white shadow-[0_8px_18px_-6px_rgba(213,151,88,0.5)]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg></div>
                    <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">Vault</p><h2 className="text-[1.02rem] font-semibold text-[#1b2345] sm:text-[1.1rem]">Documents</h2></div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] ${application.documents.length > 0 ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-slate-200 bg-slate-50 text-slate-600"}`}><span className={`h-1.5 w-1.5 rounded-full ${application.documents.length > 0 ? "bg-emerald-500" : "bg-slate-400"}`} />{application.documents.length > 0 ? "Submitted" : "Pending"}</span>
                </div>
                <div className="p-5 sm:p-6">
                  {application.documents.length > 0 ? (
                    <div className="relative overflow-hidden rounded-[20px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5">
                      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-200/40 blur-3xl" />
                      <div className="relative flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.55)]"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></div>
                        <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-emerald-900">Documents received</p><p className="mt-1 text-sm leading-6 text-[#4d546a]"><span className="text-2xl font-semibold tabular-nums text-[#1b2345]">{application.documents.length}</span> document{application.documents.length === 1 ? "" : "s"} linked to your application.</p></div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-[20px] border-2 border-dashed border-[#d7d9e2] bg-gradient-to-br from-[#fafbff] to-white p-6 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef0f7] text-[#68708a]"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg></div>
                      <p className="mt-3 text-sm font-semibold text-[#1b2345]">No documents submitted yet</p>
                      <p className="mt-1 text-sm leading-6 text-[#68708a]">Upload your required files to continue.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
              <div className="flex items-center justify-between gap-3 border-b border-[#eef0f7] px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_8px_18px_-6px_rgba(27,35,69,0.5)]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg></div>
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c37d43]">Status Timeline</p><h2 className="text-[1.05rem] font-semibold text-[#1b2345] sm:text-[1.15rem]">Progress Journey</h2></div>
                </div>
                {application.statusLogs.length > 0 ? (<span className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f67de]">{application.statusLogs.length} Update{application.statusLogs.length === 1 ? "" : "s"}</span>) : null}
              </div>

              <div className="p-5 sm:p-6">
                {application.statusLogs.length === 0 ? (
                  <div className="rounded-[18px] border-2 border-dashed border-[#d7d9e2] bg-[#fafbff] p-6 text-center text-sm text-[#68708a]">No progress updates yet.</div>
                ) : (
                  <div className="relative space-y-5">
                    <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#dbe6ff] via-[#e4e8f3] to-transparent" />

                    {application.statusLogs.map((log: StatusLogItem, index: number) => {
                      const tone = getTimelineTone(log.toStatus);
                      const isLatest = index === 0;

                      return (
                        <div key={log.id} className="relative flex gap-4">
                          <div className="relative z-10 flex w-8 shrink-0 justify-center">
                            <div className={`relative flex h-8 w-8 items-center justify-center rounded-full border-4 bg-white ${tone.ring} ${isLatest ? "ring-4 ring-[#2f67de]/10" : ""}`}>
                              <div className={`h-2.5 w-2.5 rounded-full ${tone.dot} ${isLatest ? "animate-pulse" : ""}`} />
                            </div>
                          </div>

                          <div className={`min-w-0 flex-1 rounded-[18px] border p-4 transition ${isLatest ? "border-[#dbe6ff] bg-gradient-to-br from-[#eef4ff] via-white to-white shadow-[0_8px_20px_-10px_rgba(47,103,222,0.25)]" : "border-[#e3e6ef] bg-[#fafbfe]"}`}>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <p className="break-words text-sm font-semibold text-[#1b2345]">{formatStatus(log.toStatus)}</p>
                                <p className="mt-1 break-words text-xs text-[#68708a]">{new Date(log.createdAt).toLocaleString()}</p>
                              </div>
                              <span className={`inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${isLatest ? "border border-[#2f67de]/30 bg-[#2f67de] text-white" : "border border-[#dbe6ff] bg-[#eef4ff] text-[#2f67de]"}`}>{isLatest ? "Latest" : "Update"}</span>
                            </div>
                            <p className="mt-3 break-words text-sm leading-6 text-[#4d546a]">{log.note || "No additional note provided."}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-[20px] border border-[#e1e4ee] bg-gradient-to-r from-[#fafbff] to-white px-5 py-4 sm:flex-row">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#eef4ff] text-[#2f67de]"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg></div>
                <div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">Secure Session</p><p className="text-sm font-semibold text-[#1b2345]">Auto Access · Encrypted Portal</p></div>
              </div>
              <form action="/api/portal-logout" method="post" className="w-full sm:w-auto">
                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1d2240] bg-[#1d2240] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a3563] sm:w-auto"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>Logout</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
