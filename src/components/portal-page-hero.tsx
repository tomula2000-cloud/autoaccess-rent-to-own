type PortalPageHeroAction = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type PortalPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: PortalPageHeroAction[];
};

export default function PortalPageHero({
  eyebrow,
  title,
  description,
}: PortalPageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[26px] border border-white bg-white/85 p-5 shadow-[0_18px_55px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:rounded-[30px] sm:p-6 md:rounded-[34px] md:p-9">
      <div className="absolute inset-0">
        <div className="absolute left-[5%] top-[10%] h-[160px] w-[160px] rounded-full bg-blue-100/70 blur-3xl sm:h-[200px] sm:w-[200px] md:h-[220px] md:w-[220px]" />
        <div className="absolute right-[6%] top-[2%] h-[160px] w-[160px] rounded-full bg-orange-100/70 blur-3xl sm:h-[200px] sm:w-[200px] md:h-[220px] md:w-[220px]" />
      </div>

      <div className="relative">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-500 sm:text-xs sm:tracking-[0.32em]">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[#1c2340] sm:mt-4 sm:text-3xl md:text-4xl">
            {title}
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8 md:text-lg">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}