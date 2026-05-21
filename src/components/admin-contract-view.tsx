import Link from "next/link";
import PaymentCountdownCard from "@/components/payment-countdown-card";
import PrepareInvoiceForm from "@/components/prepare-invoice-form";
import ResendContractButton from "@/components/resend-contract-button";

function formatCurrency(val: string | null | undefined) {
  if (!val) return "—";
  const n = Number(val.replace(/[^\d.-]/g, ""));
  if (!isFinite(n)) return val;
  return "R " + n.toLocaleString("en-ZA", { minimumFractionDigits: 0 });
}

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-ZA", { dateStyle: "medium", timeStyle: "short" });
}

interface AdminContractViewProps {
  application: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    referenceNumber: string;
    status: string;
    createdAt: Date;
    contractAccepted: boolean | null;
    contractAcceptedAt: Date | null;
    contractAcceptedName: string | null;
    contractIssuedAt: Date | null;
    contractExpiresAt: Date | null;
    contractSignatureImage: string | null;
    contractVehicleTitle: string | null;
    contractVehicleImage: string | null;
    contractVehicleYearModel: string | null;
    contractVehicleTransmission: string | null;
    contractVehicleFuelType: string | null;
    contractTerm: string | null;
    contractDepositAmount: string | null;
    contractLicensingFee: string | null;
    contractMonthlyPayment: string | null;
    contractTotalPayableNow: string | null;
    clientBankName: string | null;
    clientAccountHolder: string | null;
    clientAccountNumber: string | null;
    clientAccountType: string | null;
    clientBranchCode: string | null;
    clientBankSubmittedAt: Date | null;
    invoiceNumber: string | null;
    invoiceSentAt: Date | null;
    contractClientFullName: string | null;
  };
}

export default function AdminContractView({ application }: AdminContractViewProps) {
  const isSigned = !!application.contractAccepted;
  const isAwaitingInvoice = application.status === "AWAITING_INVOICE";
  const hasBanking = !!application.clientBankSubmittedAt;

  return (
    <div className="min-h-screen bg-[#f4f6fb] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl">

        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e1e4ee] bg-white text-[#68708a] hover:bg-[#f4f6fb]">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            </Link>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#68708a]">Admin · Contract View</p>
              <h1 className="text-[1.1rem] font-semibold text-[#1b2345]">{application.fullName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={"rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] " + (isAwaitingInvoice ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700")}>
              {isAwaitingInvoice ? "Awaiting Invoice" : "Contract Issued"}
            </span>
            <span className="rounded-full border border-[#e1e4ee] bg-white px-3 py-1.5 font-mono text-[11px] font-bold text-[#2f67de]">{application.referenceNumber}</span>
          </div>
        </div>

        {/* Two column layout */}
        <div className="grid gap-5 xl:grid-cols-[1fr_340px]">

          {/* LEFT — Main content */}
          <div className="space-y-4">

            {/* Vehicle + Financial summary */}
            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#0b1532] to-[#1b2345] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Contract Summary</p>
                <h2 className="text-[1.05rem] font-semibold text-white">Issued Vehicle Rental Agreement</h2>
              </div>
              <div className="grid gap-0 sm:grid-cols-[1fr_1fr]">
                {/* Vehicle */}
                <div className="border-b border-[#eef0f7] sm:border-b-0 sm:border-r">
                  {application.contractVehicleImage && (
                    <div className="relative h-[180px] overflow-hidden">
                      <img src={application.contractVehicleImage} alt={application.contractVehicleTitle || "Vehicle"} className="h-full w-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b1532]/70 to-transparent" />
                      <div className="absolute bottom-0 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wide text-[#f4c89a]">Contract Vehicle</p>
                        <p className="text-[1rem] font-semibold text-white">{application.contractVehicleTitle}</p>
                        <div className="mt-1.5 flex flex-wrap gap-1">
                          {application.contractVehicleYearModel && <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase text-white">{application.contractVehicleYearModel}</span>}
                          {application.contractVehicleTransmission && <span className="rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase text-white">{application.contractVehicleTransmission}</span>}
                          {application.contractTerm && <span className="rounded-full bg-[#d59758]/90 px-2 py-0.5 text-[9px] font-bold uppercase text-[#1b2345]">{application.contractTerm} months</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Financials */}
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Financial Summary</p>
                  <div className="mt-3 space-y-2.5">
                    <div className="flex justify-between text-sm"><span className="text-[#68708a]">Deposit</span><span className="font-semibold text-[#1b2345]">{formatCurrency(application.contractDepositAmount)}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-[#68708a]">Licensing &amp; Registration</span><span className="font-semibold text-[#1b2345]">{formatCurrency(application.contractLicensingFee)}</span></div>
                    <div className="flex justify-between border-t border-[#eef0f7] pt-2.5 text-sm"><span className="font-semibold text-[#1b2345]">Total Required Now</span><span className="text-lg font-bold text-[#2f67de]">{formatCurrency(application.contractTotalPayableNow)}</span></div>
                    <div className="flex justify-between border-t border-[#eef0f7] pt-2.5 text-sm"><span className="text-[#68708a]">Monthly Instalment</span><span className="font-semibold text-[#1b2345]">{formatCurrency(application.contractMonthlyPayment)}</span></div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
                    <div className="rounded-[10px] bg-[#f4f6fb] p-2.5">
                      <p className="text-[#68708a]">Issued</p>
                      <p className="mt-0.5 font-semibold text-[#1b2345]">{formatDate(application.contractIssuedAt)}</p>
                    </div>
                    <div className="rounded-[10px] bg-[#f4f6fb] p-2.5">
                      <p className="text-[#68708a]">Expires</p>
                      <p className="mt-0.5 font-semibold text-[#1b2345]">{formatDate(application.contractExpiresAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Signing Status */}
            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)]">
              <div className={"border-b px-5 py-4 " + (isSigned ? "border-emerald-100 bg-gradient-to-r from-[#0a3b2a] to-[#0f5239]" : "border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563]")}>
                <p className={"text-[10px] font-bold uppercase tracking-[0.22em] " + (isSigned ? "text-emerald-200" : "text-[#f4c89a]")}>Contract Signature</p>
                <h2 className="text-[1.05rem] font-semibold text-white">{isSigned ? "Contract Signed Digitally" : "Awaiting Client Signature"}</h2>
              </div>
              <div className="p-5">
                {isSigned ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100">
                        <svg className="h-6 w-6 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">Signed by {application.contractAcceptedName || application.fullName}</p>
                        <p className="mt-0.5 text-[12px] text-[#68708a]">Signed on {formatDate(application.contractAcceptedAt)}</p>
                      </div>
                    </div>
                    {application.contractSignatureImage && (
                      <div className="rounded-[14px] border border-[#e7eaf2] bg-[#fafbff] p-3">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">Signature on file</p>
                        <img src={application.contractSignatureImage} alt="Client signature" className="h-16 w-auto rounded-lg border border-[#eef0f7] bg-white p-1" />
                      </div>
                    )}
                    <div className="flex gap-2">
                      <a href={"/api/admin/preview-contract?id=" + application.id} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-[12px] font-semibold text-indigo-700 hover:bg-indigo-100">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Preview Signed Contract
                      </a>
                      <ResendContractButton applicationId={application.id} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-[14px] border border-amber-200 bg-amber-50 p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                      <svg className="h-5 w-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Waiting for client to sign</p>
                      <p className="mt-0.5 text-[12px] text-amber-700">The client has not yet reviewed and signed their contract.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 24hr countdown if signed */}
            {isSigned && application.contractAcceptedAt && (
              <PaymentCountdownCard contractAcceptedAt={new Date(application.contractAcceptedAt).toISOString()} />
            )}

            {/* Banking Details */}
            {hasBanking && (
              <div className="overflow-hidden rounded-[24px] border border-emerald-200 bg-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)]">
                <div className="border-b border-emerald-100 bg-gradient-to-r from-[#0a3b2a] to-[#0f5239] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200">Payment Banking</p>
                  <h2 className="text-[1.05rem] font-semibold text-white">Client Banking Details</h2>
                </div>
                <div className="p-5">
                  <p className="mb-3 text-[11px] text-[#68708a]">Submitted {formatDate(application.clientBankSubmittedAt)}</p>
                  <div className="divide-y divide-[#f0f2f8] rounded-[14px] border border-[#e7eaf2] bg-[#fafbff] overflow-hidden">
                    {[
                      {label:"Bank Name", value:application.clientBankName},
                      {label:"Account Holder", value:application.clientAccountHolder},
                      {label:"Account Number", value:application.clientAccountNumber},
                      {label:"Account Type", value:application.clientAccountType},
                      {label:"Branch Code", value:application.clientBranchCode},
                    ].map(({label, value}) => (
                      <div key={label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-[12px] text-[#68708a]">{label}</span>
                        <span className={"text-[13px] font-semibold text-[#1b2345] " + (label.includes("Number") || label.includes("Code") ? "font-mono" : "")}>{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Invoice actions */}
            {isAwaitingInvoice && (
              <PrepareInvoiceForm
                applicationId={application.id}
                referenceNumber={application.referenceNumber}
                contractDepositAmount={application.contractDepositAmount}
                contractLicensingFee={application.contractLicensingFee}
                contractMonthlyPayment={application.contractMonthlyPayment}
                contractTotalPayableNow={application.contractTotalPayableNow}
                clientFullName={application.contractClientFullName}
                invoiceNumber={application.invoiceNumber}
                invoiceSentAt={application.invoiceSentAt}
              />
            )}
          </div>

          {/* RIGHT — Sidebar */}
          <div className="space-y-4">

            {/* Client profile */}
            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">Client Profile</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-white text-[14px] font-bold">
                    {application.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#1b2345]">{application.fullName}</p>
                    <p className="text-[11px] text-[#68708a]">{application.referenceNumber}</p>
                  </div>
                </div>
                <div className="divide-y divide-[#f0f2f8] rounded-[12px] border border-[#e7eaf2] overflow-hidden text-[12px]">
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <svg className="h-3.5 w-3.5 shrink-0 text-[#68708a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <a href={"mailto:"+application.email} className="text-[#2f67de] hover:underline truncate">{application.email}</a>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5">
                    <svg className="h-3.5 w-3.5 shrink-0 text-[#68708a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.04 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                    <a href={"tel:"+application.phone} className="text-[#1b2345] font-medium">{application.phone}</a>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={"https://wa.me/27"+application.phone.replace(/^0/, "").replace(/\s/g,"")} target="_blank" rel="noreferrer" className="flex-1 rounded-full bg-[#25d366] py-2 text-center text-[11px] font-bold text-white">WhatsApp</a>
                  <a href={"/admin/"+application.id} className="flex-1 rounded-full border border-[#e1e4ee] bg-white py-2 text-center text-[11px] font-semibold text-[#1b2345] hover:bg-[#f4f6fb]">Full Profile</a>
                </div>
              </div>
            </div>

            {/* SA Reviews */}
            <div className="overflow-hidden rounded-[24px] border border-[#f1dfd1] bg-gradient-to-br from-[#fffaf5] to-white shadow-[0_4px_16px_-8px_rgba(213,151,88,0.15)]">
              <div className="p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c37d43]">Client Trust Signal</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => (<svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#d59758"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>))}</div>
                  <span className="text-[13px] font-bold text-[#1b2345]">4.7</span>
                  <span className="text-[11px] text-[#68708a]">· 229+ reviews</span>
                </div>
                <a href="https://sareviews.co.za/auto-access" target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-between rounded-[12px] border border-[#f1dfd1] bg-[#fffbf5] px-3 py-2.5 text-[11px] font-semibold text-[#c37d43] hover:bg-[#fff5e8]">
                  View on SA Reviews
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                </a>
              </div>
            </div>

            {/* Application journey */}
            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] px-4 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Application Journey</p>
              </div>
              <div className="p-4 space-y-2">
                {[
                  {label:"Applied", done:true},
                  {label:"Documents", done:true},
                  {label:"Approval", done:true},
                  {label:"Contract Issued", done:true},
                  {label:"Contract Signed", done:isSigned},
                  {label:"Banking Submitted", done:hasBanking},
                  {label:"Invoice Issued", done:!!application.invoiceSentAt},
                ].map(({label, done}) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className={"flex h-5 w-5 shrink-0 items-center justify-center rounded-full " + (done ? "bg-emerald-500" : "border-2 border-[#e1e4ee] bg-white")}>
                      {done && <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                    </div>
                    <span className={"text-[12px] " + (done ? "font-semibold text-[#1b2345]" : "text-[#a3aac0]")}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_4px_16px_-8px_rgba(15,23,42,0.08)]">
              <div className="border-b border-[#eef0f7] px-4 py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">Quick Links</p>
              </div>
              <div className="p-3 space-y-1.5">
                {[
                  {label:"How Does It Work", href:"https://autoaccess.co.za/#how-it-works", icon:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"},
                  {label:"Audio Approval Message", href:"/audio", icon:"M9 18V5l12-2v13"},
                  {label:"FAQ", href:"https://autoaccess.co.za/#faq", icon:"M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"},
                  {label:"About Auto Access", href:"https://autoaccess.co.za/about", icon:"M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"},
                  {label:"Showroom", href:"https://autoaccess.co.za/showroom", icon:"M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2"},
                ].map(({label, href, icon}) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-[12px] px-3 py-2.5 text-[12px] font-medium text-[#39425d] hover:bg-[#f4f6fb] transition">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef0f7]">
                        <svg className="h-3.5 w-3.5 text-[#1b2345]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={icon}/></svg>
                      </div>
                      {label}
                    </div>
                    <svg className="h-3.5 w-3.5 text-[#a3aac0]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
