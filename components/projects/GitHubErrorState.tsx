"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock, RefreshCw, TriangleAlert, WifiOff } from "lucide-react";
import { GithubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";
import type { GitHubError } from "@/types/github";

function useCountdown(target?: string) {
  const [remaining, setRemaining] = useState<number | null>(null);
  useEffect(() => {
    if (!target) return;
    const tick = () => setRemaining(Math.max(0, Date.parse(target) - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return remaining;
}

function formatDuration(ms: number) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m} menit ${s} detik` : `${s} detik`;
}

export function GitHubErrorState({ error }: { error: GitHubError }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const remaining = useCountdown(error.kind === "rate_limit" ? error.resetAt : undefined);
  const Icon = error.kind === "rate_limit" ? Clock : error.kind === "network" ? WifiOff : TriangleAlert;

  return (
    <div
      role="alert"
      className="glass mx-auto flex max-w-xl flex-col items-center gap-4 rounded-xl border-destructive/30 px-6 py-12 text-center"
    >
      <span className="grid size-12 place-items-center rounded-full bg-destructive/10 text-destructive">
        <Icon aria-hidden className="size-6" />
      </span>
      <div className="space-y-1.5">
        <h3 className="font-semibold">
          {error.kind === "rate_limit" ? "Rate limit GitHub tercapai" : "Gagal memuat repositori"}
        </h3>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        {remaining !== null && remaining > 0 && (
          <p className="font-mono text-xs text-muted-foreground">
            Kuota direset dalam {formatDuration(remaining)}
          </p>
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Button
          variant="outline"
          disabled={pending || (remaining !== null && remaining > 0)}
          onClick={() => startTransition(() => router.refresh())}
        >
          <RefreshCw className={pending ? "animate-spin" : undefined} /> Coba lagi
        </Button>
        <Button asChild>
          <a href={siteConfig.socials.github} target="_blank" rel="noopener noreferrer">
            <GithubIcon /> Lihat langsung di GitHub
          </a>
        </Button>
      </div>
    </div>
  );
}
