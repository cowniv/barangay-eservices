import type { Metadata } from "next";
import Link from "next/link";
import { BARANGAY } from "@/lib/documents";
import "./globals.css";

export const metadata: Metadata = {
  title: `${BARANGAY.name} e-Services`,
  description: "Request barangay documents online and track them by reference number.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased">
        <header className="no-print border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="text-lg font-bold text-brand">
              {BARANGAY.name} <span className="font-normal text-slate-500">e-Services</span>
            </Link>
