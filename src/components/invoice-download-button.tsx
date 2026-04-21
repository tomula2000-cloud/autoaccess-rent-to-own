"use client";

interface InvoiceDownloadButtonProps {
  invoiceNumber: string;
  referenceNumber: string;
  invoiceIssuedAt: string | null;
  invoiceDueAt: string | null;
  invoiceDepositAmount: string | null;
  invoiceLicensingFee: string | null;
  invoiceMonthlyAmount: string | null;
  invoiceTotalDue: string | null;
  invoiceBankName: string | null;
  invoiceBankHolder: string | null;
  invoiceBankAccount: string | null;
  invoiceBankBranch: string | null;
  invoiceBankType: string | null;
  invoicePaymentReference: string | null;
  invoiceTerms: string | null;
}

export default function InvoiceDownloadButton(props: InvoiceDownloadButtonProps) {
  const handlePrint = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    const fmtDate = (d: string | null) =>
      d ? new Date(d).toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" }) : "";

    w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${props.invoiceNumber}</title>
    <style>
      body{font-family:Arial,sans-serif;color:#1b2345;padding:20px;max-width:700px;margin:0 auto;}
      .hdr{background:#1b2345;color:#fff;padding:20px;display:flex;justify-content:space-between;align-items:flex-start;}
      .gold{color:#c9973a;} .bar{height:3px;background:#c9973a;}
      .strip{background:#f8f6f0;padding:10px 20px;display:flex;gap:30px;border-bottom:1px solid #e2ddd5;}
      .lbl{font-size:9px;text-transform:uppercase;letter-spacing:2px;color:#8a9bbf;}
      .val{font-size:13px;font-weight:700;margin-top:2px;}
      .body{padding:20px;}
      table{width:100%;border-collapse:collapse;margin-bottom:16px;}
      th{background:#1b2345;color:#8a9bbf;padding:8px 12px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:2px;font-weight:400;}
      th:last-child,td:last-child{text-align:right;}
      td{padding:10px 12px;border-bottom:1px solid #eef0f5;font-size:13px;}
      .total-box{background:#1b2345;padding:10px 14px;display:flex;justify-content:space-between;margin-bottom:16px;}
      .bk-card{border:1px solid #dde1ec;padding:12px;margin-bottom:12px;}
      .bk-row{display:flex;justify-content:space-between;font-size:12px;padding:3px 0;border-bottom:1px solid #eef0f5;}
      .ref-box{background:#fff8ee;border:1px solid #c9973a;padding:8px 12px;display:flex;justify-content:space-between;margin-top:8px;}
      .terms{background:#fafbfd;border:1px solid #eef0f5;padding:12px;font-size:11px;color:#5a6480;line-height:1.6;white-space:pre-wrap;margin-bottom:16px;}
      .footer{background:#1b2345;padding:10px 20px;display:flex;justify-content:space-between;}
    </style></head><body>
    <div class="hdr">
      <div>
        <div style="font-size:20px;font-weight:700;color:#c9973a;">Auto Access</div>
        <div style="font-size:10px;color:#8a9bbf;margin-top:2px;">Access Holdings (Pty) Ltd T/A Auto Access</div>
        <div style="font-size:11px;color:#8a9bbf;margin-top:8px;line-height:1.6;">22 Eiland St, Eiland Park, Paarl, 7646<br/>087 012 6734 | admin@autoaccess.co.za</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:24px;color:#fff;">Invoice</div>
        <div style="font-size:10px;color:#c9973a;letter-spacing:2px;text-transform:uppercase;margin-top:4px;">Payment Request</div>
        <div style="margin-top:10px;display:inline-block;background:#fff0e0;border:1px solid #c9973a;padding:2px 10px;font-size:9px;color:#c9973a;font-weight:700;text-transform:uppercase;">Due within 24 hours</div>
      </div>
    </div>
    <div class="bar"></div>
    <div class="strip">
      <div><div class="lbl">Invoice No.</div><div class="val gold">${props.invoiceNumber}</div></div>
      <div><div class="lbl">Contract Ref.</div><div class="val">${props.referenceNumber}</div></div>
      <div><div class="lbl">Invoice Date</div><div class="val">${fmtDate(props.invoiceIssuedAt)}</div></div>
      <div><div class="lbl">Due Date</div><div class="val gold">${fmtDate(props.invoiceDueAt)}</div></div>
    </div>
    <div class="body">
      <table>
        <thead><tr><th>#</th><th>Description</th><th>Amount Due</th></tr></thead>
        <tbody>
          <tr><td style="color:#8a9bbf;font-size:11px;">01</td><td><b>Security Deposit</b><br/><span style="font-size:11px;color:#8a9bbf;">Refundable upon 54-month completion</span></td><td><b>R ${props.invoiceDepositAmount || ""}</b></td></tr>
          <tr><td style="color:#8a9bbf;font-size:11px;">02</td><td><b>Licensing &amp; Registration Fee</b></td><td><b>R ${props.invoiceLicensingFee || ""}</b></td></tr>
          <tr style="opacity:0.6"><td style="color:#8a9bbf;font-size:11px;">03</td><td><b>Monthly Instalment</b> <span style="background:#eef0f5;padding:1px 6px;font-size:9px;color:#8a9bbf;text-transform:uppercase;">Not due now</span><br/><span style="font-size:11px;color:#8a9bbf;">Commences next calendar month via debit order</span></td><td style="color:#8a9bbf;"><b>R 0.00</b></td></tr>
        </tbody>
      </table>
      <div class="total-box">
        <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#8a9bbf;">Total Due Now</span>
        <span style="font-size:18px;font-weight:700;color:#c9973a;">R ${props.invoiceTotalDue || ""}</span>
      </div>
      <div class="bk-card">
        <div class="lbl" style="color:#c9973a;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #eef0f5;">Banking Details</div>
        <div class="bk-row"><span style="color:#8a9bbf;">Bank</span><b>${props.invoiceBankName || ""}</b></div>
        <div class="bk-row"><span style="color:#8a9bbf;">Account Holder</span><b>${props.invoiceBankHolder || ""}</b></div>
        <div class="bk-row"><span style="color:#8a9bbf;">Account Number</span><b style="font-family:monospace;">${props.invoiceBankAccount || ""}</b></div>
        <div class="bk-row"><span style="color:#8a9bbf;">Branch Code</span><b style="font-family:monospace;">${props.invoiceBankBranch || ""}</b></div>
        <div class="bk-row"><span style="color:#8a9bbf;">Account Type</span><b>${props.invoiceBankType || ""}</b></div>
        <div class="ref-box">
          <span style="font-size:11px;color:#8a9bbf;text-transform:uppercase;letter-spacing:1px;">Payment Reference</span>
          <span style="font-size:15px;font-weight:700;color:#c9973a;font-family:Georgia,serif;">${props.invoicePaymentReference || props.referenceNumber}</span>
        </div>
      </div>
      ${props.invoiceTerms ? `<div class="terms">${props.invoiceTerms}</div>` : ""}
    </div>
    <div class="footer">
      <span style="font-size:10px;color:#8a9bbf;">Access Holdings (Pty) Ltd T/A Auto Access | Reg No: 1999/002599/10 | admin@autoaccess.co.za</span>
      <span style="font-size:10px;color:#5a6480;">Ref: ${props.invoiceNumber}</span>
    </div>
    </body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 500);
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#c9973a]/40 bg-[#fff8ee] px-5 py-3 text-sm font-semibold text-[#c9973a] transition hover:bg-[#fff0d0]"
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 6 2 18 2 18 9" />
        <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
        <rect x="6" y="14" width="12" height="8" />
      </svg>
      View &amp; Download Invoice
    </button>
  );
}
