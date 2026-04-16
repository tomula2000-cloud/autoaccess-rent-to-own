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

export default function AdminDocumentViewer({ documents }: { documents: Document[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  async function handleView(doc: Document) {
    setLoadingId(doc.id);
    setErrorId(null);
    try {
      const res = await fetch(`/api/admin/documents?url=${encodeURIComponent(doc.fileUrl)}`);
      const data = await res.json();
      if (data.downloadUrl) {
        window.open(data.downloadUrl, "_blank");
      } else {
        setErrorId(doc.id);
      }
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
        <div key={doc.id} className="flex items-center justify-between gap-4 rounded-[16px] border border-[#e8ecf5] bg-[#fbfcff] px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
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
            {errorId === doc.id ? (
              <p className="mt-1.5 text-[11px] text-red-600">Failed to load document. Please try again.</p>
            ) : null}
          </div>
          <button
            onClick={() => handleView(doc)}
            disabled={loadingId === doc.id}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-4 py-2 text-[11px] font-bold text-white shadow-[0_6px_16px_-4px_rgba(47,103,222,0.4)] transition hover:from-[#2559c6] hover:to-[#3568d6] disabled:opacity-50"
          >
            {loadingId === doc.id ? (
              <>
                <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                Opening...
              </>
            ) : (
              <>
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                View
              </>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
