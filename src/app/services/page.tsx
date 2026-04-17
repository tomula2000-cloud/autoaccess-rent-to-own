import Link from "next/link";
const services = [
  {
    icon: "📋",
    title: "Vehicle Licensing",
    description: "Annual vehicle licensing is handled entirely by Auto Access and included in your rental agreement. You will never face unexpected licensing costs or renewal complications. We manage the paperwork, the fees and the compliance — you simply drive.",
    badge: "Included",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    icon: "🛡️",
    title: "Insurance Cover Waiver",
    description: "Third-party insurance cover waiver is included in your monthly agreement from day one. You are protected on the road without needing to arrange separate insurance. Drive with confidence knowing your cover is active before your vehicle even leaves our premises.",
    badge: "Included",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    icon: "📡",
    title: "Vehicle Tracking",
    description: "A certified GPS tracker is professionally installed and activated on your vehicle before delivery. Your vehicle is monitored at all times — providing security, peace of mind and compliance with our insurance requirements throughout your contract term.",
    badge: "Included",
    badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  {
    icon: "🔧",
    title: "Maintenance Support",
    description: "All routine servicing and maintenance is conducted at a nominated approved dealership in your home province — selected by Auto Access. You will never need to travel to the Western Cape for any vehicle-related matter. A maintenance budgeting plan is also available to help you manage routine service costs responsibly.",
    badge: "Provincial Support",
    badgeColor: "bg-[#eef4ff] text-[#2f67de] border-[#dbe6ff]",
  },
  {
    icon: "🔄",
    title: "Flexible Upgrade or Downgrade",
    description: "Life changes — and your vehicle agreement can change with it. At any point during your contract term you can upgrade to a higher-value vehicle or downgrade to a more affordable option. Our team will guide you through the process with full transparency on any adjustments.",
    badge: "Flexible",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    icon: "🚪",
    title: "No Fixed Contract Lock-in",
    description: "You are never trapped. If your circumstances change and you need to exit the agreement, you have that freedom. Our team will walk you through the exit process clearly and transparently. No hidden penalties designed to keep you locked in.",
    badge: "Flexible",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
  },
];

export default function ServicesPage() {
  return (
    <>
    {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-24 text-white">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#2f67de]/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#d59758]/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f4c89a] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d59758]" />
            Auto Access · Our Services
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Everything included.<br />
            <span className="text-[#d59758]">No surprises.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-8 text-white/70">
            Your monthly rent-to-own payment covers far more than just the vehicle. Here is exactly what is included in your Auto Access agreement.
          </p>
        </div>
      </section>

      {/* ── NATIONWIDE BANNER ── */}
      <section className="border-b border-[#e1e4ee] bg-gradient-to-r from-emerald-50 to-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 text-center">
          <span className="text-emerald-600 text-xl">🚚</span>
          <p className="text-[14px] font-semibold text-[#1b2345]">Free nationwide delivery to all 9 provinces · Licensing and registration handled in your home province</p>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="bg-[#f4f6fb] px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${service.badgeColor}`}>{service.badge}</span>
                  </div>
                  <h3 className="mt-2 text-[1rem] font-semibold text-white">{service.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-[13px] leading-7 text-[#4d546a]">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHEAPER ── */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[28px] border border-[#dbe6ff] bg-gradient-to-br from-[#eef4ff] to-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <div className="border-b border-[#dbe6ff] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Our Competitive Advantage</p>
              <h2 className="text-[1.2rem] font-semibold text-white">Why our prices are more competitive than most</h2>
            </div>
            <div className="grid gap-8 p-6 md:grid-cols-2">
              <div>
                <p className="text-[15px] leading-8 text-[#4d546a]">
                  Auto Access specialises exclusively in bank repossessed vehicles. When a financial institution repossesses a vehicle, an established outstanding balance from the previous owner's agreement already exists with the bank.
                </p>
                <p className="mt-4 text-[15px] leading-8 text-[#4d546a]">
                  We structure your rent-to-own agreement from that existing balance — meaning you benefit from significantly lower entry costs and more competitive monthly payments compared to programmes priced from retail value. The previous owner's equity in the vehicle works directly in your favour from day one.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Standard rent-to-own", value: "Priced from retail vehicle value", color: "border-red-200 bg-red-50 text-red-700" },
                  { label: "Auto Access", value: "Priced from existing bank balance — lower costs", color: "border-emerald-200 bg-emerald-50 text-emerald-700" },
                ].map((item) => (
                  <div key={item.label} className={`rounded-[16px] border p-4 ${item.color}`}>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] opacity-70">{item.label}</p>
                    <p className="mt-1.5 text-[13px] font-semibold">{item.value}</p>
                  </div>
                ))}
                <div className="rounded-[16px] border border-[#dbe6ff] bg-[#eef4ff] p-4">
                  <p className="text-[12px] leading-6 text-[#39425d]">This model also benefits the previous owner by resolving their outstanding financial obligation with the bank — a win for all parties involved.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">All of this is included in your agreement.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-8 text-white/70">No hidden extras. No surprise fees. Just a clear, all-inclusive monthly payment and a real path to owning your vehicle.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/apply" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-8 py-4 text-sm font-bold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)]">
              Apply Now
            </Link>
            <Link href="/faq" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white">
              Read Our FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}