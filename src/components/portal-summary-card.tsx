type PortalSummaryCardProps = {
  label: string;
  value: string;
  shellClass?: string;
  labelClass?: string;
};

export default function PortalSummaryCard({
  label,
  value,
  shellClass = "border-blue-200 bg-gradient-to-br from-blue-50 via-white to-sky-100",
  labelClass = "text-blue-700",
}: PortalSummaryCardProps) {
  return (
    <div
      className={`rounded-[24px] border p-5 shadow-[0_12px_35px_rgba(15,23,42,0.08)] sm:rounded-[26px] sm:p-6 md:rounded-[28px] ${shellClass}`}
    >
      <p className={`text-[11px] font-bold uppercase tracking-[0.22em] ${labelClass} sm:text-xs sm:tracking-[0.24em]`}>
        {label}
      </p>

      <p className="mt-3 break-words text-xl font-bold tracking-tight text-gray-900 sm:text-2xl md:text-3xl">
        {value}
      </p>
    </div>
  );
}