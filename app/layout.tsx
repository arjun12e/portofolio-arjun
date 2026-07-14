import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arjun — Portofolio & Milestone Tracker",
  description:
    "Portofolio dinamis: pencapaian proyek Industrial IoT, otomatisasi industri, dan software development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
