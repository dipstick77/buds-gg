"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  Compass,
  Crown,
  Hexagon,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  UserRound,
  X,
} from "lucide-react";
import "@/app/discover-theme.css";

const NAV = [
  {
    href: "/discover",
    label: "Discover",
    icon: Compass,
    match: (p: string) => p === "/" || p === "/discover",
  },
  {
    href: "/discover?tab=groups",
    label: "Groups",
    icon: Users,
    match: (p: string) => p.startsWith("/g"),
  },
  {
    href: "/discover?tab=players",
    label: "Players",
    icon: UserRound,
    match: () => false,
  },
] as const;

export function AppShell({
  children,
  searchPlaceholder = "Search for games, groups or players…",
  searchValue,
  onSearchChange,
}: {
  children: React.ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const query = searchValue ?? localQuery;
  const setQuery = onSearchChange ?? setLocalQuery;

  return (
    <div className="discover-theme d-shell">
      <aside className={`d-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="d-sidebar__brand">
          <Link href="/discover" className="d-brand" onClick={() => setMobileNavOpen(false)}>
            <span className="d-brand__mark" aria-hidden>
              <Hexagon size={16} strokeWidth={2.5} />
            </span>
            buds.gg
          </Link>
          <button
            type="button"
            className="d-sidebar__close"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        <nav className="d-nav" aria-label="Primary">
          {NAV.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`d-nav__item ${active ? "is-active" : ""}`}
                onClick={() => setMobileNavOpen(false)}
              >
                <Icon size={18} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
                {item.label}
              </Link>
            );
          })}
          <div className="d-nav__divider" role="separator" />
          <Link
            href="/login"
            className="d-nav__item"
            onClick={() => setMobileNavOpen(false)}
          >
            <UserRound size={18} strokeWidth={1.75} aria-hidden />
            My Profile
          </Link>
          <Link
            href="/edit"
            className="d-nav__item"
            onClick={() => setMobileNavOpen(false)}
          >
            <Settings size={18} strokeWidth={1.75} aria-hidden />
            Settings
          </Link>
          <Link
            href="/login"
            className="d-nav__item"
            onClick={() => setMobileNavOpen(false)}
          >
            <LogOut size={18} strokeWidth={1.75} aria-hidden />
            Log Out
          </Link>
        </nav>

        <div className="d-premium">
          <p className="d-premium__title">
            <Crown size={16} aria-hidden />
            Go Premium
          </p>
          <p className="d-premium__body">
            Unlock extra customisation and advanced filters.
          </p>
          <button type="button" className="d-btn d-btn--primary d-btn--sm d-btn--block">
            Learn More
          </button>
        </div>

        <p className="d-sidebar__footer">
          Find your people.
          <br />© 2025 Buds.gg
        </p>
      </aside>

      {mobileNavOpen ? (
        <button
          type="button"
          className="d-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="d-main">
        <header className="d-topnav">
          <button
            type="button"
            className="d-menu-btn"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu size={18} />
          </button>
          <label className="d-search">
            <Search size={16} aria-hidden />
            <span className="visually-hidden">Search</span>
            <input
              type="search"
              placeholder={searchPlaceholder}
              aria-label="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="d-topnav__right">
            <button type="button" className="d-icon-btn" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <Link href="/login" className="d-avatar" title="Account" aria-label="Account">
              JD
              <span className="d-avatar__status" aria-hidden />
            </Link>
          </div>
        </header>

        <div className="d-content">{children}</div>
      </div>
    </div>
  );
}
