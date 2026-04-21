"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface PopFile {
  url: string;
  filename: string;
  uploadedAt: string;
}

interface ProofOfPaymentUploadProps {
  initialFiles: PopFile[];
  paymentCompletedAt: Date | string | null;
}

export default function ProofOfPaymentUpload({
  initialFiles,
  paymentCompletedAt,
}: ProofOfPaymentUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<PopFile[]>(initialFiles);
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isLocked = !!paymentCompletedAt;
  const hasFiles = files.length > 0;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected || selected.length === 0) return;

    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < selected.length; i++) {
        formData.append("files", selected[i]);
      }

      const res = await fetch("/api/portal/upload-proof-of-payment", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFiles(data.files || []);
      setSuccess(`${selected.length} file(s) uploaded successfully`);
      if (fileInputRef.current) fileInputRef.current.value = "";
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (url: string) => {
    if (isLocked) return;
    if (!confirm("Remove this file?")) return;

    setError(null);
    try {
      const res = await fetch("/api/portal/upload-proof-of-payment", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) throw new Error("Delete failed");
      setFiles(files.filter((f) => f.url !== url));
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Delete failed");
    }
  };

  const handleConfirmPayment = async () => {
    if (!hasFiles) {
      setError("Please upload at least one proof of payment file first.");
      return;
    }
    if (!confirm("Confirm you have completed payment? This will submit your proof of payment for verification.")) return;

    setError(null);
    setConfirming(true);

    try {
      const res = await fetch("/api/portal/confirm-payment", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Confirmation failed");

      setSuccess("Payment confirmed! Our team will verify your payment shortly.");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Confirmation failed");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Upload section */}
      <div className="rounded-[14px] border border-[#c9973a]/30 bg-[#fff8ee] p-4">
        <div className="mb-2 flex items-center gap-2">
          <svg className="h-4 w-4 text-[#c9973a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c9973a]">Proof of Payment</p>
        </div>
        <p className="mb-3 text-[12px] leading-5 text-[#5a6480]">
          Upload your proof of payment. You can upload multiple files (PDFs and screenshots accepted, max 10MB each).
        </p>

        {!isLocked && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
              multiple
              onChange={handleUpload}
              disabled={uploading}
              className="hidden"
              id="pop-upload-input"
            />
            <label
              htmlFor="pop-upload-input"
              className={`inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border-2 border-dashed border-[#c9973a]/50 bg-white px-4 py-3.5 text-[13px] font-bold text-[#c9973a] transition hover:bg-[#fff0d0] ${uploading ? "pointer-events-none opacity-60" : ""}`}
            >
              {uploading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {hasFiles ? "Upload Additional Files" : "Select Files to Upload"}
                </>
              )}
            </label>
          </>
        )}

        {/* File list */}
        {hasFiles && (
          <div className="mt-3 space-y-2">
            {files.map((file, idx) => (
              <div
                key={file.url}
                className="flex items-center justify-between gap-3 rounded-[10px] border border-[#e8ecf5] bg-white px-3 py-2.5"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f8f6f0]">
                    <svg className="h-4 w-4 text-[#c9973a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-[#1b2345]">{file.filename}</p>
                    <p className="text-[10px] text-[#8a9bbf]">
                      Uploaded {new Date(file.uploadedAt).toLocaleDateString("en-ZA", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full p-2 text-[#8a9bbf] transition hover:bg-[#f8f6f0] hover:text-[#c9973a]"
                    title="View"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </a>
                  {!isLocked && (
                    <button
                      onClick={() => handleDelete(file.url)}
                      className="rounded-full p-2 text-[#8a9bbf] transition hover:bg-red-50 hover:text-red-600"
                      title="Remove"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</div>
      )}

      {/* Payment confirmation */}
      <div className={`rounded-[14px] p-3.5 ${isLocked ? "border border-emerald-300 bg-emerald-50" : "border border-emerald-200 bg-emerald-50/70"}`}>
        {isLocked ? (
          <>
            <div className="mb-2 flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Payment Submitted</p>
            </div>
            <p className="text-[12px] leading-5 text-[#39425d]">
              Your payment confirmation and proof of payment have been submitted. Our team is verifying your payment now — you will receive a confirmation email once verified.
            </p>
          </>
        ) : (
          <>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Payment Confirmation</p>
            <p className="mt-1 text-[12px] leading-5 text-[#39425d]">
              {hasFiles
                ? "Once you click the button below, your proof of payment will be submitted for verification."
                : "Upload at least one proof of payment document above, then confirm your payment here."}
            </p>
            <button
              onClick={handleConfirmPayment}
              disabled={!hasFiles || confirming}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-700 px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.4)] transition disabled:opacity-40"
            >
              {confirming ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0110 10" />
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  I Have Completed Payment
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
