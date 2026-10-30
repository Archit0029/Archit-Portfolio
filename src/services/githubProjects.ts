export type GitHubProject = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  color: string;
  link: string;
  github?: string;
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
const cacheKey = "portfolio.github-projects.v2";
const cacheDurationMs = 10 * 24 * 60 * 60 * 1000;
const projectColors = ["#22d3ee", "#a78bfa", "#f97316", "#10b981"];

const ALLOWED_PROJECTS = [
  "Smart-Compiler",
  "Price_Predictions_of_used_mobiles",
  "Archit-Portfolio",
  "file-converter-website",
];

const LIVE_LINKS: Record<string, string> = {
  "Smart-Compiler": "https://smartcompiler-swart.vercel.app",
  "Price_Predictions_of_used_mobiles": "https://pricepredictions.vercel.app/",
  "Archit-Portfolio": "https://architbishnoi-portfolio.vercel.app/",
  "file-converter-website": "https://ab-file-convertern-archit-bishnoi.onrender.com/",
};

const PROJECT_DESCRIPTIONS: Record<string, string> = {
  "Smart-Compiler":
    "An online multi-language cloud IDE and code editor supporting 16+ programming languages, interactive standard input, and Monaco-grade code editing.",
  "Price_Predictions_of_used_mobiles":
    "An end-to-end Machine Learning web application predicting realistic secondary resale valuation of used smartphones with depreciation modeling.",
  "Archit-Portfolio":
    "Modern editorial developer portfolio featuring responsive design, verified credentials, active GitHub contributions, and instant contact options.",
  "file-converter-website":
    "A universal web-based file conversion platform supporting format transformations for PDFs, images, audio, video, and OCR text extraction.",
};

const PROJECT_TAGS: Record<string, string[]> = {
  "Smart-Compiler": ["JavaScript", "Monaco Editor", "Compiler", "Cloud IDE"],
  "Price_Predictions_of_used_mobiles": ["Python", "Machine Learning", "FastAPI", "Scikit-Learn"],
  "Archit-Portfolio": ["React", "TypeScript", "Tailwind CSS", "Vite"],
  "file-converter-website": ["Python", "Flask", "File Processing", "Tesseract OCR"],
};

function toProject(repository: GitHubRepository, index: number): GitHubProject {
  const dynamicTags = [repository.language, ...(repository.topics ?? [])]
    .filter((tag): tag is string => Boolean(tag));
  const fallbackTags = PROJECT_TAGS[repository.name] ?? ["GitHub"];
  const tags = dynamicTags.length ? dynamicTags.slice(0, 4) : fallbackTags;

  const liveLink =
    repository.homepage ||
    LIVE_LINKS[repository.name] ||
    repository.html_url;

  return {
    id: String(index + 1).padStart(2, "0"),
    title: repository.name,
    desc:
      repository.description ||
      PROJECT_DESCRIPTIONS[repository.name] ||
      "A project built and maintained on GitHub.",
    tags,
    color: projectColors[index % projectColors.length],
    link: liveLink,
    github: repository.html_url,
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
      `https://api.github.com/users/${githubUsername}/repos?per_page=100`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

    const repositories = (await response.json()) as GitHubRepository[];
    const filteredRepos = repositories.filter(
      (repository) => !repository.fork && ALLOWED_PROJECTS.includes(repository.name),
    );

    // Sort according to ALLOWED_PROJECTS order
    filteredRepos.sort(
      (a, b) => ALLOWED_PROJECTS.indexOf(a.name) - ALLOWED_PROJECTS.indexOf(b.name),
    );

    const projects = filteredRepos.map(toProject);
    if (!projects.length) return fallback;

    cacheProjects(projects);
    return projects;
  } catch (error) {
    console.error("Unable to load GitHub projects:", error);
    return fallback;
  }
}
