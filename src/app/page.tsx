import ChatBox from "@/lib/component/ChatBox";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <section className="max-w-5xl mx-auto px-6 pt-12 pb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Star Wars source of true
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground">
          Search with Star Wars Yoda Intelligence: The new deep space galaxy AI
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 flex justify-center">
        <ChatBox />
      </section>
    </main>
  );
}
