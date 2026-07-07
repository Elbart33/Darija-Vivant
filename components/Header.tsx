"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Aujourd'hui" },
  { href: "/review", label: "À revoir" },
  { href: "/progress", label: "Mon chemin" },
];

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-zellige/10 bg-sand/90 backdrop-blur dark:border-sand/10 dark:bg-ink/90">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-zellige text-sand">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink dark:text-sand">
            Français Vivant
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 font-medium transition-colors ${
                  active
                    ? "bg-zellige text-sand"
                    : "text-ink/70 hover:bg-zellige/10 hover:text-ink dark:text-sand/70 dark:hover:bg-sand/10 dark:hover:text-sand"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
