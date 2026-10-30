"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PLATFORMS } from "@/lib/platforms";
import { THEMES } from "@/lib/themes";
import type {
  PlatformId,
  PublicProfilePayload,
  ThemeId,
} from "@/lib/types";
import { TemporaryContext } from "@/components/ui/TemporaryContext";

type PlatformDraft = {
  key: string;
  platform: PlatformId;
  label: string;
  value: string;
  url: string;
};

type GameDraft = {
  key: string;
  game_name: string;
  image_url: string;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export function EditForm({
  initial,
  needsClaim,
}: {
  initial: PublicProfilePayload | null;
  needsClaim: boolean;
}) {
  const [handle, setHandle] = useState(initial?.profile.handle ?? "");
  const [displayName, setDisplayName] = useState(
    initial?.profile.display_name ?? "",
  );
  const [bio, setBio] = useState(initial?.profile.bio ?? "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.profile.avatar_url ?? "");
  const [theme, setTheme] = useState<ThemeId>(
    initial?.profile.theme ?? "midnight",
  );
  const [lookingForBud, setLookingForBud] = useState(
    Boolean(initial?.profile.looking_for_bud),
  );
  const [lookingGame, setLookingGame] = useState(
    initial?.profile.looking_for_game ?? "",
  );
  const [lookingVibe, setLookingVibe] = useState(
    initial?.profile.looking_for_vibe ?? "",
  );
  const [platforms, setPlatforms] = useState<PlatformDraft[]>(
    () =>
      initial?.platforms.map((p) => ({
        key: p.id,
        platform: p.platform,
        label: p.label,
        value: p.value,
        url: p.url,
      })) ?? [
        { key: uid(), platform: "discord", label: "", value: "", url: "" },
        { key: uid(), platform: "steam", label: "", value: "", url: "" },
      ],
  );
  const [games, setGames] = useState<GameDraft[]>(
    () =>
      initial?.games.map((g) => ({
        key: g.id,
        game_name: g.game_name,
        image_url: g.image_url,
      })) ?? [{ key: uid(), game_name: "", image_url: "" }],
  );
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [claimed, setClaimed] = useState(!needsClaim);
  const [busy, setBusy] = useState(false);

  const publicPath = useMemo(
    () => (handle ? `/${handle.toLowerCase()}` : null),
    [handle],
  );

  async function claim() {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/profile/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Claim failed");
      setClaimed(true);
      setDisplayName(data.profile.profile.display_name);
      setStatus(`Claimed buds.gg/${data.profile.profile.handle}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Claim failed");
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          handle,
          display_name: displayName,
          bio,
          avatar_url: avatarUrl,
          theme,
          looking_for_bud: lookingForBud,
          looking_for_game: lookingGame,
          looking_for_vibe: lookingVibe,
          is_public: true,
          platforms: platforms.map((p, i) => ({
            platform: p.platform,
            label: p.label,
            value: p.value,
            url: p.url,
            sort_order: i,
          })),
          games: games.map((g, i) => ({
            game_name: g.game_name,
            image_url: g.image_url,
            sort_order: i,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setHandle(data.profile.profile.handle);
      setStatus("Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="edit-shell">
      <header className="edit-mobile-bar">
        <Link href="/" className="brand-mark">
          buds<span className="brand-accent">.gg</span>
        </Link>
        <div style={{ display: "flex", gap: "0.25rem" }}>
          {publicPath && claimed ? (
            <Link href={publicPath} className="nav-link">
              View
            </Link>
          ) : null}
          <Link href="/api/auth/logout" className="nav-link">
            Log out
          </Link>
        </div>
      </header>

      <aside className="edit-sidebar">
        <Link href="/" className="brand-mark">
          buds<span className="brand-accent">.gg</span>
        </Link>
        <nav className="edit-sidebar__nav" aria-label="Settings">
          <span className="edit-nav-item is-active">User Settings</span>
          <span className="edit-nav-item">Profile</span>
          <span className="edit-nav-item">Platforms</span>
          <span className="edit-nav-item">Games</span>
          <span className="edit-nav-item">Theme</span>
        </nav>
        <div className="edit-sidebar__footer">
          {publicPath && claimed ? (
            <Link href={publicPath} className="nav-link">
              View public page
            </Link>
          ) : null}
          <Link href="/api/auth/logout" className="nav-link">
            Log out
          </Link>
        </div>
      </aside>

      <main className="edit-main">
        <h1 className="edit-title">Edit your card</h1>
        <p className="edit-sub">
          Explicit Save for MVP. Public page at{" "}
          <code>buds.gg/{"{handle}"}</code>.
        </p>

        {!claimed ? (
          <section className="edit-panel">
            <h2>Claim handle</h2>
            <label className="field">
              <span>Handle</span>
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="maya"
                autoCapitalize="off"
                autoCorrect="off"
              />
            </label>
            <button
              type="button"
              className="cta-btn cta-btn--primary"
              disabled={busy || !handle}
              onClick={claim}
            >
              Claim buds.gg/{handle || "…"}
            </button>
          </section>
        ) : (
          <>
            <section className="edit-panel">
              <h2>Profile</h2>
              <label className="field">
                <span>Handle</span>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  autoCapitalize="off"
                />
              </label>
              <label className="field">
                <span>Display name</span>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </label>
              <label className="field">
                <span>Bio</span>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={240}
                />
              </label>
              <label className="field">
                <span>Avatar URL</span>
                <input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://…"
                />
              </label>
            </section>

            <section className="edit-panel">
              <h2>Theme</h2>
              <div className="theme-picker">
                {THEMES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className={`theme-option ${theme === t.id ? "is-active" : ""}`}
                    onClick={() => setTheme(t.id)}
                  >
                    <strong>{t.name}</strong>
                    <span>{t.blurb}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="edit-panel">
              <h2>Platforms</h2>
              <p className="field-hint">Top 3 show as primary CTAs on the public page.</p>
              {platforms.map((p, index) => (
                <div key={p.key} className="platform-editor">
                  <select
                    value={p.platform}
                    onChange={(e) => {
                      const next = [...platforms];
                      next[index] = {
                        ...p,
                        platform: e.target.value as PlatformId,
                      };
                      setPlatforms(next);
                    }}
                  >
                    {PLATFORMS.map((meta) => (
                      <option key={meta.id} value={meta.id}>
                        {meta.name}
                      </option>
                    ))}
                  </select>
                  <input
                    placeholder="ID / tag / URL"
                    value={p.value}
                    onChange={(e) => {
                      const next = [...platforms];
                      next[index] = { ...p, value: e.target.value };
                      setPlatforms(next);
                    }}
                  />
                  <input
                    placeholder="Optional label"
                    value={p.label}
                    onChange={(e) => {
                      const next = [...platforms];
                      next[index] = { ...p, label: e.target.value };
                      setPlatforms(next);
                    }}
                  />
                  <button
                    type="button"
                    className="cta-btn cta-btn--ghost"
                    onClick={() =>
                      setPlatforms(platforms.filter((x) => x.key !== p.key))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="cta-btn cta-btn--ghost"
                onClick={() =>
                  setPlatforms([
                    ...platforms,
                    {
                      key: uid(),
                      platform: "custom",
                      label: "",
                      value: "",
                      url: "",
                    },
                  ])
                }
              >
                Add platform
              </button>
            </section>

            <section className="edit-panel">
              <h2>Favorite games</h2>
              {games.map((g, index) => (
                <div key={g.key} className="game-editor">
                  <input
                    placeholder="Game name"
                    value={g.game_name}
                    onChange={(e) => {
                      const next = [...games];
                      next[index] = { ...g, game_name: e.target.value };
                      setGames(next);
                    }}
                  />
                  <button
                    type="button"
                    className="cta-btn cta-btn--ghost"
                    onClick={() =>
                      setGames(games.filter((x) => x.key !== g.key))
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="cta-btn cta-btn--ghost"
                onClick={() =>
                  setGames([
                    ...games,
                    { key: uid(), game_name: "", image_url: "" },
                  ])
                }
              >
                Add game
              </button>
            </section>

            <section className="edit-panel">
              <h2>Looking for a bud</h2>
              <label className="check-field">
                <input
                  type="checkbox"
                  checked={lookingForBud}
                  onChange={(e) => setLookingForBud(e.target.checked)}
                />
                <span>Show “looking for a bud” on my public page</span>
              </label>
              {lookingForBud ? (
                <>
                  <label className="field">
                    <span>Game</span>
                    <input
                      value={lookingGame}
                      onChange={(e) => setLookingGame(e.target.value)}
                    />
                  </label>
                  <label className="field">
                    <span>Vibe one-liner</span>
                    <input
                      value={lookingVibe}
                      onChange={(e) => setLookingVibe(e.target.value)}
                    />
                  </label>
                </>
              ) : null}
            </section>

            <TemporaryContext title="Showcase / inventory / presence">
              <p>
                Featured skins, Steam inventory sync, and live Discord status are
                stubbed for later phases. Your manual platforms and games are what
                ship in this MVP.
              </p>
            </TemporaryContext>

            <div className="edit-save-bar">
              <button
                type="button"
                className="cta-btn cta-btn--primary cta-btn--lg"
                disabled={busy}
                onClick={save}
              >
                {busy ? "Saving…" : "Save profile"}
              </button>
              {publicPath ? (
                <Link href={publicPath} className="cta-btn cta-btn--ghost cta-btn--lg">
                  Preview
                </Link>
              ) : null}
            </div>
          </>
        )}

        {error ? <p className="form-error">{error}</p> : null}
        {status ? <p className="form-status">{status}</p> : null}
      </main>
    </div>
  );
}
