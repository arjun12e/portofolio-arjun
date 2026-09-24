import "server-only";
import { cache } from "react";
import type {
  GitHubError,
  GitHubProfile,
  GitHubRepoResponse,
  GitHubResult,
  GitHubStats,
  GitHubUserResponse,
  LanguageStat,
  Repository,
} from "@/types/github";

const GITHUB_API = "https://api.github.com";
/** Data GitHub di-cache 1 jam di Data Cache Next.js → hemat kuota rate-limit. */
const REVALIDATE_SECONDS = 60 * 60;

function githubHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Opsional: token menaikkan limit dari 60 → 5.000 request/jam.
  // Tanpa prefix NEXT_PUBLIC_ sehingga tidak pernah ikut ke bundle browser.
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function toGitHubError(res: Response): GitHubError {
  const remaining = res.headers.get("x-ratelimit-remaining");
  const reset = res.headers.get("x-ratelimit-reset");

  if ((res.status === 403 || res.status === 429) && (remaining === "0" || res.status === 429)) {
    const resetAt = reset ? new Date(Number(reset) * 1000).toISOString() : undefined;
    return {
      kind: "rate_limit",
      message: "Batas request GitHub API tercapai. Data akan tersedia kembali sebentar lagi.",
      resetAt,
    };
  }
  if (res.status === 404) {
    return { kind: "not_found", message: "Pengguna GitHub tidak ditemukan." };
  }
  return { kind: "unknown", message: `GitHub API merespons dengan status ${res.status}.` };
}

async function githubFetch<T>(path: string): Promise<GitHubResult<T>> {
  try {
    const res = await fetch(`${GITHUB_API}${path}`, {
      headers: githubHeaders(),
      next: { revalidate: REVALIDATE_SECONDS, tags: ["github"] },
    });
    if (!res.ok) return { ok: false, error: toGitHubError(res) };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return {
      ok: false,
      error: { kind: "network", message: "Tidak dapat terhubung ke GitHub API." },
    };
  }
}

/** Hanya terima URL http(s) — kolom homepage GitHub adalah teks bebas. */
function normalizeHomepage(value: string | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function mapRepository(repo: GitHubRepoResponse): Repository {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description,
    url: repo.html_url,
    homepage: normalizeHomepage(repo.homepage),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    topics: repo.topics ?? [],
    isFork: repo.fork,
    isArchived: repo.archived,
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at,
  };
}

/**
 * Semua repositori publik milik `username` (bukan fork), terurut dari yang
 * terakhir di-push. `cache()` memastikan satu request per render walau
 * dipanggil dari beberapa komponen (Projects & Stats).
 */
export const getRepositories = cache(
  async (username: string): Promise<GitHubResult<Repository[]>> => {
    const result = await githubFetch<GitHubRepoResponse[]>(
      `/users/${encodeURIComponent(username)}/repos?type=owner&sort=pushed&per_page=100`
    );
    if (!result.ok) return result;
    return {
      ok: true,
      data: result.data.filter((r) => !r.fork && !r.private).map(mapRepository),
    };
  }
);

export const getProfile = cache(
  async (username: string): Promise<GitHubResult<GitHubProfile>> => {
    const result = await githubFetch<GitHubUserResponse>(
      `/users/${encodeURIComponent(username)}`
    );
    if (!result.ok) return result;
    const u = result.data;
    return {
      ok: true,
      data: {
        login: u.login,
        name: u.name,
        avatarUrl: u.avatar_url,
        url: u.html_url,
        publicRepos: u.public_repos,
        followers: u.followers,
        following: u.following,
        createdAt: u.created_at,
      },
    };
  }
);

export function computeLanguageStats(repos: Repository[], limit = 6): LanguageStat[] {
  const counts = new Map<string, number>();
  for (const repo of repos) {
    if (repo.language) counts.set(repo.language, (counts.get(repo.language) ?? 0) + 1);
  }
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  if (total === 0) return [];
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([language, count]) => ({
      language,
      count,
      percent: Math.round((count / total) * 1000) / 10,
    }));
}

export async function getGitHubStats(username: string): Promise<GitHubResult<GitHubStats>> {
  const [repos, profile] = await Promise.all([getRepositories(username), getProfile(username)]);
  if (!repos.ok) return repos;
  if (!profile.ok) return profile;

  const list = repos.data;
  const mostStarred = list.reduce<Repository | null>(
    (best, r) => (!best || r.stars > best.stars ? r : best),
    null
  );
  const years =
    (Date.now() - new Date(profile.data.createdAt).getTime()) / (365.25 * 24 * 3600 * 1000);

  return {
    ok: true,
    data: {
      totalStars: list.reduce((sum, r) => sum + r.stars, 0),
      totalForks: list.reduce((sum, r) => sum + r.forks, 0),
      totalRepos: profile.data.publicRepos,
      followers: profile.data.followers,
      topLanguages: computeLanguageStats(list),
      languageCount: new Set(list.map((r) => r.language).filter(Boolean)).size,
      mostStarred,
      accountYears: Math.max(0, Math.floor(years)),
    },
  };
}
