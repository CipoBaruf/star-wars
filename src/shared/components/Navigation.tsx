"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "@/shared/locales";

export default function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: locales.nav.home },
    { href: "/characters", label: locales.nav.characters },
    { href: "/planets", label: locales.nav.planets },
    { href: "/spaceships", label: locales.nav.spaceships },
    { href: "/vehicles", label: locales.nav.vehicles },
    { href: "/chat", label: locales.nav.aiChat },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className="mx-auto max-w-5xl p-4"
      aria-label={locales.aria.mainNavigation}
    >
      <div className="flex items-center justify-between">
        {/* Logo/Title - visible on mobile */}
        <Link
          href="/"
          className="text-xl font-bold text-white md:hidden"
          onClick={closeMobileMenu}
        >
          SW
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex md:w-full">
          {links.map(link => {
            const isActive = pathname === link.href;
            const isChat = link.href === "/chat";
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                  isChat
                    ? "font-semibold text-gradient-ai hover:opacity-80"
                    : isActive
                      ? "font-semibold text-blue-400"
                      : "hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="rounded-md p-2 text-white transition-colors hover:bg-gray-800 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mt-4 flex flex-col gap-2 border-t border-gray-700 pt-4 md:hidden">
          {links.map(link => {
            const isActive = pathname === link.href;
            const isChat = link.href === "/chat";
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`rounded-md px-4 py-3 text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isChat
                    ? "font-semibold text-gradient-ai hover:bg-gray-800"
                    : isActive
                      ? "bg-gray-800 font-semibold text-blue-400"
                      : "hover:bg-gray-800 hover:text-blue-400"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
