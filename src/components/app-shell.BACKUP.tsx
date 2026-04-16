import Link from "next/link";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

const WHATSAPP_LINK = "https://wa.me/27610490061";
const FACEBOOK_LINK = "#";
const PHONE_LINK = "tel:0870126734";

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* ── Global font + animation tokens ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes callBounceGlow {
          0%, 100% {
            transform: translateY(0);
            box-shadow: 0 8px 20px rgba(232,114,12,0.28);
          }
          50% {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 0 0 5px rgba(232,114,12,0.12), 0 14px 28px rgba(232,114,12,0.36);
          }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes countUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim-fade-up   { animation: fadeUp 0.65s ease both; }
        .anim-slide-l   { animation: slideInLeft 0.65s ease both; }

        .section-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .section-reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .step-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .step-reveal.visible { opacity: 1; transform: translateY(0); }

        .call-btn { animation: callBounceGlow 1.8s ease-in-out infinite; }
      `}</style>

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b border-[#edf0f7] bg-white shadow-[0_2px_16px_rgba(10,31,78,0.06)]">
        <div className="mx-auto max-w-[1280px] px-5 py-0 md:px-8">
          <div className="flex h-[72px] items-center justify-between gap-6">

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <img
                src="/auto-access-logo.png"
                alt="Auto Access"
                className="h-14 w-auto object-contain md:h-16"
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-8 md:flex">
              <nav className="flex items-center gap-7">
                {[
                  { href: "/",             label: "Home" },
                  { href: "/gallery",      label: "Gallery" },
                  { href: "/apply",        label: "Apply" },
                  { href: "/portal-login", label: "Client Portal" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-[13.5px] font-medium text-[#3d4b6e] transition hover:text-[#1446cc]"
                  >
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Social + CTA */}
              <div className="flex items-center gap-2.5">
                {/* WhatsApp */}
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#edf0f7] bg-[#f8f9fc] text-emerald-600 transition hover:bg-emerald-50 hover:border-emerald-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-4 w-4 fill-current">
                    <path d="M19.11 17.21c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.59.14-.17.27-.68.87-.83 1.05-.15.18-.3.2-.57.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.33-1.57-1.48-1.84-.15-.27-.02-.41.11-.54.12-.12.27-.3.41-.45.14-.15.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.59-1.43-.81-1.96-.21-.5-.43-.43-.59-.44h-.5c-.18 0-.45.07-.68.34-.23.27-.89.87-.89 2.12 0 1.25.91 2.45 1.03 2.62.12.16 1.78 2.72 4.31 3.82.6.26 1.08.42 1.45.54.61.19 1.17.16 1.61.1.49-.07 1.58-.65 1.8-1.28.22-.63.22-1.17.15-1.28-.06-.11-.24-.18-.5-.32Z" />
                    <path d="M16.03 3.2c-7.06 0-12.79 5.73-12.79 12.79 0 2.25.58 4.44 1.69 6.37L3 29l6.82-1.78a12.8 12.8 0 0 0 6.21 1.6h.01c7.05 0 12.79-5.74 12.79-12.79S23.09 3.2 16.03 3.2Zm0 23.45h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.05 1.06 1.08-3.95-.26-.4a10.6 10.6 0 1 1 9.03 5Z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href={FACEBOOK_LINK}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#edf0f7] bg-[#f8f9fc] text-[#1446cc] transition hover:bg-blue-50 hover:border-blue-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.78-3.88 1.1 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
                  </svg>
                </a>

                {/* Call CTA */}
                <a
                  href={PHONE_LINK}
                  aria-label="Call Us"
                  className="call-btn inline-flex items-center gap-2 rounded-lg bg-[#e8720c] px-4 py-2.5 text-[12px] font-semibold tracking-[0.12em] text-white"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63 19.79 19.79 0 01.12 1 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6z" />
                  </svg>
                  CALL US
                </a>
              </div>
            </div>

            {/* Mobile hamburger — unchanged logic */}
            <details className="relative ml-auto md:hidden">
              <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-[#edf0f7] bg-[#f8f9fc] text-[#3d4b6e] transition hover:bg-white">
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="7" x2="20" y2="7" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="17" x2="20" y2="17" />
                </svg>
              </summary>

              <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-xl border border-[#edf0f7] bg-white p-3 shadow-[0_16px_40px_rgba(10,31,78,0.12)]">
                <div className="mb-3 flex items-center gap-2">
                  <a href={WHATSAPP_LINK} target="_blank" rel="noreferrer" aria-label="WhatsApp"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#edf0f7] bg-[#f8f9fc] text-emerald-600 transition hover:bg-emerald-50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="h-4 w-4 fill-current">
                      <path d="M19.11 17.21c-.27-.14-1.58-.78-1.82-.87-.24-.09-.42-.14-.59.14-.17.27-.68.87-.83 1.05-.15.18-.3.2-.57.07-.27-.14-1.13-.42-2.15-1.33-.79-.7-1.33-1.57-1.48-1.84-.15-.27-.02-.41.11-.54.12-.12.27-.3.41-.45.14-.15.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.59-1.43-.81-1.96-.21-.5-.43-.43-.59-.44h-.5c-.18 0-.45.07-.68.34-.23.27-.89.87-.89 2.12 0 1.25.91 2.45 1.03 2.62.12.16 1.78 2.72 4.31 3.82.6.26 1.08.42 1.45.54.61.19 1.17.16 1.61.1.49-.07 1.58-.65 1.8-1.28.22-.63.22-1.17.15-1.28-.06-.11-.24-.18-.5-.32Z" />
                      <path d="M16.03 3.2c-7.06 0-12.79 5.73-12.79 12.79 0 2.25.58 4.44 1.69 6.37L3 29l6.82-1.78a12.8 12.8 0 0 0 6.21 1.6h.01c7.05 0 12.79-5.74 12.79-12.79S23.09 3.2 16.03 3.2Zm0 23.45h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-4.05 1.06 1.08-3.95-.26-.4a10.6 10.6 0 1 1 9.03 5Z" />
                    </svg>
                  </a>
                  <a href={FACEBOOK_LINK} target="_blank" rel="noreferrer" aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#edf0f7] bg-[#f8f9fc] text-[#1446cc] transition hover:bg-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.88 3.78-3.88 1.1 0 2.24.2 2.24.2v2.46H15.2c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
                    </svg>
                  </a>
                  <a href={PHONE_LINK} aria-label="Call Us"
                    className="call-btn ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[#e8720c] px-3.5 py-2 text-[11px] font-semibold tracking-[0.1em] text-white">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.63 19.79 19.79 0 01.12 1 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6z" />
                    </svg>
                    CALL US
                  </a>
                </div>

                <div className="my-2 h-px bg-[#edf0f7]" />

                <nav className="grid gap-1">
                  {[
                    { href: "/",             label: "Home" },
                    { href: "/gallery",      label: "Gallery" },
                    { href: "/apply",        label: "Apply" },
                    { href: "/portal-login", label: "Client Portal Login" },
                  ].map(({ href, label }) => (
                    <Link key={href} href={href}
                      className="rounded-lg px-4 py-2.5 text-[14px] font-medium text-[#3d4b6e] transition hover:bg-[#f8f9fc] hover:text-[#1446cc]">
                      {label}
                    </Link>
                  ))}
                </nav>
              </div>
            </details>

          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
