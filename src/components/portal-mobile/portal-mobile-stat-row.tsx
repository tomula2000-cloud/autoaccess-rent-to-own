type StatItem = {
  label: string;
  value: string;
  tone?: "default" | "blue" | "green";
};

type PortalMobileStatRowProps = {
  items: StatItem[];
};

function getToneClasses(tone: StatItem["tone"]) {
  switch (tone) {
    case "blue":
      return "border-[#dbe6ff] bg-[#eef4ff] text-[#2f67de]";
    case "green":
      return "border-emerald-200 bg-emerald-50/70 text-emerald-700";
    default:
      return "border-[#e1e4ee] bg-white text-[#68708a]";
  }
}

export default function PortalMobileStatRow({
  items,
}: PortalMobileStatRowProps) {
  const gridClass =
    items.length === 3
      ? "grid-cols-3"
      : items.length === 2
      ? "grid-cols-2"
      : "grid-cols-1";

  return (
    <section className={`mt-4 grid gap-2.5 ${gridClass}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className={`rounded-[18px] border p-3.5 shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)] ${getToneClasses(
            item.tone
          )}`}
        >
          <p className="text-[8.5px] font-bold uppercase tracking-[0.16em]">
            {item.label}
          </p>
          <p className="mt-1.5 text-[1.02rem] font-semibold leading-5 text-[#1b2345]">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}