"use client";
import { useState } from "react";

export default function AdminBulkApprovalSms({ approvedCount }: { approvedCount: number }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleSend = async () => {
    if (!confirm(`Send approval SMS to all ${approvedCount} approved client(s)?`)) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/admin/send-bulk-approval-sms", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResult(`✅ Sent to ${data.sent} client(s)${data.failed > 0 ? ` — ${data.failed} failed.` : "."}`);
      } else {
        setResult(`❌ ${data.error || "Failed."}`);
      }
    } catch {
      setResult("❌ Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[24px] border border-emerald-200 bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
      <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-700 to-emerald-500 px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-100">Bulk Notification</p>
        <h2 className="text-[1rem] font-semibold text-white">Send Approval SMS to All Approved Clients</h2>
      </div>
      <div className="p-5">
        <p className="mb-3 text-sm text-gray-500">
          {approvedCount > 0
            ? `${approvedCount} client(s) currently approved in principle. Each will receive a personalised SMS with their name and reference number.`
            : "No clients currently in Approved in Principle status."}
        </p>
        <button
          onClick={handleSend}
          disabled={loading || approvedCount === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50"
        >
          {loading ? "Sending…" : `📱 Send Approval SMS to All (${approvedCount})`}
        </button>
        {result && <p className="mt-3 text-sm">{result}</p>}
      </div>
    </div>
  );
}
