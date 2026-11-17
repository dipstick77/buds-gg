import { DiscoverPageClient } from "@/components/discover/DiscoverPageClient";
import { listGroups } from "@/lib/groups";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function DiscoverPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const initialTab =
    tab === "players" ? "players" : tab === "groups" ? "groups" : "for-you";
  const groups = listGroups();

  return <DiscoverPageClient groups={groups} initialTab={initialTab} />;
}
