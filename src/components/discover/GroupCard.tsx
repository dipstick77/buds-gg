import Link from "next/link";
import { ArrowRight, Gamepad2, Monitor, Smartphone } from "lucide-react";
import {
  platformLabel,
  recruitmentLabel,
  type SeedGroup,
} from "@/lib/groups";

export function GroupCard({ group, index = 0 }: { group: SeedGroup; index?: number }) {
  const delay = `delay-${Math.min((index % 3) + 1, 3)}`;
  const visibleTags = [...group.games.slice(0, 2), ...group.tags.slice(0, 2)];
  const extra =
    group.games.length + group.tags.length - visibleTags.length;

  return (
    <article className={`d-card motion-rise ${delay}`}>
      <div className={`d-card__banner d-card__banner--${group.bannerHue}`}>
        <span className="d-card__activity">{group.activity}</span>
        <div
          className="d-card__avatar"
          style={{ background: group.avatarColor }}
          aria-hidden
        >
          {group.avatarInitials}
        </div>
      </div>

      <div className="d-card__body">
        <div className="d-card__head">
          <div>
            <h3 className="d-card__name">
              <Link href={`/g/${group.slug}`}>{group.name}</Link>
            </h3>
            <p className="d-card__members">{group.memberCount} members</p>
          </div>
          <span className={`d-badge d-badge--${group.recruitmentMode}`}>
            {recruitmentLabel(group.recruitmentMode)}
          </span>
        </div>

        <p className="d-card__desc">{group.description}</p>

        <ul className="d-tags">
          {visibleTags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
          {extra > 0 ? <li>+{extra}</li> : null}
        </ul>

        <div className="d-card__footer">
          <ul className="d-platforms" aria-label="Platforms">
            {group.platforms.map((p) => (
              <li key={p} title={platformLabel(p)}>
                <PlatformIcon platform={p} />
              </li>
            ))}
          </ul>
          <Link href={`/g/${group.slug}`} className="d-card__cta">
            View Group <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}

function PlatformIcon({ platform }: { platform: SeedGroup["platforms"][number] }) {
  switch (platform) {
    case "pc":
      return <Monitor size={13} aria-hidden />;
    case "xbox":
    case "psn":
    case "nintendo":
      return <Gamepad2 size={13} aria-hidden />;
    case "discord":
      return <Smartphone size={13} aria-hidden />;
    default:
      return <Gamepad2 size={13} aria-hidden />;
  }
}
