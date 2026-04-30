"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_INVOICE_TERMS = `1. Payment deadline. Full payment of the amount reflected above must be received within 24 hours of the invoice date. Failure to pay by the due date will result in automatic cancellation of your contract.

2. Proof of payment. Upon payment, please email your proof of payment to admin@autoaccess.co.za with your reference number in the subject line, or upload it via your client portal.

3. Payment reference. Always use your contract reference number as the payment reference. Payments received without a valid reference number cannot be allocated and may result in delays.

4. Monthly instalments. Your first monthly instalment commences via debit order in the next calendar month following vehicle delivery. The total monthly rental escalates by 4% annually on the anniversary of the delivery date.

5. Vehicle collection & delivery. Licensing and registration are completed within 24 to 48 hours for clients in the Western Cape. Your vehicle will only be released after payment is verified and registration is completed.

6. Non-refundable fees. The licensing & registration fee is non-refundable once registration has been submitted. The security deposit is refundable upon successful completion of the full 54-month contract term.`;

interface PrepareInvoiceFormProps {
  applicationId: string;
  referenceNumber: string;
  contractDepositAmount: string | null;
  contractLicensingFee: string | null;
  contractMonthlyPayment: string | null;
  contractTotalPayableNow: string | null;
  clientFullName: string | null;
  invoiceNumber?: string | null;
  invoiceSentAt?: Date | string | null;
}

function cleanAmount(val: string | null | undefined): string {
  if (!val) return "";
  return val.replace(/[^\d.]/g, "");
}

export default function PrepareInvoiceForm({
  applicationId,
  referenceNumber,
  contractDepositAmount,
  contractLicensingFee,
  contractMonthlyPayment,
  contractTotalPayableNow,
  clientFullName,
  invoiceNumber,
  invoiceSentAt,
}: PrepareInvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [deposit, setDeposit] = useState(cleanAmount(contractDepositAmount) || "10000");
  const [licensing, setLicensing] = useState(cleanAmount(contractLicensingFee) || "1850");
  const [monthly, setMonthly] = useState(cleanAmount(contractMonthlyPayment) || "4500");

  const totalDue = (parseFloat(deposit || "0") + parseFloat(licensing || "0")).toFixed(2);

  const [bankName, setBankName] = useState("Nedbank");
  const [bankHolder, setBankHolder] = useState("Access Holdings (Pty) Ltd");
  const [bankAccount, setBankAccount] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [bankType, setBankType] = useState("Business Cheque");
  const [terms, setTerms] = useState(DEFAULT_INVOICE_TERMS);

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    setSaveSuccess(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/save-contract-amounts/${applicationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deposit,
          licensing,
          monthly,
          total: totalDue,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveSuccess("✅ Amounts saved. The admin page now reflects the updated figures.");
      router.refresh();
    } catch {
      setError("Failed to save contract amounts.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankAccount || !bankBranch) {
      setError("Please enter the bank account number and branch code.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/prepare-invoice/${applicationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceDepositAmount: deposit,
          invoiceLicensingFee: licensing,
          invoiceMonthlyAmount: monthly,
          invoiceTotalDue: totalDue,
          invoiceBankName: bankName,
          invoiceBankHolder: bankHolder,
          invoiceBankAccount: bankAccount,
          invoiceBankBranch: bankBranch,
          invoiceBankType: bankType,
          invoiceTerms: terms,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || "Failed to send invoice");
      }
      const data = await res.json();
      setSuccess(`Invoice ${data.invoiceNumber} sent successfully to ${clientFullName}.`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-[#dde1ec] bg-white px-4 py-2.5 text-sm text-[#1b2345] focus:border-[#c9973a] focus:outline-none focus:ring-2 focus:ring-[#c9973a]/20";
  const labelClass = "mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9bbf]";

  return (
    <div className="rounded-2xl border border-[#dde1ec] bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1b2345]">Prepare Invoice</h2>
          <p className="mt-1 text-sm text-[#8a9bbf]">
            Pre-filled from contract snapshot — edit if needed before sending.
          </p>
        </div>
        {invoiceSentAt && (
          <div className="rounded-lg bg-emerald-50 px-3 py-2 text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Already Sent</p>
            <p className="mt-0.5 text-xs text-emerald-600">{invoiceNumber}</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Line items */}
        <div>
          <p className={labelClass}>Line Items</p>
          <div className="overflow-hidden rounded-xl border border-[#dde1ec]">
            <div className="grid grid-cols-[1fr_160px] bg-[#1b2345] px-4 py-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#8a9bbf]">
              <span>Description</span>
              <span className="text-right">Amount (R)</span>
            </div>
            {/* Deposit */}
            <div className="grid grid-cols-[1fr_160px] items-center border-b border-[#eef0f5] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#1b2345]">Security Deposit</p>
                <p className="text-xs text-[#8a9bbf]">Refundable upon 54-month completion</p>
              </div>
              <input type="number" value={deposit} onChange={(e) => setDeposit(e.target.value)} className={`${inputClass} text-right`} placeholder="0.00" />
            </div>
            {/* Licensing */}
            <div className="grid grid-cols-[1fr_160px] items-center border-b border-[#eef0f5] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[#1b2345]">Licensing &amp; Registration Fee</p>
                <p className="text-xs text-[#8a9bbf]">Vehicle registration &amp; licence disc</p>
              </div>
              <input type="number" value={licensing} onChange={(e) => setLicensing(e.target.value)} className={`${inputClass} text-right`} placeholder="0.00" />
            </div>
            {/* Monthly — not due now */}
            <div className="grid grid-cols-[1fr_160px] items-center bg-[#fafbfd] px-4 py-3 opacity-70">
              <div>
                <p className="text-sm font-semibold text-[#1b2345]">
                  Monthly Instalment
                  <span className="ml-2 rounded border border-[#c8d0e0] bg-[#eef0f5] px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#8a9bbf]">Not due now</span>
                </p>
                <p className="text-xs text-[#8a9bbf]">Commences next calendar month via debit order</p>
              </div>
              <input type="number" value={monthly} onChange={(e) => setMonthly(e.target.value)} className={`${inputClass} text-right`} placeholder="0.00" readOnly />
            </div>
            {/* Total */}
            <div className="grid grid-cols-[1fr_160px] items-center bg-[#1b2345] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8a9bbf]">Total Due Now</p>
              <p className="text-right text-lg font-bold text-[#c9973a]">R {parseFloat(totalDue).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

        {/* Banking details */}
        <div>
          <p className={labelClass}>Banking Details</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Bank Name</label>
              <input value={bankName} onChange={(e) => setBankName(e.target.value)} className={inputClass} placeholder="e.g. Nedbank" />
            </div>
            <div>
              <label className={labelClass}>Account Holder</label>
              <input value={bankHolder} onChange={(e) => setBankHolder(e.target.value)} className={inputClass} placeholder="Account holder name" />
            </div>
            <div>
              <label className={labelClass}>Account Number *</label>
              <input value={bankAccount} onChange={(e) => setBankAccount(e.target.value)} className={inputClass} placeholder="e.g. 1234567890" required />
            </div>
            <div>
              <label className={labelClass}>Branch Code *</label>
              <input value={bankBranch} onChange={(e) => setBankBranch(e.target.value)} className={inputClass} placeholder="e.g. 198765" required />
            </div>
            <div>
              <label className={labelClass}>Account Type</label>
              <select value={bankType} onChange={(e) => setBankType(e.target.value)} className={inputClass}>
                <option>Business Cheque</option>
                <option>Business Current</option>
                <option>Business Savings</option>
                <option>Current</option>
                <option>Savings</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Payment Reference</label>
              <input value={referenceNumber} readOnly className={`${inputClass} bg-[#f8f6f0] font-bold text-[#c9973a]`} />
            </div>
          </div>
        </div>

        {/* Terms */}
        <div>
          <label className={labelClass}>Terms &amp; Conditions of Payment</label>
          <textarea
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            rows={10}
            className={`${inputClass} resize-y font-mono text-xs leading-relaxed`}
          />
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
        )}
        {success && (
          <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</div>
        )}

        {saveSuccess && (
          <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">{saveSuccess}</div>
        )}
        <button
          type="button"
          onClick={handleSave}
          className="w-full rounded-full border-2 border-[#1b2345] bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-[#1b2345] transition hover:bg-[#1b2345] hover:text-white"
        >
          💾 Save & Preview Amounts
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-gradient-to-r from-[#1b2345] to-[#2c3d6b] px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-[#c9973a] shadow-[0_14px_30px_-10px_rgba(27,35,69,0.5)] transition hover:from-[#2c3d6b] hover:to-[#1b2345] disabled:opacity-60"
        >
          {isSubmitting ? "Sending Invoice..." : invoiceSentAt ? "Re-send Invoice" : "Send Invoice to Client"}
        </button>
      </form>
    </div>
  );
}
