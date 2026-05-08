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
