"use client";

import { useRef, type PointerEvent } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Archive, ArrowUpRight, GitFork, Globe, Star } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLanguageColor } from "@/lib/language-colors";
import { formatCompact, timeAgo } from "@/lib/utils";
import type { Repository } from "@/types/github";

/** State "hidden"/"show" diwariskan dari grid parent (stagger); kartu hanya mendefinisikan bentuknya. */
export const projectCardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

const MAX_TILT_DEG = 8;
const spring = { stiffness: 300, damping: 30, mass: 0.6 };

interface ProjectCardProps {
  repo: Repository;
  /** Waktu referensi dari server agar label "x hari lalu" konsisten saat hidrasi. */
  now: number;
}

export function ProjectCard({ repo, now }: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const languageColor = getLanguageColor(repo.language);

  // Posisi pointer relatif terhadap kartu, 0..1 (0.5 = tengah).
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [MAX_TILT_DEG, -MAX_TILT_DEG]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-MAX_TILT_DEG, MAX_TILT_DEG]), spring);

  // Glow radial yang mengikuti kursor.
  const glowX = useTransform(px, (v) => `${v * 100}%`);
  const glowY = useTransform(py, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX} ${glowY}, color-mix(in oklch, ${languageColor} 28%, transparent), transparent 55%)`;
  const borderGlow = useMotionTemplate`radial-gradient(260px circle at ${glowX} ${glowY}, var(--neon-cyan), transparent 70%)`;

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || e.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  }

  function handlePointerLeave() {
    px.set(0.5);
    py.set(0.5);
  }

  return (
    <motion.article
      layout
      variants={projectCardVariants}
      exit="exit"
      className="group [perspective:1000px]"
    >
      <motion.div
        ref={ref}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        className="relative h-full rounded-xl"
      >
        {/* Border bercahaya: lapisan gradien di belakang, terlihat 1px lewat padding. */}
        <motion.div
          aria-hidden
          style={{
            background: borderGlow,
            // Mask "cincin": hanya area padding 1px yang terlihat.
            mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
          }}
          className="pointer-events-none absolute -inset-px z-10 rounded-xl p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <div className="glass relative flex h-full flex-col overflow-hidden rounded-xl">
          <motion.div
            aria-hidden
            style={{ background: glow }}
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          />

          <div className="relative flex flex-1 flex-col gap-4 p-5" style={{ transform: "translateZ(30px)" }}>
            <header className="flex items-start justify-between gap-3">
              <h3 className="font-mono text-base font-semibold leading-snug break-all">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="outline-none after:absolute after:inset-0 after:content-[''] focus-visible:text-primary"
                >
                  {repo.name}
                </a>
              </h3>
              <ArrowUpRight
                aria-hidden
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
              />
            </header>

            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {repo.description ?? "Belum ada deskripsi untuk repositori ini."}
            </p>

            {repo.topics.length > 0 && (
              <ul className="flex flex-wrap gap-1.5" aria-label="Topik">
                {repo.topics.slice(0, 4).map((topic) => (
                  <li key={topic}>
                    <Badge variant="secondary" className="font-mono text-[11px]">
                      {topic}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {repo.language && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium"
                  style={{
                    color: languageColor,
                    borderColor: `color-mix(in oklch, ${languageColor} 45%, transparent)`,
                    background: `color-mix(in oklch, ${languageColor} 12%, transparent)`,
                  }}
                >
                  <span
                    aria-hidden
                    className="size-2 rounded-full"
                    style={{ background: languageColor, boxShadow: `0 0 8px ${languageColor}` }}
                  />
                  {repo.language}
                </span>
              )}
              <span className="inline-flex items-center gap-1" title={`${repo.stars} bintang`}>
                <Star aria-hidden className="size-3.5" />
                <span className="sr-only">Bintang:</span>
                {formatCompact(repo.stars)}
              </span>
              <span className="inline-flex items-center gap-1" title={`${repo.forks} fork`}>
                <GitFork aria-hidden className="size-3.5" />
                <span className="sr-only">Fork:</span>
                {formatCompact(repo.forks)}
              </span>
              {repo.isArchived && (
                <span className="inline-flex items-center gap-1">
                  <Archive aria-hidden className="size-3.5" /> Arsip
                </span>
              )}
              <time dateTime={repo.pushedAt} className="ml-auto">
                {timeAgo(repo.pushedAt, now)}
              </time>
            </div>

            {/* z-10 agar tombol bisa diklik di atas link "stretched" judul kartu. */}
            <footer className="relative z-10 flex gap-2 border-t border-border pt-4">
              <Button asChild variant="outline" size="sm">
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  <GithubIcon /> Kode
                </a>
              </Button>
              {repo.homepage && (
                <Button asChild size="sm">
                  <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                    <Globe /> Live Demo
                  </a>
                </Button>
              )}
            </footer>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
