import { getRepositories } from "@/lib/github";
import { siteConfig } from "@/lib/site";
import { GitHubErrorState } from "@/components/projects/GitHubErrorState";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";

/**
 * Server Component: data diambil di server (token aman, cache 1 jam) lalu
 * di-stream ke browser. Selama menunggu, <Suspense> menampilkan skeleton.
 */
export async function GitHubProjects() {
  const result = await getRepositories(siteConfig.githubUsername);

  if (!result.ok) return <GitHubErrorState error={result.error} />;

  // Server Component dirender sekali per request; waktu ini dikirim ke client
  // agar label "x hari lalu" identik saat SSR dan hidrasi.
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();

  return <ProjectsExplorer repos={result.data} now={now} />;
}
