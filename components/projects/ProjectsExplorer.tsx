"use client";

import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, type Variants } from "framer-motion";
import { ArrowDownAZ, Clock, FolderSearch, Search, Star } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALL_LANGUAGES, useRepoFilters } from "@/hooks/use-repo-filters";
import { getLanguageColor } from "@/lib/language-colors";
import { cn } from "@/lib/utils";
import type { RepoSortKey, Repository } from "@/types/github";

const PAGE_SIZE = 9;

const sortOptions: { key: RepoSortKey; label: string; icon: typeof Star }[] = [
  { key: "stars", label: "Bintang", icon: Star },
  { key: "updated", label: "Terbaru", icon: Clock },
  { key: "name", label: "Nama", icon: ArrowDownAZ },
];

const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export function ProjectsExplorer({ repos, now }: { repos: Repository[]; now: number }) {
  const { sort, setSort, language, setLanguage, query, setQuery, languages, visible } =
    useRepoFilters(repos);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const shown = visible.slice(0, limit);

  return (
    <div className="flex flex-col gap-6">
      {/* ---------- Toolbar ---------- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(PAGE_SIZE);
            }}
            placeholder="Cari repositori…"
            aria-label="Cari repositori"
            className="pl-9"
          />
        </div>

        <div role="radiogroup" aria-label="Urutkan" className="glass inline-flex self-start rounded-lg p-1">
          {sortOptions.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              role="radio"
              aria-checked={sort === key}
              onClick={() => setSort(key)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                sort === key ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {sort === key && (
                <motion.span
                  layoutId="sort-pill"
                  className="absolute inset-0 rounded-md bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <Icon aria-hidden className="relative size-3.5" />
              <span className="relative">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Filter bahasa ---------- */}
      <div
        role="radiogroup"
        aria-label="Filter bahasa pemrograman"
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
      >
        {languages.map(({ name, count }) => {
          const active = language === name;
          const color = getLanguageColor(name);
          return (
            <button
              key={name}
              role="radio"
              aria-checked={active}
              onClick={() => {
                setLanguage(name);
                setLimit(PAGE_SIZE);
              }}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all",
                active
                  ? "border-primary/60 bg-primary/10 text-foreground shadow-[0_0_14px_-4px_var(--neon-cyan)]"
                  : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              )}
            >
              {name !== ALL_LANGUAGES && (
                <span aria-hidden className="size-2 rounded-full" style={{ background: color }} />
              )}
              {name}
              <span className="text-muted-foreground">{count}</span>
            </button>
          );
        })}
      </div>

      {/* ---------- Grid ---------- */}
      <p className="sr-only" aria-live="polite">
        Menampilkan {shown.length} dari {visible.length} repositori.
      </p>

      {visible.length === 0 ? (
        <div className="glass flex flex-col items-center gap-3 rounded-xl py-16 text-center text-muted-foreground">
          <FolderSearch aria-hidden className="size-8" />
          <p>Tidak ada repositori yang cocok dengan filter ini.</p>
        </div>
      ) : (
        <LayoutGroup>
          <motion.div
            variants={grid}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {shown.map((repo) => (
                <ProjectCard key={repo.id} repo={repo} now={now} />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      )}

      {visible.length > limit && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
            Tampilkan lebih banyak ({visible.length - limit})
          </Button>
        </div>
      )}
    </div>
  );
}
