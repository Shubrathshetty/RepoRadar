import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RepoRadar",
  description: "Analyze any public GitHub repository and get a structured technical explanation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
