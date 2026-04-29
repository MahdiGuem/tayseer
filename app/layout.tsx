import type { Metadata } from "next";
import "./globals.css";

// Using system font stack to avoid network requests during build
const inter = {
  variable: "--font-geist-sans",
  style: { fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }
};

export const metadata: Metadata = {
  title: "Tayseer - Autonomous Financial Agent",
  description: "AI-powered financial management for freelancers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
