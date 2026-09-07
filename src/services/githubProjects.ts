export type GitHubProject = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  color: string;
  link: string;
};

type GitHubRepository = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  fork: boolean;
};

const githubUsername = "Archit0029";
const cacheKey = "portfolio.github-projects.v1";
const cacheDurationMs = 10 * 24 * 60 * 60 * 1000;
const projectColors = ["#22d3ee", "#a78bfa", "#f97316", "#10b981"];

function toProject(repository: GitHubRepository, index: number): GitHubProject {
  const tags = [repository.language, ...(repository.topics ?? [])]
    .filter((tag): tag is string => Boolean(tag))
    .slice(0, 4);

  return {
    id: String(index + 1).padStart(2, "0"),
    title: repository.name,
    desc: repository.description || "A project built and maintained on GitHub.",
    tags: tags.length ? tags : ["GitHub"],
    color: projectColors[index % projectColors.length],
    link: repository.homepage || repository.html_url,
  };
}

function readCachedProjects(): GitHubProject[] | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = window.localStorage.getItem(cacheKey);
    if (!cached) return null;

    const parsed = JSON.parse(cached) as { savedAt: number; projects: GitHubProject[] };
    if (!Array.isArray(parsed.projects) || Date.now() - parsed.savedAt >= cacheDurationMs) return null;
    return parsed.projects;
  } catch {
    return null;
  }
}

function cacheProjects(projects: GitHubProject[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), projects }));
}

export async function fetchGitHubProjects(fallback: GitHubProject[]): Promise<GitHubProject[]> {
  const cachedProjects = readCachedProjects();
  if (cachedProjects) return cachedProjects;

  try {
    const response = await fetch(
      `https://api.github.com/users/${githubUsername}/repos?sort=updated&direction=desc&per_page=8`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const repositories = (await response.json()) as GitHubRepository[];
    const projects = repositories.filter((repository) => !repository.fork).map(toProject);
    if (!projects.length) return fallback;

    cacheProjects(projects);
    return projects;
  } catch (error) {
    console.error("Unable to load GitHub projects:", error);
    return fallback;
  }
}