"use client";

import SharedApplicationForm from "@/components/home/shared-application-form";

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    num: "01",
    title: "Wide Vehicle Choice",
    desc: "Quality vehicles suited for your lifestyle, family, or business.",
  },
  {
    num: "02",
    title: "Online Application",
    desc: "Submit quickly through a convenient, fully digital process.",
  },
  {
    num: "03",
    title: "Secure Client Portal",
    desc: "Log in, upload documents, and track status from one place.",
  },
  {
    num: "04",
    title: "Fast Approval Flow",
    desc: "Designed to help qualifying applicants get on the road sooner.",
  },
] as const;

const TRUST_ITEMS = [
  { label: "256-bit SSL Secured" },
  { label: "NCA Compliant" },
  { label: "No Deposit Required" },
  { label: "48hr Response" },
] as const;

const STATS = [
  { num: "12K+", label: "Vehicles Placed Nationwide" },
  { num: "94%",  label: "Application Approval Rate" },
  { num: "48hr", label: "Average Response Time" },
  { num: "9+",   label: "Years in the Industry" },
] as const;

const PROCESS_STEPS = [
  { num: "01", title: "Submit Application", desc: "Complete the online form to begin your journey." },
  { num: "02", title: "Access Your Portal",  desc: "Log in and manage your progress securely." },
  { num: "03", title: "Upload Documents",    desc: "Send required documents through your portal." },
  { num: "04", title: "Get Approved",        desc: "Our team reviews and updates your status." },
  { num: "05", title: "Drive Away",          desc: "Once approved, get on the road with confidence." },
] as const;

const VEHICLES = [
  { tag: "Popular", cat: "Sedan",         name: "Mid-Range Sedan",   price: "R 2,850", bg: "from-[#1a3a7a] to-[#2358e0]" },
  { tag: "SUV",     cat: "SUV / Crossover", name: "Compact SUV",    price: "R 3,990", bg: "from-[#2a1a0a] to-[#6b3a0e]" },
  { tag: "Bakkie",  cat: "Bakkie / Pickup", name: "Double Cab Bakkie", price: "R 4,750", bg: "from-[#0d2e1a] to-[#1a6b3a]" },
] as const;

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconCar({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="5" cy="18" r="3" />
      <circle cx="19" cy="18" r="3" />
      <path d="M5 15h14M1 10h2l3-6h10l4 5h2M14 4l2 6" />
    </svg>
  );
}

function IconArrow({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconShield({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconLock({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function IconPhone({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63 19.79 19.79 0 01.12 1 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6z" />
    </svg>
  );
}

function IconMail({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconClock({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TopBar() {
  return (
    <div className="bg-[#0a1f4e] h-[42px] px-10 flex items-center justify-between">
      <div className="flex items-center gap-5">
        {[
          { icon: <IconPhone />, text: "0800 AUTO ACCESS" },
          { icon: <IconMail />,  text: "apply@autoaccess.co.za" },
          { icon: <IconClock />, text: "Mon – Fri  08:00 – 17:00" },
        ].map(({ icon, text }) => (
          <div key={text} className="flex items-center gap-1.5 text-white/60 text-[11.5px] tracking-wide">
            <span className="opacity-70">{icon}</span>
            {text}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        {["Client Portal", "Track Application"].map((label) => (
          <button
            key={label}
            className="text-white/60 text-[11px] px-2.5 py-1 rounded-full border border-white/15 tracking-wider hover:text-white hover:border-white/35 transition-all"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#dde4f2] h-[68px] px-10 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#1446cc] to-[#0a1f4e] flex items-center justify-center">
          <IconCar className="w-5 h-5 text-white" />
        </div>
        <span
          className="text-[22px] font-bold text-[#0a1f4e] tracking-[-0.01em]"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Auto<span className="text-[#e8720c]">Access</span>
        </span>
      </div>

      {/* Links */}
      <div className="hidden lg:flex items-center gap-8">
        {["Home", "How It Works", "Vehicles", "Eligibility", "About", "Contact"].map((link, i) => (
          <a
            key={link}
            href="#"
            className={`text-[13.5px] font-medium tracking-wide transition-colors ${
              i === 0
                ? "text-[#0a1f4e] font-semibold"
                : "text-[#3d4b6e] hover:text-[#1446cc]"
            }`}
          >
            {link}
          </a>
        ))}
      </div>

      {/* CTA */}
      <a
        href="#application-form"
        className="bg-[#1446cc] text-white px-5 py-2.5 rounded-lg text-[13px] font-semibold tracking-wider hover:bg-[#0a1f4e] transition-colors"
      >
        Apply Now →
      </a>
    </nav>
  );
}

function HeroLeft() {
  return (
    <div className="flex flex-col justify-center px-12 py-14 border-r border-[#dde4f2]">
      {/* Eyebrow */}
      <div className="flex items-center gap-2.5 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#e8720c]" />
        <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#6b7a9a]">
          South Africa's Trusted Rent-to-Own Platform
        </span>
        <span className="w-6 h-px bg-[#dde4f2]" />
      </div>

      {/* Headline */}
      <h1
        className="text-[clamp(32px,3.6vw,52px)] font-bold leading-[1.08] tracking-[-0.02em] text-[#0a1f4e] mb-5"
        style={{ fontFamily: "'Cormorant Garamond', serif" }}
      >
        Vehicle access for every{" "}
        <em className="not-italic text-[#1446cc]">South African,</em>
        <br />
        regardless of credit.
      </h1>

      {/* Highlight Band */}
      <div className="relative overflow-hidden rounded-[10px] bg-gradient-to-br from-[#0a1f4e] to-[#2358e0] px-5 py-4 mb-6">
        <span className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-[#e8720c]/18" />
        <div className="relative flex items-start gap-3.5">
          <div className="shrink-0 w-9 h-9 rounded-lg bg-white/12 border border-white/20 flex items-center justify-center">
            <IconShield className="w-4 h-4 text-white" />
          </div>
          <p className="text-white text-[14px] leading-[1.55]">
            <strong className="font-semibold">
              Blacklisted, under debt review, or low credit score?
            </strong>
            <br />
            Welcome to Auto Access — your solution to affordable rent-to-own vehicles.
          </p>
        </div>
      </div>

      {/* Body */}
      <p className="text-[14.5px] leading-[1.78] text-[#6b7a9a] mb-8 max-w-[480px]">
        Choose from a wide variety of vehicles, submit your application online, upload
        your documents securely, and track every stage through your personal portal with ease.
      </p>

      {/* CTAs */}
      <div className="flex flex-wrap gap-3 mb-10">
        <a
          href="#application-form"
          className="inline-flex items-center gap-2 bg-[#e8720c] hover:bg-[#d4660b] text-white px-7 py-3.5 rounded-lg text-[13.5px] font-semibold tracking-wider transition-all hover:-translate-y-px"
        >
          <IconArrow className="w-3.5 h-3.5" />
          Start Your Application
        </a>
        <a
          href="#process-flow"
          className="inline-flex items-center border border-[#dde4f2] hover:border-[#1446cc] hover:text-[#1446cc] text-[#0a1f4e] px-6 py-3.5 rounded-lg text-[13.5px] font-medium transition-all"
        >
          View How It Works
        </a>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-8">
        {FEATURES.map(({ num, title, desc }) => (
          <div
            key={num}
            className="bg-white border border-[#dde4f2] rounded-[10px] p-4 hover:border-[#b8c7f0] hover:shadow-[0_2px_20px_rgba(10,31,78,0.07)] transition-all"
          >
            <div className="font-mono text-[11px] font-medium text-[#1446cc]/70 tracking-wider mb-2">{num}</div>
            <div className="text-[13px] font-semibold text-[#0a1f4e] mb-1">{title}</div>
            <div className="text-[12px] text-[#6b7a9a] leading-[1.6]">{desc}</div>
          </div>
        ))}
      </div>

      {/* Trust Bar */}
      <div className="flex flex-wrap items-center gap-5 pt-6 border-t border-[#dde4f2]">
        {TRUST_ITEMS.map(({ label }, i) => (
          <div key={label} className="flex items-center gap-2">
            {i > 0 && <span className="w-px h-4 bg-[#dde4f2]" />}
            <div className="flex items-center gap-1.5 text-[#6b7a9a] text-[12px]">
              <div className="w-7 h-7 rounded-md bg-[#f5f7fc] border border-[#dde4f2] flex items-center justify-center">
                <IconLock className="w-3 h-3 text-[#1446cc]" />
              </div>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsStrip() {
  return (
    <div className="bg-white border-t border-b border-[#dde4f2] grid grid-cols-2 md:grid-cols-4">
      {STATS.map(({ num, label }, i) => (
        <div
          key={label}
          className={`text-center py-9 px-5 ${i < STATS.length - 1 ? "border-r border-[#dde4f2]" : ""}`}
        >
          <div
            className="text-[36px] font-bold text-[#0a1f4e] tracking-[-0.02em] leading-none mb-1.5"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {num.replace(/[^0-9]/g, "")}
            <span className="text-[#e8720c]">{num.replace(/[0-9]/g, "")}</span>
          </div>
          <div className="text-[12px] text-[#6b7a9a] tracking-wide">{label}</div>
        </div>
      ))}
    </div>
  );
}

function ProcessSection() {
  return (
    <section id="process-flow" className="bg-[#0a1f4e] px-12 py-14">
      <div className="max-w-[1240px] mx-auto">
        <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#e8720c] mb-2.5">
          How It Works
        </p>
        <h2
          className="text-[clamp(24px,2.5vw,38px)] font-bold text-white tracking-[-0.01em] mb-3"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Your road to a vehicle,<br />step by step.
        </h2>
        <p className="text-[14px] text-white/55 leading-[1.7] max-w-lg mb-12">
          A seamless five-step journey from application to the open road — designed
          for clarity, speed, and your peace of mind.
        </p>

        <div className="relative grid grid-cols-5 gap-0">
          {/* connector line */}
          <span className="absolute top-[22px] left-[10%] right-[10%] h-px bg-white/12 pointer-events-none" />

          {PROCESS_STEPS.map(({ num, title, desc }, i) => (
            <div key={num} className="relative z-10 text-center px-3">
              <div
                className={`w-11 h-11 rounded-full mx-auto mb-4 flex items-center justify-center border font-mono text-[13px] font-medium text-white transition-all ${
                  i === 0
                    ? "bg-[#e8720c] border-[#e8720c] shadow-[0_0_0_6px_rgba(232,114,12,0.18)]"
                    : "bg-white/7 border-white/15"
                }`}
              >
                {num}
              </div>
              <div className="text-[12.5px] font-semibold text-white mb-1.5">{title}</div>
              <div className="text-[11.5px] text-white/45 leading-[1.6]">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VehicleCard({ vehicle }: { vehicle: typeof VEHICLES[number] }) {
  return (
    <div className="bg-white border border-[#dde4f2] rounded-xl overflow-hidden hover:shadow-[0_4px_24px_rgba(10,31,78,0.10)] hover:-translate-y-0.5 transition-all cursor-pointer">
      <div className={`h-40 bg-gradient-to-br ${vehicle.bg} flex items-center justify-center relative`}>
        {/* Simple SVG car silhouette */}
        <svg className="w-32 opacity-25" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="30" width="160" height="30" rx="8" fill="white" />
          <ellipse cx="55" cy="62" rx="14" ry="14" fill="white" />
          <ellipse cx="145" cy="62" rx="14" ry="14" fill="white" />
          <path d="M40 30 L70 10 L130 10 L160 30" stroke="white" strokeWidth="3" fill="rgba(255,255,255,0.1)" />
        </svg>
        <div className="absolute top-2.5 left-2.5 bg-[#0a1f4e]/85 text-white text-[10px] font-semibold tracking-wider px-2.5 py-0.5 rounded-full uppercase">
          {vehicle.tag}
        </div>
      </div>
      <div className="p-4">
        <div className="text-[10.5px] font-semibold text-[#6b7a9a] tracking-wider uppercase mb-1">{vehicle.cat}</div>
        <div className="text-[15px] font-semibold text-[#0a1f4e] mb-2.5">{vehicle.name}</div>
        <div className="flex items-baseline gap-1.5 mb-3">
          <span className="text-[11px] text-[#6b7a9a]">from</span>
          <span
            className="text-[22px] font-bold text-[#1446cc] tracking-[-0.01em]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {vehicle.price}
          </span>
          <span className="text-[11px] text-[#6b7a9a]">/ month</span>
        </div>
        <button className="w-full bg-[#f5f7fc] border border-[#dde4f2] hover:bg-[#e8eeff] hover:border-[#1446cc] hover:text-[#1446cc] text-[#0a1f4e] rounded-lg py-2 text-[12.5px] font-medium transition-all">
          Enquire About This Vehicle
        </button>
      </div>
    </div>
  );
}

function VehicleSection() {
  return (
    <section className="px-12 py-14 bg-[#f5f7fc]">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#e8720c] mb-2">
              Vehicle Selection
            </p>
            <h2
              className="text-[clamp(24px,2.5vw,36px)] font-bold text-[#0a1f4e] tracking-[-0.01em]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Available vehicles
            </h2>
          </div>
          <a href="#" className="text-[13px] font-medium text-[#1446cc] flex items-center gap-1.5">
            View all vehicles →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VEHICLES.map((v) => (
            <VehicleCard key={v.name} vehicle={v} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a1f4e] px-12 py-9 flex items-center justify-between">
      <div>
        <div
          className="text-[18px] font-bold text-white"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          Auto<span className="text-[#e8720c]">Access</span>
        </div>
        <div className="text-[11.5px] text-white/40 mt-0.5">
          © 2024 Auto Access (Pty) Ltd · NCR Registered · POPIA Compliant
        </div>
      </div>
      <div className="flex gap-5">
        {["Privacy Policy", "Terms of Service", "NCR Registration", "POPIA Notice", "Contact"].map((link) => (
          <a key={link} href="#" className="text-white/45 text-[12px] hover:text-white transition-colors">
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DesktopHomeView() {
  return (
    <>
      {/* Google Fonts — add to your _document.tsx or layout.tsx head instead */}
      {/* <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" /> */}

      <div
        className="min-h-screen"
        style={{
          background: "linear-gradient(165deg,#f0f3fb 0%,#f7f9fd 45%,#fdf7f2 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Utility bar ── */}
        <TopBar />

        {/* ── Navigation ── */}
        <Navbar />

        {/* ── Hero ── */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] min-h-[calc(100vh-110px)]">
          {/* Left hero content */}
          <HeroLeft />

          {/* Right: application form (unchanged logic) */}
          <div id="application-form" className="bg-white border-l border-[#dde4f2] flex flex-col">
            {/* Form header above SharedApplicationForm */}
            <div className="px-9 pt-8 pb-6 border-b border-[#dde4f2]">
              <div className="inline-flex items-center gap-1.5 bg-[#e8eeff] text-[#1446cc] text-[11px] font-semibold tracking-[0.08em] uppercase px-3 py-1.5 rounded-full mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8720c]" />
                Application Form
              </div>
              <h2
                className="text-[26px] font-bold text-[#0a1f4e] leading-[1.2] tracking-[-0.01em] mb-1.5"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                Begin Your Vehicle<br />Application
              </h2>
              <p className="text-[13px] text-[#6b7a9a] leading-[1.65]">
                Complete the form below. One of our consultants will contact you within 48 business hours.
              </p>
            </div>

            {/*
              ┌──────────────────────────────────────────────────────────┐
              │  SharedApplicationForm is rendered here UNCHANGED.       │
              │  All existing state, validation, API calls, overlays      │
              │  and submission logic remain intact.                      │
              │                                                          │
              │  Apply the Tailwind classes below to the wrapper div     │
              │  inside SharedApplicationForm to pick up the new design: │
              │                                                          │
              │  Inputs:   border-[1.5px] border-[#dde4f2] rounded-lg   │
              │            bg-[#f5f7fc] focus:border-[#1446cc]           │
              │            focus:ring-[3px] focus:ring-[#1446cc]/8       │
              │  Labels:   text-[12px] font-medium text-[#3d4b6e]        │
              │  Submit:   bg-gradient-to-br from-[#e8720c] to-[#d4660b] │
              │            hover:shadow-[0_8px_24px_rgba(232,114,12,.3)] │
              │            hover:-translate-y-px                          │
              └──────────────────────────────────────────────────────────┘
            */}
            <div className="flex-1 overflow-y-auto px-9 py-6">
              <SharedApplicationForm />
            </div>

            {/* Security note below form */}
            <div className="px-9 pb-6 flex items-center justify-center gap-1.5 text-[#6b7a9a] text-[11px]">
              <IconLock className="w-3 h-3 text-[#1446cc]" />
              256-bit SSL encrypted · Your data is secure and confidential
            </div>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <StatsStrip />

        {/* ── Process section ── */}
        <ProcessSection />

        {/* ── Vehicle showcase ── */}
        <VehicleSection />

        {/* ── Footer ── */}
        <Footer />
      </div>
    </>
  );
}
