import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProfileView } from "@/components/profile/ProfileView";
import { getPublicProfile } from "@/lib/db";
import { RESERVED_HANDLES, normalizeHandle } from "@/lib/reserved";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ handle: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const data = getPublicProfile(handle);
  if (!data) {
    return { title: "Not found" };
  }
  const title = `${data.profile.display_name} (@${data.profile.handle})`;
  const description =
    data.profile.bio ||
    `Add ${data.profile.display_name} on Steam, Discord, and more — buds.gg/${data.profile.handle}`;
  return {
    title,
    description,
    openGraph: {
      title: `${title} · buds.gg`,
      description,
      type: "profile",
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { handle: raw } = await params;
  const handle = normalizeHandle(raw);

  if (RESERVED_HANDLES.has(handle)) {
    notFound();
  }

  const data = getPublicProfile(handle);
  if (!data) {
    return (
      <div className="not-found">
        <p className="brand-mark">buds.gg</p>
        <h1>No bud here yet</h1>
        <p style={{ color: "var(--muted)" }}>
          <code>/{handle}</code> isn’t claimed (or isn’t public).
        </p>
        <Link href="/login" className="cta-btn cta-btn--primary">
          Claim this handle
        </Link>
        <Link href="/" className="nav-link">
          Back home
        </Link>
      </div>
    );
  }

  return <ProfileView data={data} />;
}
