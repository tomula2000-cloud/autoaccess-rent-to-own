"use client";

import { useState, useEffect } from "react";

const WHATSAPP_LINK = "https://wa.me/27870126734?text=Hi%20Auto%20Access%2C%20I%20have%20a%20question%20about%20my%20application.";

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissed) setVisible(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <div
      className={`fixed bottom-6 right-4 z-[9999] flex flex-col items-end gap-2 transition-all duration-500 ${
        visible ? "translate-x-0 opacity-100" : "translate-x-[120%] opacity-0"
      }`}
    >
      {visible ? (
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1.5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.15)]">
          <span className="text-[11px] font-semibold text-[#39425d]">Questions? Contact Support</span>
          <button
            onClick={() => { setVisible(false); setTimeout(() => setDismissed(true), 500); }}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e8ecf5] text-[#68708a]"
            aria-label="Dismiss"
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      ) : null}

      
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noreferrer"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25d366] to-[#128c7e] shadow-[0_8px_24px_-6px_rgba(37,211,102,0.5)] transition hover:scale-105"
        aria-label="WhatsApp Support"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.123 1.533 5.854L.057 23.571a.75.75 0 00.921.921l5.764-1.498A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.722 9.722 0 01-4.964-1.357l-.356-.211-3.684.957.983-3.596-.232-.371A9.722 9.722 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
        </svg>
      </a>
    </div>
  );
}
