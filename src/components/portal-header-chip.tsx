"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type PortalUser = {
  loggedIn: boolean;
  fullName?: string;
  referenceNumber?: string;
  status?: string;
};

function getFirstName(fullName: string) {
  return fullName.split(" ")[0];
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default function PortalHeaderChip() {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => r.json())
      .then((data) => setUser(data))
      .catch(() => setUser({ loggedIn: false }));
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await fetch("/api/portal-logout", { method: "POST" });
    setUser({ loggedIn: false });
    setOpen(false);
    window.location.href = "/";
  }

  if (!user) return null;

  if (!user.loggedIn) {
    return (
      <Link
        href="/portal-login"
        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-white/20"
      >
        Portal Login
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-2 text-[12px] font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
          {user.fullName?.[0] ?? "?"}
        </span>
        {getFirstName(user.fullName ?? "")}
        <svg className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-b from-[#0d1a3d] to-[#0b1532] shadow-[0_16px_40px_rgba(11,21,50,0.5)]">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4c89a]">Logged In</p>
            <p className="mt-0.5 text-[13px] font-semibold text-white">{user.fullName}</p>
            <p className="mt-0.5 font-mono text-[10px] text-white/50">{user.referenceNumber}</p>
            {user.status ? (
              <span className="mt-1.5 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">
                {formatStatus(user.status)}
              </span>
            ) : null}
          </div>
          <div className="p-2">
            <Link
              href="/portal"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[13px] font-medium text-blue-50/80 transition hover:bg-white/5 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              My Portal Dashboard
            </Link>
            <Link
              href="/portal/documents"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[13px] font-medium text-blue-50/80 transition hover:bg-white/5 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              My Documents
            </Link>
            <div className="my-1.5 h-px bg-white/10" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-[12px] px-3 py-2.5 text-[13px] font-medium text-red-400/80 transition hover:bg-red-500/10 hover:text-red-300"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
