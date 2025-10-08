export default function LoadingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
