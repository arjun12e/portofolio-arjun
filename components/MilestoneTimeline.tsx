"use client";

import { useMemo, useState } from "react";
import type { Milestone } from "@/lib/types";

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
      <div className="empty-state">
        Belum ada milestone yang dipublikasikan.
      </div>
    );
  }

  return (
    <>
      {/* FR-PUB-02: filter kategori */}
      <div className="filter-bar" role="tablist" aria-label="Filter kategori">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip${active === cat ? " active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <ol className="timeline">
        {filtered.map((m) => (
          <li
            key={m.id}
            className={`timeline-item${m.is_featured ? " featured" : ""}`}
          >
            <article className="milestone-card">
              <div className="milestone-meta">
                <span className="badge">{m.category}</span>
                <time dateTime={m.date_achieved}>
                  {formatDate(m.date_achieved)}
                </time>
                {m.is_featured && <span className="badge outline">★ Unggulan</span>}
              </div>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
              {m.image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="thumb"
                  src={m.image_url}
                  alt={`Bukti proyek: ${m.title}`}
                  loading="lazy"
                />
              )}
            </article>
          </li>
        ))}
      </ol>
    </>
  );
}
