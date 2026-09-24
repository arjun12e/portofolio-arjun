"use client";

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { ArrowDown, MapPin, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTypewriter } from "@/hooks/use-typewriter";
import { siteConfig } from "@/lib/site";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  const reduce = useReducedMotion() ?? false;
  const role = useTypewriter(siteConfig.roles, { disabled: reduce });

  // Parallax ringan: konten sedikit naik & memudar saat di-scroll.
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  function scrollToProjects() {
    document.getElementById("projects")?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-16">
      <motion.div
        style={{ y, opacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-6xl px-4 sm:px-6"
      >
        <motion.div variants={item}>
          <Badge variant="glow" className="mb-6 py-1">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            Terbuka untuk kolaborasi & proyek baru
          </Badge>
        </motion.div>

        <motion.p variants={item} className="mb-3 font-mono text-sm text-muted-foreground">
          Halo, saya
        </motion.p>

        <motion.h1
          variants={item}
          className="text-5xl leading-[1.05] font-bold tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="text-gradient">{siteConfig.name}</span>
          <span className="text-primary">.</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 flex min-h-[2.5rem] items-center font-mono text-xl text-foreground/90 sm:text-3xl"
          aria-label={siteConfig.roles.join(", ")}
        >
          <span aria-hidden className="mr-2 text-primary">&gt;</span>
          <span aria-hidden>{role}</span>
          <span aria-hidden className="ml-0.5 inline-block h-[1.1em] w-[0.55ch] animate-blink bg-primary" />
        </motion.p>

        <motion.p variants={item} className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {siteConfig.bio}
        </motion.p>

        <motion.div variants={item} className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin aria-hidden className="size-4" /> {siteConfig.location}
        </motion.div>

        <motion.div variants={item} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={scrollToProjects} className="group">
            <Sparkles /> Lihat Proyek
            <ArrowDown className="transition-transform group-hover:translate-y-0.5" />
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon /> GitHub
            </a>
          </Button>
        </motion.div>
      </motion.div>

      {/* Indikator scroll */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <div className="flex h-10 w-6 justify-center rounded-full border border-border pt-2">
          <motion.span
            className="h-2 w-1 rounded-full bg-primary"
            animate={reduce ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
