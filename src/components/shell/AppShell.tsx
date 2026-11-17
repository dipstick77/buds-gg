"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/", label: "Discover", match: (p: string) => p === "/" || p === "/discover" },
  { href: "/discover?tab=groups", label: "Groups", match: (p: string) => p.startsWith("/g") },
{ href: "/discover?tab=players", label: "Players", match: () => false },
] as const;

export function AppShell({
  children,
  searchPlaceholder = "Search for games, groups or players…",
}: {
  children: React.ReactNode;
  searchPlaceholder?: string;
}) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="discover-shell">
      <aside className={`discover-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
        <div className="discover-sidebar__top">
          <Link href="/" className="brand-mark" onClick={() => setMobileNavOpen(false)}>
            buds<span className="brand-accent">.gg</span>
          </Link>
          <button
            type="button"
            className="discover-sidebar__close"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="discover-nav" aria-label="Primary">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`discover-nav__item ${active ? "is-active" : ""}`}
                onClick={() => setMobileNavOpen(false)}
              >
                <span className="discover-nav__dot" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="discover-sidebar__section">
          <p className="section-label">Account</p>
          <Link href="/login" className="discover-nav__item" onClick={() => setMobileNavOpen(false)}>
            My Profile
          </Link>
          <Link href="/edit" className="discover-nav__item" onClick={() => setMobileNavOpen(false)}>
            Settings
          </Link>
          <Link href="/login" className="discover-nav__item" onClick={() => setMobileNavOpen(false)}>
            Log in
          </Link>
        </div>

        <div className="discover-sidebar__promo">
          <p className="discover-sidebar__promo-title">Go Premium</p>
          <p className="discover-sidebar__promo-body">
            Extra customisation and advanced filters — later. Core discovery stays free.
          </p>
          <span className="cta-btn cta-btn--ghost cta-btn--sm" aria-disabled>
            Learn more
          </span>
        </div>

        <p className="discover-sidebar__footer">Find your people. © {new Date().getFullYear()} Buds.gg</p>
      </aside>

      {mobileNavOpen ? (
        <button
          type="button"
          className="discover-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="discover-main">
        <header className="discover-header">
          <button
            type="button"
            className="discover-menu-btn"
            aria-label="Open navigation"
            onClick={() => setMobileNavOpen(true)}
          >
            ☰
          </button>
          <label className="discover-search">
            <span className="discover-search__icon" aria-hidden>
              ⌕
            </span>
            <input
              type="search"
              placeholder={searchPlaceholder}
              aria-label="Search"
              disabled
            />
          </label>
          <div className="discover-header__right">
            <button type="button" className="discover-icon-btn" aria-label="Notifications" disabled>
              ⌂
            </button>
            <Link href="/login" className="discover-avatar" title="Log in" aria-label="Account">
              JD
              <span className="discover-avatar__status" aria-hidden />
            </Link>
          </div>
        </header>

        <div className="discover-content">{children}</div>
      </div>
    </div>
  );
}
