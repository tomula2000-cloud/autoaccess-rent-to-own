"use client";

import { useState } from "react";

type Props = {
  applicationId: string;
  status: string;
  fullName: string;
};

const REMINDER_STATUSES = [
  "APPLICATION_RECEIVED",
  "PRE_QUALIFIED",
  "AWAITING_DOCUMENTS",
  "ADDITIONAL_DOCUMENTS_REQUIRED",
];

const CONFIRM_STATUSES = [
  "APPLICATION_RECEIVED",
  "PRE_QUALIFIED",
  "AWAITING_DOCUMENTS",
  "ADDITIONAL_DOCUMENTS_REQUIRED",
  "DOCUMENTS_SUBMITTED",
];

export default function AdminDocumentActions({ applicationId, status, fullName }: Props) {
  const [reminderState, setReminderState] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [confirmState, setConfirmState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<"whatsapp" | "email" | "">("");

  const canSendReminder = REMINDER_STATUSES.includes(status);
  const canConfirmDocs = CONFIRM_STATUSES.includes(status);

  async function handleSendReminder() {
    setReminderState("loading");
    try {
      const res = await fetch("/api/admin/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });
      const data = await res.json();
      if (data.success) {
        setReminderState("sent");
      } else {
        setReminderState("error");
      }
    } catch {
      setReminderState("error");
    }
  }

  async function handleConfirmDocuments() {
    if (!selectedMethod) return;
    setConfirmState("loading");
    try {
      const res = await fetch("/api/admin/confirm-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, method: selectedMethod }),
      });
      const data = await res.json();
      if (data.success) {
        setConfirmState("done");
        setShowConfirmModal(false);
      } else {
        setConfirmState("error");
      }
    } catch {
      setConfirmState("error");
    }
  }

  if (!canSendReminder && !canConfirmDocs) return null;

  return (
    <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
      <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Document Actions</p>
        <h2 className="text-[1.05rem] font-semibold text-white">Manage Document Submission</h2>
      </div>
      <div className="space-y-4 p-5">

        {/* Send Reminder */}
        {canSendReminder ? (
          <div className="rounded-[18px] border border-[#dbe6ff] bg-[#eef4ff] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2f67de]">Document Reminder</p>
            <p className="mt-2 text-sm leading-6 text-[#39425d]">
              Send <strong>{fullName}</strong> a reminder email with instructions to submit their documents via portal, email or WhatsApp.
            </p>
            {reminderState === "sent" ? (
              <div className="mt-3 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                <p className="text-sm font-semibold text-emerald-700">Reminder sent successfully.</p>
              </div>
            ) : reminderState === "error" ? (
              <div className="mt-3 rounded-[12px] border border-red-200 bg-red-50 px-4 py-2.5">
                <p className="text-sm font-semibold text-red-700">Failed to send reminder. Please try again.</p>
              </div>
            ) : null}
            <button
              onClick={handleSendReminder}
              disabled={reminderState === "loading" || reminderState === "sent"}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(47,103,222,0.4)] transition disabled:opacity-50"
            >
              {reminderState === "loading" ? (
                <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending...</>
              ) : reminderState === "sent" ? (
                "Reminder Sent"
              ) : (
                <><svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>Send Document Reminder</>
              )}
            </button>
          </div>
        ) : null}

        {/* Confirm Documents */}
        {canConfirmDocs ? (
          <div className="rounded-[18px] border border-amber-200 bg-amber-50 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-700">Manual Document Confirmation</p>
            <p className="mt-2 text-sm leading-6 text-[#39425d]">
              If <strong>{fullName}</strong> sent documents via WhatsApp or email, confirm receipt here to update their application status.
            </p>
            {confirmState === "done" ? (
              <div className="mt-3 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-2.5">
                <p className="text-sm font-semibold text-emerald-700">Documents confirmed. Status updated to Documents Submitted.</p>
              </div>
            ) : confirmState === "error" ? (
              <div className="mt-3 rounded-[12px] border border-red-200 bg-red-50 px-4 py-2.5">
                <p className="text-sm font-semibold text-red-700">Failed to confirm. Please try again.</p>
              </div>
            ) : null}
            <button
              onClick={() => setShowConfirmModal(true)}
              disabled={confirmState === "done"}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(213,151,88,0.4)] transition disabled:opacity-50"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Confirm Documents Received
            </button>
          </div>
        ) : null}
      </div>

      {/* Confirm Modal */}
      {showConfirmModal ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b1532]/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] border border-[#e1e4ee] bg-white p-6 shadow-[0_40px_100px_-30px_rgba(11,21,50,0.4)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a] bg-gradient-to-r from-[#1b2345] to-[#2a3563] -mx-6 -mt-6 px-6 py-4 rounded-t-[24px]">Confirm Document Receipt</p>
            <p className="mt-4 text-sm leading-6 text-[#39425d]">
              How did <strong>{fullName}</strong> send their documents?
            </p>
            <div className="mt-4 space-y-2">
              {[
                { value: "whatsapp", label: "Via WhatsApp", icon: "💬" },
                { value: "email", label: "Via Email (docs@autoaccess.co.za)", icon: "📧" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedMethod(option.value as "whatsapp" | "email")}
                  className={`w-full rounded-[14px] border px-4 py-3 text-left text-sm font-semibold transition ${
                    selectedMethod === option.value
                      ? "border-[#2f67de] bg-[#eef4ff] text-[#2f67de]"
                      : "border-[#e1e4ee] bg-[#fafbff] text-[#1b2345] hover:border-[#dbe6ff]"
                  }`}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 rounded-full border border-[#e1e4ee] bg-[#fafbff] px-4 py-3 text-sm font-semibold text-[#68708a] transition hover:border-[#dbe6ff]"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDocuments}
                disabled={!selectedMethod || confirmState === "loading"}
                className="flex-1 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(47,103,222,0.4)] transition disabled:opacity-50"
              >
                {confirmState === "loading" ? "Confirming..." : "Confirm & Update Status"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
