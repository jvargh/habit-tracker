import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Habit Tracker - Build Better Habits",
  description: "A simple and effective habit tracker to help you build better habits and achieve your goals.",
  keywords: ["habit tracker", "habits", "productivity", "goals", "self-improvement"],
  authors: [{ name: "Habit Tracker App" }],
  creator: "Habit Tracker App",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Habit Tracker",
    title: "Habit Tracker - Build Better Habits",
    description: "A simple and effective habit tracker to help you build better habits and achieve your goals.",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Habit Tracker" />
      </head>
      <body className={`${inter.variable} font-sans h-full bg-background text-foreground antialiased`}>
        <div id="root" className="min-h-screen">
          {children}
        </div>
        
        {/* Portal container for modals and overlays */}
        <div id="modal-root" />
        
        {/* Accessibility announcements */}
        <div
          id="announcements"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      </body>
    </html>
  );
}
