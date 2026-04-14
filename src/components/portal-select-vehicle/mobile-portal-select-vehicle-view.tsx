import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import RequestContractConfirmationCard from "@/components/portal-select-vehicle/request-contract-confirmation-card";
import PortalMobileShell from "@/components/portal-mobile/portal-mobile-shell";
import PortalMobileTopbar from "@/components/portal-mobile/portal-mobile-topbar";
import PortalMobileHero from "@/components/portal-mobile/portal-mobile-hero";
import PortalMobileStatRow from "@/components/portal-mobile/portal-mobile-stat-row";
import PortalMobileSectionCard from "@/components/portal-mobile/portal-mobile-section-card";
import PortalMobileFooterBar from "@/components/portal-mobile/portal-mobile-footer-bar";
import { portalMobileThemes } from "@/components/portal-mobile/portal-mobile-theme";
import { getCompactCountdown } from "@/components/portal-mobile/portal-mobile-utils";

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

// ── Shared vehicle card — used for both primary and extra lists ──
function VehicleCard({
  vehicle,
  isSelected,
}: {
  vehicle: PageVehicle;
  isSelected: boolean;
}) {
  const vehicleDeposit = parseMoney(vehicle.depositAmount);
  const vehicleRequiredNow = vehicleDeposit + LICENSING_AND_REGISTRATION_FEE;

  return (
    <form
      action="/api/portal/select-vehicle"
      method="POST"
      className={`overflow-hidden rounded-[16px] border transition ${
        isSelected
          ? "border-emerald-300 bg-emerald-50/40 shadow-[0_10px_24px_-12px_rgba(16,185,129,0.3)]"
          : "border-[#e1e4ee] bg-white hover:border-[#2f67de]/30 hover:shadow-[0_10px_24px_-12px_rgba(47,103,222,0.14)]"
      }`}
    >
      <input type="hidden" name="vehicleId" value={vehicle.id} />

      <div className="p-3">
        <div className="grid grid-cols-[88px_1fr] gap-3">
          <div className="overflow-hidden rounded-[10px] bg-[#f4f6fb]">
            <img
              src={vehicle.featuredImage}
              alt={vehicle.title}
              className="h-[68px] w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#2f67de]">
                {vehicle.yearModel}
              </span>
              {isSelected ? (
                <span className="rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                  Selected
                </span>
              ) : null}
            </div>

            <h3 className="mt-1 line-clamp-2 text-[13px] font-semibold leading-5 text-[#1b2345]">
              {vehicle.title}
            </h3>

            <div className="mt-1 flex flex-wrap gap-1">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                {vehicle.transmission}
              </span>
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                {vehicle.fuelType}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2 py-2">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
              Deposit
            </p>
            <p className="mt-0.5 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
              {vehicle.depositAmount}
            </p>
          </div>

          <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2 py-2">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
              Monthly
            </p>
            <p className="mt-0.5 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
              {vehicle.monthlyPayment}
            </p>
          </div>

          <div className="rounded-[10px] border border-[#e7eaf2] bg-[#fafbff] px-2 py-2">
            <p className="text-[7.5px] font-bold uppercase tracking-[0.12em] text-[#68708a]">
              Required
            </p>
            <p className="mt-0.5 text-[10.5px] font-semibold leading-4 text-[#1b2345]">
              {formatCurrency(vehicleRequiredNow)}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className={`mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold transition ${
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
}

export default async function MobilePortalSelectVehicleView() {
  const cookieStore = await cookies();
  const referenceNumber = cookieStore.get("autoaccess_portal_ref")?.value;
  const email = cookieStore.get("autoaccess_portal_email")?.value;
  const applicationId = cookieStore.get(
    "autoaccess_portal_application_id"
  )?.value;

  if (!referenceNumber || !email || !applicationId) {
    redirect("/portal-login");
  }

  const application = await prisma.application.findUnique({
    where: { referenceNumber },
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
    where: { status: "AVAILABLE" as never },
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
    vehicles.find(
      (vehicle: PageVehicle) => vehicle.id === application.selectedVehicleId
    ) ||
    allVehicles.find(
      (vehicle: PageVehicle) => vehicle.id === application.selectedVehicleId
    ) ||
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
    <PortalMobileShell>
      <PortalMobileTopbar rightHref="/portal" rightLabel="Dashboard" />

      <PortalMobileHero
        theme={portalMobileThemes.approved}
        eyebrow="Auto Access · Select Vehicle"
        title="Select your approved vehicle"
        description="Choose a qualifying vehicle and review the amount required to proceed."
        statusLabel={formatStatus(application.status)}
        referenceNumber={application.referenceNumber}
        countdownText={compactCountdown}
        selectionText={
          selectedVehicle ? selectedVehicle.title : "No vehicle selected yet"
        }
      />

      <PortalMobileStatRow
        items={[
          {
            label: "Income",
            value: formatCurrency(monthlyIncomeValue),
          },
          {
            label: "Max Monthly",
            value: formatCurrency(maxAllowedInstallment),
            tone: "blue",
          },
          {
            label: "Eligible",
            value: `${vehicles.length} vehicle${vehicles.length !== 1 ? "s" : ""}`,
            tone: "green",
          },
        ]}
      />

      {/* ── Vehicle Options ── */}
      <PortalMobileSectionCard
        eyebrow="Approved Inventory"
        title="Vehicle options"
        badge={`${vehicles.length} eligible`}
      >
        <div className="grid gap-2">
          {vehicles.length === 0 ? (
            <div className="rounded-[14px] border-2 border-dashed border-[#d7d9e2] bg-[#fafbff] p-6 text-center">
              <p className="text-[13px] font-semibold text-[#1b2345]">
                No eligible vehicles available
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-[#68708a]">
                No available vehicles currently fall within your approved
                affordability bracket.
              </p>
            </div>
          ) : (
            <>
              {primaryVehicles.map((vehicle: PageVehicle) => (
                <VehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={application.selectedVehicleId === vehicle.id}
                />
              ))}

              {extraVehicles.length > 0 ? (
                <details className="group rounded-[14px] border border-[#e1e4ee] bg-[#fafbff]">
                  <summary className="flex cursor-pointer list-none items-center justify-center gap-2 px-4 py-3 text-[12px] font-semibold text-[#1b2345] marker:content-none">
                    View {extraVehicles.length} more vehicle
                    {extraVehicles.length > 1 ? "s" : ""}
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

                  <div className="grid gap-2 border-t border-[#e7eaf2] p-3">
                    {extraVehicles.map((vehicle: PageVehicle) => (
                      <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        isSelected={
                          application.selectedVehicleId === vehicle.id
                        }
                      />
                    ))}
                  </div>
                </details>
              ) : null}
            </>
          )}
        </div>
      </PortalMobileSectionCard>

      {/* ── Financial Summary ── */}
      <PortalMobileSectionCard
        eyebrow="Financial Summary"
        title="Selected vehicle totals"
      >
        <div className="space-y-2">
          {selectedVehicle ? (
            <>
              {!selectedVehicleStillEligible ? (
                <div className="rounded-[14px] border border-red-200 bg-red-50 px-3.5 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">
                    Selection Review Needed
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-red-900">
                    Your saved vehicle is outside the current affordability
                    bracket. Please choose a qualifying option above.
                  </p>
                </div>
              ) : null}

              {/* Compact vehicle title row — no image repeat */}
              <div className="rounded-[14px] border border-[#e8ecf5] bg-[#fbfcff] divide-y divide-[#eef0f8]">
                <div className="px-3.5 py-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                    Selected Vehicle
                  </p>
                  <p className="mt-1 text-[13px] font-semibold text-[#1b2345]">
                    {selectedVehicle.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    <span className="rounded-full border border-[#dbe6ff] bg-[#eef4ff] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#2f67de]">
                      {selectedVehicle.yearModel}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                      {selectedVehicle.transmission}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-700">
                      {selectedVehicle.fuelType}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[12px] border border-[#e7eaf2] bg-white px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                    Deposit
                  </p>
                  <p className="mt-1 text-[12.5px] font-semibold text-[#1b2345]">
                    {formatCurrency(depositAmount)}
                  </p>
                </div>

                <div className="rounded-[12px] border border-[#e7eaf2] bg-white px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                    Monthly
                  </p>
                  <p className="mt-1 text-[12.5px] font-semibold text-[#1b2345]">
                    {formatCurrency(monthlyPayment)}
                  </p>
                </div>

                <div className="rounded-[12px] border border-[#e7eaf2] bg-white px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#68708a]">
                    Licensing
                  </p>
                  <p className="mt-1 text-[12.5px] font-semibold text-[#1b2345]">
                    {formatCurrency(LICENSING_AND_REGISTRATION_FEE)}
                  </p>
                </div>

                <div className="rounded-[12px] border border-[#dbe6ff] bg-[#eef4ff] px-3 py-2.5">
                  <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-[#2f67de]">
                    Required Now
                  </p>
                  <p className="mt-1 text-[12.5px] font-semibold text-[#1b2345]">
                    {formatCurrency(amountRequiredNow)}
                  </p>
                </div>
              </div>

              <div className="rounded-[14px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white px-3.5 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c37d43]">
                  Client Notice
                </p>
                <p className="mt-1 text-[12px] leading-5 text-[#39425d]">
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
            <div className="rounded-[14px] border-2 border-dashed border-[#d7d9e2] bg-[#fafbff] p-6 text-center">
              <p className="text-[13px] font-semibold text-[#1b2345]">
                No vehicle selected yet
              </p>
              <p className="mt-1.5 text-[12px] leading-5 text-[#68708a]">
                Once a vehicle is selected, the totals will appear here.
              </p>
            </div>
          )}
        </div>
      </PortalMobileSectionCard>

      <PortalMobileFooterBar href="/portal" label="Back to Dashboard" />
    </PortalMobileShell>
  );
}