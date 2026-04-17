import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

const gradients = [
  "from-[#2f67de] to-[#4f86f7]",
  "from-[#d59758] to-[#e4ad72]",
  "from-emerald-500 to-emerald-600",
];

const orbs = [
  "from-[#2f67de]/10",
  "from-[#d59758]/10",
  "from-emerald-400/10",
];

const hovers = [
  "hover:border-[#2f67de]/30",
  "hover:border-[#d59758]/30",
  "hover:border-emerald-300",
];

function formatCurrency(value: string) {
  const num = Number(value.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return `R ${value}`;
  return `R ${num.toLocaleString("en-ZA")}`;
}

export default async function HomeFeaturedVehicles() {
  const vehicles = await prisma.vehicleOffer.findMany({
    where: {
      status: "AVAILABLE" as never,
      NOT: { featuredImage: { contains: "unsplash" } },
    },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }],
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      featuredImage: true,
      monthlyPayment: true,
      yearModel: true,
      transmission: true,
      fuelType: true,
    },
  });

  if (vehicles.length === 0) return null;

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {vehicles.map((vehicle, index) => (
        <div
          key={vehicle.id}
          className={`group relative overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)] transition hover:-translate-y-1 ${hovers[index % 3]} hover:shadow-[0_24px_50px_-18px_rgba(47,103,222,0.25)]`}
        >
          <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${gradients[index % 3]}`}>
            <Image
              src={vehicle.featuredImage}
              alt={vehicle.title}
              fill
              className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.06]"
              sizes="384px"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              {vehicle.yearModel}
            </div>
          </div>
          <div className="relative p-5">
            <div className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${orbs[index % 3]} to-transparent blur-2xl`} />
            <div className="relative">
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full border border-[#e1e4ee] bg-[#fafbff] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#68708a]">{vehicle.transmission}</span>
                <span className="rounded-full border border-[#e1e4ee] bg-[#fafbff] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#68708a]">{vehicle.fuelType}</span>
              </div>
              <p className="mt-2 text-[1rem] font-semibold leading-tight text-[#1b2345] line-clamp-2">{vehicle.title}</p>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#68708a]">from</span>
                <span className="text-[1.5rem] font-semibold tabular-nums text-[#1b2345]">{formatCurrency(vehicle.monthlyPayment)}</span>
                <span className="text-[11px] text-[#68708a]">/ month</span>
              </div>
              <Link
                href={`/gallery/${vehicle.slug}`}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_12px_26px_-10px_rgba(47,103,222,0.55)] transition hover:from-[#2559c6] hover:to-[#3568d6]"
              >
                View This Vehicle
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
