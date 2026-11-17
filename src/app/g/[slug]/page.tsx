import type { Metadata } from "next";
import Link from "next/link";
import { GroupProfile } from "@/components/group/GroupProfile";
import { getGroupBySlug, listGroups } from "@/lib/groups";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return listGroups().map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const group = getGroupBySlug(slug);
  if (!group) return { title: "Group not found" };
  return {
    title: group.name,
    description: group.description,
    openGraph: {
      title: `${group.name} · buds.gg`,
      description: group.description,
      type: "website",
    },
  };
}

export default async function GroupPage({ params }: Props) {
  const { slug } = await params;
  const group = getGroupBySlug(slug);
  if (!group) {
    return (
      <div className="not-found">
        <p className="brand-mark">
          buds<span className="brand-accent">.gg</span>
        </p>
        <h1>No group here</h1>
        <p style={{ color: "var(--muted)" }}>
          <code>/g/{slug}</code> isn’t in the seed catalog yet.
        </p>
        <Link href="/" className="cta-btn cta-btn--primary">
          Back to Discover
        </Link>
      </div>
    );
  }

  return <GroupProfile group={group} />;
}
