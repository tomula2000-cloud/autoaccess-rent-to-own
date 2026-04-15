import type { ReactNode } from "react";

type PortalMobileSectionCardProps = {
  eyebrow: string;
  title: string;
  badge?: string;
  id?: string;
  children: ReactNode;
};

export default function PortalMobileSectionCard({
  eyebrow,
  title,
  badge,
  id,
  children,
}: PortalMobileSectionCardProps) {
  return (
    <section id={id} className="mt-4 overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white shadow-[0_24px_60px_-20px_rgba(15,23,42,0.18)]">
      <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-4 py-3.5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f4c89a]">
              {eyebrow}
            </p>
            <h2 className="text-[1rem] font-semibold text-white">{title}</h2>
          </div>
          {badge ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
              {badge}
            </span>
          ) : null}
        </div>
      </div>
      <div className="p-3.5">{children}</div>
    </section>
  );
}
