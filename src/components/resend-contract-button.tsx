"use client";
import { useState } from "react";

export default function ResendContractButton({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleResend() {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/resend-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Contract copy sent successfully.");
      } else {
        setMessage(data.error || "Failed to send contract.");
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleResend}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-[13px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        {loading ? "Sending..." : "Send Contract Copy to Client"}
      </button>
      {message && (
        <p className={`text-[12px] font-medium ${message.includes("success") ? "text-emerald-600" : "text-red-500"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
