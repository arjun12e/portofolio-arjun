"use client";

import { useDeferredValue, useMemo, useState } from "react";
import type { RepoSortKey, Repository } from "@/types/github";

export const ALL_LANGUAGES = "Semua";

const sorters: Record<RepoSortKey, (a: Repository, b: Repository) => number> = {
  stars: (a, b) => b.stars - a.stars || b.forks - a.forks,
  updated: (a, b) => Date.parse(b.pushedAt) - Date.parse(a.pushedAt),
  name: (a, b) => a.name.localeCompare(b.name),
};

/** State filter/sort/pencarian repositori — murni client, tanpa request ulang. */
export function useRepoFilters(repos: Repository[]) {
  const [sort, setSort] = useState<RepoSortKey>("stars");
  const [language, setLanguage] = useState<string>(ALL_LANGUAGES);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // Bahasa diurutkan menurut jumlah repo agar yang dominan tampil lebih dulu.
  const languages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of repos) if (r.language) counts.set(r.language, (counts.get(r.language) ?? 0) + 1);
    return [
      { name: ALL_LANGUAGES, count: repos.length },
      ...[...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
    ];
  }, [repos]);

  const visible = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return repos
      .filter((r) => language === ALL_LANGUAGES || r.language === language)
      .filter(
        (r) =>
          !q ||
          r.name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.topics.some((t) => t.includes(q))
      )
      .sort(sorters[sort]);
  }, [repos, language, deferredQuery, sort]);

  return { sort, setSort, language, setLanguage, query, setQuery, languages, visible };
}
