"use client";

import { useState } from "react";

type RequestContractConfirmationCardProps = {
  selectedVehicleTitle: string;
  selectedVehicleImage: string;
  depositAmount: string;
  licensingFee: string;
  totalRequiredNow: string;
  monthlyPayment: string;
  disabled?: boolean;
};

export default function RequestContractConfirmationCard({
  selectedVehicleTitle,
  selectedVehicleImage,
  depositAmount,
  licensingFee,
  totalRequiredNow,
  monthlyPayment,
  disabled = false,
}: RequestContractConfirmationCardProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#a3b3d6] to-[#b8c6e2] px-6 py-3.5 text-sm font-semibold text-white"
      >
        Request a Contract
      </button>
    );
  }

  return (
    <div className="space-y-4">
      {!showConfirmation ? (
        <button
          type="button"
          onClick={() => setShowConfirmation(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(16,185,129,0.55)] transition hover:from-emerald-700 hover:to-emerald-800 hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.7)]"
        >
          Request a Contract
        </button>
      ) : null}

      {showConfirmation ? (
        <div className="overflow-hidden rounded-[24px] border border-[#d59758]/30 bg-gradient-to-br from-[#fffaf5] via-white to-[#fbf2ea] shadow-[0_16px_40px_-18px_rgba(213,151,88,0.28)]">
          <div className="border-b border-[#f2e5d8] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
              Contract Request Confirmation
            </p>
            <h3 className="mt-1 text-[1.05rem] font-semibold text-white">
              Please review before proceeding
            </h3>
          </div>

          <div className="space-y-5 p-5">
            <div className="overflow-hidden rounded-[18px] border border-[#e7eaf2] bg-white">
              <div className="overflow-hidden bg-[#f4f6fb]">
                <img
                  src={selectedVehicleImage}
                  alt={selectedVehicleTitle}
                  className="h-[220px] w-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">
                  Selected Vehicle
                </p>
                <p className="mt-2 text-base font-semibold text-[#1b2345]">
                  {selectedVehicleTitle}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-[18px] border border-[#e7eaf2] bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[#68708a]">Deposit</span>
                <span className="text-sm font-semibold text-[#1b2345]">
                  {depositAmount}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[#68708a]">
                  Licensing & Registration Fee
                </span>
                <span className="text-sm font-semibold text-[#1b2345]">
                  {licensingFee}
                </span>
              </div>

              <div className="border-t border-[#eef0f7] pt-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-[#1b2345]">
                    Total Required Now
                  </span>
                  <span className="text-lg font-semibold text-[#2f67de]">
                    {totalRequiredNow}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[#eef0f7] pt-3">
                <span className="text-sm text-[#68708a]">
                  First Monthly Instalment
                </span>
                <span className="text-sm font-semibold text-[#1b2345]">
                  {monthlyPayment}
                </span>
              </div>
            </div>

            <div className="rounded-[18px] border-l-4 border-[#d59758] bg-gradient-to-r from-[#fbf2ea] to-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">
                Important Notice
              </p>
              <p className="mt-2 text-sm leading-7 text-[#39425d]">
                By proceeding with this request, you confirm that you are ready to
                move forward with the transaction promptly.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#39425d]">
                Once your contract has been issued, the current 12-day
                approval-in-principle validity period will immediately fall away
                and a strict <span className="font-semibold text-[#1b2345]">24-hour completion window</span> will apply.
              </p>
              <p className="mt-3 text-sm leading-7 text-[#39425d]">
                During this 24-hour period, you will be expected to complete the
                required payment and any remaining completion steps. This action is
                treated as a firm indication that you are ready to proceed.
              </p>
              <p className="mt-3 text-sm leading-7 font-medium text-[#8b5a2b]">
                If you are not fully prepared to pay and complete the process within
                24 hours once the contract is issued, do not proceed with this
                contract request at this stage.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <form
                action="/api/portal/request-contract"
                method="POST"
                className="w-full"
              >
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_-10px_rgba(16,185,129,0.55)] transition hover:from-emerald-700 hover:to-emerald-800 hover:shadow-[0_16px_36px_-10px_rgba(16,185,129,0.7)]"
                >
                  Proceed with Contract Request
                </button>
              </form>

              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#1d2240] bg-white px-6 py-3.5 text-sm font-semibold text-[#1d2240] transition hover:bg-[#f8fafc] sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}