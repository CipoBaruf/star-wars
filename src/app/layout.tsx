import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Star Wars source of true",
  description:
    "Search with Star Wars Yoda Intelligence: The new deep space galaxy AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <nav className="max-w-5xl mx-auto flex items-center gap-6 p-4">
            <a href="/" className="font-semibold hover:underline">
              Home
            </a>
            <a href="/characters" className="hover:underline">
              Characters
            </a>
            <a href="/planets" className="hover:underline">
              Planets
            </a>
            <a href="/spaceships-and-vehicles" className="hover:underline">
              Spaceships & Vehicles
            </a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
