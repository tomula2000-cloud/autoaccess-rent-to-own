"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import NavDropdown from "@/components/nav-dropdown";

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

export function DesktopNav() {
  const [user, setUser] = useState<PortalUser | null>(null);

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => r.json())
      .then(setUser)
      .catch(() => setUser({ loggedIn: false }));
  }, []);

  return (
    <nav className="hidden items-center gap-6 md:flex">
      <Link href="/" className="text-[13px] font-medium text-blue-50/60 transition hover:text-white">Home</Link>
      <Link href="/gallery" className="text-[13px] font-medium text-blue-50/60 transition hover:text-white">Showroom</Link>
      <NavDropdown />
      {!user?.loggedIn ? (
        <Link href="/apply" className="text-[13px] font-medium text-blue-50/60 transition hover:text-white">Apply</Link>
      ) : null}
      <Link href={user?.loggedIn ? "/portal" : "/portal-login"} className="text-[13px] font-medium text-blue-50/60 transition hover:text-white">
        Client Portal
      </Link>
    </nav>
  );
}

export function MobileMenu({ whatsappLink, phoneLink }: { whatsappLink: string; phoneLink: string }) {
  const [user, setUser] = useState<PortalUser | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch("/api/portal/me")
      .then((r) => r.json())
      .then(setUser)
      .catch(() => setUser({ loggedIn: false }));
  }, []);

  async function handleLogout() {
    await fetch("/api/portal-logout", { method: "POST" });
    setUser({ loggedIn: false });
    setOpen(false);
    window.location.href = "/";
  }

  return (
    <div className="relative ml-auto md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>
        </svg>
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-b from-[#0d1a3d] to-[#0b1532] p-3 shadow-[0_16px_40px_rgba(11,21,50,0.5)]">

          {user?.loggedIn ? (
            <div className="mb-2 rounded-[14px] border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4c89a]">Logged In As</p>
              <p className="mt-1 text-[14px] font-semibold text-white">{user.fullName}</p>
              <p className="font-mono text-[10px] text-white/50">{user.referenceNumber}</p>
              {user.status ? (
                <span className="mt-1.5 inline-flex rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white/70">
                  {formatStatus(user.status)}
                </span>
              ) : null}
            </div>
          ) : null}

          <nav className="grid gap-1">
            <Link href="/" onClick={() => setOpen(false)} className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">Home</Link>
            <Link href="/gallery" onClick={() => setOpen(false)} className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">Showroom</Link>
            <div className="rounded-[12px] border border-white/10 bg-white/5 px-3 py-2">
              <p className="mb-1 px-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">About</p>
              <Link href="/about" onClick={() => setOpen(false)} className="block rounded-[10px] px-3 py-2 text-[13px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">About Us</Link>
              <Link href="/how-it-works" onClick={() => setOpen(false)} className="block rounded-[10px] px-3 py-2 text-[13px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">How It Works</Link>
              <Link href="/services" onClick={() => setOpen(false)} className="block rounded-[10px] px-3 py-2 text-[13px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">Our Services</Link>
              <Link href="/faq" onClick={() => setOpen(false)} className="block rounded-[10px] px-3 py-2 text-[13px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">FAQ</Link>
            </div>
            {!user?.loggedIn ? (
              <Link href="/apply" onClick={() => setOpen(false)} className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">Apply Now</Link>
            ) : null}
            {user?.loggedIn ? (
              <>
                <Link href="/portal" onClick={() => setOpen(false)} className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-emerald-400 transition hover:bg-white/5 hover:text-emerald-300">My Portal</Link>
                <Link href="/portal/documents" onClick={() => setOpen(false)} className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">My Documents</Link>
              </>
            ) : (
              <Link href="/portal-login" onClick={() => setOpen(false)} className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">Client Portal</Link>
            )}
          </nav>

          <div className="my-3 h-px bg-white/10" />
          <a href={phoneLink} className="call-btn mb-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-white">Call Us</a>
          <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[12px] font-semibold text-emerald-400">WhatsApp Us</a>

          {user?.loggedIn ? (
            <>
              <div className="my-3 h-px bg-white/10" />
              <button
                onClick={handleLogout}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-3 text-[12px] font-semibold text-red-300"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Log Out
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
