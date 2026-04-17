"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function NavDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-blue-50/60 transition hover:text-white"
      >
        About Us
        <svg className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open ? (
        <div className="absolute left-0 top-10 z-50 w-56 overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-b from-[#0d1a3d] to-[#0b1532] p-2 shadow-[0_16px_40px_rgba(11,21,50,0.5)]">
          {[
            { href: "/about", label: "About Us", icon: "◆" },
            { href: "/how-it-works", label: "How It Works", icon: "◆" },
            { href: "/services", label: "Our Services", icon: "◆" },
            { href: "/faq", label: "FAQ", icon: "◆" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-[12px] px-4 py-2.5 text-[13px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white"
            >
              <span className="text-[#d59758] text-[8px]">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
