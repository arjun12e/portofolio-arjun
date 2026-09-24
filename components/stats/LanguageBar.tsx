"use client";

import { motion } from "framer-motion";
import { getLanguageColor } from "@/lib/language-colors";
import type { LanguageStat } from "@/types/github";

export function LanguageBar({ languages }: { languages: LanguageStat[] }) {
  if (languages.length === 0) {
    return <p className="text-sm text-muted-foreground">Belum ada data bahasa.</p>;
  }
  return (
    <div className="space-y-4">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-muted" role="img" aria-label="Distribusi bahasa">
        {languages.map((l, i) => (
          <motion.span
            key={l.language}
            initial={{ width: 0 }}
            whileInView={{ width: `${l.percent}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
            style={{ background: getLanguageColor(l.language) }}
          />
        ))}
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        {languages.map((l) => (
          <li key={l.language} className="flex items-center gap-2">
            <span aria-hidden className="size-2.5 shrink-0 rounded-full" style={{ background: getLanguageColor(l.language) }} />
            <span className="truncate">{l.language}</span>
            <span className="ml-auto font-mono text-xs text-muted-foreground">{l.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
