import { useEffect, useRef, useState } from "react";
import { sendPortfolioMessage } from "./services/contactService";
import { fetchGitHubProjects, type GitHubProject } from "./services/githubProjects";

const SKILLS = [
  { name: "React / Next.js", level: 90, cat: "Frontend" },
  { name: "TypeScript", level: 85, cat: "Frontend" },
  { name: "React Native", level: 80, cat: "Mobile" },
  { name: "Node.js / Express", level: 88, cat: "Backend" },
  { name: "MongoDB / PostgreSQL", level: 82, cat: "Backend" },
  { name: "Tailwind CSS", level: 92, cat: "Frontend" },
  { name: "Firebase / Supabase", level: 78, cat: "Backend" },
  { name: "Git / DevOps", level: 75, cat: "Tools" },
];

const FALLBACK_PROJECTS: GitHubProject[] = [
  {
    id: "01",
    title: "NeuralChat",
    desc: "Real-time AI chat application with streaming responses, context memory, and multi-modal input. Built with WebSockets and OpenAI API.",
    tags: ["React", "Node.js", "WebSocket", "OpenAI"],
    color: "#22d3ee",
    link: "#",
  },
  {
    id: "02",
    title: "TrackFlow",
    desc: "Cross-platform productivity app for teams. Task management with Kanban boards, time tracking, and analytics dashboard.",
    tags: ["React Native", "Expo", "Firebase", "Redux"],
    color: "#a78bfa",
    link: "#",
  },
  {
    id: "03",
    title: "ShopWave",
    desc: "Full-stack e-commerce platform with payment integration, inventory management, and a recommendation engine.",
    tags: ["Next.js", "PostgreSQL", "Stripe", "Prisma"],
    color: "#f97316",
    link: "#",
  },
  {
    id: "04",
    title: "DevPulse",
    desc: "Developer analytics dashboard that aggregates GitHub activity, PR stats, and code metrics into visual insights.",
    tags: ["React", "D3.js", "GitHub API", "Express"],
    color: "#22d3ee",
    link: "#",
  },
];

const MARQUEE_ITEMS = [
  "React", "TypeScript", "Node.js", "React Native", "Next.js",
  "MongoDB", "PostgreSQL", "Firebase", "Tailwind", "Express",
  "Redux", "GraphQL", "Docker", "Git", "Figma",
  "React", "TypeScript", "Node.js", "React Native", "Next.js",
  "MongoDB", "PostgreSQL", "Firebase", "Tailwind", "Express",
  "Redux", "GraphQL", "Docker", "Git", "Figma",
];

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

function SkillBar({ name, level, cat, delay = 0 }: { name: string; level: number; cat: string; delay?: number }) {
  const { ref, visible } = useIntersectionObserver(0.1);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && barRef.current) {
      setTimeout(() => {
        if (barRef.current) barRef.current.style.width = `${level}%`;
      }, delay);
    }
  }, [visible, level, delay]);

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-[#8888aa]">[{cat}]</span>
          <span className="text-sm text-[#e2e2f0] font-medium">{name}</span>
        </div>
        <span className="text-xs font-mono text-[#22d3ee]">{level}%</span>
      </div>
      <div className="h-[2px] bg-[#1e1e2e] rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="skill-bar-fill"
          style={{ transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: GitHubProject; index: number }) {
  const { ref, visible } = useIntersectionObserver(0.1);
  return (
    <div
      ref={ref}
      className="project-card p-8 rounded-none"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      <div className="flex items-start justify-between mb-6">
        <span
          className="text-5xl font-display font-black opacity-20"
          style={{ color: project.color, fontFamily: "Fraunces, serif" }}
        >
          {project.id}
        </span>
        <a
          href={project.link}
          className="w-8 h-8 border border-[#1e1e2e] flex items-center justify-center hover:border-[#22d3ee] hover:text-[#22d3ee] transition-all duration-200 text-[#8888aa]"
          aria-label="View project"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 11L11 1M11 1H4M11 1V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
      <h3
        className="text-2xl font-black mb-3"
        style={{ fontFamily: "Fraunces, serif", color: project.color }}
      >
        {project.title}
      </h3>
      <p className="text-[#8888aa] text-sm leading-relaxed mb-6">{project.desc}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="tag-pill">{tag}</span>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -400, y: -400 });
  const [navOpen, setNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [typedText, setTypedText] = useState("");
  const [glitchActive, setGlitchActive] = useState(false);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);

  const heroWords = ["Developer.", "Builder.", "Creator."];
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    fetchGitHubProjects(FALLBACK_PROJECTS).then(setProjects);
  }, []);

  // Cursor glow
  useEffect(() => {
    const move = (e: MouseEvent) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Typewriter effect
  useEffect(() => {
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
  }, [wordIdx]);

  // Random glitch
  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Scroll spy
  useEffect(() => {
    const sections = ["home", "about", "skills", "projects", "contact"];
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
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setNavOpen(false);
  };

  const navItems = ["home", "about", "skills", "projects", "contact"];

  return (
    <div className="relative min-h-screen bg-[#050508] overflow-x-hidden">
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
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 backdrop-blur-sm border-b border-[#1e1e2e40]">
        <button
          onClick={() => scrollTo("home")}
          className="font-mono text-sm text-[#22d3ee] tracking-widest uppercase hover:opacity-70 transition-opacity"
        >
          AB<span className="text-[#a78bfa]">_</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item)}
              className={`nav-link ${activeSection === item ? "!text-[#22d3ee]" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>

        <a
          href="mailto:architbishnoi177@gmail.com"
          className="hidden md:block cta-btn text-xs"
        >
          Hire Me
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-6 bg-[#22d3ee] transition-all duration-300 ${navOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-px w-6 bg-[#22d3ee] transition-all duration-300 ${navOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-[#22d3ee] transition-all duration-300 ${navOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#050508ee] flex flex-col items-center justify-center gap-8 transition-all duration-500 ${navOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {navItems.map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item)}
            className="text-4xl font-display font-black text-[#e2e2f0] hover:text-[#22d3ee] transition-colors"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            {item}
          </button>
        ))}
      </div>

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
            className={`text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-2 text-[#e2e2f0] ${glitchActive ? "glitch" : ""}`}
            data-text="Archit"
            style={{ fontFamily: "Fraunces, serif", animationDelay: "0.3s" }}
          >
            Archit
          </h1>
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-black leading-none mb-8 text-gradient-cyan"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            Bishnoi
          </h1>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-xl md:text-2xl text-[#8888aa] font-light">Full-Stack</span>
            <span className="text-xl md:text-2xl text-[#e2e2f0] font-medium min-w-[180px]">
              {typedText}
              <span className="animate-blink text-[#22d3ee]">|</span>
            </span>
          </div>

          <p className="text-[#8888aa] text-base leading-relaxed max-w-xl mb-10">
            BCA student crafting scalable web & mobile experiences. I turn ambitious ideas into elegant, performant products — from pixel to production.
          </p>

          <div className="flex flex-wrap gap-4">
            <button onClick={() => scrollTo("projects")} className="cta-btn-solid">
              View My Work
            </button>
            <button onClick={() => scrollTo("contact")} className="cta-btn">
              Get In Touch
            </button>
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

      {/* ABOUT */}
      <section id="about" className="py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="relative aspect-[4/5] max-w-sm bg-[#111118]">
              <img
                src="https://images.unsplash.com/photo-1562813733-b31f71025d54?w=600&h=750&fit=crop&auto=format"
                alt="Developer at work"
                className="w-full h-full object-cover mix-blend-luminosity opacity-60"
              />
              {/* Overlay color wash */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#22d3ee15] to-[#a78bfa15]" />
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#22d3ee]" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#22d3ee]" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#22d3ee]" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#22d3ee]" />
            </div>
            {/* Floating stat cards */}
            <div className="absolute -right-4 top-12 bg-[#0d0d14] border border-[#22d3ee33] p-4 animate-float" style={{ animationDelay: "1s" }}>
              <div className="text-3xl font-black text-[#22d3ee]" style={{ fontFamily: "Fraunces, serif" }}>20+</div>
              <div className="text-xs font-mono text-[#8888aa]">Projects Built</div>
            </div>
            <div className="absolute -right-8 bottom-16 bg-[#0d0d14] border border-[#a78bfa33] p-4 animate-float" style={{ animationDelay: "2s" }}>
              <div className="text-3xl font-black text-[#a78bfa]" style={{ fontFamily: "Fraunces, serif" }}>3+</div>
              <div className="text-xs font-mono text-[#8888aa]">Years Coding</div>
            </div>
          </div>

          {/* Text side */}
          <div>
            <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-4">
              01 / About Me
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
                I&apos;m a BCA student with a deep obsession for building things on the internet.
                What started as curiosity about &quot;how websites work&quot; became a full-on
                passion for crafting seamless digital products.
              </p>
              <p>
                I specialize in the full spectrum — from designing pixel-perfect interfaces
                to architecting robust backend systems and shipping cross-platform mobile apps.
                My work lives at the intersection of engineering and design.
              </p>
              <p>
                When I&apos;m not writing code, I&apos;m exploring new technologies, contributing
                to open source, or sketching out the next product idea.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                { label: "Location", value: "India" },
                { label: "Degree", value: "BCA" },
                { label: "Focus", value: "Full-Stack" },
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

      {/* SKILLS */}
      <section id="skills" className="py-32 px-8 md:px-16 lg:px-24 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-4">
              02 / Skills & Stack
            </p>
            <h2
              className="text-5xl md:text-6xl font-black text-[#e2e2f0]"
              style={{ fontFamily: "Fraunces, serif" }}
            >
              What I
              <em className="text-gradient-cyan not-italic"> Work With</em>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              {SKILLS.map((skill, i) => (
                <SkillBar key={skill.name} {...skill} delay={i * 100} />
              ))}
            </div>

            <div className="space-y-8">
              {/* Tech cluster visual */}
              <div className="border-glow p-8 space-y-6">
                <h3 className="text-xs font-mono text-[#8888aa] uppercase tracking-widest">
                  Tech Ecosystem
                </h3>
                {[
                  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion"] },
                  { label: "Backend", items: ["Node.js", "Express", "GraphQL", "REST", "WebSocket"] },
                  { label: "Mobile", items: ["React Native", "Expo", "Android", "iOS"] },
                  { label: "Data", items: ["MongoDB", "PostgreSQL", "Redis", "Prisma", "Firebase"] },
                  { label: "Tools", items: ["Git", "Docker", "Vercel", "Figma", "VS Code"] },
                ].map(({ label, items }) => (
                  <div key={label}>
                    <div className="text-xs font-mono text-[#22d3ee] mb-2 uppercase tracking-wider">{label}</div>
                    <div className="flex flex-wrap gap-2">
                      {items.map((item) => (
                        <span key={item} className="tag-pill cursor-default">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-32 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-mono text-[#22d3ee] tracking-widest uppercase mb-4">
                03 / Selected Work
              </p>
              <h2
                className="text-5xl md:text-6xl font-black text-[#e2e2f0]"
                style={{ fontFamily: "Fraunces, serif" }}
              >
                Projects That
                <br />
                <em className="text-gradient-cyan not-italic">Ship.</em>
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
              <ProjectCard key={project.id} project={project} index={i} />
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
                04 / Contact
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
              <div className="space-y-4">
                {[
                  { label: "Email", value: "architbishnoi177@gmail.com", href: "mailto:architbishnoi177@gmail.com" },
                  { label: "GitHub", value: "github.com/Archit0029", href: "https://github.com/Archit0029" },
                  { label: "LinkedIn", value: "linkedin.com/in/Archit-29bishnoi", href: "https://www.linkedin.com/in/Archit-29bishnoi" },
                ].map(({ label, value, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
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

      {/* FOOTER */}
      <footer className="border-t border-[#1e1e2e] py-8 px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-xs font-mono text-[#8888aa]">
            © 2024 Archit Bishnoi — Designed & Built with obsession
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
  const [form, setForm] = useState({ name: "", email: "", message: "" });
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
        <p className="text-sm text-[#8888aa]">I&apos;ll get back to you within 24 hours.</p>
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
            required
            className="w-full bg-[#111118] border text-[#e2e2f0] text-sm px-4 py-3 outline-none transition-colors placeholder:text-[#4a4a6a] font-mono"
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
          required
          className="w-full bg-[#111118] border text-[#e2e2f0] text-sm px-4 py-3 outline-none transition-colors placeholder:text-[#4a4a6a] font-mono resize-none"
          style={{
            borderColor: focused === "message" ? "#22d3ee55" : "#1e1e2e",
          }}
        />
      </div>
      {error && <p className="text-sm text-[#f97316]" role="alert">{error}</p>}
      <button type="submit" className="cta-btn-solid w-full" disabled={isSending}>
        {isSending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
