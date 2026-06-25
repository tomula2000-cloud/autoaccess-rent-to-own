import Link from "next/link";
export default function AboutPage() {
  return (
    <>
    {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-24 text-white">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#2f67de]/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#d59758]/15 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#f4c89a] backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#d59758]" />
            Auto Access · Our Story
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Driven by progress.<br />
            <span className="text-[#d59758]">Built on trust.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-8 text-white/70">
            Auto Access is a South African vehicle rent-to-own company built on the belief that every employed South African deserves access to reliable personal transport — regardless of their credit history.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/apply" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-3 text-sm font-bold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)]">
              Apply Now
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <Link href="/how-it-works" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur">
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* ── NATIONWIDE BANNER ── */}
      <section className="border-b border-[#e1e4ee] bg-gradient-to-r from-emerald-50 to-white px-5 py-5">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_10px_24px_-8px_rgba(16,185,129,0.45)]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">Nationwide Service</p>
              <p className="text-[15px] font-semibold text-[#1b2345]">We deliver to all 9 provinces — completely free of charge</p>
            </div>
          </div>
          <Link href="/how-it-works" className="shrink-0 rounded-full border border-emerald-200 bg-white px-5 py-2.5 text-[12px] font-semibold text-emerald-700 transition hover:bg-emerald-50">
            Learn More
          </Link>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="bg-white px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d59758]">Who We Are</p>
              <h2 className="mt-3 text-3xl font-bold leading-tight text-[#1b2345] sm:text-4xl">
                Removing barriers to vehicle ownership
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-[#4d546a]">
                We work with employed South Africans who have been turned away by traditional finance institutions — people with bad credit, under debt review, or previously blacklisted. Our rent-to-own model provides a structured, transparent and achievable path to owning your vehicle.
              </p>
              <p className="mt-4 text-[15px] leading-8 text-[#4d546a]">
                Proudly based in the Western Cape, we serve clients across every province with free nationwide delivery, provincial licensing and dedicated local support.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {[
                  { number: "54", label: "Month Contract" },
                  { number: "9", label: "Provinces Served" },
                  { number: "0", label: "Credit Checks" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-[18px] border border-[#e8ecf5] bg-[#fafbff] p-4 text-center">
                    <p className="text-3xl font-bold text-[#2f67de]">{stat.number}</p>
                    <p className="mt-1 text-[11px] font-semibold text-[#68708a]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0b1532] to-[#1b3375] p-8 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Our Promise</p>
              <h3 className="mt-3 text-2xl font-bold">Every client deserves a fair opportunity.</h3>
              <p className="mt-4 text-[14px] leading-7 text-white/70">
                We believe a credit score should never define your access to mobility. Our team is committed to finding a vehicle solution that works within your budget and life circumstances — with full transparency at every step.
              </p>
              <div className="mt-6 space-y-3">
                {["No credit bureau checks", "Free nationwide delivery", "Full cost transparency", "Real path to ownership"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                      <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <p className="text-[13px] font-medium text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 PILLARS ── */}

      {/* ── Tokyo Group Heritage ── */}
      <section className="bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-20 text-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f4c89a]">Our Heritage</p>
            <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
              Born from a legacy of trust
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-8 text-white/70">
              Auto Access did not appear overnight. It grew out of more than two decades of experience in the South African automotive industry — backed by the established name of Tokyo Group.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2 lg:items-stretch">
            {/* Tokyo Group card */}
            <div className="flex flex-col rounded-[28px] border border-white/10 bg-white/[0.04] p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#d59758]/20">
                  <span className="text-xl font-bold text-[#f4c89a]">TG</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c89a]">Est. 1999</p>
                  <h3 className="text-xl font-bold">Tokyo Group</h3>
                </div>
              </div>
              <p className="mt-5 text-[14px] leading-7 text-white/70">
                Tokyo Group opened its doors in 1999 as an automotive car dealership in South Africa. Over more than twenty years it built a reputation for quality vehicles, honest dealing and a deep understanding of what South African motorists need. Through changing markets and tough economic times, one thing stayed constant — a commitment to helping people get behind the wheel of a car they could trust.
              </p>
            </div>

            {/* Auto Access card */}
            <div className="flex flex-col rounded-[28px] border border-[#d59758]/30 bg-gradient-to-br from-[#d59758]/15 to-transparent p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2f67de]/25">
                  <span className="text-xl font-bold text-[#9db8f0]">AA</span>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9db8f0]">Born 2021</p>
                  <h3 className="text-xl font-bold">Auto Access</h3>
                </div>
              </div>
              <p className="mt-5 text-[14px] leading-7 text-white/75">
                By 2021 the team behind Tokyo Group had seen a pattern too many times to ignore — hardworking, employed South Africans being turned away by the banks simply because of their credit history. They knew these were good people who deserved a fair chance. And so Auto Access was born: a rent-to-own company built specifically to open the door that traditional finance kept shut. The dealership heritage of Tokyo Group, reimagined for the people the system left behind.
              </p>
            </div>
          </div>

          {/* Timeline strip */}
          <div className="mt-10 flex items-center justify-center gap-4 sm:gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#f4c89a] sm:text-3xl">1999</p>
              <p className="mt-1 text-[11px] font-semibold text-white/50">Tokyo Group founded</p>
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-[#f4c89a]/40 to-[#9db8f0]/40 sm:w-24"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#9db8f0] sm:text-3xl">2021</p>
              <p className="mt-1 text-[11px] font-semibold text-white/50">Auto Access born</p>
            </div>
            <div className="h-px w-12 bg-gradient-to-r from-[#9db8f0]/40 to-emerald-400/40 sm:w-24"></div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400 sm:text-3xl">Today</p>
              <p className="mt-1 text-[11px] font-semibold text-white/50">Serving all 9 provinces</p>
            </div>
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-[14px] leading-7 text-white/60">
            Today Auto Access proudly operates as a division of Tokyo Group — combining the trust and automotive expertise of a dealership established in 1999 with a modern mission to make vehicle ownership possible for every employed South African.
          </p>
        </div>
      </section>

      <section className="bg-[#f4f6fb] px-5 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#d59758]">Why Auto Access</p>
            <h2 className="mt-3 text-3xl font-bold text-[#1b2345] sm:text-4xl">What sets us apart</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-7 text-[#68708a]">
              We have built a rent-to-own model that genuinely benefits the client at every stage.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "💰",
                title: "Bank Repossessed Vehicles",
                description: "We specialise exclusively in bank repossessed vehicles. Your rent-to-own agreement is structured from the previous owner's existing bank balance — meaning significantly lower entry costs and more competitive monthly payments compared to retail pricing. Their equity works in your favour.",
                accent: "bg-[#eef4ff] text-[#2f67de]",
              },
              {
                icon: "✅",
                title: "No Credit Checks",
                description: "We do not run credit bureau checks. Your current employment status and income are what matter — not your credit score, past financial history, blacklisting status or debt review. If you are employed and earning, we want to help you.",
                accent: "bg-emerald-50 text-emerald-700",
              },
              {
                icon: "🚚",
                title: "Nationwide Free Delivery",
                description: "Based in the Western Cape but serving all 9 provinces. We load your vehicle onto an approved professional transporter and deliver it to your door — completely free. Provincial licensing and registration are handled in your home province before handover.",
                accent: "bg-amber-50 text-amber-700",
              },
              {
                icon: "📋",
                title: "Full Transparency",
                description: "Every cost is disclosed before you commit. Your deposit, monthly payment and all inclusive benefits are clearly outlined. No hidden fees, no surprises, no fine print designed to catch you out.",
                accent: "bg-[#fafbff] text-[#1b2345]",
              },
              {
                icon: "📱",
                title: "South Africa's First Rent-to-Own Portal",
                description: "We have built the country's first fully integrated rent-to-own client portal. Track your application, upload documents, sign your contract digitally and manage everything in real time — from any device, anywhere in the country.",
                accent: "bg-purple-50 text-purple-700",
              },
              {
                icon: "🏁",
                title: "A Real Path to Ownership",
                description: "After completing your full 54-month contract term with consistent payments, the vehicle is yours. This is not an open-ended rental with no destination — it is a structured journey to full legal ownership.",
                accent: "bg-rose-50 text-rose-700",
              },
            ].map((pillar) => (
              <div key={pillar.title} className="overflow-hidden rounded-[24px] border border-[#e1e4ee] bg-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
                <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-5 py-4">
                  <span className="text-2xl">{pillar.icon}</span>
                  <h3 className="mt-2 text-[1rem] font-semibold text-white">{pillar.title}</h3>
                </div>
                <div className="p-5">
                  <p className="text-[13px] leading-7 text-[#4d546a]">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IN PERSON VISITS ── */}
      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-[28px] border border-[#e1e4ee] bg-gradient-to-br from-[#fafbff] to-white shadow-[0_8px_24px_-12px_rgba(15,23,42,0.08)]">
            <div className="border-b border-[#eef0f7] bg-gradient-to-r from-[#1b2345] to-[#2a3563] px-6 py-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c89a]">Visit Us</p>
              <h2 className="text-[1.2rem] font-semibold text-white">Prefer to sign in person? You are welcome.</h2>
            </div>
            <div className="grid gap-8 p-6 md:grid-cols-2">
              <div>
                <p className="text-[15px] leading-8 text-[#4d546a]">
                  Approved clients are welcome to visit our Western Cape offices to sign their rental agreement and make relevant payments in person. Our team will be on hand to walk you through every document and answer any questions before you sign.
                </p>
                <p className="mt-4 text-[15px] leading-8 text-[#4d546a]">
                  Please note that our premises are reserved exclusively for approved clients. Unapproved third parties are not permitted to access our warehouse or offices unless accompanying and presenting alongside an approved client.
                </p>
              </div>
              <div className="space-y-3">
                <div className="rounded-[18px] border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Who Can Visit</p>
                  <p className="mt-2 text-[13px] leading-6 text-[#39425d]">Clients who have been fully approved through our portal and have a confirmed application reference number.</p>
                </div>
                <div className="rounded-[18px] border border-red-200 bg-red-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-700">Please Note</p>
                  <p className="mt-2 text-[13px] leading-6 text-[#39425d]">Unapproved individuals may not access our premises unless accompanying an approved client. This policy is in place to protect the security and privacy of all our clients.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] px-5 py-20 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#f4c89a]">Ready to Start</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">Your vehicle is waiting.</h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-8 text-white/70">
            Apply in minutes, upload your documents through your secure portal and let our team handle the rest — wherever you are in South Africa.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/apply" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-8 py-4 text-sm font-bold text-white shadow-[0_14px_30px_-10px_rgba(213,151,88,0.55)]">
              Apply Now — It is Free
            </Link>
            <Link href="/faq" className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur">
              Read Our FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}