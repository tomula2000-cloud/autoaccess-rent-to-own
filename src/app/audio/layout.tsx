import type { Metadata } from "next";
import "../globals.css";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Your Approval Message | Auto Access",
  description: "Listen to your personalised next steps guide from Auto Access.",
};

export default function AudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
