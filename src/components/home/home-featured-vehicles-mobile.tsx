"use client";

import { useState } from "react";
import Link from "next/link";

interface Vehicle {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  monthlyPayment: string;
  yearModel: string;
  transmission: string;
  fuelType: string;
}

function formatCurrency(value: string) {
  const num = Number(value.replace(/[^\d.-]/g, ""));
  if (!Number.isFinite(num)) return `R ${value}`;
  return `R ${num.toLocaleString("en-ZA")}`;
}

export default function HomeFeaturedVehiclesMobile({ vehicles }: { vehicles: Vehicle[] }) {
  const [current, setCurrent] = useState(0);

  if (vehicles.length === 0) return null;

  const vehicle = vehicles[current];

  return (
    <div className="relative">
      {/* Vehicle Card */}
      <div className="overflow-hidden rounded-[22px] border border-[#e1e4ee] bg-white shadow-[0_6px_18px_-8px_rgba(15,23,42,0.1)]">
        <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#2f67de] to-[#4f86f7]">
          <img
            src={vehicle.featuredImage}
            alt={vehicle.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            {vehicle.yearModel}
          </div>
        </div>
        <div className="p-5">
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
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#2f67de] to-[#3f78ea] px-5 py-2.5 text-xs font-semibold text-white shadow-[0_12px_26px_-10px_rgba(47,103,222,0.55)]"
          >
            View This Vehicle
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>
      </div>

      {/* Navigation */}
      {vehicles.length > 1 && (
        <>
          {/* Arrows */}
          <button
            onClick={() => setCurrent((current - 1 + vehicles.length) % vehicles.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur"
          >
            <svg className="h-5 w-5 text-[#1b2345]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button
            onClick={() => setCurrent((current + 1) % vehicles.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur"
          >
            <svg className="h-5 w-5 text-[#1b2345]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Dots */}
          <div className="mt-4 flex justify-center gap-2">
            {vehicles.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-[#2f67de]" : "w-2 bg-[#e1e4ee]"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
