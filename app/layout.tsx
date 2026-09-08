import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chat Hackers | Community chat research interview",
  description:
    "A structured interview workspace for understanding how progressive organisations run community chat and where Matrix can help.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
