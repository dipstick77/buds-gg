import Link from "next/link";
import { getPlatform } from "@/lib/platforms";
import type { PublicProfilePayload } from "@/lib/types";
import { CopyButton } from "@/components/ui/CopyButton";
import { TemporaryContext } from "@/components/ui/TemporaryContext";

export function ProfileView({
  data,
  showBrandFooter = true,
}: {
  data: PublicProfilePayload;
  showBrandFooter?: boolean;
}) {
  const { profile, platforms, games } = data;
  const primary = platforms.slice(0, 3);
  const rest = platforms.slice(3);
  const initial = (profile.display_name || profile.handle).slice(0, 1).toUpperCase();

  return (
    <div className={`theme-${profile.theme} profile-shell`}>
      <article className="profile-panel">
        <div className="profile-banner" aria-hidden />
        <header className="profile-head motion-rise">
          <div className="profile-avatar" aria-hidden>
            {profile.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="" width={72} height={72} />
            ) : (
              <span>{initial}</span>
            )}
          </div>
          <div className="profile-identity">
            <p className="profile-handle">buds.gg/{profile.handle}</p>
            <h1 className="profile-name">{profile.display_name || profile.handle}</h1>
          </div>
        </header>

        <div className="profile-body">
          {profile.bio ? <p className="profile-bio">{profile.bio}</p> : null}
          {profile.looking_for_bud ? (
            <p className="looking-badge">
              Looking for a bud
              {profile.looking_for_game ? ` · ${profile.looking_for_game}` : ""}
              {profile.looking_for_vibe ? ` — ${profile.looking_for_vibe}` : ""}
            </p>
          ) : null}

          <section className="profile-section motion-rise delay-1" aria-label="Add me">
            <h2 className="section-label">Add me</h2>
            <ul className="platform-list">
              {primary.map((p) => {
                const meta = getPlatform(p.platform);
                const openUrl = p.url || null;
                const title = p.label || meta.name;
                return (
                  <li key={p.id} className="platform-row">
                    <div className="platform-meta">
                      <span className="platform-name">{title}</span>
                      <span className="platform-value">{p.value}</span>
                    </div>
                    <div className="platform-actions">
                      {meta.primaryCta === "open" && openUrl ? (
                        <a
                          className="cta-btn cta-btn--primary cta-btn--sm"
                          href={openUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open
                        </a>
                      ) : (
                        <CopyButton
                          value={p.value}
                          label="Copy"
                          hint="Copied"
                          className="cta-btn--sm"
                        />
                      )}
                      {meta.primaryCta === "open" ? (
                        <CopyButton
                          value={p.value}
                          label="Copy"
                          className="cta-btn--ghost cta-btn--sm"
                        />
                      ) : openUrl ? (
                        <a
                          className="cta-btn cta-btn--ghost cta-btn--sm"
                          href={openUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open
                        </a>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {games.length > 0 ? (
            <section
              className="profile-section motion-rise delay-2"
              aria-label="Favorite games"
            >
              <h2 className="section-label">Favorites</h2>
              <ul className="games-strip">
                {games.map((g) => (
                  <li key={g.id} className="game-chip">
                    {g.game_name}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {rest.length > 0 ? (
            <section
              className="profile-section motion-rise delay-2"
              aria-label="More platforms"
            >
              <h2 className="section-label">More</h2>
              <ul className="platform-list">
                {rest.map((p) => {
                  const meta = getPlatform(p.platform);
                  const openUrl = p.url || null;
                  return (
                    <li key={p.id} className="platform-row">
                      <div className="platform-meta">
                        <span className="platform-name">{p.label || meta.name}</span>
                        <span className="platform-value">{p.value}</span>
                      </div>
                      <div className="platform-actions">
                        <CopyButton
                          value={p.value}
                          label="Copy"
                          className="cta-btn--ghost cta-btn--sm"
                        />
                        {openUrl ? (
                          <a
                            className="cta-btn cta-btn--ghost cta-btn--sm"
                            href={openUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open
                          </a>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ) : null}

          <div className="motion-rise delay-3">
            <TemporaryContext title="Coming later — not in this MVP">
              <p>
                Live Discord presence and Steam inventory sync are deferred. Manual
                Copy / Open links above are the product for now.
              </p>
            </TemporaryContext>
          </div>

          {showBrandFooter ? (
            <footer className="profile-footer">
              <Link href="/">
                Make yours — buds<span className="brand-accent">.gg</span>
              </Link>
            </footer>
          ) : null}
        </div>
      </article>
    </div>
  );
}
