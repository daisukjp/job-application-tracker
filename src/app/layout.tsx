import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const workSans = Work_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Job Application Tracker",
  description: "Track roles, interviews, and outcomes in one minimal workspace."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={workSans.variable}>
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
