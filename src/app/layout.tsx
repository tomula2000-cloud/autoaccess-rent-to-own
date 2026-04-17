import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/app-shell";
import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Auto Access Rent To Own",
  description: "Auto Access Rent To Own application and portal system",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className={`${dmSans.className} bg-gray-50 text-black`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}