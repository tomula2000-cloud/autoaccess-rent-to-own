export type PortalMobileStageTheme = {
  heroClassName: string;
  glowLeftClassName: string;
  glowRightClassName: string;
  eyebrowTextClassName: string;
  statusBadgeClassName: string;
  refBadgeClassName: string;
  timerBarClassName: string;
  selectionCardClassName: string;
  urgentTimer?: boolean;
};

export const portalMobileThemes = {
  approved: {
    heroClassName:
      "border border-emerald-200/60 bg-gradient-to-br from-[#0a3b2a] via-[#0f5239] to-[#137a52] shadow-[0_24px_60px_-20px_rgba(16,80,55,0.45)]",
    glowLeftClassName: "bg-emerald-400/20",
    glowRightClassName: "bg-green-300/15",
    eyebrowTextClassName: "text-emerald-200/90",
    statusBadgeClassName: "border border-emerald-300/40 bg-emerald-500/15 text-emerald-100",
    refBadgeClassName: "border border-white/15 bg-white/5 text-emerald-50/85",
    timerBarClassName: "border border-white/15 bg-white/10 text-emerald-50/90",
    selectionCardClassName: "border border-white/15 bg-white/10 text-emerald-50/90",
    urgentTimer: false,
  },

  contract: {
    heroClassName:
      "border border-red-300/60 bg-gradient-to-br from-[#4a0a0a] via-[#7a1515] to-[#a01e1e] shadow-[0_24px_60px_-20px_rgba(140,20,20,0.55)]",
    glowLeftClassName: "bg-red-500/25",
    glowRightClassName: "bg-rose-400/20",
    eyebrowTextClassName: "text-red-100/90",
    statusBadgeClassName: "border border-red-300/40 bg-red-500/20 text-red-50",
    refBadgeClassName: "border border-white/15 bg-white/5 text-red-50/85",
    timerBarClassName: "border border-red-300/50 bg-red-500/20 text-red-100",
    selectionCardClassName: "border border-white/15 bg-white/10 text-red-50/90",
    urgentTimer: true,
  },

  invoice: {
    heroClassName:
      "border border-blue-200/60 bg-gradient-to-br from-[#0d1f4a] via-[#16306f] to-[#22479a] shadow-[0_24px_60px_-20px_rgba(21,48,111,0.42)]",
    glowLeftClassName: "bg-blue-400/20",
    glowRightClassName: "bg-sky-300/15",
    eyebrowTextClassName: "text-blue-100/90",
    statusBadgeClassName: "border border-blue-300/40 bg-blue-500/15 text-blue-50",
    refBadgeClassName: "border border-white/15 bg-white/5 text-blue-50/85",
    timerBarClassName: "border border-white/15 bg-white/10 text-blue-50/90",
    selectionCardClassName: "border border-white/15 bg-white/10 text-blue-50/90",
    urgentTimer: false,
  },

  payment: {
    heroClassName:
      "border border-orange-200/60 bg-gradient-to-br from-[#5a2607] via-[#7a3a10] to-[#b35a15] shadow-[0_24px_60px_-20px_rgba(138,69,16,0.42)]",
    glowLeftClassName: "bg-orange-400/20",
    glowRightClassName: "bg-amber-300/15",
    eyebrowTextClassName: "text-orange-100/90",
    statusBadgeClassName: "border border-orange-300/40 bg-orange-500/15 text-orange-50",
    refBadgeClassName: "border border-white/15 bg-white/5 text-orange-50/85",
    timerBarClassName: "border border-white/15 bg-white/10 text-orange-50/90",
    selectionCardClassName: "border border-white/15 bg-white/10 text-orange-50/90",
    urgentTimer: false,
  },

  success: {
    heroClassName:
      "border border-emerald-200/60 bg-gradient-to-br from-[#083826] via-[#0d4b35] to-[#137a52] shadow-[0_24px_60px_-20px_rgba(16,80,55,0.45)]",
    glowLeftClassName: "bg-emerald-400/20",
    glowRightClassName: "bg-lime-300/15",
    eyebrowTextClassName: "text-emerald-100/90",
    statusBadgeClassName: "border border-emerald-300/40 bg-emerald-500/15 text-emerald-50",
    refBadgeClassName: "border border-white/15 bg-white/5 text-emerald-50/85",
    timerBarClassName: "border border-white/15 bg-white/10 text-emerald-50/90",
    selectionCardClassName: "border border-white/15 bg-white/10 text-emerald-50/90",
    urgentTimer: false,
  },

  danger: {
    heroClassName:
      "border border-red-200/60 bg-gradient-to-br from-[#4a1117] via-[#681923] to-[#8f2432] shadow-[0_24px_60px_-20px_rgba(104,25,35,0.42)]",
    glowLeftClassName: "bg-rose-400/20",
    glowRightClassName: "bg-red-300/15",
    eyebrowTextClassName: "text-rose-100/90",
    statusBadgeClassName: "border border-rose-300/40 bg-rose-500/15 text-rose-50",
    refBadgeClassName: "border border-white/15 bg-white/5 text-rose-50/85",
    timerBarClassName: "border border-white/15 bg-white/10 text-rose-50/90",
    selectionCardClassName: "border border-white/15 bg-white/10 text-rose-50/90",
    urgentTimer: false,
  },

  neutral: {
    heroClassName:
      "border border-white/10 bg-gradient-to-br from-[#0b1532] via-[#102046] to-[#1b3375] shadow-[0_24px_60px_-20px_rgba(11,21,50,0.55)]",
    glowLeftClassName: "bg-[#2f67de]/25",
    glowRightClassName: "bg-[#d59758]/15",
    eyebrowTextClassName: "text-blue-200/90",
    statusBadgeClassName: "border border-[#d59758]/40 bg-[#d59758]/15 text-[#f4c89a]",
    refBadgeClassName: "border border-white/15 bg-white/5 text-blue-50/80",
    timerBarClassName: "border border-white/15 bg-white/10 text-blue-50/90",
    selectionCardClassName: "border border-white/15 bg-white/10 text-blue-50/90",
    urgentTimer: false,
  },
} as const;
