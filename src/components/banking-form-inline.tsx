"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BankingFormInline({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    clientBankName: "",
    clientAccountHolder: "",
    clientAccountNumber: "",
    clientAccountType: "",
    clientBranchCode: "",
  });

  async function handleSubmit() {
    const { clientBankName, clientAccountHolder, clientAccountNumber, clientAccountType, clientBranchCode } = data;
    if (!clientBankName || !clientAccountHolder || !clientAccountNumber || !clientAccountType || !clientBranchCode) {
      setError("Please complete all fields before submitting.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/sign-and-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Failed" }));
        throw new Error(err.error || "Failed to submit");
      }
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Bank Name</label>
        <select value={data.clientBankName} onChange={e => setData(p => ({...p, clientBankName: e.target.value}))} className="w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-3 py-2.5 text-sm text-[#1b2345] outline-none focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20">
          <option value="">Select your bank</option>
          {["ABSA","Capitec Bank","First National Bank (FNB)","Nedbank","Standard Bank","African Bank","Investec","TymeBank","Discovery Bank","Other"].map(b => <option key={b}>{b}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Account Holder Name</label>
        <input type="text" placeholder="Full name as on bank account" value={data.clientAccountHolder} onChange={e => setData(p => ({...p, clientAccountHolder: e.target.value}))} className="w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-3 py-2.5 text-sm text-[#1b2345] outline-none focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Account Number</label>
          <input type="text" placeholder="Account number" value={data.clientAccountNumber} onChange={e => setData(p => ({...p, clientAccountNumber: e.target.value}))} className="w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-3 py-2.5 text-sm text-[#1b2345] outline-none focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20" />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Branch Code</label>
          <input type="text" placeholder="e.g. 632005" value={data.clientBranchCode} onChange={e => setData(p => ({...p, clientBranchCode: e.target.value}))} className="w-full rounded-[10px] border border-[#dbe0ed] bg-[#fafbff] px-3 py-2.5 text-sm text-[#1b2345] outline-none focus:border-[#d59758] focus:ring-2 focus:ring-[#d59758]/20" />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a] mb-1.5">Account Type</label>
        <div className="grid grid-cols-3 gap-2">
          {["Cheque","Savings","Current"].map(t => (
            <button key={t} type="button" onClick={() => setData(p => ({...p, clientAccountType: t}))} className={"rounded-[10px] border py-2.5 text-[12px] font-semibold transition " + (data.clientAccountType === t ? "border-[#1b2345] bg-[#1b2345] text-white" : "border-[#dbe0ed] bg-white text-[#39425d] hover:border-[#d59758]")}>
              {t}
            </button>
          ))}
        </div>
      </div>
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">{error}</div>}
      <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="w-full rounded-full bg-gradient-to-r from-[#d59758] to-[#c37d43] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(213,151,88,0.5)] transition hover:from-[#c37d43] hover:to-[#b86e35] disabled:opacity-60">
        {isSubmitting ? "Submitting..." : "Submit Banking Details & Request Invoice"}
      </button>
    </div>
  );
}
