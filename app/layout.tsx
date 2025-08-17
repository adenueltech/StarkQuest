import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "sonner";
import MobileTabBar from "@/components/mobile-tab-bar";
import "./globals.css";

export const metadata: Metadata = {
  title: "StarkEarn - Decentralized Bounty Platform",
  description:
    "Connect with skilled developers, designers, and creators in the StarkNet ecosystem",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Toaster position="top-right" />
            {/* add bottom padding so content isn't hidden behind the tab bar on mobile */}
            <div className="pb-24 md:pb-0">{children}</div>
            <MobileTabBar />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
