"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronDown, Gamepad2 } from "lucide-react";
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
  initialTab = "for-you",
  searchQuery = "",
}: {
  groups: SeedGroup[];
  initialTab?: TabId;
  searchQuery?: string;
}) {
  const [tab, setTab] = useState<TabId>(initialTab);
  const [game, setGame] = useState("");
  const [style, setStyle] = useState("");
  const [age, setAge] = useState("");
  const [platform, setPlatform] = useState("");
  const [region, setRegion] = useState("");
  const [timezone, setTimezone] = useState("");
  const [size, setSize] = useState<PreferredSize | "">("");
  const [recruitment, setRecruitment] = useState<RecruitmentMode | "">("");
  const [sort, setSort] = useState<SortId>("best");
  const [adultOnly, setAdultOnly] = useState(true);
  const [englishOnly, setEnglishOnly] = useState(true);
  const [includeApplications, setIncludeApplications] = useState(true);
  const [activeTag, setActiveTag] = useState("");

  const effectiveQuery = searchQuery;

  const filtered = useMemo(() => {
    let list = [...groups];
    const q = effectiveQuery.trim().toLowerCase();

    if (q) {
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
    if (adultOnly || age === "18+") list = list.filter((g) => g.minAge >= 18);
    if (age === "21+") list = list.filter((g) => g.minAge >= 21);
    if (!includeApplications) list = list.filter((g) => g.recruitmentMode === "open");
    if (activeTag) {
      list = list.filter(
        (g) => g.tags.includes(activeTag) || g.games.includes(activeTag),
      );
    }
    // englishOnly is UI chrome for Phase A — seed groups are all EN
    void englishOnly;

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
    effectiveQuery,
    game,
    style,
    age,
    platform,
    region,
    timezone,
    size,
    recruitment,
    sort,
    adultOnly,
    englishOnly,
    includeApplications,
    activeTag,
  ]);

  return (
    <div className="d-layout">
      <div className="d-primary">
        <section className="d-hero motion-rise">
          <div className="d-hero__copy">
            <h1 className="d-hero__title">
              Find your <span>people.</span>
            </h1>
            <p className="d-hero__sub">
              Discover gaming groups and players that fit your vibe.
            </p>
            <div className="d-hero__cta">
              <button
                type="button"
                className="d-btn d-btn--primary"
                onClick={() => setTab("groups")}
              >
                Browse Groups →
              </button>
              <button
                type="button"
                className="d-btn d-btn--outline"
                onClick={() => setTab("players")}
              >
                Find Players
              </button>
            </div>
          </div>
          <div className="d-hero__art" aria-hidden>
            <Gamepad2 size={64} strokeWidth={1.25} />
          </div>
        </section>

        <div className="d-tabs" role="tablist" aria-label="Discover views">
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
              className={`d-tab ${tab === id ? "is-active" : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "players" ? (
          <TemporaryContext title="Player directory — Temporary Context">
            <p>
              Player Discover lands after group recruitment. Demo profiles:{" "}
              <Link href="/maya">/maya</Link>, <Link href="/kai">/kai</Link>,{" "}
              <Link href="/nova">/nova</Link>.
            </p>
          </TemporaryContext>
        ) : null}

        {tab === "groups" || tab === "for-you" ? (
          <>
            {tab === "for-you" ? (
              <TemporaryContext title="Personalized For You — Temporary Context">
                <p>
                  Match scoring needs Auth + profile prefs. Until then, seed groups stand in
                  for ranked recommendations.
                </p>
              </TemporaryContext>
            ) : null}

            <div className="d-filters">
              <div className="d-filter-row">
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
                  label="Age"
                  value={age}
                  onChange={setAge}
                  options={[
                    { value: "18+", label: "18+" },
                    { value: "21+", label: "21+" },
                  ]}
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
                  label="More Filters"
                  value={recruitment}
                  onChange={(v) => setRecruitment(v as RecruitmentMode | "")}
                  options={FILTER_OPTIONS.recruitment.map((r) => ({
                    value: r.value,
                    label: r.label,
                  }))}
                />
                <label className="d-sort">
                  <span>Sort by</span>
                  <select value={sort} onChange={(e) => setSort(e.target.value as SortId)}>
                    <option value="best">Best Match</option>
                    <option value="active">Most Active</option>
                    <option value="largest">Largest</option>
                    <option value="smallest">Smallest</option>
                  </select>
                  <ChevronDown size={14} aria-hidden />
                </label>
              </div>
            </div>

            <p className="d-count">
              {tab === "groups"
                ? `${filtered.length} group${filtered.length === 1 ? "" : "s"} · seed demo data`
                : `Showing ${filtered.length} seed groups as ranked stand-ins`}
            </p>

            {filtered.length === 0 ? (
              <p className="d-empty">No groups match these filters. Clear a chip and try again.</p>
            ) : (
              <div className="d-grid">
                {filtered.map((group, i) => (
                  <GroupCard key={group.slug} group={group} index={i} />
                ))}
              </div>
            )}
          </>
        ) : null}

        <div className="d-context">
          <TemporaryContext title="Auth & Supabase — Temporary Context">
            <ul>
              <li>No Supabase keys required — seed JSON powers this shell.</li>
              <li>
                Set <code>NEXT_PUBLIC_SUPABASE_URL</code> +{" "}
                <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> later for Auth and live data.
              </li>
            </ul>
          </TemporaryContext>
        </div>
      </div>

      <aside className="d-rail" aria-label="Profile and quick filters">
        <section className="d-rail__card">
          <p className="d-rail__label">Your Profile</p>
          <div className="d-rail__profile">
            <span className="d-avatar d-avatar--lg">
              JD
              <span className="d-avatar__status" aria-hidden />
            </span>
            <div>
              <p className="d-rail__name">jordan.dev</p>
              <p className="d-rail__status">Looking for friends</p>
            </div>
          </div>
          <p className="d-rail__label">Your interests</p>
          <ul className="d-tags">
            {["PC", "FPS", "RPG"].map((t) => (
              <li key={t}>{t}</li>
            ))}
            <li>+3</li>
          </ul>
        </section>

        <section className="d-rail__card">
          <p className="d-rail__label">Quick Filters</p>
          <label className="d-toggle">
            <span>18+ Only</span>
            <input
              type="checkbox"
              checked={adultOnly}
              onChange={(e) => setAdultOnly(e.target.checked)}
            />
          </label>
          <label className="d-toggle">
            <span>English Only</span>
            <input
              type="checkbox"
              checked={englishOnly}
              onChange={(e) => setEnglishOnly(e.target.checked)}
            />
          </label>
          <label className="d-toggle">
            <span>Include Applications</span>
            <input
              type="checkbox"
              checked={includeApplications}
              onChange={(e) => setIncludeApplications(e.target.checked)}
            />
          </label>
        </section>

        <section className="d-rail__card">
          <p className="d-rail__label">Popular Tags</p>
          <ul className="d-tags">
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
    <label className="d-chip">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Any</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown size={12} aria-hidden />
    </label>
  );
}
