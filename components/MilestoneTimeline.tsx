"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Milestone } from "@/lib/types";
import { cn } from "@/lib/utils";

const ALL = "Semua";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MilestoneTimeline({
  milestones,
}: {
  milestones: Milestone[];
}) {
  const [active, setActive] = useState(ALL);

  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(milestones.map((m) => m.category)))],
    [milestones]
  );

  const filtered =
    active === ALL
      ? milestones
      : milestones.filter((m) => m.category === active);

  if (milestones.length === 0) {
    return (
      <div className="glass rounded-xl py-12 text-center text-muted-foreground">
        Belum ada milestone yang dipublikasikan.
      </div>
    );
  }

  return (
    <>
      {/* FR-PUB-02: filter kategori */}
      <div className="mb-8 flex flex-wrap gap-2" role="radiogroup" aria-label="Filter kategori">
        {categories.map((cat) => (
          <button
            key={cat}
            role="radio"
            aria-checked={active === cat}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-all",
              active === cat
                ? "border-primary/60 bg-primary/10 text-foreground shadow-[0_0_14px_-4px_var(--neon-cyan)]"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <ol className="relative ml-2 border-l border-border">
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((m, i) => (
            <motion.li
              key={m.id}
              layout
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: Math.min(i, 4) * 0.05 }}
              className="relative pb-8 pl-8 last:pb-0"
            >
              <span
                aria-hidden
                className={cn(
                  "absolute top-2 -left-[7px] size-3.5 rounded-full border-2 border-primary",
                  m.is_featured
                    ? "bg-primary shadow-[0_0_12px_var(--neon-cyan)]"
                    : "bg-background"
                )}
              />
              <article className="glass rounded-xl p-5">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge>{m.category}</Badge>
                  <time dateTime={m.date_achieved}>
                    {formatDate(m.date_achieved)}
                  </time>
                  {m.is_featured && (
                    <Badge variant="glow">
                      <Star aria-hidden /> Unggulan
                    </Badge>
                  )}
                </div>
                <h3 className="text-lg font-semibold">{m.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {m.description}
                </p>
                {m.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    className="mt-4 max-h-80 w-full rounded-lg border border-border object-cover"
                    src={m.image_url}
                    alt={`Bukti proyek: ${m.title}`}
                    loading="lazy"
                  />
                )}
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
    </>
  );
}
