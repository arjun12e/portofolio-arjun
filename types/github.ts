// ---------- Bentuk mentah dari GitHub REST API (hanya field yang dipakai) ----------

/** GET /users/{username}/repos */
export interface GitHubRepoResponse {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics?: string[];
  fork: boolean;
  archived: boolean;
  private: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
}

/** GET /users/{username} */
export interface GitHubUserResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

// ---------- Model yang dipakai UI (sudah dinormalisasi) ----------

export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  /** URL live demo — null jika kolom "homepage" di GitHub kosong/tidak valid. */
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  isFork: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
}

export interface GitHubProfile {
  login: string;
  name: string | null;
  avatarUrl: string;
  url: string;
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
}

export interface LanguageStat {
  language: string;
  count: number;
  /** 0–100 */
  percent: number;
}

export interface GitHubStats {
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  followers: number;
  topLanguages: LanguageStat[];
  /** Jumlah bahasa berbeda di seluruh repositori. */
  languageCount: number;
  mostStarred: Repository | null;
  accountYears: number;
}

export type GitHubErrorKind = "rate_limit" | "not_found" | "network" | "unknown";

export interface GitHubError {
  kind: GitHubErrorKind;
  message: string;
  /** ISO timestamp kapan kuota rate-limit direset (hanya untuk kind = rate_limit). */
  resetAt?: string;
}

/** Discriminated union — memaksa pemanggil menangani kasus error. */
export type GitHubResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: GitHubError };

export type RepoSortKey = "stars" | "updated" | "name";
