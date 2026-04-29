"use client";
import { useState } from "react";

export default function AdminBulkApprove({ underReviewCount }: { underReviewCount: number }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleApprove = async () => {
    if (!confirm(`This will approve all ${underReviewCount} application(s) currently under review and send each client an approval email and SMS. Are you sure?`)) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/admin/bulk-approve", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResult(`✅ ${data.approved} application(s) approved. Email and SMS sent to each client.${data.failed > 0 ? ` ${data.failed} failed.` : ""}`);
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
    <div className="overflow-hidden rounded-[24px] border border-[#dbe6ff] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
      <div className="border-b border-[#dbe6ff] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Bulk Action</p>
        <h2 className="text-[1rem] font-semibold text-white">Approve All Documents Under Review</h2>
      </div>
      <div className="p-5">
        <p className="mb-3 text-sm text-gray-500">
          {underReviewCount > 0
            ? `${underReviewCount} application(s) currently in Documents Under Review. Clicking below will move all of them to Approved in Principle and trigger an approval email and SMS to each client.`
            : "No applications currently in Documents Under Review."}
        </p>
        <button
          onClick={handleApprove}
          disabled={loading || underReviewCount === 0}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-2.5 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Processing…" : `✅ Approve All (${underReviewCount})`}
        </button>
        {result && <p className="mt-3 text-sm">{result}</p>}
      </div>
    </div>
  );
}
