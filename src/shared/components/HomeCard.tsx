import Link from "next/link";

interface HomeCardProps {
  href: string;
  title: string;
  description: string;
}

export default function HomeCard({ href, title, description }: HomeCardProps) {
  return (
    <Link
      href={href}
      className="card-base bg-gray-800/50 text-center group hover:!border-blue-500"
    >
      <h2 className="text-2xl font-bold mb-2 transition-colors group-hover:text-blue-400">
        {title}
      </h2>
      <p className="text-muted-foreground">{description}</p>
    </Link>
  );
}
