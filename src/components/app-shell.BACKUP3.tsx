import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-black">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }

        @keyframes callBounceGlow {
          0%, 100% { transform: translateY(0); box-shadow: 0 8px 20px rgba(213,151,88,0.3); }
          50% { transform: translateY(-3px) scale(1.03); box-shadow: 0 0 0 5px rgba(213,151,88,0.12), 0 14px 28px rgba(213,151,88,0.4); }
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

        .anim-fade-up { animation: fadeUp 0.65s ease both; }
        .anim-slide-l { animation: slideInLeft 0.65s ease both; }

        .section-reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .section-reveal.visible { opacity: 1; transform: translateY(0); }

        .step-reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .step-reveal.visible { opacity: 1; transform: translateY(0); }

        .call-btn { animation: callBounceGlow 1.8s ease-in-out infinite; }
      `}</style>

      {children}
    </div>
  );
}