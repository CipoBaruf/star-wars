import Link from "next/link";
import { ROUTES } from "@/lib/constants";

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
  isMobile?: boolean;
  onClick?: () => void;
}

export default function NavLink({
  href,
  label,
  isActive,
  isMobile = false,
  onClick,
}: NavLinkProps) {
  const isChat = href === ROUTES.CHAT;

  const baseClasses =
    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500";

  const desktopClasses = `rounded-sm focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
    isChat
      ? "font-semibold text-gradient-ai hover:opacity-80"
      : isActive
        ? "font-semibold text-blue-400"
        : "hover:text-blue-400"
  }`;

  const mobileClasses = `rounded-md px-4 py-3 text-base ${
    isChat
      ? "font-semibold text-gradient-ai hover:bg-gray-800"
      : isActive
        ? "bg-gray-800 font-semibold text-blue-400"
        : "hover:bg-gray-800 hover:text-blue-400"
  }`;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}
    >
      {label}
    </Link>
  );
}
