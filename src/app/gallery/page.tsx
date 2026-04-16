import Link from "next/link";

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] flex items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur">
          <svg className="h-10 w-10 text-[#f4c89a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 002 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#f4c89a]">
          Auto Access · Showroom
        </p>
        <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
          We are updating our stock
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-white/60">
          Our showroom is currently being refreshed with new vehicles. Please check back in a few hours — exciting options are on their way.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Back to Home
          </Link>
          <Link
            href="/apply"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#d59758] to-[#e4ad72] px-6 py-3 text-sm font-bold text-white shadow-[0_8px_20px_-6px_rgba(213,151,88,0.5)]"
          >
            Apply Now
          </Link>
        </div>
        <p className="mt-8 text-[12px] text-white/30">
          Have questions? Contact us on{" "}
          <a href="https://wa.me/27610490061" className="text-white/50 underline hover:text-white/70">
            WhatsApp
          </a>
        </p>
      </div>
    </main>
  );
}
