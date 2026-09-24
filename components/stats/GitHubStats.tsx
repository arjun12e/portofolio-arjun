import { BookMarked, CalendarDays, GitFork, Star, Trophy, Users, type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/stats/AnimatedCounter";
import { LanguageBar } from "@/components/stats/LanguageBar";
import { GitHubErrorState } from "@/components/projects/GitHubErrorState";
import { getGitHubStats } from "@/lib/github";
import { siteConfig } from "@/lib/site";

interface StatTileProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
}

function StatTile({ icon: Icon, label, value, suffix }: StatTileProps) {
  return (
    <div className="glass group rounded-xl p-5 transition-colors hover:border-primary/40">
      <Icon aria-hidden className="mb-4 size-5 text-primary transition-transform group-hover:scale-110" />
      <p className="text-3xl font-bold tracking-tight sm:text-4xl">
        <AnimatedCounter value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/** Statistik dihitung sendiri dari REST API (tanpa widget pihak ketiga yang sering rate-limited). */
export async function GitHubStats() {
  const result = await getGitHubStats(siteConfig.githubUsername);
  if (!result.ok) return <GitHubErrorState error={result.error} />;

  const s = result.data;
  return (
    <div className="grid gap-5 lg:grid-cols-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-3">
        <StatTile icon={BookMarked} label="Repositori publik" value={s.totalRepos} />
        <StatTile icon={Star} label="Total bintang" value={s.totalStars} />
        <StatTile icon={GitFork} label="Total fork" value={s.totalForks} />
        <StatTile icon={Users} label="Followers" value={s.followers} />
        <StatTile icon={CalendarDays} label="Tahun di GitHub" value={s.accountYears} suffix="+" />
        <StatTile icon={Trophy} label="Bahasa dipakai" value={s.languageCount} />
      </div>

      <div className="glass flex flex-col gap-5 rounded-xl p-6 lg:col-span-2">
        <div>
          <h3 className="font-semibold">Bahasa teratas</h3>
          <p className="text-xs text-muted-foreground">Berdasarkan bahasa utama tiap repositori</p>
        </div>
        <LanguageBar languages={s.topLanguages} />
        {s.mostStarred && (
          <a
            href={s.mostStarred.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto rounded-lg border border-border bg-background/40 p-4 transition-colors hover:border-primary/40"
          >
            <p className="text-xs text-muted-foreground">Repositori paling populer</p>
            <p className="mt-1 flex items-center justify-between gap-2 font-mono text-sm font-semibold">
              <span className="truncate">{s.mostStarred.name}</span>
              <span className="inline-flex shrink-0 items-center gap-1 text-primary">
                <Star aria-hidden className="size-3.5" /> {s.mostStarred.stars}
              </span>
            </p>
          </a>
        )}
      </div>
    </div>
  );
}
