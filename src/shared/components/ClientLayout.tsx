"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import { BackToTop } from "./index";
import { locales } from "@/shared/locales";
import { useScrollTitle } from "@/shared/hooks";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const showTitle = useScrollTitle(50);

  // Determine page title based on route
  const getPageTitle = () => {
    switch (pathname) {
      case "/characters":
        return locales.pages.characters.title;
      case "/planets":
        return locales.pages.planets.title;
      case "/spaceships":
        return locales.pages.spaceships.title;
      case "/vehicles":
        return locales.pages.vehicles.title;
      case "/chat":
        return locales.pages.chat.title;
      default:
        return undefined;
    }
  };

  // Determine if title should always show (for chat page)
  const shouldAlwaysShowTitle = pathname === "/chat";

  // Determine if we should show BackToTop button (data pages only)
  const showBackToTop = [
    "/characters",
    "/planets",
    "/spaceships",
    "/vehicles",
  ].includes(pathname);

  const pageTitle = getPageTitle();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <Navigation
          pageTitle={pageTitle}
          showPageTitle={shouldAlwaysShowTitle || showTitle}
        />
      </header>
      {children}
      {showBackToTop && <BackToTop />}
    </>
  );
}
