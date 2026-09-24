"use client";

import { motion, type Variants } from "framer-motion";
import { Brain, Code2, Server, Wrench, type LucideIcon } from "lucide-react";
import { skillGroups, type SkillCategory } from "@/lib/site";

const categoryMeta: Record<SkillCategory, { icon: LucideIcon; color: string }> = {
  Frontend: { icon: Code2, color: "var(--neon-cyan)" },
  Backend: { icon: Server, color: "var(--neon-violet)" },
  Tools: { icon: Wrench, color: "oklch(0.8 0.16 150)" },
  AI: { icon: Brain, color: "var(--neon-pink)" },
};

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const card: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const chips: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.2 } } };
const chip: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 400, damping: 22 } },
};

export function SkillsGrid() {
  return (
    <motion.ul
      variants={list}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="grid gap-5 sm:grid-cols-2"
    >
      {skillGroups.map((group) => {
        const { icon: Icon, color } = categoryMeta[group.category];
        return (
          <motion.li
            key={group.category}
            variants={card}
            className="glass group relative overflow-hidden rounded-xl p-6"
            style={{ ["--c" as string]: color }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
              style={{ background: "var(--c)" }}
            />
            <div className="mb-5 flex items-center gap-3">
              <span
                className="grid size-10 place-items-center rounded-lg border"
                style={{
                  color: "var(--c)",
                  borderColor: "color-mix(in oklch, var(--c) 40%, transparent)",
                  background: "color-mix(in oklch, var(--c) 12%, transparent)",
                }}
              >
                <Icon aria-hidden className="size-5" />
              </span>
              <div>
                <h3 className="font-semibold">{group.category}</h3>
                <p className="text-xs text-muted-foreground">{group.description}</p>
              </div>
            </div>
            <motion.ul variants={chips} className="flex flex-wrap gap-2" aria-label={`Keahlian ${group.category}`}>
              {group.skills.map((skill) => (
                <motion.li
                  key={skill}
                  variants={chip}
                  whileHover={{ y: -2 }}
                  className="cursor-default rounded-md border border-border bg-background/40 px-3 py-1.5 font-mono text-xs transition-colors hover:border-[color:var(--c)] hover:text-[color:var(--c)]"
                >
                  {skill}
                </motion.li>
              ))}
            </motion.ul>
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
