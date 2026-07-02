"use client";
import { useState } from "react";

export default function SendDeliveryDelayButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const handleClick = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/send-delivery-delay-notice", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setResult(data.message);
      }
    } catch {
      setError("Network error — please try again");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold transition disabled:opacity-50 ${
          confirming
            ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-[#e1e4ee] bg-white text-[#39425d] hover:border-amber-300 hover:text-amber-700"
        }`}
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        {loading ? "Sending..." : confirming ? "Click again to confirm send" : "Send Delivery Delay Notice"}
      </button>
      {result ? (
        <p className="max-w-xs text-right text-[10px] font-semibold text-emerald-600">{result}</p>
      ) : null}
      {error ? (
        <p className="max-w-xs text-right text-[10px] font-semibold text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
