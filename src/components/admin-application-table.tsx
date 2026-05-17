"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Application = {
  id: string;
  referenceNumber: string;
  fullName: string;
  email: string;
  phone: string;
  identityType: string | null;
  identityNumber: string | null;
  employmentStatus: string;
  monthlyIncome: string;
  preferredVehicle: string;
  status: string;
  createdAt: Date | string;
  adminSeen: boolean;
};

type Props = {
  applications: Application[];
  statusTimestampMap: Record<string, Date | string | undefined>;
  priorityStatuses: string[];
};

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

function formatIdentityType(value: string | null) {
  if (!value) return "—";
  if (value === "SA_ID") return "SA ID";
  if (value === "PASSPORT") return "Passport";
  return value;
}

function getStatusBadge(status: string) {
  switch (status) {
    case "APPLICATION_RECEIVED": return "border-blue-400/30 bg-blue-500/10 text-blue-300";
    case "PRE_QUALIFICATION_REVIEW": return "border-indigo-400/30 bg-indigo-500/10 text-indigo-300";
    case "PRE_QUALIFIED": return "border-sky-400/30 bg-sky-500/10 text-sky-300";
    case "AWAITING_DOCUMENTS": return "border-amber-400/30 bg-amber-500/10 text-amber-300";
    case "DOCUMENTS_SUBMITTED": return "border-cyan-400/30 bg-cyan-500/10 text-cyan-300";
    case "DOCUMENTS_UNDER_REVIEW": return "border-violet-400/30 bg-violet-500/10 text-violet-300";
    case "ADDITIONAL_DOCUMENTS_REQUIRED": return "border-orange-400/30 bg-orange-500/10 text-orange-300";
    case "APPROVED_IN_PRINCIPLE": return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";
    case "CONTRACT_REQUESTED": return "border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-300";
    case "CONTRACT_ISSUED": return "border-purple-400/30 bg-purple-500/10 text-purple-300";
    case "AWAITING_INVOICE": return "border-violet-400/30 bg-violet-500/10 text-violet-300";
    case "INVOICE_ISSUED": return "border-purple-400/30 bg-purple-500/10 text-purple-300";
    case "AWAITING_PAYMENT": return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300";
    case "PAYMENT_UNDER_VERIFICATION": return "border-teal-400/30 bg-teal-500/10 text-teal-300";
    case "PAYMENT_CONFIRMED": return "border-green-400/30 bg-green-500/10 text-green-300";
    case "COMPLETED": return "border-lime-400/30 bg-lime-500/10 text-lime-300";
    case "DECLINED": return "border-red-400/30 bg-red-500/10 text-red-300";
    default: return "border-white/20 bg-white/5 text-white/60";
  }
}

type Toast = { kind: "success" | "error" | "info"; message: string };

export default function AdminApplicationTable({
  applications,
  statusTimestampMap,
  priorityStatuses,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const byId = useMemo(
    () => new Map(applications.map((a) => [a.id, a])),
    [applications]
  );

  const allChecked = applications.length > 0 && selectedIds.size === applications.length;
  const someChecked = selectedIds.size > 0 && !allChecked;

  function toggleAll(checked: boolean) {
    if (checked) {
      setSelectedIds(new Set(applications.map((a) => a.id)));
    } else {
      setSelectedIds(new Set());
    }
  }

  function toggleOne(id: string, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function clearSelection() {
    setSelectedIds(new Set());
  }

  function showToast(t: Toast, ms = 5000) {
    setToast(t);
    window.setTimeout(() => setToast(null), ms);
  }

  async function runBulk(opts: {
    ids: string[];
    url: (id: string) => string;
    body: (id: string) => unknown;
    successLabel: string;
    emptyLabel?: string;
  }) {
    if (opts.ids.length === 0) {
      if (opts.emptyLabel) showToast({ kind: "info", message: opts.emptyLabel });
      return;
    }
    setIsProcessing(true);
    setProgress({ done: 0, total: opts.ids.length });
    let ok = 0;
    let fail = 0;
    let missing = 0;
    for (const id of opts.ids) {
      try {
        const res = await fetch(opts.url(id), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(opts.body(id)),
        });
        if (res.ok) {
          ok++;
        } else if (res.status === 404) {
          missing++;
          fail++;
        } else {
          fail++;
        }
      } catch {
        fail++;
      }
      setProgress((p) => (p ? { ...p, done: p.done + 1 } : p));
    }
    setIsProcessing(false);
    setProgress(null);
    let msg = `${ok} ${opts.successLabel}`;
    if (fail > 0) msg += ` · ${fail} failed`;
    if (missing > 0) msg += ` (endpoint not yet implemented)`;
    showToast({ kind: fail === 0 ? "success" : "error", message: msg });
  }

  async function sendReminder() {
    await runBulk({
      ids: [...selectedIds],
      url: () => "/api/admin/send-reminder",
      body: (id) => ({ applicationId: id }),
      successLabel: "reminders sent",
    });
  }

  async function sendApprovalSms() {
    await runBulk({
      ids: [...selectedIds],
      url: () => "/api/admin/send-approval-sms",
      body: (id) => ({ applicationId: id }),
      successLabel: "approval SMS sent",
    });
  }

  async function markUnderReview() {
    const eligible = [...selectedIds].filter(
      (id) => byId.get(id)?.status === "DOCUMENTS_SUBMITTED"
    );
    await runBulk({
      ids: eligible,
      url: (id) => `/api/applications/${id}/status`,
      body: () => ({ status: "DOCUMENTS_UNDER_REVIEW" }),
      successLabel: "marked Under Review",
      emptyLabel: "No selected applications are in DOCUMENTS_SUBMITTED status.",
    });
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#eef0f7] bg-[#fafbff]">
              <th className="w-10 px-3 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked;
                  }}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="h-4 w-4 cursor-pointer accent-[#2f67de]"
                  aria-label="Select all applications"
                  disabled={applications.length === 0}
                />
              </th>
              {["Reference", "Applicant", "Contact", "Employment", "Vehicle", "Status", "Date", "Action"].map((h) => (
                <th key={h} className="px-3 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {applications.map((application, index) => {
              const isSelected = selectedIds.has(application.id);
              return (
                <tr
                  key={application.id}
                  className={`border-t border-[#eef0f7] align-top transition ${
                    isSelected
                      ? "bg-[#eef4ff]"
                      : index % 2 === 0
                        ? "bg-white hover:bg-[#fafbff]"
                        : "bg-[#fdfdff] hover:bg-[#fafbff]"
                  }`}
                >
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => toggleOne(application.id, e.target.checked)}
                      className="h-4 w-4 cursor-pointer accent-[#2f67de]"
                      aria-label={`Select ${application.referenceNumber}`}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-[12px] font-bold text-[#2f67de]">{application.referenceNumber}</span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-[13px] font-semibold text-[#1b2345]">{application.fullName}</p>
                    <p className="mt-0.5 text-[11px] text-[#68708a]">{application.email}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-[12px] font-medium text-[#39425d]">{application.phone}</p>
                    <p className="mt-0.5 text-[11px] text-[#68708a]">{formatIdentityType(application.identityType)} · {application.identityNumber || "—"}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-[12px] font-medium text-[#39425d]">{application.employmentStatus}</p>
                    <p className="mt-0.5 text-[11px] text-[#68708a]">R {application.monthlyIncome}</p>
                  </td>
                  <td className="px-3 py-3 text-[12px] text-[#39425d]">{application.preferredVehicle}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${getStatusBadge(application.status)}`}>
                      {formatStatus(application.status)}
                    </span>
                    {application.status === "AWAITING_INVOICE" && !application.adminSeen ? (
                      <span className="ml-2 inline-flex items-center gap-1.5 align-middle text-[10px] font-bold uppercase tracking-[0.12em] text-red-600">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>
                        ! New
                      </span>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-[11px] text-[#68708a]">
                    {priorityStatuses.includes(application.status) && statusTimestampMap[application.id] ? (
                      <span className="text-fuchsia-300">
                        <span className="block font-semibold">{new Date(statusTimestampMap[application.id] as Date | string).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        <span className="block text-[10px]">{new Date(statusTimestampMap[application.id] as Date | string).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}</span>
                      </span>
                    ) : (
                      <span>
                        <span className="block font-semibold">{new Date(application.createdAt).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}</span>
                        <span className="block text-[10px]">{new Date(application.createdAt).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}</span>
                      </span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Link
                      href={`/admin/${application.id}`}
                      className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold text-white transition ${
                        priorityStatuses.includes(application.status)
                          ? application.adminSeen
                            ? "bg-gradient-to-r from-[#4b5563] to-[#6b7280] hover:from-[#6b7280] hover:to-[#9ca3af]"
                            : "bg-gradient-to-r from-[#1b2345] to-[#2a3563] hover:from-[#2a3563] hover:to-[#3b4a82]"
                          : "bg-gradient-to-r from-[#1b2345] to-[#2a3563] hover:from-[#2a3563] hover:to-[#3b4a82]"
                      }`}
                    >
                      {priorityStatuses.includes(application.status) && application.adminSeen ? "✓ Viewed" : "View"}
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bulk actions toolbar */}
      {selectedIds.size > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-gradient-to-r from-[#0b1532] to-[#102046] shadow-[0_-12px_30px_-12px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-3 px-5 py-3.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d59758]/40 bg-[#d59758]/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#f4c89a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f4c89a] shadow-[0_0_8px_rgba(244,200,154,0.7)]" />
              <span className="tabular-nums">{selectedIds.size}</span> selected
            </span>

            <button
              type="button"
              onClick={sendReminder}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-4 py-2 text-[12px] font-bold text-[#0b1532] shadow-[0_8px_18px_-6px_rgba(213,151,88,0.5)] transition hover:from-[#c4863f] hover:to-[#d59758] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send Document Reminder
            </button>

            <button
              type="button"
              onClick={sendApprovalSms}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-4 py-2 text-[12px] font-bold text-[#0b1532] shadow-[0_8px_18px_-6px_rgba(213,151,88,0.5)] transition hover:from-[#c4863f] hover:to-[#d59758] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send Approval SMS
            </button>

            <button
              type="button"
              onClick={markUnderReview}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-white/[0.12] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark as Under Review
            </button>

            {isProcessing && progress ? (
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-blue-100/80">
                <span
                  className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-[#f4c89a]"
                  aria-hidden="true"
                />
                <span className="tabular-nums">Processing {progress.done}/{progress.total}</span>
              </span>
            ) : null}

            <button
              type="button"
              onClick={clearSelection}
              disabled={isProcessing}
              aria-label="Clear selection"
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/70 transition hover:border-white/30 hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      {/* Toast */}
      {toast ? (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-24 right-4 z-50 flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] backdrop-blur ${
            toast.kind === "success"
              ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
              : toast.kind === "error"
                ? "border-red-400/40 bg-red-500/15 text-red-100"
                : "border-[#d59758]/40 bg-[#0b1532]/85 text-[#f4c89a]"
          }`}
        >
          <span className="text-[13px] font-semibold leading-snug">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            aria-label="Dismiss"
            className="ml-2 -mr-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-current opacity-70 transition hover:opacity-100"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : null}
    </>
  );
}
