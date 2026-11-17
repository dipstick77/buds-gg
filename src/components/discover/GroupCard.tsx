import Link from "next/link";
import {
  platformLabel,
  recruitmentLabel,
  type SeedGroup,
} from "@/lib/groups";

export function GroupCard({ group, index = 0 }: { group: SeedGroup; index?: number }) {
  const delay = `delay-${Math.min((index % 3) + 1, 3)}`;

  return (
    <article className={`group-card motion-rise ${delay}`}>
      <div className={`group-card__banner group-card__banner--${group.bannerHue}`}>
        <span className="group-card__activity">{group.activity}</span>
        <div
          className="group-card__avatar"
          style={{ background: group.avatarColor }}
          aria-hidden
        >
          {group.avatarInitials}
        </div>
      </div>

      <div className="group-card__body">
        <div className="group-card__head">
          <div className="group-card__titles">
            <h3 className="group-card__name">
              <Link href={`/g/${group.slug}`}>{group.name}</Link>
            </h3>
            <p className="group-card__members">{group.memberCount} members</p>
          </div>
          <span
            className={`group-card__mode group-card__mode--${group.recruitmentMode}`}
          >
            {recruitmentLabel(group.recruitmentMode)}
          </span>
        </div>

        <p className="group-card__desc">{group.description}</p>

        <ul className="group-card__tags">
          {[...group.games.slice(0, 2), ...group.tags.slice(0, 2)].map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <div className="group-card__footer">
          <ul className="group-card__platforms" aria-label="Platforms">
            {group.platforms.map((p) => (
              <li key={p} title={platformLabel(p)}>
                {platformShort(p)}
              </li>
            ))}
          </ul>
          <Link href={`/g/${group.slug}`} className="group-card__cta">
            View Group →
          </Link>
        </div>
      </div>
    </article>
  );
}

function platformShort(platform: SeedGroup["platforms"][number]): string {
  switch (platform) {
    case "pc":
      return "PC";
    case "xbox":
      return "XB";
    case "psn":
      return "PS";
    case "nintendo":
      return "NS";
    case "discord":
      return "DC";
  }
}
