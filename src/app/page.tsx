import { DiscoverPageClient } from "@/components/discover/DiscoverPageClient";
import { listGroups } from "@/lib/groups";

export default function HomePage() {
  const groups = listGroups();
  return <DiscoverPageClient groups={groups} initialTab="for-you" />;
}
