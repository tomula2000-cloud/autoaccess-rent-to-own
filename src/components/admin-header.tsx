import Link from "next/link";

type AdminHeaderProps = {
  title: string;
  description?: string;
};

export default function AdminHeader({ title, description }: AdminHeaderProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-[28px] border border-white/10 bg-gradient-to-r from-[#0b1532] via-[#102046] to-[#1b3375] shadow-[0_24px_60px_-20px_rgba(11,21,50,0.55)]">
      <div className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#f4c89a]">
            Auto Access Admin
          </p>
          <h1 className="mt-2 text-2xl font-bold text-white md:text-3xl">{title}</h1>
          {description ? (
            <p className="mt-2 max-w-2xl text-[13px] leading-6 text-white/60">{description}</p>
          ) : null}
        </div>
        <nav className="flex flex-wrap gap-2">
          <Link href="/admin" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-semibold text-white/80 transition hover:bg-white/20">
            Dashboard
          </Link>
          <Link href="/admin/vehicles" className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12px] font-semibold text-white/80 transition hover:bg-white/20">
            Vehicles
          </Link>
          <Link href="/admin/vehicles/new" className="rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-4 py-2 text-[12px] font-bold text-white shadow-[0_8px_20px_-6px_rgba(213,151,88,0.5)] transition hover:from-[#c4863f] hover:to-[#d59758]">
            Add Vehicle
          </Link>
        </nav>
      </div>
    </div>
  );
}
