import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ApprovalCountdownCard from "@/components/approval-countdown-card";
import RequestContractConfirmationCard from "@/components/portal-select-vehicle/request-contract-confirmation-card";

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

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

const LICENSING_AND_REGISTRATION_FEE = 1850;
const MAX_INSTALLMENT_PERCENTAGE = 0.3;

type PageVehicle = {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  depositAmount: string;
  monthlyPayment: string;
  yearModel: string;
  mileage: string;
  transmission: string;
  fuelType: string;
  status: string;
};

export default async function DesktopPortalSelectVehicleView() {
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
      email: true,
      referenceNumber: true,
      fullName: true,
      status: true,
      preferredVehicle: true,
      selectedVehicleId: true,
      monthlyIncome: true,
      approvalValidUntil: true,
    },
  });

  if (
    !application ||
    application.id !== applicationId ||
    application.email.toLowerCase() !== email.toLowerCase()
  ) {
    redirect("/portal-login");
  }

  if (application.status !== "APPROVED_IN_PRINCIPLE") {
    redirect("/portal");
  }

  const allVehicles = await prisma.vehicleOffer.findMany({
    where: {
      status: "AVAILABLE" as never,
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      featuredImage: true,
      depositAmount: true,
      monthlyPayment: true,
      yearModel: true,
      mileage: true,
      transmission: true,
      fuelType: true,
      status: true,
    },
  });

  const monthlyIncomeValue = parseMoney(application.monthlyIncome);
  const maxAllowedInstallment = Math.floor(
    monthlyIncomeValue * MAX_INSTALLMENT_PERCENTAGE
  );

  const vehicles = allVehicles.filter((vehicle) => {
    const vehicleMonthly = parseMoney(vehicle.monthlyPayment);
    return vehicleMonthly <= maxAllowedInstallment;
  });

  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.id === application.selectedVehicleId) ||
    allVehicles.find((vehicle) => vehicle.id === application.selectedVehicleId) ||
    null;

  const depositAmount = selectedVehicle
    ? parseMoney(selectedVehicle.depositAmount)
    : 0;

  const monthlyPayment = selectedVehicle
    ? parseMoney(selectedVehicle.monthlyPayment)
    : 0;

  const amountRequiredNow = selectedVehicle
    ? depositAmount + LICENSING_AND_REGISTRATION_FEE
    : 0;

  const approvalValidUntilIso = application.approvalValidUntil
    ? new Date(application.approvalValidUntil).toISOString()
    : null;

  const selectedVehicleStillEligible = selectedVehicle
    ? monthlyPayment <= maxAllowedInstallment
    : false;

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
                  Auto Access · Select Vehicle
                </p>
              </div>

              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-[2.85rem]">
                Select your
                <br />
                <span className="text-emerald-300">
                  approved vehicle option.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-[15px] leading-7 text-emerald-50/80">
                Your application is approved in principle. Choose the vehicle
                you want to proceed with and review the exact amount required to
                complete this stage.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100 backdrop-blur">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  {formatStatus(application.status)}
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
              <div className="rounded-[28px] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-100/80">
                  Current Selection
                </p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {selectedVehicle
                    ? selectedVehicle.title
                    : "No vehicle selected yet"}
                </p>
                <p className="mt-2 text-sm text-emerald-50/70">
                  {selectedVehicle
                    ? "Your selection is saved to your portal profile."
                    : "Choose one vehicle below to continue."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {approvalValidUntilIso ? (
          <div className="mt-6">
            <ApprovalCountdownCard approvalValidUntil={approvalValidUntilIso} />
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-[30px] border border-[#e1e4ee] bg-white/95 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)] backdrop-blur md:p-2">
          <div className="rounded-[26px] bg-white p-5 md:p-7">
            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <div className="overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white p-5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                  Monthly Income
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#1b2345]">
                  {formatCurrency(monthlyIncomeValue)}
                </p>
              </div>

              <div className="overflow-hidden rounded-[22px] border border-[#dbe6ff] bg-[#eef4ff] p-5 shadow-[0_8px_24px_-12px_rgba(47,103,222,0.12)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f67de]">
                  Maximum Eligible Instalment
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#1b2345]">
                  {formatCurrency(maxAllowedInstallment)}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#4d546a]">
                  Based on 30% of your declared monthly income.
                </p>
              </div>

              <div className="overflow-hidden rounded-[22px] border border-emerald-200 bg-emerald-50/60 p-5 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.12)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                  Eligible Vehicles
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#1b2345]">
                  {vehicles.length}
                </p>
                <p className="mt-1 text-sm leading-6 text-[#4d546a]">
                  Only qualifying offers are shown below.
                </p>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                        Approved Inventory
                      </p>
                      <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">
                        Select Vehicle Option
                      </h2>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
                      {vehicles.length} Eligible
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 p-5 sm:p-6">
                  {vehicles.length === 0 ? (
                    <div className="rounded-[20px] border-2 border-dashed border-[#d7d9e2] bg-gradient-to-br from-[#fafbff] to-white p-8 text-center">
                      <p className="text-base font-semibold text-[#1b2345]">
                        No eligible vehicles available
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#68708a]">
                        No available vehicles currently fall within your approved affordability bracket.
                      </p>
                    </div>
                  ) : (
                    vehicles.map((vehicle) => {
                      const isSelected =
                        application.selectedVehicleId === vehicle.id;
                      const vehicleDeposit = parseMoney(vehicle.depositAmount);
                      const vehicleRequiredNow =
                        vehicleDeposit + LICENSING_AND_REGISTRATION_FEE;

                      return (
                        <form
                          key={vehicle.id}
                          action="/api/portal/select-vehicle"
                          method="POST"
                          className={`overflow-hidden rounded-[22px] border transition ${
                            isSelected
                              ? "border-emerald-300 bg-emerald-50/40 shadow-[0_12px_28px_-14px_rgba(16,185,129,0.35)]"
                              : "border-[#e1e4ee] bg-white hover:border-[#2f67de]/30 hover:shadow-[0_12px_28px_-14px_rgba(47,103,222,0.2)]"
                          }`}
                        >
                          <input type="hidden" name="vehicleId" value={vehicle.id} />

                          <div className="grid gap-4 p-4 lg:grid-cols-[180px_1fr_auto] lg:items-center">
                            <div className="overflow-hidden rounded-[18px] bg-[#f4f6fb]">
                              <img
                                src={vehicle.featuredImage}
                                alt={vehicle.title}
                                className="h-[130px] w-full object-cover"
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f67de]">
                                  {vehicle.yearModel}
                                </span>
                                {isSelected ? (
                                  <span className="rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                                    Selected
                                  </span>
                                ) : null}
                              </div>

                              <h3 className="mt-3 text-[1.15rem] font-semibold text-[#1b2345]">
                                {vehicle.title}
                              </h3>

                              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-[#e7eaf2] bg-[#fafbff] px-3 py-3">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                                    Deposit
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                                    {vehicle.depositAmount}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-[#e7eaf2] bg-[#fafbff] px-3 py-3">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                                    Monthly
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                                    {vehicle.monthlyPayment}
                                  </p>
                                </div>

                                <div className="rounded-xl border border-[#e7eaf2] bg-[#fafbff] px-3 py-3">
                                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                                    Required Now
                                  </p>
                                  <p className="mt-1 text-sm font-semibold text-[#1b2345]">
                                    {formatCurrency(vehicleRequiredNow)}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <button
                                type="submit"
                                className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition lg:w-auto ${
                                  isSelected
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "bg-gradient-to-r from-[#2f67de] to-[#3f78ea] text-white hover:from-[#2559c6] hover:to-[#3568d6]"
                                }`}
                              >
                                {isSelected ? "Selected Vehicle" : "Select Vehicle"}
                              </button>
                            </div>
                          </div>
                        </form>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                  <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4 sm:px-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                      Financial Summary
                    </p>
                    <h2 className="text-[1.05rem] font-semibold text-white sm:text-[1.15rem]">
                      Selected Vehicle Totals
                    </h2>
                  </div>

                  <div className="space-y-4 p-5 sm:p-6">
                    {selectedVehicle ? (
                      <>
                        {!selectedVehicleStillEligible ? (
                          <div className="rounded-[18px] border border-red-200 bg-red-50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-red-700">
                              Selection Review Needed
                            </p>
                            <p className="mt-2 text-sm leading-6 text-red-900">
                              Your saved vehicle is outside the current affordability bracket. Please choose a qualifying option below to continue.
                            </p>
                          </div>
                        ) : null}

                        <div className="overflow-hidden rounded-[18px] border border-[#e7eaf2] bg-[#fafbff]">
                          <div className="overflow-hidden bg-[#f4f6fb]">
                            <img
                              src={selectedVehicle.featuredImage}
                              alt={selectedVehicle.title}
                              className="h-[220px] w-full object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                              Selected Vehicle
                            </p>
                            <p className="mt-2 text-base font-semibold text-[#1b2345]">
                              {selectedVehicle.title}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f67de]">
                                {selectedVehicle.yearModel}
                              </span>
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
                                {selectedVehicle.transmission}
                              </span>
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-700">
                                {selectedVehicle.fuelType}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3 rounded-[18px] border border-[#e7eaf2] bg-white p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-[#68708a]">Deposit</span>
                            <span className="text-sm font-semibold text-[#1b2345]">
                              {formatCurrency(depositAmount)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-[#68708a]">
                              Licensing & Registration Fee
                            </span>
                            <span className="text-sm font-semibold text-[#1b2345]">
                              {formatCurrency(LICENSING_AND_REGISTRATION_FEE)}
                            </span>
                          </div>

                          <div className="border-t border-[#eef0f7] pt-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-semibold text-[#1b2345]">
                                Total Required Now
                              </span>
                              <span className="text-lg font-semibold text-[#2f67de]">
                                {formatCurrency(amountRequiredNow)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 border-t border-[#eef0f7] pt-3">
                            <span className="text-sm text-[#68708a]">
                              First Monthly Instalment
                            </span>
                            <span className="text-sm font-semibold text-[#1b2345]">
                              {formatCurrency(monthlyPayment)}
                            </span>
                          </div>
                        </div>

                        <div className="rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                            Client Notice
                          </p>
                          <p className="mt-2 text-sm leading-6 text-[#39425d]">
                            To complete this stage, you need to have{" "}
                            <span className="font-semibold text-[#1b2345]">
                              {formatCurrency(amountRequiredNow)}
                            </span>{" "}
                            in your possession. This amount includes the deposit and
                            the licensing and registration fee of{" "}
                            <span className="font-semibold text-[#1b2345]">
                              {formatCurrency(LICENSING_AND_REGISTRATION_FEE)}
                            </span>
                            . Your first monthly instalment of{" "}
                            <span className="font-semibold text-[#1b2345]">
                              {formatCurrency(monthlyPayment)}
                            </span>{" "}
                            will be payable next calendar month.
                          </p>
                        </div>

                        <RequestContractConfirmationCard
                          selectedVehicleTitle={selectedVehicle.title}
                          selectedVehicleImage={selectedVehicle.featuredImage}
                          depositAmount={formatCurrency(depositAmount)}
                          licensingFee={formatCurrency(
                            LICENSING_AND_REGISTRATION_FEE
                          )}
                          totalRequiredNow={formatCurrency(amountRequiredNow)}
                          monthlyPayment={formatCurrency(monthlyPayment)}
                          disabled={!selectedVehicleStillEligible}
                        />
                      </>
                    ) : (
                      <div className="rounded-[20px] border-2 border-dashed border-[#d7d9e2] bg-gradient-to-br from-[#fafbff] to-white p-8 text-center">
                        <p className="text-base font-semibold text-[#1b2345]">
                          No vehicle selected yet
                        </p>
                        <p className="mt-2 text-sm leading-6 text-[#68708a]">
                          Once a vehicle is selected, the deposit, licensing fee,
                          and completion total will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center justify-between gap-4 rounded-[20px] border border-[#e1e4ee] bg-gradient-to-r from-[#fafbff] to-white px-5 py-4 sm:flex-row">
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
                        Auto Access · Vehicle Selection Portal
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
        </div>
      </div>
    </main>
  );
}