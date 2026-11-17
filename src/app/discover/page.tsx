import { DiscoverView } from "@/components/discover/DiscoverView";
import { AppShell } from "@/components/shell/AppShell";
import { listGroups } from "@/lib/groups";

type Props = {
  searchParams: Promise<{ tab?: string }>;
};

export default async function DiscoverPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const initialTab =
    tab === "players" ? "players" : tab === "for-you" ? "for-you" : "groups";
  const groups = listGroups();

  return (
    <AppShell>
      <DiscoverView groups={groups} initialTab={initialTab} />
    </AppShell>
  );
}
