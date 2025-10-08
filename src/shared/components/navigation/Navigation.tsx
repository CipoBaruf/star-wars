"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UI_CONFIG, ROUTES } from "@/lib/constants";
import { locales } from "@/shared/locales";
import NavLink from "./NavLink";
import MenuIcon from "./MenuIcon";

interface NavigationProps {
  pageTitle?: string;
  showPageTitle?: boolean;
}

const NAV_LINKS = [
  { href: ROUTES.HOME, label: locales.nav.home },
  { href: ROUTES.CHARACTERS, label: locales.nav.characters },
  { href: ROUTES.PLANETS, label: locales.nav.planets },
  { href: ROUTES.SPACESHIPS, label: locales.nav.spaceships },
  { href: ROUTES.VEHICLES, label: locales.nav.vehicles },
  { href: ROUTES.CHAT, label: locales.nav.aiChat },
];

export default function Navigation({
  pageTitle,
  showPageTitle = false,
}: NavigationProps = {}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className="mx-auto w-full p-4"
      aria-label={locales.aria.mainNavigation}
    >
      <div className="flex items-center justify-between md:justify-start">
        <Link
          href={ROUTES.HOME}
          className="text-xl font-bold text-white md:hidden"
          onClick={closeMobileMenu}
        >
          SW
        </Link>

        <div
          className={`absolute left-1/2 -translate-x-1/2 overflow-hidden transition-all ease-out md:hidden ${
            showPageTitle ? "max-w-[250px] opacity-100" : "max-w-0 opacity-0"
          }`}
          style={{
            transitionDuration: `${UI_CONFIG.TITLE_ANIMATION_DURATION}ms`,
          }}
        >
          {pageTitle && (
            <span className="whitespace-nowrap text-base font-bold tracking-wide text-white">
              {pageTitle}
            </span>
          )}
        </div>

        <div className="hidden items-center gap-6 md:flex md:w-full">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={pathname === link.href}
            />
          ))}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="rounded-md p-2 text-white transition-colors hover:bg-gray-800 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <MenuIcon isOpen={isMobileMenuOpen} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mt-4 flex flex-col gap-2 border-t border-gray-700 pt-4 md:hidden">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.href}
              href={link.href}
              label={link.label}
              isActive={pathname === link.href}
              isMobile
              onClick={closeMobileMenu}
            />
          ))}
        </div>
      )}
    </nav>
  );
}
