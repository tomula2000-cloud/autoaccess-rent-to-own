import WhatsAppFloat from "@/components/whatsapp-float";
import PortalHeaderChip from "@/components/portal-header-chip";
import { DesktopNav, MobileMenu } from "@/components/portal-nav-aware";
import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

const PHONE_LINK = "tel:0870126734";
const WHATSAPP_LINK = "https://wa.me/27610490061";

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
          <DesktopNav />
          <div className="hidden items-center gap-2.5 md:flex">
            <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[12px] font-semibold text-emerald-400">WhatsApp</a>
            <a href={PHONE_LINK} className="call-btn rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-4 py-2 text-[12px] font-bold uppercase tracking-[0.12em] text-white">Call Us</a>
            <PortalHeaderChip />
          </div>
          <MobileMenu whatsappLink={WHATSAPP_LINK} phoneLink={PHONE_LINK} />
        </div>
      </header>

      {children}
      <WhatsAppFloat />
    </div>
  );
}
