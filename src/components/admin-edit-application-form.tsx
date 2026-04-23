"use client";

import { useState } from "react";

type ApplicationFields = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  identityType: string | null;
  identityNumber: string | null;
  employmentStatus: string;
  monthlyIncome: string;
  salaryDate: string | null;
  preferredVehicle: string;
  physicalAddress: string | null;
  notes: string | null;
};

type Props = {
  application: ApplicationFields;
};

type FieldConfig = {
  key: keyof Omit<ApplicationFields, "id">;
  label: string;
  type: "text" | "email" | "tel" | "select";
  options?: string[];
  placeholder?: string;
};

const FIELDS: FieldConfig[] = [
  { key: "fullName", label: "Full Name", type: "text", placeholder: "e.g. John Smith" },
  { key: "email", label: "Email Address", type: "email", placeholder: "e.g. john@example.com" },
  { key: "phone", label: "Phone Number", type: "tel", placeholder: "e.g. 0821234567" },
  {
    key: "identityType",
    label: "Identity Type",
    type: "select",
    options: ["SOUTH_AFRICAN_ID", "PASSPORT", "OTHER"],
  },
  { key: "identityNumber", label: "ID / Passport Number", type: "text", placeholder: "e.g. 9001015009087" },
  {
    key: "employmentStatus",
    label: "Employment Status",
    type: "select",
    options: ["EMPLOYED", "SELF_EMPLOYED", "BUSINESS_OWNER", "CONTRACT", "OTHER"],
  },
  { key: "monthlyIncome", label: "Monthly Income", type: "text", placeholder: "e.g. R15000" },
  { key: "salaryDate", label: "Salary Date", type: "text", placeholder: "e.g. 25th of every month" },
  { key: "preferredVehicle", label: "Preferred Vehicle", type: "text", placeholder: "e.g. Toyota Hilux" },
  { key: "physicalAddress", label: "Physical Address", type: "text", placeholder: "e.g. 12 Main Rd, Cape Town" },
  { key: "notes", label: "Additional Notes", type: "text", placeholder: "Any additional info" },
];

function formatFieldValue(value: string | null | undefined): string {
  return value || "";
}

function IconEdit({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconClose({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCheck({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconSpinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

// ── Inline edit for a single field ───────────────────────────────────────────

function InlineEdit({
  applicationId,
  fieldConfig,
  currentValue,
  onSaved,
}: {
  applicationId: string;
  fieldConfig: FieldConfig;
  currentValue: string;
  onSaved: (newValue: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(currentValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/edit-application/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [fieldConfig.key]: value }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      onSaved(value);
      setEditing(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="group flex items-center gap-1.5 text-left"
        title={`Edit ${fieldConfig.label}`}
      >
        <span className="text-[13px] font-semibold text-[#1b2345] group-hover:text-[#2f67de] transition-colors">
          {currentValue || "Not provided"}
        </span>
        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[#2f67de]">
          <IconEdit />
        </span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      {fieldConfig.type === "select" ? (
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 rounded-lg border border-[#2f67de] bg-white px-2.5 py-1.5 text-[13px] font-semibold text-[#1b2345] outline-none focus:ring-2 focus:ring-[#2f67de]/20"
          autoFocus
        >
          {fieldConfig.options?.map((opt) => (
            <option key={opt} value={opt}>{opt.replaceAll("_", " ")}</option>
          ))}
        </select>
      ) : (
        <input
          type={fieldConfig.type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={fieldConfig.placeholder}
          className="flex-1 rounded-lg border border-[#2f67de] bg-white px-2.5 py-1.5 text-[13px] font-semibold text-[#1b2345] outline-none focus:ring-2 focus:ring-[#2f67de]/20"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") { setEditing(false); setValue(currentValue); }
          }}
        />
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-60"
      >
        {saving ? <IconSpinner className="h-3.5 w-3.5" /> : <IconCheck className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={() => { setEditing(false); setValue(currentValue); }}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#e1e4ee] bg-white text-[#68708a] hover:bg-[#f4f6fb]"
      >
        <IconClose className="h-3.5 w-3.5" />
      </button>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function AdminEditApplicationForm({ application }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of FIELDS) {
      v[f.key] = formatFieldValue(application[f.key] as string | null);
    }
    return v;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleInlineSave(key: string, newValue: string) {
    setValues((prev) => ({ ...prev, [key]: newValue }));
  }

  async function handleModalSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/admin/edit-application/${application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setSuccess(false);
        window.location.reload();
      }, 1000);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* ── Edit All button (goes in section header) ── */}
      <button
        onClick={() => setModalOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur transition hover:bg-white/20"
      >
        <IconEdit className="h-3 w-3" />
        Edit Details
      </button>

      {/* ── Inline edit fields (rendered separately per field) ── */}
      <div style={{ display: "none" }} id="inline-edit-fields">
        {FIELDS.map((f) => (
          <InlineEdit
            key={f.key}
            applicationId={application.id}
            fieldConfig={f}
            currentValue={values[f.key]}
            onSaved={(v) => handleInlineSave(f.key, v)}
          />
        ))}
      </div>

      {/* ── Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />

          {/* Modal card */}
          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[28px] border border-[#e1e4ee] bg-white shadow-[0_40px_100px_-20px_rgba(15,23,42,0.35)]">
            {/* Header */}
            <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">
                    Admin · Edit Application
                  </p>
                  <h2 className="text-[1.05rem] font-semibold text-white">
                    Edit Applicant Details
                  </h2>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition"
                >
                  <IconClose />
                </button>
              </div>
            </div>

            {/* Form */}
            <div className="max-h-[70vh] overflow-y-auto p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div key={f.key} className={f.key === "notes" || f.key === "physicalAddress" ? "sm:col-span-2" : ""}>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#68708a]">
                      {f.label}
                    </label>
                    {f.type === "select" ? (
                      <select
                        value={values[f.key]}
                        onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        className="w-full rounded-[14px] border border-[#dde1ee] bg-white px-4 py-3 text-[13px] font-medium text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                      >
                        {f.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt.replaceAll("_", " ")}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type}
                        value={values[f.key]}
                        onChange={(e) => setValues((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full rounded-[14px] border border-[#dde1ee] bg-white px-4 py-3 text-[13px] font-medium text-[#1b2345] outline-none transition focus:border-[#2f67de] focus:ring-4 focus:ring-[#2f67de]/10"
                      />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <div className="mt-4 rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-4 flex items-center gap-2 rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-700">
                  <IconCheck />
                  Details updated successfully — refreshing…
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#eef0f7] bg-[#fafbff] px-6 py-4">
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-[#dde1ee] bg-white px-5 py-2.5 text-[13px] font-semibold text-[#1b2345] transition hover:bg-[#f4f6fb]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleModalSave}
                  disabled={saving || success}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_8px_20px_-6px_rgba(47,103,222,0.4)] transition hover:from-[#2559c6] hover:to-[#3568d6] disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <IconSpinner className="h-3.5 w-3.5" />
                      Saving…
                    </>
                  ) : success ? (
                    <>
                      <IconCheck className="h-3.5 w-3.5" />
                      Saved!
                    </>
                  ) : (
                    "Save All Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
