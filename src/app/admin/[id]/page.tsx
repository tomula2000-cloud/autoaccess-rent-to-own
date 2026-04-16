import { notFound } from "next/navigation";
import AdminDocumentViewer from "@/components/admin-document-viewer";
import AdminDocumentActions from "@/components/admin-document-actions";
import { prisma } from "@/lib/prisma";
import AdminStatusForm from "@/components/admin-status-form";
import AdminApprovalValidityForm from "@/components/admin-approval-validity-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

type ApplicationDocument = {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  createdAt: Date;
};

type ApplicationStatusLog = {
  id: string;
  toStatus: string;
  note: string | null;
  createdAt: Date;
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatIdentityType(value: string | null) {
  if (!value) return "Not provided";
  if (value === "SA_ID") return "South African ID";
  if (value === "PASSPORT") return "Passport";
  return value;
}

function getApprovalDisplay(status: string, approvalValidUntil: Date | null) {
  if (status !== "APPROVED_IN_PRINCIPLE") {
    return "Approval validity not active for current status.";
  }

  if (!approvalValidUntil) {
    return "No expiry limit currently applied.";
  }

  return new Date(approvalValidUntil).toLocaleString();
}

function parseMoney(value: string | null | undefined) {
  if (!value) return 0;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

const DEFAULT_LICENSING_FEE = 1850;

const DEFAULT_CONTRACT_TERMS = `VEHICLE RENT TO OWN CONTRACT

This agreement is concluded between the Rentor and the Rentee for the rent-to-own use of the vehicle described in this contract snapshot.

TERMS AND CONDITIONS

1. DURATION
This agreement commences on the delivery date of the vehicle and remains in force for the agreed contract term unless ended earlier in accordance with the agreement.

2. PAYMENT OF RENTALS
All rentals shall be paid by debit order on the agreed due date each month. The rentee may not withhold, defer, or deduct any rental amount due.

3. SECURITY DEPOSIT
A deposit is payable on signature of this agreement. No interest shall accrue on the deposit during the contract period. Any refundable portion shall only be considered after all obligations have been fully discharged, subject to the agreement terms.

4. OWNERSHIP
The rentor remains the owner of the vehicle throughout the contract term. Ownership only passes after successful completion of the full agreed contract term and all obligations due under the agreement.

5. USE OF VEHICLE
The rentee must use the vehicle lawfully, responsibly, and in accordance with all road traffic laws. The vehicle may not be misused, neglected, unlawfully modified, or driven by unauthorised persons.

6. MAINTENANCE
The rentee must maintain the vehicle in a roadworthy condition, comply with the required service schedule, and ensure approved servicing where applicable.

7. LOSS, DAMAGE, THEFT, OR ACCIDENT
The rentee must notify the rentor immediately and report any theft, hijacking, or accident to the South African Police Service within the required period.

8. TRACKING AND IMMOBILISER
The rentee acknowledges that the vehicle may be fitted with tracking and immobiliser systems and may be remotely managed where permitted in terms of the agreement.

9. BREACH
If the rentee breaches a material term of the agreement, including payment obligations, unlawful use, or failure to maintain the vehicle as required, the rentor may enforce its rights in terms of the agreement.

10. JURISDICTION AND GENERAL
This agreement forms the full agreement between the parties unless amended in writing and signed. The parties consent to the applicable South African jurisdiction for disputes arising from the agreement.

11. ACKNOWLEDGEMENT
The rentee confirms that they have read, understood, and accepted the agreement and the financial obligations recorded in this contract snapshot.`;

export default async function AdminApplicationDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const application = await prisma.application.findUnique({
    where: { id },
    select: {
      id: true,
      referenceNumber: true,
      fullName: true,
      email: true,
      phone: true,
      status: true,
      identityType: true,
      identityNumber: true,
      employmentStatus: true,
      monthlyIncome: true,
      salaryDate: true,
      preferredVehicle: true,
      physicalAddress: true,
      notes: true,
      approvalValidUntil: true,
      reapplyAllowedAt: true,
      contractRequestedAt: true,
      contractIssuedAt: true,
      contractExpiresAt: true,
      contractAccepted: true,
      contractAcceptedAt: true,
      contractAcceptedName: true,
      selectedVehicleId: true,
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

      selectedVehicle: {
        select: {
          id: true,
          title: true,
          featuredImage: true,
          depositAmount: true,
          monthlyPayment: true,
          term: true,
          yearModel: true,
          mileage: true,
          transmission: true,
          fuelType: true,
          slug: true,
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
      documents: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          fileName: true,
          fileUrl: true,
          documentType: true,
          createdAt: true,
        },
      },
    },
  });

  if (!application) {
    notFound();
  }

  const selectedVehicle = application.selectedVehicle;

  const fallbackDepositAmount = selectedVehicle?.depositAmount || "";
  const fallbackMonthlyPayment = selectedVehicle?.monthlyPayment || "";
  const fallbackLicensingFee = String(DEFAULT_LICENSING_FEE);

  const depositForPreview = application.contractDepositAmount
    ? parseMoney(application.contractDepositAmount)
    : parseMoney(fallbackDepositAmount);

  const licensingForPreview = application.contractLicensingFee
    ? parseMoney(application.contractLicensingFee)
    : DEFAULT_LICENSING_FEE;

  const totalNowPreview = application.contractTotalPayableNow
    ? parseMoney(application.contractTotalPayableNow)
    : depositForPreview + licensingForPreview;

  const monthlyPreview = application.contractMonthlyPayment
    ? parseMoney(application.contractMonthlyPayment)
    : parseMoney(fallbackMonthlyPayment);

  const showContractPreparation = application.status === "CONTRACT_REQUESTED";
  const showPreparedSnapshot =
    !!application.contractVehicleTitle ||
    !!application.contractDepositAmount ||
    !!application.contractTerms;

  return (
    <main className="min-h-screen bg-white px-6 py-16 text-black">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
          Auto Access Admin
        </p>

        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          Application Details
        </h1>

        <p className="mb-10 max-w-3xl text-lg text-gray-600">
          Review the applicant profile, uploaded documents, status history, and
          contract preparation controls before issuing the contract.
        </p>

        {resolvedSearchParams.success ? (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-medium text-green-800">
            {resolvedSearchParams.success}
          </div>
        ) : null}

        {resolvedSearchParams.error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-800">
            {resolvedSearchParams.error}
          </div>
        ) : null}

        <div className="mb-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Reference Number</p>
            <p className="mt-2 text-2xl font-bold">
              {application.referenceNumber}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="mt-2 text-2xl font-bold">
              {formatStatus(application.status)}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Created</p>
            <p className="mt-2 font-semibold">
              {new Date(application.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Approval Validity Overview
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-white/80 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Current approval validity
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                {getApprovalDisplay(
                  application.status,
                  application.approvalValidUntil
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-white/80 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Reapply restriction
              </p>
              <p className="mt-2 text-base font-semibold text-gray-900">
                {application.reapplyAllowedAt
                  ? new Date(application.reapplyAllowedAt).toLocaleString()
                  : "No reapply restriction currently recorded"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Applicant Information</h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="mt-1 font-semibold">{application.fullName}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 font-semibold">{application.email}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="mt-1 font-semibold">{application.phone}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Identity Type</p>
                  <p className="mt-1 font-semibold">
                    {formatIdentityType(application.identityType)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">ID / Passport Number</p>
                  <p className="mt-1 font-semibold">
                    {application.identityNumber || "Not provided"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Employment Status</p>
                  <p className="mt-1 font-semibold">
                    {application.employmentStatus}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Monthly Income</p>
                  <p className="mt-1 font-semibold">
                    {application.monthlyIncome}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Salary Date</p>
                  <p className="mt-1 font-semibold">
                    {application.salaryDate || "Not provided"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Preferred Vehicle</p>
                  <p className="mt-1 font-semibold">
                    {application.preferredVehicle}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Physical Address</p>
                  <p className="mt-1 font-semibold">
                    {application.physicalAddress || "Not provided"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Additional Notes</p>
                  <p className="mt-1 font-semibold">
                    {application.notes || "No additional notes provided."}
                  </p>
                </div>
              </div>
            </div>

            {selectedVehicle ? (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
                <h2 className="mb-5 text-2xl font-bold text-blue-950">
                  Selected Vehicle Reference
                </h2>

                <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
                  <img
                    src={selectedVehicle.featuredImage}
                    alt={selectedVehicle.title}
                    className="h-64 w-full object-cover"
                  />
                  <div className="grid gap-5 p-5 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">Vehicle Title</p>
                      <p className="mt-1 font-semibold">{selectedVehicle.title}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Year Model</p>
                      <p className="mt-1 font-semibold">
                        {selectedVehicle.yearModel}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Mileage</p>
                      <p className="mt-1 font-semibold">
                        {selectedVehicle.mileage}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="mt-1 font-semibold">
                        {selectedVehicle.transmission}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="mt-1 font-semibold">
                        {selectedVehicle.fuelType}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Term</p>
                      <p className="mt-1 font-semibold">{selectedVehicle.term}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Deposit</p>
                      <p className="mt-1 font-semibold">
                        {selectedVehicle.depositAmount}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Monthly Payment</p>
                      <p className="mt-1 font-semibold">
                        {selectedVehicle.monthlyPayment}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {showContractPreparation ? (
              <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 shadow-sm">
                <h2 className="mb-2 text-2xl font-bold text-purple-950">
                  Contract Preparation & Verification
                </h2>

                <p className="mb-6 max-w-3xl text-sm leading-6 text-purple-900">
                  Before issuing the contract, verify the customer identity,
                  contract-facing client details, selected vehicle details, and
                  final financial figures. These fields save a frozen contract
                  snapshot and do not overwrite the original application record.
                </p>

                <form
                  action={`/api/admin/prepare-contract/${application.id}`}
                  method="POST"
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-purple-100 bg-white p-5">
                    <h3 className="text-lg font-bold text-gray-900">
                      Contract Client Snapshot
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Client Full Name
                        </label>
                        <input
                          type="text"
                          name="contractClientFullName"
                          defaultValue={
                            application.contractClientFullName ||
                            application.fullName
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Client Email
                        </label>
                        <input
                          type="email"
                          name="contractClientEmail"
                          defaultValue={
                            application.contractClientEmail || application.email
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Client Phone
                        </label>
                        <input
                          type="text"
                          name="contractClientPhone"
                          defaultValue={
                            application.contractClientPhone || application.phone
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Identity Type
                        </label>
                        <input
                          type="text"
                          name="contractClientIdentityType"
                          defaultValue={
                            application.contractClientIdentityType ||
                            formatIdentityType(application.identityType)
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Identity Number
                        </label>
                        <input
                          type="text"
                          name="contractClientIdentityNumber"
                          defaultValue={
                            application.contractClientIdentityNumber ||
                            application.identityNumber ||
                            ""
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Contract Address
                        </label>
                        <textarea
                          name="contractClientAddress"
                          rows={3}
                          defaultValue={
                            application.contractClientAddress ||
                            application.physicalAddress ||
                            ""
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-purple-100 bg-white p-5">
                    <h3 className="text-lg font-bold text-gray-900">
                      Contract Vehicle Snapshot
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Vehicle Title
                        </label>
                        <input
                          type="text"
                          name="contractVehicleTitle"
                          defaultValue={
                            application.contractVehicleTitle ||
                            selectedVehicle?.title ||
                            application.preferredVehicle
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Vehicle Image URL
                        </label>
                        <input
                          type="text"
                          name="contractVehicleImage"
                          defaultValue={
                            application.contractVehicleImage ||
                            selectedVehicle?.featuredImage ||
                            ""
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Year Model
                        </label>
                        <input
                          type="text"
                          name="contractVehicleYearModel"
                          defaultValue={
                            application.contractVehicleYearModel ||
                            selectedVehicle?.yearModel ||
                            ""
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Mileage
                        </label>
                        <input
                          type="text"
                          name="contractVehicleMileage"
                          defaultValue={
                            application.contractVehicleMileage ||
                            selectedVehicle?.mileage ||
                            ""
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Transmission
                        </label>
                        <input
                          type="text"
                          name="contractVehicleTransmission"
                          defaultValue={
                            application.contractVehicleTransmission ||
                            selectedVehicle?.transmission ||
                            ""
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Fuel Type
                        </label>
                        <input
                          type="text"
                          name="contractVehicleFuelType"
                          defaultValue={
                            application.contractVehicleFuelType ||
                            selectedVehicle?.fuelType ||
                            ""
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-purple-100 bg-white p-5">
                    <h3 className="text-lg font-bold text-gray-900">
                      Contract Financial Snapshot
                    </h3>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Deposit Amount
                        </label>
                        <input
                          type="text"
                          name="contractDepositAmount"
                          defaultValue={
                            application.contractDepositAmount ||
                            fallbackDepositAmount
                          }
                          placeholder="e.g. 8500"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Licensing Fee
                        </label>
                        <input
                          type="text"
                          name="contractLicensingFee"
                          defaultValue={
                            application.contractLicensingFee ||
                            fallbackLicensingFee
                          }
                          placeholder="e.g. 1850"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Monthly Payment
                        </label>
                        <input
                          type="text"
                          name="contractMonthlyPayment"
                          defaultValue={
                            application.contractMonthlyPayment ||
                            fallbackMonthlyPayment
                          }
                          placeholder="e.g. 2760"
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                          required
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                          Contract Term
                        </label>
                        <input
                          type="text"
                          name="contractTerm"
                          defaultValue={
                            application.contractTerm ||
                            selectedVehicle?.term ||
                            "54 Months"
                          }
                          className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-600"
                        />
                      </div>
                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">Deposit Preview</p>
                        <p className="mt-2 text-xl font-bold text-gray-900">
                          {formatCurrency(depositForPreview)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                          Licensing Preview
                        </p>
                        <p className="mt-2 text-xl font-bold text-gray-900">
                          {formatCurrency(licensingForPreview)}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
                        <p className="text-sm text-blue-700">
                          Total Required Now
                        </p>
                        <p className="mt-2 text-xl font-bold text-blue-900">
                          {formatCurrency(totalNowPreview)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-semibold text-amber-900">
                        First Monthly Instalment Preview
                      </p>
                      <p className="mt-1 text-lg font-bold text-amber-950">
                        {formatCurrency(monthlyPreview)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-purple-100 bg-white p-5">
                    <h3 className="text-lg font-bold text-gray-900">
                      Contract Terms Snapshot
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      You can edit this contract text before the contract is
                      issued. Once issued, the client should be reviewing this
                      frozen contract snapshot, not live application values.
                    </p>

                    <textarea
                      name="contractTerms"
                      rows={20}
                      defaultValue={
                        application.contractTerms || DEFAULT_CONTRACT_TERMS
                      }
                      className="mt-4 w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-purple-600"
                      required
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button
                      type="submit"
                      className="inline-flex rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-700"
                    >
                      Save Contract Snapshot
                    </button>

                    <p className="text-sm text-gray-600">
                      Save first, review the snapshot below, then use the status
                      form to issue the contract.
                    </p>
                  </div>
                </form>
              </div>
            ) : null}

            {showPreparedSnapshot ? (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-6 shadow-sm">
                <h2 className="mb-5 text-2xl font-bold text-indigo-950">
                  Saved Contract Snapshot Preview
                </h2>

                <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
                  <div className="space-y-4">
                    {application.contractVehicleImage ||
                    selectedVehicle?.featuredImage ? (
                      <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-white">
                        <img
                          src={
                            application.contractVehicleImage ||
                            selectedVehicle?.featuredImage ||
                            ""
                          }
                          alt={
                            application.contractVehicleTitle ||
                            selectedVehicle?.title ||
                            "Contract vehicle"
                          }
                          className="h-64 w-full object-cover"
                        />
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                      <h3 className="text-lg font-bold text-gray-900">
                        Vehicle Snapshot
                      </h3>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">Title</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleTitle || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Year Model</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleYearModel || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Mileage</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleMileage || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Transmission</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleTransmission ||
                              "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Fuel Type</p>
                          <p className="mt-1 font-semibold">
                            {application.contractVehicleFuelType || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Term</p>
                          <p className="mt-1 font-semibold">
                            {application.contractTerm || "Not saved"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                      <h3 className="text-lg font-bold text-gray-900">
                        Client Snapshot
                      </h3>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientFullName || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientEmail || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientPhone || "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Identity Type</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientIdentityType ||
                              "Not saved"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">
                            Identity Number
                          </p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientIdentityNumber ||
                              "Not saved"}
                          </p>
                        </div>

                        <div className="sm:col-span-2">
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="mt-1 font-semibold">
                            {application.contractClientAddress || "Not saved"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                      <h3 className="text-lg font-bold text-gray-900">
                        Financial Snapshot
                      </h3>

                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-600">Deposit</span>
                          <span className="font-semibold text-gray-900">
                            {application.contractDepositAmount || "Not saved"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-600">
                            Licensing Fee
                          </span>
                          <span className="font-semibold text-gray-900">
                            {application.contractLicensingFee || "Not saved"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm text-gray-600">
                            Monthly Payment
                          </span>
                          <span className="font-semibold text-gray-900">
                            {application.contractMonthlyPayment || "Not saved"}
                          </span>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-gray-900">
                              Total Required Now
                            </span>
                            <span className="text-lg font-bold text-blue-700">
                              {application.contractTotalPayableNow || "Not saved"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-indigo-100 bg-white p-5">
                      <h3 className="text-lg font-bold text-gray-900">
                        Contract Terms Preview
                      </h3>

                      <div className="mt-4 max-h-[480px] overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <pre className="whitespace-pre-wrap text-sm leading-6 text-gray-800">
                          {application.contractTerms ||
                            "No contract terms saved yet."}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Update Status</h2>
              <AdminStatusForm
                applicationId={application.id}
                currentStatus={application.status}
              />
            </div>

            <AdminApprovalValidityForm
              applicationId={application.id}
              currentStatus={application.status}
              approvalValidUntil={
                application.approvalValidUntil
                  ? application.approvalValidUntil.toISOString()
                  : null
              }
            />

            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Client Documents</p>
                <h2 className="text-[1.05rem] font-semibold text-white">Uploaded Supporting Files</h2>
              </div>
              <div className="p-5">
                <AdminDocumentViewer documents={application.documents} />
              </div>
            </div>
            <AdminDocumentActions
              applicationId={application.id}
              status={application.status}
              fullName={application.fullName}
            />

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-2xl font-bold">Status History</h2>

              {application.statusLogs.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                  No status updates yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {application.statusLogs.map((log: ApplicationStatusLog) => (
                    <div
                      key={log.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                    >
                      <p className="font-semibold">
                        {formatStatus(log.toStatus)}
                      </p>
                      <p className="mt-1 text-sm text-gray-600">
                        {log.note || "Status updated."}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(application.status === "CONTRACT_ISSUED" ||
              application.status === "AWAITING_INVOICE" ||
              application.status === "INVOICE_ISSUED") && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 shadow-sm">
                <h2 className="mb-4 text-2xl font-bold text-amber-950">
                  Contract Stage Overview
                </h2>

                <div className="space-y-3 text-sm leading-6 text-amber-900">
                  <p>
                    <span className="font-semibold">Issued At:</span>{" "}
                    {application.contractIssuedAt
                      ? new Date(application.contractIssuedAt).toLocaleString()
                      : "Not recorded"}
                  </p>

                  <p>
                    <span className="font-semibold">Contract Expires:</span>{" "}
                    {application.contractExpiresAt
                      ? new Date(application.contractExpiresAt).toLocaleString()
                      : "Not recorded"}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Client Acceptance Recorded:
                    </span>{" "}
                    {application.contractAccepted ? "Yes" : "No"}
                  </p>

                  <p>
                    <span className="font-semibold">Accepted Name:</span>{" "}
                    {application.contractAcceptedName || "Not yet signed"}
                  </p>

                  <p>
                    <span className="font-semibold">Accepted At:</span>{" "}
                    {application.contractAcceptedAt
                      ? new Date(application.contractAcceptedAt).toLocaleString()
                      : "Not yet signed"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}