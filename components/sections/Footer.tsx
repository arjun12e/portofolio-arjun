import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { siteConfig } from "@/lib/site";

const links = [
  { href: siteConfig.socials.github, label: "GitHub", icon: GithubIcon },
  { href: siteConfig.socials.linkedin, label: "LinkedIn", icon: LinkedinIcon },
  { href: `mailto:${siteConfig.email}`, label: "Email", icon: Mail },
];

export function SocialLinks() {
  return (
    <ul className="flex gap-3">
      {links.map(({ href, label, icon: Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            aria-label={label}
            className="glass grid size-11 place-items-center rounded-lg text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_20px_-6px_var(--neon-cyan)]"
          >
            <Icon className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p>
          © {new Date().getFullYear()} {siteConfig.name}. Dibuat dengan Next.js, Tailwind & Framer Motion.
        </p>
        <a href="/admin/login" className="font-mono text-xs hover:text-foreground">
          admin
        </a>
      </div>
    </footer>
  );
}
