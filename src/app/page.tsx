import Link from "next/link";
import { HomeCard } from "@/shared/components";
import { locales } from "@/shared/locales";

export default function Home() {
  return (
    <main className="w-full overflow-y-none">
      <section className="mx-auto max-w-5xl px-4 pb-8 pt-8 text-center sm:px-6 sm:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          {locales.pages.home.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
          {locales.pages.home.subtitle}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <HomeCard
            href="/characters"
            title={locales.homeCards.characters.title}
            description={locales.homeCards.characters.description}
          />
          <HomeCard
            href="/planets"
            title={locales.homeCards.planets.title}
            description={locales.homeCards.planets.description}
          />
          <HomeCard
            href="/spaceships"
            title={locales.homeCards.spaceships.title}
            description={locales.homeCards.spaceships.description}
          />
          <HomeCard
            href="/vehicles"
            title={locales.homeCards.vehicles.title}
            description={locales.homeCards.vehicles.description}
          />
        </div>

        <div className="mt-16 flex justify-center">
          <Link
            href="/chat"
            className="ai-border-animate bg-glass rounded-2xl px-12 py-6 text-2xl font-bold text-white transition-transform hover:scale-105"
          >
            <span className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {locales.homeCards.chatButton}
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}
