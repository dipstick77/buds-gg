"use client";

import { useState } from "react";
import { AppShell } from "@/components/shell/AppShell";
import { DiscoverView } from "@/components/discover/DiscoverView";
import type { SeedGroup } from "@/lib/groups";

type TabId = "for-you" | "groups" | "players";

export function DiscoverPageClient({
  groups,
  initialTab = "for-you",
}: {
  groups: SeedGroup[];
  initialTab?: TabId;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <AppShell searchValue={searchQuery} onSearchChange={setSearchQuery}>
      <DiscoverView
        groups={groups}
        initialTab={initialTab}
        searchQuery={searchQuery}
      />
    </AppShell>
  );
}
