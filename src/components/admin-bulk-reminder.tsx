"use client";

import { useState } from "react";

export default function AdminBulkReminder({ pendingCount }: { pendingCount: number }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSend() {
    setState("loading");
    setShowConfirm(false);
    try {
      const res = await fetch("/api/admin/send-bulk-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setState("done");
        setMessage(data.message);
      } else {
        setState("error");
        setMessage(data.error || "Something went wrong.");
      }
    } catch {
      setState("error");
      setMessage("Failed to send reminders. Please try again.");
    }
  }

  if (pendingCount === 0) return null;

  return (
    <>
      <div className="overflow-hidden rounded-[24px] border border-amber-200 bg-gradient-to-r from-amber-50 to-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
        <div className="border-b border-amber-100 bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Bulk Action</p>
          <h2 className="text-[1.05rem] font-semibold text-white">Send Document Reminders</h2>
        </div>
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-[0_10px_24px_-8px_rgba(245,158,11,0.45)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
                {pendingCount} client{pendingCount !== 1 ? "s" : ""} awaiting documents
              </p>
              <p className="mt-1.5 text-sm leading-6 text-[#39425d]">
                Send a document reminder email to all clients who have applied but have not yet submitted their supporting documents. Each email includes portal, email and WhatsApp submission options.
              </p>
              {state === "done" ? (
                <div className="mt-3 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                  <p className="text-sm font-semibold text-emerald-700">{message}</p>
                </div>
              ) : state === "error" ? (
                <div className="mt-3 rounded-[12px] border border-red-200 bg-red-50 px-4 py-2.5">
                  <p className="text-sm font-semibold text-red-700">{message}</p>
                </div>
              ) : null}
              <button
                onClick={() => setShowConfirm(true)}
                disabled={state === "loading" || state === "done"}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-5 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(213,151,88,0.5)] transition hover:from-[#c4863f] hover:to-[#d59758] disabled:opacity-50"
              >
                {state === "loading" ? (
                  <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending Reminders...</>
                ) : state === "done" ? (
                  "Reminders Sent"
                ) : (
                  <>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Send Reminders to All {pendingCount} Client{pendingCount !== 1 ? "s" : ""}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b1532]/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_40px_100px_-30px_rgba(11,21,50,0.4)]">
            <div className="rounded-t-[24px] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Confirm Bulk Action</p>
              <h3 className="text-[1rem] font-semibold text-white">Send Reminders to All?</h3>
            </div>
            <div className="p-6">
              <p className="text-sm leading-6 text-[#39425d]">
                You are about to send a document reminder email to <strong>{pendingCount} client{pendingCount !== 1 ? "s" : ""}</strong> who have not yet submitted their documents. This action cannot be undone.
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-full border border-[#e1e4ee] bg-[#fafbff] px-4 py-3 text-sm font-semibold text-[#68708a] transition hover:border-[#dbe6ff]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-4 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(213,151,88,0.5)]"
                >
                  Yes, Send All
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
