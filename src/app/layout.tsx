import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import CommandPalette from "../components/CommandPalette";
import Providers from "../components/Providers";
import WebBackground from "../components/WebBackground";
import { profile } from "../data/resume";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.role}`,
  description: profile.summary,
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.headline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0f0c",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* warm up connections used by the Open Source section */}
        <link rel="preconnect" href="https://api.github.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          <WebBackground />
          <Navbar />
          <CommandPalette />
          {children}
        </Providers>
      </body>
    </html>
  );
}
