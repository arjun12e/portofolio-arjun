// Warna resmi dari github/linguist untuk bahasa yang umum dipakai.
const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  Dart: "#00B4AB",
  HTML: "#e34c26",
  CSS: "#663399",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Astro: "#ff5a03",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  "Jupyter Notebook": "#DA5B0B",
  Lua: "#000080",
  Arduino: "#bd79d1",
  "Objective-C": "#438eff",
  PLpgSQL: "#336790",
  TSQL: "#e38c00",
  MDX: "#fcb32c",
  Blade: "#f7523f",
};

export const FALLBACK_LANGUAGE_COLOR = "#8b949e";

export function getLanguageColor(language: string | null | undefined) {
  if (!language) return FALLBACK_LANGUAGE_COLOR;
  return LANGUAGE_COLORS[language] ?? FALLBACK_LANGUAGE_COLOR;
}
