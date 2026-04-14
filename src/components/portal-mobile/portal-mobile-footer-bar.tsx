import Link from "next/link";

type PortalMobileFooterBarProps = {
  href?: string;
  label?: string;
};

function IconArrow() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function PortalMobileFooterBar({
  href = "/portal",
  label = "Back to Dashboard",
}: PortalMobileFooterBarProps) {
  return (
    <div className="mt-4 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#0b1532] to-[#060e24]">
      <div className="px-4 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a]">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1l-.8 1.63A6 6 0 002 12.42V16h2" />
              <circle cx="6.5" cy="16.5" r="2.5" />
              <circle cx="16.5" cy="16.5" r="2.5" />
            </svg>
          </div>
          <p className="text-[16px] font-semibold text-white">
            Auto<span className="text-[#f4c89a]">Access</span>
          </p>
        </div>

        <p className="mt-3 text-[12px] leading-6 text-blue-50/45">
          A premium South African rent-to-own platform built around clarity,
          trust, and structured access to vehicles.
        </p>

        <div className="mt-4 flex flex-wrap gap-4">
          <Link href="/" className="text-[12px] text-blue-50/55">
            Home
          </Link>
          <Link href="/apply" className="text-[12px] text-blue-50/55">
            Apply
          </Link>
          <Link href="/portal-login" className="text-[12px] text-blue-50/55">
            Client Portal
          </Link>
        </div>

        <Link
          href={href}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
        >
          {label}
          <IconArrow />
        </Link>

        <div className="mt-5 border-t border-white/10 pt-4">
          <p className="text-[11px] text-blue-50/35">
            © {new Date().getFullYear()} Auto Access (Pty) Ltd · NCR Registered · POPIA Compliant
          </p>
        </div>
      </div>
    </div>
  );
}