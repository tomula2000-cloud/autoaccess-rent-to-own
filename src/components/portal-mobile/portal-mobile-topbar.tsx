import Link from "next/link";

function IconCar() {
  return (
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
  );
}

type PortalMobileTopbarProps = {
  rightHref: string;
  rightLabel: string;
};

export default function PortalMobileTopbar({
  rightHref,
  rightLabel,
}: PortalMobileTopbarProps) {
  return (
    <div className="flex items-center justify-between">
      <Link href="/portal" className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2345] to-[#2a3563] text-[#f4c89a] shadow-[0_8px_18px_-6px_rgba(27,35,69,0.5)]">
          <IconCar />
        </div>
        <p className="text-[17px] font-semibold text-[#1b2345]">
          Auto<span className="text-[#d59758]">Access</span>
        </p>
      </Link>

      <Link
        href={rightHref}
        className="rounded-full border border-[#2f67de] px-4 py-2 text-[12px] font-semibold text-[#2f67de]"
      >
        {rightLabel}
      </Link>
    </div>
  );
}