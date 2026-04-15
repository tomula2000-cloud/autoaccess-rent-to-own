"use client";

export default function ChangeVehicleButton() {
  return (
    <button
      type="button"
      onClick={() => {
        const el = document.getElementById("vehicle-list");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#e1e4ee] bg-[#fafbff] px-5 py-3 text-[12px] font-semibold text-[#68708a] transition hover:border-[#dbe6ff] hover:text-[#2f67de]"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
      Choose a Different Vehicle
    </button>
  );
}
