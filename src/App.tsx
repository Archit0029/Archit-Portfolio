import { useEffect, useRef, useState } from "react";
import { sendPortfolioMessage } from "./services/contactService";
import { CONTACT_EMAIL, certifications, education, experience } from "./data/portfolio";
import type { GitHubProject } from "./services/githubProjects";

const SKILL_GROUPS = [
  { category: "Web", items: ["React", "JavaScript", "HTML", "CSS"] },
  { category: "Mobile & backend", items: ["Flutter", "Firebase"] },
  { category: "Programming", items: ["Java", "Python", "C", "C++"] },
  { category: "Tools", items: ["Git", "GitHub", "VS Code"] },
];

const FEATURED_PROJECTS: GitHubProject[] = [
  {
    id: "01",
    title: "Smart-Compiler",
    desc: "An online multi-language cloud IDE and code editor supporting 16+ programming languages, interactive standard input, and Monaco-grade code editing.",
    tags: ["JavaScript", "Monaco Editor", "Compiler", "Cloud IDE"],
    color: "#22d3ee",
    link: "https://smartcompiler-swart.vercel.app",
    github: "https://github.com/Archit0029/Smart-Compiler",
  },
  {
    id: "02",
    title: "Price_Predictions_of_used_mobiles",
    desc: "An end-to-end Machine Learning web application predicting realistic secondary resale valuation of used smartphones with depreciation modeling.",
    tags: ["Python", "Machine Learning", "FastAPI", "Scikit-Learn"],
    color: "#a78bfa",
    link: "https://pricepredictions.vercel.app/",
    github: "https://github.com/Archit0029/Price_Predictions_of_used_mobiles",
  },
  {
    id: "03",
    title: "Archit-Portfolio",
    desc: "Modern editorial developer portfolio featuring responsive design, verified credentials, active GitHub contributions, and instant contact options.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    color: "#f97316",
    link: "https://architbishnoi-portfolio.vercel.app/",
    github: "https://github.com/Archit0029/Archit-Portfolio",
  },
  {
    id: "04",
    title: "file-converter-website",
    desc: "A universal web-based file conversion platform supporting format transformations for PDFs, images, audio, video, and OCR text extraction.",
    tags: ["Python", "Flask", "File Processing", "Tesseract OCR"],
    color: "#10b981",
    link: "https://ab-file-convertern-archit-bishnoi.onrender.com/",
    github: "https://github.com/Archit0029/file-converter-website",
  },
];

const MARQUEE_ITEMS = [
  "React", "JavaScript", "HTML", "CSS", "Java", "Python",
  "Flutter", "Firebase", "Git", "GitHub", "VS Code",
  "React", "JavaScript", "HTML", "CSS", "Java", "Python",
  "Flutter", "Firebase", "Git", "GitHub", "VS Code",
];

type GitHubContribution = { date: string; count: number; level: number };
type ContributionStatus = "loading" | "success" | "empty" | "error";

const CONTRIBUTIONS_API_URL = "https://github-contributions-api.jogruber.de/v4/Archit0029?y=last";

function isGitHubContribution(value: unknown): value is GitHubContribution {
  if (typeof value !== "object" || value === null) return false;
  const contribution = value as Record<string, unknown>;
  return (
    typeof contribution.date === "string" &&
    typeof contribution.count === "number" &&
    typeof contribution.level === "number" &&
    contribution.level >= 0 &&
    contribution.level <= 4
  );
}

function hasContributions(value: unknown): value is { contributions: GitHubContribution[] } {
  if (typeof value !== "object" || value === null || !("contributions" in value)) return false;
  const contributions = value.contributions;
  return Array.isArray(contributions) && contributions.every(isGitHubContribution);
}

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function ProjectCard({ project, index, reducedMotion }: { project: GitHubProject; index: number; reducedMotion: boolean }) {
  const { ref, visible } = useIntersectionObserver(0.1);
  return (
    <div
      ref={ref}
      className="project-card p-8 rounded-none flex flex-col justify-between"
      style={{
        opacity: reducedMotion || visible ? 1 : 0,
        transform: reducedMotion || visible ? "translateY(0)" : "translateY(40px)",
        transition: reducedMotion ? "none" : `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      <div>
        <div className="flex items-start justify-between mb-6">
          <span
            className="text-5xl font-display font-black opacity-20"
            style={{ color: project.color, fontFamily: "Fraunces, serif" }}
          >
            {project.id}
          </span>
          <div className="flex items-center gap-2">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-11 min-w-11 border border-[#1e1e2e] flex items-center justify-center hover:border-[#22d3ee] hover:text-[#22d3ee] transition-all duration-200 text-[#8888aa]"
                aria-label={`View ${project.title} on GitHub`}
                title="View GitHub Repository"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-11 min-w-11 border border-[#1e1e2e] flex items-center justify-center hover:border-[#22d3ee] hover:text-[#22d3ee] transition-all duration-200 text-[#8888aa]"
              aria-label={`Open live link for ${project.title}`}
              title="Open Live Link"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
        <h3
          className="text-2xl font-black mb-3"
          style={{ fontFamily: "Fraunces, serif", color: project.color }}
        >
          {project.title}
        </h3>
        <p className="text-[#8888aa] text-sm leading-relaxed mb-6">{project.desc}</p>
      </div>
      <div>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
        </div>
        <div className="pt-4 border-t border-[#1e1e2e40] flex items-center justify-between text-xs font-mono">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#22d3ee] hover:underline flex items-center gap-1.5"
          >
            <span>Live Preview</span>
            <span aria-hidden="true">↗</span>
          </a>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8888aa] hover:text-[#e2e2f0] flex items-center gap-1.5"
            >
              <span>GitHub</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -400, y: -400 });
  const [navOpen, setNavOpen] = useState(false);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const [mailOptionsOpen, setMailOptionsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [typedText, setTypedText] = useState("Developer.");
  const [glitchActive, setGlitchActive] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [githubContributions, setGithubContributions] = useState<GitHubContribution[]>([]);
  const [contributionStatus, setContributionStatus] = useState<ContributionStatus>("loading");

  const heroWords = ["Developer.", "Builder.", "Creator."];
  const [wordIdx, setWordIdx] = useState(0);
  const projects = FEATURED_PROJECTS;

  useEffect(() => {
    const controller = new AbortController();

    const loadContributions = async () => {
      try {
        const response = await fetch(CONTRIBUTIONS_API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(`GitHub contributions returned ${response.status}`);

        const data: unknown = await response.json();
        if (!hasContributions(data)) throw new Error("GitHub contributions returned an unexpected response");

        setGithubContributions(data.contributions);
        setContributionStatus(data.contributions.length ? "success" : "empty");
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Unable to load GitHub contributions:", error);
        setContributionStatus("error");
      }
    };

    void loadContributions();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  // Cursor glow
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (prefersReducedMotion) {
      setTypedText("Developer.");
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    const word = heroWords[wordIdx];
    let i = 0;
    setTypedText("");

    const type = () => {
      if (i <= word.length) {
        setTypedText(word.slice(0, i));
        i++;
        timeout = setTimeout(type, 80);
      } else {
        timeout = setTimeout(() => {
          const erase = () => {
            if (i > 0) {
              i--;
              setTypedText(word.slice(0, i));
              timeout = setTimeout(erase, 40);
            } else {
              setWordIdx((prev) => (prev + 1) % heroWords.length);
            }
          };
          timeout = setTimeout(erase, 1800);
        }, 200);
      }
    };
    type();
    return () => clearTimeout(timeout);
  }, [wordIdx, prefersReducedMotion]);

  // Random glitch
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  // Scroll spy
  useEffect(() => {
    const sections = ["home", "projects", "about", "experience", "social", "skills", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { threshold: 0.4 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    setNavOpen(false);
  };

  useEffect(() => {
    if (!mailOptionsOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMailOptionsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mailOptionsOpen]);

  useEffect(() => {
    if (!navOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setNavOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [navOpen]);

  const openMailOption = (provider: "gmail" | "outlook" | "default") => {
    if (provider === "default") {
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    } else {
      const composeUrl = provider === "gmail"
        ? `https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT_EMAIL}`
        : `https://outlook.live.com/mail/0/deeplink/compose?to=${CONTACT_EMAIL}`;
      window.open(composeUrl, "_blank", "noopener,noreferrer");
    }
    setMailOptionsOpen(false);
  };

  const navItems = ["home", "projects", "about", "experience", "social", "skills", "contact"];

  return (
    <div className="relative min-h-screen bg-[#050508] overflow-x-hidden">
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* Ambient cursor glow */}
      <div
        className="cursor-glow"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      {/* Film grain overlay */}
      <div className="noise-overlay" />

      {/* CRT scanline */}
      <div className="scanline" />

      {/* Grid background */}
      <div className="grid-bg fixed inset-0 pointer-events-none opacity-40" />

      {/* NAV */}
      <nav aria-label="Primary navigation" className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-sm border-b border-[#1e1e2e40]">
        <a
          href="#home"
          aria-label="Archit Bishnoi, home"
          onClick={(event) => { event.preventDefault(); scrollTo("home"); }}
          className="font-mono text-sm text-[#22d3ee] tracking-widest uppercase hover:opacity-70 transition-opacity"
        >
          AB<span className="text-[#a78bfa]">_</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={(event) => { event.preventDefault(); scrollTo(item); }}
              aria-current={activeSection === item ? "location" : undefined}
              className={`nav-link ${activeSection === item ? "!text-[#22d3ee]" : ""}`}
            >
              {item}
            </a>
          ))}
        </div>

        <button
          ref={menuToggleRef}
          type="button"
          onClick={() => setMailOptionsOpen(true)}
          className="hidden md:block cta-btn text-xs"
        >
          Hire Me
        </button>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden flex flex-col items-center justify-center gap-1.5 min-h-11 min-w-11"
          onClick={() => setNavOpen(!navOpen)}
          aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={navOpen}
          aria-controls="mobile-menu"
        >
          <span className={`block h-px w-6 bg-[#22d3ee] transition-all duration-300 ${navOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-px w-6 bg-[#22d3ee] transition-all duration-300 ${navOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-[#22d3ee] transition-all duration-300 ${navOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        aria-label="Mobile navigation"
        aria-hidden={!navOpen}
        hidden={!navOpen}
        className="fixed inset-0 z-40 bg-[#050508ee] flex flex-col items-center justify-center gap-4"
        style={{ display: navOpen ? "flex" : "none" }}
      >
        {navItems.map((item) => (
          <a
            key={item}
            href={`#${item}`}
            onClick={(event) => { event.preventDefault(); scrollTo(item); }}
            className="flex min-h-11 items-center text-4xl font-display font-black text-[#e2e2f0] hover:text-[#22d3ee] transition-colors"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            {item}
          </a>
        ))}
      </div>

      {mailOptionsOpen && (
        <div
          className="mail-modal-backdrop"
          role="presentation"
          onClick={() => setMailOptionsOpen(false)}
        >
          <div
            className="mail-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mail-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-3">Start a conversation</p>
                <h2 id="mail-modal-title" className="text-3xl font-black text-[#e2e2f0]" style={{ fontFamily: "Fraunces, serif" }}>Choose your mail app</h2>
              </div>
              <button type="button" className="mail-modal-close" onClick={() => setMailOptionsOpen(false)} aria-label="Close mail options">×</button>
            </div>
            <p className="text-sm text-[#8888aa] mt-3">Send a message to {CONTACT_EMAIL}</p>
            <div className="mail-options">
              <button type="button" className="mail-option" onClick={() => openMailOption("gmail")}><strong>Gmail</strong><span>Open compose ↗</span></button>
              <button type="button" className="mail-option" onClick={() => openMailOption("outlook")}><strong>Outlook</strong><span>Open compose ↗</span></button>
              <button type="button" className="mail-option" onClick={() => openMailOption("default")}><strong>Other mail app</strong><span>Use default app ↗</span></button>
            </div>
          </div>
        </div>
      )}

      <main id="main-content" tabIndex={-1}>
      {/* HERO */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-20">
        {/* Decorative orbit ring */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 hidden lg:block">
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 border border-[#22d3ee15] rounded-full animate-spin-slow" />
            <div className="absolute inset-8 border border-[#a78bfa10] rounded-full" style={{ animation: "spin-slow 30s linear infinite reverse" }} />
            <div className="absolute inset-16 border border-[#22d3ee08] rounded-full animate-spin-slow" style={{ animationDuration: "15s" }} />
            {/* Dots on orbit */}
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                className="absolute w-1.5 h-1.5 bg-[#22d3ee] rounded-full"
                style={{
                  top: `calc(50% + ${Math.sin((deg * Math.PI) / 180) * 136}px - 3px)`,
                  left: `calc(50% + ${Math.cos((deg * Math.PI) / 180) * 136}px - 3px)`,
                }}
              />
            ))}
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 border border-[#22d3ee33] flex items-center justify-center animate-float">
                <span className="text-2xl font-mono font-bold text-[#22d3ee]">&lt;/&gt;</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status pill */}
        <div className="flex items-center gap-3 mb-10 animate-reveal-up" style={{ animationDelay: "0.1s" }}>
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#22d3ee] opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22d3ee]" />
          </span>
          <span className="text-xs font-mono text-[#8888aa] tracking-widest uppercase">
            Available for opportunities
          </span>
        </div>

        <div className="max-w-3xl">
          <p
            className="text-sm font-mono text-[#22d3ee] tracking-widest uppercase mb-4 animate-reveal-up"
            style={{ animationDelay: "0.2s" }}
          >
            Hello, world. I&apos;m
          </p>
          <h1
            aria-label="Archit Bishnoi"
            className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-8"
            style={{ fontFamily: "Fraunces, serif", animationDelay: "0.3s" }}
          >
            <span className={`block text-[#e2e2f0] ${glitchActive ? "glitch" : ""}`} data-text="Archit">Archit</span>
            <span className="block text-gradient-cyan">Bishnoi</span>
          </h1>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-8">
            <span className="text-xl md:text-2xl text-[#8888aa] font-light">Full-Stack</span>
            <span className="text-xl md:text-2xl text-[#e2e2f0] font-medium">
              {typedText}
              {!prefersReducedMotion && <span className="animate-blink text-[#22d3ee]">|</span>}
            </span>
          </div>

          <p className="text-[#8888aa] text-base leading-relaxed max-w-xl mb-10">
            I&apos;m a BCA student building web and mobile projects with JavaScript, React, Firebase, and Flutter.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#projects" onClick={(event) => { event.preventDefault(); scrollTo("projects"); }} className="cta-btn-solid min-h-11 inline-flex items-center justify-center">
              View My Work
            </a>
            <a href="/Archit_Bishnoi%20Resume.pdf" download="Archit_Bishnoi_Resume.pdf" className="cta-btn min-h-11 inline-flex items-center justify-center">
              Download Resume
            </a>
            <a href="#contact" onClick={(event) => { event.preventDefault(); scrollTo("contact"); }} className="cta-btn min-h-11 inline-flex items-center justify-center">
              Get In Touch
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-6 text-xs font-mono uppercase tracking-wider">
            <a href="https://github.com/Archit0029" target="_blank" rel="noopener noreferrer" className="text-[#8888aa] hover:text-[#22d3ee]">GitHub ↗</a>
            <a href="https://www.linkedin.com/in/archit-29bishnoi" target="_blank" rel="noopener noreferrer" className="text-[#8888aa] hover:text-[#22d3ee]">LinkedIn ↗</a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-xs font-mono text-[#8888aa] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-[#22d3ee] to-transparent" />
        </div>
      </section>

      {/* MARQUEE BAND */}
      <div className="border-y border-[#1e1e2e] py-4 overflow-hidden bg-[#0d0d14]">
        <div className="flex animate-marquee whitespace-nowrap">
          {MARQUEE_ITEMS.map((item, i) => (
            <span key={i} className="mx-6 text-xs font-mono text-[#8888aa] uppercase tracking-widest">
              {item}
              <span className="mx-6 text-[#22d3ee33]">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* PROJECTS */}
      <section id="projects" className="py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-4">Selected Work</p>
              <h2 className="text-5xl md:text-6xl font-black text-[#e2e2f0]" style={{ fontFamily: "Fraunces, serif" }}>
                Projects That <em className="text-gradient-cyan not-italic">Ship.</em>
              </h2>
            </div>
            <a
              href="https://github.com/Archit0029"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn text-xs self-start md:self-auto"
            >
              All on GitHub →
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-px bg-[#1e1e2e]">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} reducedMotion={prefersReducedMotion} />
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="relative aspect-[4/5] max-w-sm bg-[#111118]">
              <img
                src="https://avatars.githubusercontent.com/u/214365719?v=4"
                alt="Archit Bishnoi"
                className="w-full h-full object-cover mix-blend-luminosity opacity-60"
                width="600"
                height="750"
                loading="lazy"
              />
              {/* Overlay color wash */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee15] to-[#a78bfa15]" />
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#22d3ee]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#22d3ee]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#22d3ee]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#22d3ee]" />
            </div>
          </div>

          {/* Text side */}
          <div>
            <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-4">
              About Me
            </p>
            <h2
              className="text-5xl md:text-6xl font-black leading-tight mb-8 text-[#e2e2f0]"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              Crafting Digital
              <br />
              <em className="text-gradient-cyan not-italic">Experiences</em>
            </h2>
            <div className="space-y-4 text-[#8888aa] leading-relaxed">
              <p>
                I&apos;m a BCA student based in Mohali, Punjab, interested in building useful web and mobile applications.
              </p>
              <p>
                My project and internship work includes JavaScript, React, Firebase, and Flutter.
                I enjoy learning by building and improving practical software.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { label: "Location", value: "Mohali, Punjab, India" },
                { label: "Degree", value: "BCA" },
                { label: "Focus", value: "Web & Mobile" },
                { label: "Status", value: "Open to Work" },
              ].map(({ label, value }) => (
                <div key={label} className="border-l-2 border-[#22d3ee33] pl-4">
                  <div className="text-xs font-mono text-[#8888aa] uppercase tracking-wider">{label}</div>
                  <div className="text-sm text-[#e2e2f0] font-medium mt-1">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE & EDUCATION */}
      <section id="experience" className="py-24 px-8 md:px-16 lg:px-24 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-4">Experience & Education</p>
            <h2 className="text-5xl md:text-6xl font-black text-[#e2e2f0]" style={{ fontFamily: "Fraunces, serif" }}>
              The <em className="text-gradient-cyan not-italic">Background.</em>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {experience.map((item) => (
              <article key={`${item.company}-${item.role}`} className="border border-[#1e1e2e] p-6 md:p-8">
                <p className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest">{item.type} · {item.period}</p>
                <h3 className="text-2xl font-black text-[#e2e2f0] mt-4" style={{ fontFamily: "Fraunces, serif" }}>{item.role}</h3>
                <p className="text-sm text-[#a78bfa] mt-1">{item.company}</p>
                <p className="text-sm text-[#8888aa] leading-relaxed mt-4">{item.description}</p>
                <div className="flex flex-wrap gap-2 mt-5">
                  {item.stack.map((itemSkill) => <span key={itemSkill} className="tag-pill">{itemSkill}</span>)}
                </div>
              </article>
            ))}

            <article className="border border-[#1e1e2e] p-6 md:p-8">
              <h3 className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest mb-5">Education</h3>
              <div className="space-y-6">
                {education.map((item) => (
                  <div key={`${item.institution}-${item.degree}`}>
                    <p className="text-xs font-mono text-[#8888aa]">{item.period}</p>
                    <h4 className="text-lg font-bold text-[#e2e2f0] mt-1">{item.degree}</h4>
                    <p className="text-sm text-[#a78bfa] mt-1">{item.institution}</p>
                    <p className="text-sm text-[#8888aa] leading-relaxed mt-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="mt-8 border border-[#1e1e2e] p-6 md:p-8">
            <h3 className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest mb-5">Verified Certificates</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {certifications.filter((certificate) => certificate.link).map((certificate) => (
                <a
                  key={certificate.name}
                  href={certificate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#e2e2f0] hover:text-[#22d3ee] transition-colors"
                >
                  {certificate.name} <span aria-hidden="true">↗</span>
                  <span className="block text-xs text-[#8888aa] mt-1">{certificate.issuer} · {certificate.date}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PRESENCE */}
      <section id="social" className="social-section py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-4">Online Presence</p>
            <h2 className="text-5xl md:text-6xl font-black text-[#e2e2f0]" style={{ fontFamily: "Fraunces, serif" }}>
              Find Me <em className="text-gradient-cyan not-italic">Online.</em>
            </h2>
          </div>

          <div className="social-grid">
            <article className="social-card github-card">
              <div className="social-card-header">
                <span className="social-mark">GH</span>
                <span className="text-xs font-mono text-[#8888aa] uppercase tracking-widest">Open source / active</span>
              </div>
              <h3 className="text-2xl font-black text-[#e2e2f0] mt-8" style={{ fontFamily: "Fraunces, serif" }}>@Archit0029</h3>
              <p className="text-sm text-[#8888aa] mt-2">Projects, experiments, and the code behind this portfolio.</p>
              <div className="contribution-wrap">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#8888aa] uppercase tracking-wider">Contribution map</span>
                  <span className="text-xs font-mono text-[#8888aa]">less <span className="contribution-legend" /> more</span>
                </div>
                {contributionStatus === "success" ? (
                  <>
                    <p className="text-xs font-mono text-[#8888aa] mb-3" role="status">
                      {githubContributions.reduce((total, day) => total + day.count, 0)} contributions in the past year.
                    </p>
                    <div className="contribution-scroll">
                      <div className="contribution-map" aria-hidden="true">
                        {Array.from({ length: Math.ceil(githubContributions.length / 7) }, (_, weekIndex) => (
                          <div className="contribution-week" key={weekIndex}>
                            {githubContributions.slice(weekIndex * 7, weekIndex * 7 + 7).map((day) => (
                              <span key={day.date} className={`contribution-cell level-${day.level}`} />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs font-mono text-[#8888aa]" role="status">
                    {contributionStatus === "loading" && "Loading contribution activity..."}
                    {contributionStatus === "empty" && "No contribution activity is available for this period."}
                    {contributionStatus === "error" && "Contribution activity is unavailable right now. Visit GitHub for current work."}
                  </p>
                )}
              </div>
              <a href="https://github.com/Archit0029" target="_blank" rel="noopener noreferrer" className="social-action">View GitHub profile <span>↗</span></a>
            </article>

            <article className="social-card linkedin-card">
              <div className="social-card-header">
                <span className="social-mark">in</span>
                <span className="text-xs font-mono text-[#8888aa] uppercase tracking-widest">Professional network</span>
              </div>
              <h3 className="text-2xl font-black text-[#e2e2f0] mt-8" style={{ fontFamily: "Fraunces, serif" }}>Archit Bishnoi</h3>
              <p className="text-sm text-[#8888aa] mt-2">BCA student and full-stack developer building practical products.</p>
              <p className="text-sm text-[#8888aa] mt-6">Connect with me for professional updates and opportunities.</p>
              <a href="https://www.linkedin.com/in/archit-29bishnoi" target="_blank" rel="noopener noreferrer" className="social-action">Follow on LinkedIn <span>↗</span></a>
            </article>

            <article className="social-card instagram-card">
              <div className="social-card-header">
                <span className="social-mark">IG</span>
                <span className="text-xs font-mono text-[#fbbf24] uppercase tracking-widest">Visual log / personal</span>
              </div>
              <h3 className="text-2xl font-black text-[#e2e2f0] mt-8" style={{ fontFamily: "Fraunces, serif" }}>@archit_bishnoi029</h3>
              <p className="text-sm text-[#8888aa] mt-2">A little more color, behind-the-scenes builds, and everyday snapshots.</p>
              <div className="instagram-signal"><span /> <span /> <span /> <span /> <span /></div>
              <a href="https://www.instagram.com/archit_bishnoi029/" target="_blank" rel="noopener noreferrer" className="social-action instagram-action">Follow on Instagram <span>↗</span></a>
            </article>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="py-32 px-8 md:px-16 lg:px-24 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-4">
              Skills & Stack
            </p>
            <h2
              className="text-5xl md:text-6xl font-black text-[#e2e2f0]"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              What I
              <em className="text-gradient-cyan not-italic"> Work With</em>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {SKILL_GROUPS.map(({ category, items }) => (
              <div key={category} className="border-glow p-6">
                <h3 className="text-xs font-mono text-[#22d3ee] uppercase tracking-widest mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => <span key={item} className="tag-pill">{item}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-32 px-8 md:px-16 lg:px-24 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-4">
                Contact
              </p>
              <h2
                className="text-5xl md:text-6xl font-black text-[#e2e2f0] leading-tight mb-8"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Let&apos;s Build
                <br />
                <em className="text-gradient-cyan not-italic">Something.</em>
              </h2>
              <p className="text-[#8888aa] leading-relaxed mb-10 max-w-sm">
                I&apos;m currently available for freelance work, internships, and collaborative projects.
                If you have an idea — let&apos;s make it real.
              </p>
              <p className="text-sm text-[#8888aa] mb-8">
                Prefer email? <a className="text-[#22d3ee] hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </p>
              <div className="space-y-4">
                {[
                  { label: "Email", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
                  { label: "GitHub", value: "github.com/Archit0029", href: "https://github.com/Archit0029" },
                  { label: "LinkedIn", value: "linkedin.com/in/archit-29bishnoi", href: "https://www.linkedin.com/in/archit-29bishnoi" },
                ].map(({ label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-4 group"
                  >
                    <span className="text-xs font-mono text-[#8888aa] w-16 uppercase tracking-wider shrink-0">{label}</span>
                    <span className="text-sm text-[#e2e2f0] group-hover:text-[#22d3ee] transition-colors">{value}</span>
                    <svg
                      width="10" height="10" viewBox="0 0 10 10" fill="none"
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-[#22d3ee]"
                    >
                      <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <ContactForm />
          </div>
        </div>
      </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1e1e2e] py-8 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-[#8888aa]">
            © {new Date().getFullYear()} Archit Bishnoi
          </span>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#22d3ee] opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22d3ee]" />
            </span>
            <span className="text-xs font-mono text-[#22d3ee]">Open to opportunities</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSending(true);
    try {
      await sendPortfolioMessage(form);
      setSubmitted(true);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Unable to send your message.");
    } finally {
      setIsSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="border-glow p-10 flex flex-col items-center justify-center min-h-64 text-center gap-4">
        <div className="text-4xl text-[#22d3ee]">✓</div>
        <h3 className="text-xl font-display font-bold text-[#e2e2f0]" style={{ fontFamily: "Fraunces, serif" }}>
          Message Sent
        </h3>
        <p className="text-sm text-[#8888aa]">Thanks for reaching out. Your message was submitted.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-glow p-8 space-y-6">
      {[
        { id: "name", label: "Name", type: "text", placeholder: "Your name" },
        { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
      ].map(({ id, label, type, placeholder }) => (
        <div key={id}>
          <label
            htmlFor={id}
            className="block text-xs font-mono text-[#8888aa] uppercase tracking-widest mb-2"
          >
            {label}
          </label>
          <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={form[id as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [id]: e.target.value })}
            onFocus={() => setFocused(id)}
            onBlur={() => setFocused(null)}
            autoComplete={id === "name" ? "name" : "email"}
            maxLength={id === "name" ? 80 : 254}
            required
            className="w-full min-h-11 bg-[#111118] border text-[#e2e2f0] text-sm px-4 py-3 outline-none transition-colors placeholder:text-[#8888aa] font-mono"
            style={{
              borderColor: focused === id ? "#22d3ee55" : "#1e1e2e",
            }}
          />
        </div>
      ))}
      <div>
        <label htmlFor="message" className="block text-xs font-mono text-[#8888aa] uppercase tracking-widest mb-2">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Tell me about your project..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused(null)}
          maxLength={2000}
          required
          className="w-full min-h-11 bg-[#111118] border text-[#e2e2f0] text-sm px-4 py-3 outline-none transition-colors placeholder:text-[#8888aa] font-mono resize-none"
          style={{
            borderColor: focused === "message" ? "#22d3ee55" : "#1e1e2e",
          }}
        />
      </div>
      <div className="honeypot" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => setForm({ ...form, website: event.target.value })}
        />
      </div>
      <p className="text-xs leading-relaxed text-[#8888aa]">
        Your message is sent through FormSubmit to my email. If the form is unavailable, email me directly at{" "}
        <a className="text-[#22d3ee] hover:underline" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
      {error && <p className="text-sm text-[#f97316]" role="alert">{error}</p>}
      <button type="submit" className="cta-btn-solid min-h-11 w-full" disabled={isSending}>
        {isSending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
