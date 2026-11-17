import { DiscoverView } from "@/components/discover/DiscoverView";
import { AppShell } from "@/components/shell/AppShell";
import { listGroups } from "@/lib/groups";

export default function HomePage() {
  const groups = listGroups();
  return (
    <AppShell>
      <DiscoverView groups={groups} initialTab="groups" />
    </AppShell>
  );
}
