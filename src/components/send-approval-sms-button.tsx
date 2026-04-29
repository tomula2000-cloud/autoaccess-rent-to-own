"use client";
import { useState } from "react";

export default function SendApprovalSmsButton({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!confirm("Send approval SMS to client?")) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/send-approval-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ SMS sent successfully.");
      } else {
        setMessage(`❌ ${data.error || "Failed to send SMS."}`);
      }
    } catch {
      setMessage("❌ Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={handleSend}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:from-emerald-700 hover:to-emerald-600 disabled:opacity-50"
      >
        {loading ? "Sending…" : "📱 Resend Approval SMS"}
      </button>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
