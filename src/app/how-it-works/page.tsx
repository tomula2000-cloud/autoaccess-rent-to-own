import Link from "next/link";
const steps = [
  {
    number: "01",
    title: "Check If You Qualify",
    description: "To qualify you need to be employed with a minimum net take-home salary of R7,000 per month. Joint applications with a spouse are considered. You will also need a valid South African ID or passport and a valid driver's licence.",
    detail: "Bad credit, debt review or previously blacklisted? You can still qualify. We do not run credit bureau checks.",
    color: "from-[#2f67de] to-[#3f78ea]",
    light: "bg-[#eef4ff] text-[#2f67de]",
  },
  {
    number: "02",
    title: "Submit Your Application",
    description: "Complete our short online application form in minutes — no branches, no queues, no paperwork. Once submitted your secure client portal is created instantly and your reference number is issued.",
    detail: "South Africa's first rent-to-own client portal gives you real-time control of your entire application journey.",
    color: "from-[#d59758] to-[#e4ad72]",
    light: "bg-amber-50 text-amber-700",
  },
  {
    number: "03",
    title: "Upload Your Documents",
    description: "Log into your secure portal and upload your supporting documents. Required documents: Valid SA ID or passport, valid driver's licence, 3 months bank statements and proof of residence not older than 3 months.",
    detail: "Documents can be uploaded directly through the portal, sent to docs@autoaccess.co.za or submitted via WhatsApp to +27 61 049 0061.",
    color: "from-emerald-600 to-emerald-700",
    light: "bg-emerald-50 text-emerald-700",
  },
  {
    number: "04",
    title: "Get Approved",
    description: "Our team reviews your application and matches you with qualifying vehicles within your approved budget. You will receive a notification through your portal within 24 to 48 hours of submitting all required documents.",
    detail: "Once approved your portal unlocks the vehicle selection stage and your approval validity window begins.",
    color: "from-purple-600 to-purple-700",
    light: "bg-purple-50 text-purple-700",
  },
  {
    number: "05",
    title: "Select Your Vehicle",
    description: "Browse our available fleet directly through your client portal. Every listing shows the full financial breakdown — deposit, monthly payment and all inclusive benefits — before you confirm your selection.",
    detail: "All vehicles are bank repossessed, meaning your costs are structured from the previous owner's existing bank balance — giving you significantly lower entry costs.",
    color: "from-[#1b2345] to-[#2a3563]",
    light: "bg-[#eef4ff] text-[#1b2345]",
  },
  {
    number: "06",
    title: "Sign, Pay and Drive",
    description: "Review and digitally sign your vehicle rental agreement through your portal. Complete your initial payment — deposit plus first month and licensing fee. Your vehicle is then prepared for delivery.",
    detail: "Prefer to sign in person? Approved clients are welcome to visit our Western Cape offices. Delivery takes 3 to 5 working days after payment confirmation.",
    color: "from-[#d59758] to-[#e4ad72]",
    light: "bg-amber-50 text-amber-700",
  },
];

export default function HowItWorksPage() {
  return (
    <>
    {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-24 text-white">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#2f67de]/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#d59758]/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f4c89a] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d59758]" />
            Simple · Transparent · Fast
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            From application to delivery<br />
            <span className="text-[#d59758]">in 6 simple steps.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-8 text-white/70">
            Our entire process is designed to be clear, fast and completely manageable from your phone or computer — wherever you are in South Africa.
          </p>
        </div>
      </section>

      {/* ── NATIONWIDE BANNER ── */}
      <section className="border-b border-[#e1e4ee] bg-gradient-to-r from-emerald-50 to-white px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 text-center">
          <span className="text-emerald-600 text-xl">🚚</span>
          <p className="text-[14px] font-semibold text-[#1b2345]">Free nationwide delivery to all 9 provinces · 3 to 5 working days after payment confirmation</p>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="bg-[#f4f6fb] px-5 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={step.number} className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <div className={`border-b border-[#eef0f7] bg-gradient-to-r ${step.color} px-6 py-5`}>
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold text-white/20">{step.number}</span>
                    <h2 className="text-[1.15rem] font-bold text-white">{step.title}</h2>
                  </div>
                </div>
                <div className="grid gap-4 p-6 md:grid-cols-2">
                  <p className="text-[14px] leading-7 text-[#4d546a]">{step.description}</p>
                  <div className={`rounded-[16px] ${step.light} p-4`}>
                    <p className="text-[12px] font-bold uppercase tracking-[0.14em] opacity-70">Good to know</p>
                    <p className="mt-2 text-[13px] leading-6">{step.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DELIVERY DETAIL ── */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d59758]">Nationwide Coverage</p>
            <h2 className="mt-3 text-3xl font-bold text-[#1b2345]">How delivery works across provinces</h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-[#fafbff]">
              <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Delivery Process</p>
                <h3 className="text-[1rem] font-semibold text-white">What happens after payment</h3>
              </div>
              <div className="space-y-3 p-5">
                {[
                  "Your vehicle is loaded onto an approved professional transporter",
                  "Shipped to your home province at no cost to you",
                  "Licensed and registered in your province with matching number plates",
                  "Insurance activated and tracker installed before handover",
                  "Final inspection completed before vehicle is handed over to you",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2f67de] to-[#3f78ea] text-[10px] font-bold text-white">{i + 1}</div>
                    <p className="text-[13px] leading-6 text-[#4d546a]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[24px] border border-amber-200 bg-amber-50">
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">Number Plate Compliance</p>
                  <p className="mt-2 text-[13px] leading-6 text-[#39425d]">South African insurance regulations require that your vehicle is registered and licensed in the province where you are based. A Gauteng client receives GP plates, a KwaZulu-Natal client receives KZN plates and so on. This is handled by our team before handover.</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-[#dbe6ff] bg-[#eef4ff]">
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#2f67de]">Collection Not Available</p>
                  <p className="mt-2 text-[13px] leading-6 text-[#39425d]">Clients outside the Western Cape are not able to collect their vehicle from our premises. Provincial registration must be completed in your home province before handover can take place. This protects you and ensures full insurance compliance.</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-[24px] border border-emerald-200 bg-emerald-50">
                <div className="px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Ongoing Servicing</p>
                  <p className="mt-2 text-[13px] leading-6 text-[#39425d]">All routine servicing and maintenance is handled at a nominated dealership in your province — selected by Auto Access. You will never need to travel to the Western Cape for any vehicle-related matter.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Ready to start your journey?</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-8 text-white/70">Apply online in minutes. Your secure portal is created instantly and your team is ready to guide you through every step.</p>
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