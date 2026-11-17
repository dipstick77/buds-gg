import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { TemporaryContext } from "@/components/ui/TemporaryContext";
import {
  platformLabel,
  recruitmentLabel,
  sizeLabel,
  type SeedGroup,
} from "@/lib/groups";
import { sanitizeExternalUrl } from "@/lib/urls";

export function GroupProfile({ group }: { group: SeedGroup }) {
  return (
    <AppShell searchPlaceholder={`Search within ${group.name}…`}>
      <article className="group-profile motion-rise">
        <div className={`group-profile__banner group-card__banner--${group.bannerHue}`}>
          <div className="group-profile__banner-inner">
            <Link href="/" className="group-profile__back">
              ← Discover
            </Link>
          </div>
        </div>

        <div className="group-profile__head">
          <div
            className="group-profile__avatar"
            style={{ background: group.avatarColor }}
            aria-hidden
          >
            {group.avatarInitials}
          </div>
          <div className="group-profile__identity">
            <p className="group-profile__slug">/g/{group.slug}</p>
            <h1 className="group-profile__name">{group.name}</h1>
            <p className="group-profile__meta">
              {group.memberCount} members · {group.region} · {group.timezone} · min age{" "}
              {group.minAge}+
            </p>
          </div>
          <span className={`group-card__mode group-card__mode--${group.recruitmentMode}`}>
            {recruitmentLabel(group.recruitmentMode)}
          </span>
        </div>

        <div className="group-profile__grid">
          <div className="group-profile__main">
            <section className="group-profile__panel">
              <h2 className="section-label">About</h2>
              <p>{group.description}</p>
            </section>

            <section className="group-profile__panel">
              <h2 className="section-label">Games & vibe</h2>
              <ul className="group-card__tags">
                {group.games.map((g) => (
                  <li key={g}>{g}</li>
                ))}
                {group.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
                <li>{group.gamingStyle}</li>
                <li>{sizeLabel(group.preferredSize)}</li>
              </ul>
            </section>

            <section className="group-profile__panel">
              <h2 className="section-label">Schedule</h2>
              <p>{group.schedule}</p>
            </section>

            <section className="group-profile__panel">
              <h2 className="section-label">Rules</h2>
              <p>{group.rules}</p>
            </section>

            <TemporaryContext title="Applications & join — Temporary Context">
              <ul>
                <li>
                  <strong>Open</strong> join, application questions, and invite-only enforcement
                  need Supabase Auth + group memberships.
                </li>
                <li>Matching score vs your prefs is deferred (deterministic scorer later).</li>
                <li>Discord invite below is a demo link placeholder.</li>
              </ul>
            </TemporaryContext>
          </div>

          <aside className="group-profile__aside">
            <section className="group-profile__panel">
              <h2 className="section-label">Recruitment</h2>
              <p className="group-profile__recruit">
                {group.recruitmentMode === "open" && "Anyone can join when live Auth ships."}
                {group.recruitmentMode === "applications" &&
                  "Owners review applications — UI only for now."}
                {group.recruitmentMode === "invite_only" &&
                  "Cold applies will be rejected server-side later."}
              </p>
              <button type="button" className="cta-btn cta-btn--primary cta-btn--block" disabled>
                {group.recruitmentMode === "open"
                  ? "Join group"
                  : group.recruitmentMode === "applications"
                    ? "Apply to join"
                    : "Invite only"}
              </button>
              {sanitizeExternalUrl(group.discordInvite) ? (
                <a
                  href={sanitizeExternalUrl(group.discordInvite)!}
                  className="cta-btn cta-btn--ghost cta-btn--block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open Discord
                </a>
              ) : null}
            </section>

            <section className="group-profile__panel">
              <h2 className="section-label">Platforms</h2>
              <ul className="group-profile__platforms">
                {group.platforms.map((p) => (
                  <li key={p}>{platformLabel(p)}</li>
                ))}
              </ul>
            </section>

            <p className="group-profile__activity">{group.activity}</p>
          </aside>
        </div>
      </article>
    </AppShell>
  );
}
