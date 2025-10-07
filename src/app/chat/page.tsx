import { ChatBox } from "@/shared/components";
import { locales } from "@/shared/locales";

export default function ChatPage() {
  return (
    <main className="flex h-[calc(100dvh-64px)] w-full flex-col sm:h-[calc(100dvh-73px)]">
      <section className="mx-auto max-w-5xl flex-shrink-0 px-4 pb-6 pt-8 text-center sm:px-6 sm:pb-8 sm:pt-12">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          {locales.pages.chat.title}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground sm:mt-4 sm:text-base md:text-lg">
          {locales.pages.chat.subtitle}
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-1 min-h-0 justify-center px-4 pb-4 sm:px-6 sm:pb-6">
        <ChatBox className="h-full w-full" />
      </section>
    </main>
  );
}
