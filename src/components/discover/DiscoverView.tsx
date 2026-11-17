"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TemporaryContext } from "@/components/ui/TemporaryContext";
import {
  FILTER_OPTIONS,
  POPULAR_TAGS,
  type PreferredSize,
  type RecruitmentMode,
  type SeedGroup,
} from "@/lib/groups";
import { GroupCard } from "./GroupCard";

type TabId = "for-you" | "groups" | "players";
type SortId = "best" | "active" | "largest" | "smallest";

export function DiscoverView({
  groups,
  initialTab = "groups",
}: {
  groups: SeedGroup[];
  initialTab?: TabId;
}) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const [query, setQuery] = useState("");
  const [game, setGame] = useState("");
  const [style, setStyle] = useState("");
  const [platform, setPlatform] = useState("");
  const [region, setRegion] = useState("");
  const [timezone, setTimezone] = useState("");
  const [size, setSize] = useState<PreferredSize | "">("");
  const [recruitment, setRecruitment] = useState<RecruitmentMode | "">("");
  const [sort, setSort] = useState<SortId>("best");
  const [adultOnly, setAdultOnly] = useState(true);
  const [includeApplications, setIncludeApplications] = useState(true);
  const [activeTag, setActiveTag] = useState("");

  const filtered = useMemo(() => {
    let list = [...groups];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.games.some((x) => x.toLowerCase().includes(q)) ||
          g.tags.some((x) => x.toLowerCase().includes(q)),
      );
    }
    if (game) list = list.filter((g) => g.games.includes(game));
    if (style) list = list.filter((g) => g.gamingStyle === style);
    if (platform) list = list.filter((g) => g.platforms.includes(platform as SeedGroup["platforms"][number]));
    if (region) list = list.filter((g) => g.region === region);
    if (timezone) list = list.filter((g) => g.timezone === timezone);
    if (size) list = list.filter((g) => g.preferredSize === size);
    if (recruitment) list = list.filter((g) => g.recruitmentMode === recruitment);
    if (adultOnly) list = list.filter((g) => g.minAge >= 18);
    if (!includeApplications) list = list.filter((g) => g.recruitmentMode === "open");
    if (activeTag) {
      list = list.filter(
        (g) => g.tags.includes(activeTag) || g.games.includes(activeTag),
      );
    }

    list.sort((a, b) => {
      switch (sort) {
        case "active":
          return a.activity.includes("now") ? -1 : b.activity.includes("now") ? 1 : 0;
        case "largest":
          return b.memberCount - a.memberCount;
        case "smallest":
          return a.memberCount - b.memberCount;
        case "best":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [
    groups,
    query,
    game,
    style,
    platform,
    region,
    timezone,
    size,
    recruitment,
    sort,
    adultOnly,
    includeApplications,
    activeTag,
  ]);

  return (
    <div className="discover-layout">
      <div className="discover-primary">
        <section className="discover-hero motion-rise">
          <div className="discover-hero__copy">
            <h1 className="discover-hero__title">
              Find your <span className="brand-accent">people.</span>
            </h1>
            <p className="discover-hero__sub">
              Discover gaming groups and players that fit your vibe — recruitment-first, not another thin social feed.
            </p>
            <div className="discover-hero__cta">
              <button
                type="button"
                className="cta-btn cta-btn--primary cta-btn--lg"
                onClick={() => setTab("groups")}
              >
                Browse Groups →
              </button>
              <button
                type="button"
                className="cta-btn cta-btn--ghost cta-btn--lg"
                onClick={() => setTab("players")}
              >
                Find Players
              </button>
            </div>
          </div>
        </section>

        <div className="discover-tabs" role="tablist" aria-label="Discover views">
          {(
            [
              ["for-you", "For You"],
              ["groups", "Groups"],
              ["players", "Players"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`discover-tab ${tab === id ? "is-active" : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "for-you" ? (
          <TemporaryContext title="Personalized For You — Temporary Context">
            <p>
              Match scoring and preference-based recommendations need Auth + profile prefs in
              Supabase. Until then, use the <strong>Groups</strong> tab with seed data.
            </p>
          </TemporaryContext>
        ) : null}

        {tab === "players" ? (
          <div className="discover-stub-stack">
            <TemporaryContext title="Player directory — Temporary Context">
              <p>
                Player Discover and matching land after group recruitment. Demo player cards
                remain at vanity URLs like <Link href="/maya">/maya</Link>,{" "}
                <Link href="/kai">/kai</Link>, <Link href="/nova">/nova</Link>.
              </p>
            </TemporaryContext>
          </div>
        ) : null}

        {tab === "groups" || tab === "for-you" ? (
          <>
            <div className="discover-filters">
              <label className="discover-filter-search">
                <span className="visually-hidden">Filter groups</span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter by name, game, or tag…"
                />
              </label>

              <div className="discover-filter-row">
                <Select
                  label="Games"
                  value={game}
                  onChange={setGame}
                  options={FILTER_OPTIONS.games.map((g) => ({ value: g, label: g }))}
                />
                <Select
                  label="Gaming Style"
                  value={style}
                  onChange={setStyle}
                  options={FILTER_OPTIONS.styles.map((s) => ({ value: s, label: s }))}
                />
                <Select
                  label="Platform"
                  value={platform}
                  onChange={setPlatform}
                  options={FILTER_OPTIONS.platforms.map((p) => ({
                    value: p,
                    label: p.toUpperCase(),
                  }))}
                />
                <Select
                  label="Region"
                  value={region}
                  onChange={setRegion}
                  options={FILTER_OPTIONS.regions.map((r) => ({ value: r, label: r }))}
                />
                <Select
                  label="Time Zone"
                  value={timezone}
                  onChange={setTimezone}
                  options={FILTER_OPTIONS.timezones.map((t) => ({ value: t, label: t }))}
                />
                <Select
                  label="Group Size"
                  value={size}
                  onChange={(v) => setSize(v as PreferredSize | "")}
                  options={FILTER_OPTIONS.sizes.map((s) => ({
                    value: s,
                    label: s[0]!.toUpperCase() + s.slice(1),
                  }))}
                />
                <Select
                  label="Recruitment"
                  value={recruitment}
                  onChange={(v) => setRecruitment(v as RecruitmentMode | "")}
                  options={FILTER_OPTIONS.recruitment.map((r) => ({
                    value: r.value,
                    label: r.label,
                  }))}
                />
                <label className="discover-sort">
                  <span>Sort by</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value as SortId)}>
                    <option value="best">Best Match</option>
                    <option value="active">Most Active</option>
                    <option value="largest">Largest</option>
                    <option value="smallest">Smallest</option>
                  </select>
                </label>
              </div>
            </div>

            {tab === "groups" ? (
              <p className="discover-count">
                {filtered.length} group{filtered.length === 1 ? "" : "s"} · seed demo data
              </p>
            ) : (
              <p className="discover-count">
                Showing seed groups as a stand-in for ranked matches
              </p>
            )}

            {filtered.length === 0 ? (
              <p className="discover-empty">No groups match these filters. Clear a chip and try again.</p>
            ) : (
              <div className="group-grid">
                {filtered.map((group, i) => (
                  <GroupCard key={group.slug} group={group} index={i} />
                ))}
              </div>
            )}
          </>
        ) : null}

        <div className="discover-context-stack">
          <TemporaryContext title="Auth & Supabase — Temporary Context">
            <ul>
              <li>No Supabase keys required for this UI shell — seed JSON powers groups.</li>
              <li>
                Set <code>NEXT_PUBLIC_SUPABASE_URL</code> +{" "}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> later for Auth, RLS, and live data.
              </li>
              <li>Applications, matching scores, and adult attestation are deferred.</li>
            </ul>
          </TemporaryContext>
        </div>
      </div>

      <aside className="discover-rail" aria-label="Quick filters">
        <section className="discover-rail__card">
          <p className="section-label">Your profile</p>
          <div className="discover-rail__profile">
            <span className="discover-avatar discover-avatar--lg">JD</span>
            <div>
              <p className="discover-rail__name">jordan.dev</p>
              <p className="discover-rail__status">Looking for friends</p>
            </div>
          </div>
          <p className="section-label" style={{ marginTop: "0.75rem" }}>
            Your interests
          </p>
          <ul className="discover-rail__tags">
            {["PC", "FPS", "RPG"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <TemporaryContext title="Demo profile rail">
            <p>Signed-in prefs appear here after Auth. This block is placeholder chrome.</p>
          </TemporaryContext>
        </section>

        <section className="discover-rail__card">
          <p className="section-label">Quick filters</p>
          <label className="discover-toggle">
            <input
              type="checkbox"
              checked={adultOnly}
              onChange={(e) => setAdultOnly(e.target.checked)}
            />
            <span>18+ Only</span>
          </label>
          <label className="discover-toggle">
            <input type="checkbox" checked disabled readOnly />
            <span>English Only</span>
          </label>
          <label className="discover-toggle">
            <input
              type="checkbox"
              checked={includeApplications}
              onChange={(e) => setIncludeApplications(e.target.checked)}
            />
            <span>Include Applications</span>
          </label>
        </section>

        <section className="discover-rail__card">
          <p className="section-label">Popular tags</p>
          <ul className="discover-rail__tags discover-rail__tags--wrap">
            {POPULAR_TAGS.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className={activeTag === tag ? "is-active" : ""}
                  onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                >
                  {tag}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="discover-chip-select">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
