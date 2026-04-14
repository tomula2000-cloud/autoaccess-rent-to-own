import type { ReactNode } from "react";

type PortalMobileShellProps = {
  children: ReactNode;
};

export default function PortalMobileShell({
  children,
}: PortalMobileShellProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f4f6fb] text-black">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,103,222,0.08),transparent_55%),radial-gradient(circle_at_top_right,rgba(213,151,88,0.06),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-[430px] px-4 pb-8 pt-4">{children}</div>
    </main>
  );
}