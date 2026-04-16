"use client";

import { useState } from "react";

type Document = {
  id: string;
  fileName: string;
  fileUrl: string;
  documentType: string;
  createdAt: Date | string;
};

function formatDocType(type: string) {
  return type.replaceAll("_", " ");
}

function isImage(fileName: string) {
  return /\.(jpg|jpeg|png|gif|webp|heic)$/i.test(fileName);
}

function isPDF(fileName: string) {
  return /\.pdf$/i.test(fileName);
}

export default function AdminDocumentViewer({ documents }: { documents: Document[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  async function handlePreview(doc: Document) {
    if (previewId === doc.id) {
      setPreviewId(null);
      setPreviewUrl(null);
      return;
    }
    setLoadingId(doc.id);
    setErrorId(null);
    try {
      const proxyUrl = `/api/admin/documents?url=${encodeURIComponent(doc.fileUrl)}`;
      setPreviewUrl(proxyUrl);
      setPreviewId(doc.id);
    } catch {
      setErrorId(doc.id);
    } finally {
      setLoadingId(null);
    }
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-[18px] border-2 border-dashed border-[#e1e4ee] bg-[#fafbff] p-8 text-center">
        <p className="text-sm font-semibold text-[#1b2345]">No documents uploaded yet</p>
        <p className="mt-1 text-xs text-[#68708a]">Documents will appear here once the client uploads them.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((doc, index) => (
        <div key={doc.id} className="overflow-hidden rounded-[16px] border border-[#e8ecf5] bg-[#fbfcff]">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[10px] font-bold text-white">
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#1b2345]">{doc.fileName}</p>
                <p className="text-[11px] text-[#68708a]">
                  {formatDocType(doc.documentType)} · {new Date(doc.createdAt).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={() => handlePreview(doc)}
                disabled={loadingId === doc.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[11px] font-bold transition disabled:opacity-50 ${
                  previewId === doc.id
                    ? "bg-[#1b2345] text-white"
                    : "bg-gradient-to-r from-[#2f67de] to-[#3f78ea] text-white shadow-[0_6px_16px_-4px_rgba(47,103,222,0.4)] hover:from-[#2559c6] hover:to-[#3568d6]"
                }`}
              >
                {loadingId === doc.id ? (
                  <>
                    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                    Loading...
                  </>
                ) : previewId === doc.id ? (
                  <>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Close
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Preview
                  </>
                )}
              </button>
              {previewId === doc.id && previewUrl ? (
                
                  <a
                  href={previewUrl}
                  download={doc.fileName}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#e1e4ee] bg-white px-4 py-2 text-[11px] font-bold text-[#68708a] transition hover:border-[#dbe6ff] hover:text-[#2f67de]"
                >
                  <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download
                </a>
              ) : null}
            </div>
          </div>

          {errorId === doc.id ? (
            <div className="border-t border-[#eef0f7] bg-red-50 px-4 py-3">
              <p className="text-[12px] text-red-600">Failed to load preview. Please try again.</p>
            </div>
          ) : null}

          {previewId === doc.id && previewUrl ? (
            <div className="border-t border-[#eef0f7] bg-[#f4f6fb] p-3">
              {isImage(doc.fileName) ? (
                <img
                  src={previewUrl}
                  alt={doc.fileName}
                  className="mx-auto max-h-[500px] rounded-[12px] object-contain shadow-sm"
                />
              ) : isPDF(doc.fileName) ? (
                <iframe
                  src={previewUrl}
                  className="h-[600px] w-full rounded-[12px] border border-[#e1e4ee] bg-white"
                  title={doc.fileName}
                />
              ) : (
                <div className="rounded-[12px] border border-[#e1e4ee] bg-white p-6 text-center">
                  <p className="text-[13px] font-semibold text-[#1b2345]">Preview not available for this file type</p>
                  <p className="mt-1 text-[12px] text-[#68708a]">Please use the Download button to view this file.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
