"use client";

import { useState } from "react";
import ContractReviewModal from "@/components/contract-review-modal";

function formatCurrency(val: number) {
  return "R " + val.toLocaleString("en-ZA", { minimumFractionDigits: 0 });
}

interface ContractSignFlowProps {
  contract: {
    id: string;
    referenceNumber: string;
    contractAccepted?: boolean;
    contractSignatureImage?: string | null;
    contractSignedAt?: Date | string | null;
    contractVehicleTitle: string | null;
    contractVehicleImage: string | null;
    contractVehicleYearModel: string | null;
    contractVehicleMileage: string | null;
    contractVehicleTransmission: string | null;
    contractVehicleFuelType: string | null;
    contractDepositAmount: string | null;
    contractLicensingFee: string | null;
    contractMonthlyPayment: string | null;
    contractTotalPayableNow: string | null;
    contractTerm: string | null;
    contractClientFullName: string | null;
    contractClientEmail: string | null;
    contractClientPhone: string | null;
    contractClientIdentityType: string | null;
    contractClientIdentityNumber: string | null;
    contractClientAddress: string | null;
    contractTerms: string | null;
    contractIssuedAt: Date | string | null;
  };
  depositNum: number;
  licensingNum: number;
  totalNowNum: number;
  monthlyNum: number;
  contractExpiresAt?: string | null;
}

export default function ContractSignFlow({
  contract,
  depositNum,
  licensingNum,
  totalNowNum,
  monthlyNum,
}: ContractSignFlowProps) {
  const [hover, setHover] = useState(false);

  return (
    <div className="mt-5">
      <div className="relative overflow-hidden rounded-[28px] border border-[#e1e4ee] bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.18)]">

        {/* Premium navy header band */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0b1532] via-[#1b2345] to-[#2a3563] px-6 py-5">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage:"radial-gradient(circle at top right, rgba(213,151,88,0.6) 0%, transparent 50%)"}} />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-[#d59758]"></span>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4c89a]">Contract Issued</p>
              </div>
              <h2 className="mt-1.5 text-[1.25rem] font-semibold text-white">Your Vehicle Rental Agreement</h2>
              <p className="mt-0.5 text-[12px] text-blue-100/60">Reference {contract.referenceNumber}</p>
            </div>
            <div className="hidden sm:block">
              <div className="rounded-full border border-[#d59758]/30 bg-[#d59758]/10 px-3 py-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f4c89a]">⏳ Awaiting your signature</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two column body */}
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">

          {/* Left — vehicle snapshot */}
          <div className="relative border-b border-[#eef0f7] lg:border-b-0 lg:border-r">
            {contract.contractVehicleImage ? (
              <div className="relative h-[240px] w-full overflow-hidden">
                <img
                  src={contract.contractVehicleImage}
                  alt={contract.contractVehicleTitle || "Vehicle"}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1532]/85 via-[#0b1532]/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4c89a]">Your Vehicle</p>
                  <p className="mt-1 text-[1.15rem] font-semibold text-white leading-tight">{contract.contractVehicleTitle || "Selected Vehicle"}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {contract.contractVehicleYearModel && <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">{contract.contractVehicleYearModel}</span>}
                    {contract.contractVehicleTransmission && <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">{contract.contractVehicleTransmission}</span>}
                    {contract.contractTerm && <span className="rounded-full bg-[#d59758]/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#1b2345]">{contract.contractTerm} months</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-[240px] items-center justify-center bg-[#f4f6fb]">
                <p className="text-sm text-[#a3aac0]">No vehicle image available</p>
              </div>
            )}
          </div>

          {/* Right — financial highlights */}
          <div className="p-6 bg-gradient-to-br from-[#fafbff] to-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Required to activate</p>
            <p className="mt-2 text-[2rem] font-bold text-[#1b2345] leading-none">{formatCurrency(totalNowNum)}</p>
            <p className="mt-1 text-[11px] text-[#68708a]">Deposit {formatCurrency(depositNum)} + Licensing {formatCurrency(licensingNum)}</p>

            <div className="my-5 h-px bg-gradient-to-r from-transparent via-[#e1e4ee] to-transparent" />

            <div className="flex items-baseline justify-between">
              <span className="text-[12px] text-[#68708a]">Monthly instalment</span>
              <span className="text-[15px] font-semibold text-[#1b2345]">{formatCurrency(monthlyNum)}</span>
            </div>

            <div className="mt-5 rounded-[14px] border border-[#f1dfd1] bg-gradient-to-br from-[#fbf2ea] to-[#fffaf5] p-3.5">
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#d59758]/15 text-[#c37d43]">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#c37d43]">After signing</p>
                  <p className="mt-0.5 text-[11.5px] leading-5 text-[#39425d]">A <strong className="text-[#1b2345]">24-hour countdown</strong> begins when you sign. Complete your deposit payment within this period.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Single elegant CTA */}
        <div className="border-t border-[#eef0f7] bg-gradient-to-b from-white to-[#fafbff] p-6">
          <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="relative"
          >
            <ContractReviewModal contract={contract} />
            <p className="mt-3 text-center text-[11px] text-[#a3aac0]">
              Take your time — your application remains <strong className="text-[#68708a] font-medium">valid for 12 days</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
