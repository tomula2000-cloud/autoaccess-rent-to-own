import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

const PHONE_LINK = "tel:0870126734";
const WHATSAPP_LINK = "https://wa.me/27870126734";

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        *, body { font-family: 'DM Sans', sans-serif; }
        .section-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .section-reveal.visible { opacity: 1; transform: translateY(0); }
        .step-reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .step-reveal.visible { opacity: 1; transform: translateY(0); }
        @keyframes callBounceGlow {
          0%, 100% { transform: translateY(0); box-shadow: 0 8px 20px rgba(213,151,88,0.3); }
          50% { transform: translateY(-3px) scale(1.03); box-shadow: 0 0 0 5px rgba(213,151,88,0.12), 0 14px 28px rgba(213,151,88,0.4); }
        }
        .call-btn { animation: callBounceGlow 1.8s ease-in-out infinite; }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[#0b1532] to-[#060e24] shadow-[0_4px_24px_-8px_rgba(11,21,50,0.5)]">
        <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between gap-6 px-5 md:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <p className="text-[17px] font-semibold text-white">Auto<span className="text-[#d59758]">Access</span></p>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/" className="text-[13px] font-medium text-blue-50/60 transition hover:text-white">Home</Link>
            <Link href="/gallery" className="text-[13px] font-medium text-blue-50/60 transition hover:text-white">Showroom</Link>
            <Link href="/apply" className="text-[13px] font-medium text-blue-50/60 transition hover:text-white">Apply</Link>
            <Link href="/portal-login" className="text-[13px] font-medium text-blue-50/60 transition hover:text-white">Client Portal</Link>
          </nav>
          <div className="hidden items-center gap-2.5 md:flex">
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[12px] font-semibold text-emerald-400">WhatsApp</a>
            <a href={PHONE_LINK} className="call-btn rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white">Call Us</a>
            <Link href="/portal-login" className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-white/10">Portal Login</Link>
          </div>
          <details className="relative ml-auto md:hidden">
            <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>
            </summary>
            <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-b from-[#0d1a3d] to-[#0b1532] p-3 shadow-[0_16px_40px_rgba(11,21,50,0.5)]">
              <nav className="grid gap-1">
                <Link href="/" className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">Home</Link>
                <Link href="/gallery" className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">Showroom</Link>
                <Link href="/apply" className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">Apply Now</Link>
                <Link href="/portal-login" className="rounded-[12px] px-4 py-3 text-[14px] font-medium text-blue-50/70 transition hover:bg-white/5 hover:text-white">Client Portal</Link>
              </nav>
              <div className="my-3 h-px bg-white/10" />
              <a href={PHONE_LINK} className="call-btn mb-2 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-4 py-3 text-[12px] font-bold uppercase tracking-[0.12em] text-white">Call Us</a>
              <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[12px] font-semibold text-emerald-400">WhatsApp Us</a>
            </div>
          </details>
        </div>
      </header>

      {children}
    </div>
  );
}
