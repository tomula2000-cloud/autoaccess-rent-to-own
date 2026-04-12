import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/app-shell";

export const metadata: Metadata = {
  title: "Auto Access Rent To Own",
  description: "Auto Access Rent To Own application and portal system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-black">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}