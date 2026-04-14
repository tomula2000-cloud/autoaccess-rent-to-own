import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
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

function getCompactCountdown(approvalValidUntil: Date | string | null) {
  if (!approvalValidUntil) return null;

  const now = new Date();
  const target = new Date(approvalValidUntil);
  const diffMs = target.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Approval expired";
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  return `${days}d ${hours}h ${minutes}m remaining`;
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

function IconCar() {
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
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
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

function IconClock() {
  return (
    <svg
      className="h-3.5 w-3.5"
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

export default async function MobilePortalSelectVehicleView() {
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

  const vehicles = allVehicles.filter((vehicle: PageVehicle) => {
    const vehicleMonthly = parseMoney(vehicle.monthlyPayment);
    return vehicleMonthly <= maxAllowedInstallment;
  });

  const selectedVehicle =
    vehicles.find((vehicle: PageVehicle) => vehicle.id === application.selectedVehicleId) ||
    allVehicles.find((vehicle: PageVehicle) => vehicle.id === application.selectedVehicleId) ||
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

  const selectedVehicleStillEligible = selectedVehicle
    ? monthlyPayment <= maxAllowedInstallment
    : false;

  const compactCountdown = getCompactCountdown(application.approvalValidUntil);

  const primaryVehicles = vehicles.slice(0, 3);
  const extraVehicles = vehicles.slice(3);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,222,0.08),transparent_55%),radial-gradient(circle_at_top_right,rgba(213,151,88,0.06),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-[430px] px-4 pb-8 pt-4">
        <div className="flex items-center justify-between">
          <Link href="/portal" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_8px_18px_-6px_rgba(27,35,69,0.5)]">
              <IconCar />
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

        <section className="relative mt-4 overflow-hidden rounded-[26px] border border-emerald-200/60 bg-gradient-to-br from-[#0a3b2a] via-[#0f5239] to-[#137a52] px-4 pb-4 pt-5 shadow-[0_24px_60px_-20px_rgba(16,80,55,0.45)]">
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -bottom-10 right-0 h-32 w-32 rounded-full bg-green-300/15 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,0.9)]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-200/90">
                Auto Access · Select Vehicle
              </p>
            </div>

            <h1 className="mt-4 text-[1.6rem] font-semibold leading-[1.05] tracking-tight text-white">
              Select your approved vehicle option
            </h1>

            <p className="mt-3 text-[13px] leading-6 text-emerald-50/80">
              Choose a qualifying vehicle and review the amount required to proceed.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {formatStatus(application.status)}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[10px] font-medium text-emerald-50/85">
                Ref <span className="font-mono">{application.referenceNumber}</span>
              </span>
            </div>

            {compactCountdown ? (
              <div className="mt-3 inline-flex w-full items-center gap-2 rounded-[16px] border border-white/15 bg-white/10 px-3.5 py-3 text-[12.5px] font-medium text-emerald-50/90 backdrop-blur">
                <IconClock />
                <span className="font-semibold text-white">Approval Timer:</span>
                <span>{compactCountdown}</span>
              </div>
            ) : null}

            <div className="mt-3 rounded-[16px] border border-white/15 bg-white/10 px-3.5 py-3 backdrop-blur">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-100/80">
                Current Selection
              </p>
              <p className="mt-1.5 text-[14px] font-semibold text-white">
                {selectedVehicle ? selectedVehicle.title : "No vehicle selected yet"}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-[18px] border border-[#e1e4ee] bg-white p-3.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
              Income
            </p>
            <p className="mt-1.5 text-[1.02rem] font-semibold leading-5 text-[#1b2345]">
              {formatCurrency(monthlyIncomeValue)}
            </p>
          </div>

          <div className="rounded-[18px] border border-[#dbe6ff] bg-[#eef4ff] p-3.5 shadow-[0_8px_24px_-12px_rgba(47,103,222,0.12)]">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-[#2f67de]">
              Eligible
            </p>
            <p className="mt-1.5 text-[1.02rem] font-semibold leading-5 text-[#1b2345]">
              {formatCurrency(maxAllowedInstallment)}
            </p>
          </div>

          <div className="rounded-[18px] border border-emerald-200 bg-emerald-50/70 p-3.5 shadow-[0_8px_24px_-12px_rgba(16,185,129,0.12)]">
            <p className="text-[8.5px] font-bold uppercase tracking-[0.16em] text-emerald-700">
              Vehicles
            </p>
            <p className="mt-1.5 text-[1.02rem] font-semibold leading-5 text-[#1b2345]">
              {vehicles.length}
            </p>
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4c89a]">
                  Approved Inventory
                </p>
                <h2 className="text-[1rem] font-semibold text-white">
                  Vehicle options
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
                {vehicles.length} eligible
              </span>
            </div>
          </div>

          <div className="grid gap-2.5 p-3">
            {vehicles.length === 0 ? (
              <div className="rounded-[18px] border-2 border-dashed border-[#d7d9e2] bg-gradient-to-br from-[#fafbff] to-white p-6 text-center">
                <p className="text-base font-semibold text-[#1b2345]">
                  No eligible vehicles available
                </p>
                <p className="mt-2 text-sm leading-6 text-[#68708a]">
                  No available vehicles currently fall within your approved affordability bracket.
                </p>
              </div>
            ) : (
              <>
                {primaryVehicles.map((vehicle: PageVehicle) => {
                  const isSelected = application.selectedVehicleId === vehicle.id;
                  const vehicleDeposit = parseMoney(vehicle.depositAmount);
                  const vehicleRequiredNow =
                    vehicleDeposit + LICENSING_AND_REGISTRATION_FEE;

                  return (
                    <form
                      key={vehicle.id}
                      action="/api/portal/select-vehicle"
                      method="POST"
                      className={`overflow-hidden rounded-[18px] border transition ${
                        isSelected
                          ? "border-emerald-300 bg-emerald-50/40 shadow-[0_12px_28px_-14px_rgba(16,185,129,0.35)]"
                          : "border-[#e1e4ee] bg-white hover:border-[#2f67de]/30 hover:shadow-[0_12px_28px_-14px_rgba(47,103,222,0.16)]"
                      }`}
                    >
                      <input type="hidden" name="vehicleId" value={vehicle.id} />

                      <div className="p-3">
                        <div className="grid grid-cols-[96px_1fr] gap-3">
                          <div className="overflow-hidden rounded-[12px] bg-[#f4f6fb]">
                            <img
                              src={vehicle.featuredImage}
                              alt={vehicle.title}
                              className="h-[78px] w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#2f67de]">
                                {vehicle.yearModel}
                              </span>
                              {isSelected ? (
                                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                                  Selected
                                </span>
                              ) : null}
                            </div>

                            <h3 className="mt-1.5 line-clamp-2 text-[14px] font-semibold leading-5 text-[#1b2345]">
                              {vehicle.title}
                            </h3>

                            <div className="mt-1.5 flex flex-wrap gap-1.5">
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                                {vehicle.transmission}
                              </span>
                              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                                {vehicle.fuelType}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 grid grid-cols-3 gap-2">
                          <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2.5 py-2">
                            <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
                              Deposit
                            </p>
                            <p className="mt-1 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
                              {vehicle.depositAmount}
                            </p>
                          </div>

                          <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2.5 py-2">
                            <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
                              Monthly
                            </p>
                            <p className="mt-1 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
                              {vehicle.monthlyPayment}
                            </p>
                          </div>

                          <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2.5 py-2">
                            <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
                              Required
                            </p>
                            <p className="mt-1 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
                              {formatCurrency(vehicleRequiredNow)}
                            </p>
                          </div>
                        </div>

                        <button
                          type="submit"
                          className={`mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold transition ${
                            isSelected
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : "bg-gradient-to-r from-[#2f67de] to-[#3f78ea] text-white hover:from-[#2559c6] hover:to-[#3568d6]"
                          }`}
                        >
                          {isSelected ? "Selected Vehicle" : "Select Vehicle"}
                        </button>
                      </div>
                    </form>
                  );
                })}

                {extraVehicles.length > 0 ? (
                  <details className="group rounded-[18px] border border-[#e1e4ee] bg-[#fafbff]">
                    <summary className="flex cursor-pointer list-none items-center justify-center gap-2 px-4 py-3 text-[12px] font-semibold text-[#1b2345] marker:content-none">
                      View more vehicles
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

                    <div className="grid gap-2.5 border-t border-[#e7eaf2] p-3">
                      {extraVehicles.map((vehicle: PageVehicle) => {
                        const isSelected = application.selectedVehicleId === vehicle.id;
                        const vehicleDeposit = parseMoney(vehicle.depositAmount);
                        const vehicleRequiredNow =
                          vehicleDeposit + LICENSING_AND_REGISTRATION_FEE;

                        return (
                          <form
                            key={vehicle.id}
                            action="/api/portal/select-vehicle"
                            method="POST"
                            className={`overflow-hidden rounded-[18px] border transition ${
                              isSelected
                                ? "border-emerald-300 bg-emerald-50/40 shadow-[0_12px_28px_-14px_rgba(16,185,129,0.35)]"
                                : "border-[#e1e4ee] bg-white hover:border-[#2f67de]/30 hover:shadow-[0_12px_28px_-14px_rgba(47,103,222,0.16)]"
                            }`}
                          >
                            <input type="hidden" name="vehicleId" value={vehicle.id} />

                            <div className="p-3">
                              <div className="grid grid-cols-[96px_1fr] gap-3">
                                <div className="overflow-hidden rounded-[12px] bg-[#f4f6fb]">
                                  <img
                                    src={vehicle.featuredImage}
                                    alt={vehicle.title}
                                    className="h-[78px] w-full object-cover"
                                  />
                                </div>

                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#2f67de]">
                                      {vehicle.yearModel}
                                    </span>
                                    {isSelected ? (
                                      <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                                        Selected
                                      </span>
                                    ) : null}
                                  </div>

                                  <h3 className="mt-1.5 line-clamp-2 text-[14px] font-semibold leading-5 text-[#1b2345]">
                                    {vehicle.title}
                                  </h3>

                                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                                      {vehicle.transmission}
                                    </span>
                                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                                      {vehicle.fuelType}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-2.5 grid grid-cols-3 gap-2">
                                <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2.5 py-2">
                                  <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
                                    Deposit
                                  </p>
                                  <p className="mt-1 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
                                    {vehicle.depositAmount}
                                  </p>
                                </div>

                                <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2.5 py-2">
                                  <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
                                    Monthly
                                  </p>
                                  <p className="mt-1 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
                                    {vehicle.monthlyPayment}
                                  </p>
                                </div>

                                <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2.5 py-2">
                                  <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
                                    Required
                                  </p>
                                  <p className="mt-1 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
                                    {formatCurrency(vehicleRequiredNow)}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="submit"
                                className={`mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold transition ${
                                  isSelected
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                    : "bg-gradient-to-r from-[#2f67de] to-[#3f78ea] text-white hover:from-[#2559c6] hover:to-[#3568d6]"
                                }`}
                              >
                                {isSelected ? "Selected Vehicle" : "Select Vehicle"}
                              </button>
                            </div>
                          </form>
                        );
                      })}
                    </div>
                  </details>
                ) : null}
              </>
            )}
          </div>
        </section>

        <section className="mt-4 overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4c89a]">
              Financial Summary
            </p>
            <h2 className="text-[1rem] font-semibold text-white">
              Selected vehicle totals
            </h2>
          </div>

          <div className="space-y-3 p-3.5">
            {selectedVehicle ? (
              <>
                {!selectedVehicleStillEligible ? (
                  <div className="rounded-[16px] border border-red-200 bg-red-50 p-3.5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">
                      Selection Review Needed
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-5 text-red-900">
                      Your saved vehicle is outside the current affordability bracket. Please choose a qualifying option below to continue.
                    </p>
                  </div>
                ) : null}

                <div className="rounded-[16px] border border-[#e7eaf2] bg-[#fafbff] p-3">
                  <div className="grid grid-cols-[78px_1fr] gap-3">
                    <div className="overflow-hidden rounded-[12px] bg-[#f4f6fb]">
                      <img
                        src={selectedVehicle.featuredImage}
                        alt={selectedVehicle.title}
                        className="h-[70px] w-full object-cover"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                        Selected Vehicle
                      </p>
                      <p className="mt-1 text-[13px] font-semibold leading-5 text-[#1b2345]">
                        {selectedVehicle.title}
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#2f67de]">
                          {selectedVehicle.yearModel}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                          {selectedVehicle.transmission}
                        </span>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                          {selectedVehicle.fuelType}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="rounded-[14px] border border-[#e7eaf2] bg-white px-3 py-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                      Deposit
                    </p>
                    <p className="mt-1.5 text-[12.5px] font-semibold text-[#1b2345]">
                      {formatCurrency(depositAmount)}
                    </p>
                  </div>

                  <div className="rounded-[14px] border border-[#e7eaf2] bg-white px-3 py-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                      Monthly
                    </p>
                    <p className="mt-1.5 text-[12.5px] font-semibold text-[#1b2345]">
                      {formatCurrency(monthlyPayment)}
                    </p>
                  </div>

                  <div className="rounded-[14px] border border-[#e7eaf2] bg-white px-3 py-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                      Licensing
                    </p>
                    <p className="mt-1.5 text-[12.5px] font-semibold text-[#1b2345]">
                      {formatCurrency(LICENSING_AND_REGISTRATION_FEE)}
                    </p>
                  </div>

                  <div className="rounded-[14px] border border-[#dbe6ff] bg-[#eef4ff] px-3 py-3">
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#2f67de]">
                      Required Now
                    </p>
                    <p className="mt-1.5 text-[12.5px] font-semibold text-[#1b2345]">
                      {formatCurrency(amountRequiredNow)}
                    </p>
                  </div>
                </div>

                <div className="rounded-[16px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-3.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">
                    Client Notice
                  </p>
                  <p className="mt-1.5 text-[12.5px] leading-5 text-[#39425d]">
                    You need{" "}
                    <span className="font-semibold text-[#1b2345]">
                      {formatCurrency(amountRequiredNow)}
                    </span>{" "}
                    available now. Your first monthly instalment of{" "}
                    <span className="font-semibold text-[#1b2345]">
                      {formatCurrency(monthlyPayment)}
                    </span>{" "}
                    is payable next calendar month.
                  </p>
                </div>

                <RequestContractConfirmationCard
                  selectedVehicleTitle={selectedVehicle.title}
                  selectedVehicleImage={selectedVehicle.featuredImage}
                  depositAmount={formatCurrency(depositAmount)}
                  licensingFee={formatCurrency(LICENSING_AND_REGISTRATION_FEE)}
                  totalRequiredNow={formatCurrency(amountRequiredNow)}
                  monthlyPayment={formatCurrency(monthlyPayment)}
                  disabled={!selectedVehicleStillEligible}
                />
              </>
            ) : (
              <div className="rounded-[18px] border-2 border-dashed border-[#d7d9e2] bg-gradient-to-br from-[#fafbff] to-white p-6 text-center">
                <p className="text-base font-semibold text-[#1b2345]">
                  No vehicle selected yet
                </p>
                <p className="mt-2 text-sm leading-6 text-[#68708a]">
                  Once a vehicle is selected, the totals will appear here.
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-[20px] border border-[#e1e4ee] bg-gradient-to-r from-[#fafbff] to-white px-5 py-4">
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
                Auto Access · Vehicle Selection Portal
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