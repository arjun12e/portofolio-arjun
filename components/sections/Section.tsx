import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ id, eyebrow, title, description, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("py-20 sm:py-28", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal className="mb-10 max-w-2xl sm:mb-14">
          <p className="mb-3 font-mono text-xs tracking-[0.2em] text-primary uppercase">
            <span aria-hidden>{"// "}</span>
            {eyebrow}
          </p>
          <h2 id={`${id}-title`} className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h2>
          {description && <p className="mt-4 text-muted-foreground">{description}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
