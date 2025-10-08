"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { Navigation } from "./navigation";
import { BackToTop } from "./index";
import { locales } from "@/shared/locales";
import { useScrollTitle } from "@/shared/hooks";
import { ROUTES, DATA_PAGES } from "@/lib/constants";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ROUTE_TITLE_MAP: Record<string, string> = {
  [ROUTES.CHARACTERS]: locales.pages.characters.title,
  [ROUTES.PLANETS]: locales.pages.planets.title,
  [ROUTES.SPACESHIPS]: locales.pages.spaceships.title,
  [ROUTES.VEHICLES]: locales.pages.vehicles.title,
  [ROUTES.CHAT]: locales.pages.chat.title,
};

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname();
  const showTitle = useScrollTitle();

  const { pageTitle, shouldAlwaysShowTitle, showBackToTop } = useMemo(() => {
    const isDataPage = DATA_PAGES.includes(
      pathname as (typeof DATA_PAGES)[number]
    );
    const isChatPage = pathname === ROUTES.CHAT;

    return {
      pageTitle: ROUTE_TITLE_MAP[pathname],
      shouldAlwaysShowTitle: isChatPage,
      showBackToTop: isDataPage,
    };
  }, [pathname]);

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
