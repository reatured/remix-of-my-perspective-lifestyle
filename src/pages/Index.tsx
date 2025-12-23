import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, Mail, Instagram, Linkedin, Sparkles } from "lucide-react";

const fallbackProjects = [
  {
    title: "Remix of Perspective",
    type: "Digital Experience",
    year: "2025",
    description: "Reimagining a lifestyle platform as an immersive, tactile editorial for modern readers.",
    tags: ["Creative direction", "UI design", "Storytelling"],
    color: "from-[#f7c6b8] via-[#f3d6c2] to-[#f7ede2]",
  },
  {
    title: "Stillness Atlas",
    type: "Editorial + Photography",
    year: "2024",
    description: "A visual atlas of quiet places and textured light, blending analog photography with short essays.",
    tags: ["Art direction", "Photography", "Print"],
    color: "from-[#c6d8d3] via-[#dde7de] to-[#f3f6ee]",
  },
  {
    title: "Studio Gather",
    type: "Brand + Identity",
    year: "2023",
    description: "A hospitality concept shaped by slow rituals, crafted identities, and a warm digital presence.",
    tags: ["Brand systems", "UX", "Naming"],
    color: "from-[#f5d2a8] via-[#f4e3c4] to-[#f9f4e6]",
  },
];

const buildYouTubeEmbedSrc = (url: string) => {
  const hasQuery = url.includes("?");
  const params = new URLSearchParams(hasQuery ? url.split("?")[1] : "");
  params.set("controls", "0");
  params.set("modestbranding", "1");
  params.set("rel", "0");
  params.set("showinfo", "0");
  params.set("playsinline", "1");
  params.set("enablejsapi", "1");
  params.set("mute", "1");
  params.set("autoplay", "0");
  params.set("iv_load_policy", "3");
  params.set("fs", "0");
  params.set("disablekb", "1");
  params.set("cc_load_policy", "0");
  params.set("autohide", "1");
  params.set("origin", window.location.origin);
  return `${url.split("?")[0]}?${params.toString()}`;
};

const normalizeYouTubeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.includes("youtube.com/embed/") || trimmed.includes("youtube-nocookie.com/embed/")) {
    return trimmed.replace("youtube.com/embed/", "youtube-nocookie.com/embed/");
  }

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch?.[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortMatch[1]}`;
  }

  const watchMatch = trimmed.match(/v=([a-zA-Z0-9_-]+)/);
  if (watchMatch?.[1]) {
    return `https://www.youtube-nocookie.com/embed/${watchMatch[1]}`;
  }

  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch?.[1]) {
    return `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}`;
  }

  return null;
};

const Index = () => {

  const practices = [
    {
      title: "Observation-led design",
      description: "I start with field notes, interviews, and visual diaries to build empathy before pixels.",
    },
    {
      title: "Narrative systems",
      description: "I design structure and motion so content feels like a story unfolding, not a menu.",
    },
    {
      title: "Craft with intent",
      description: "Typography, light, and texture are used deliberately to shape feeling and memory.",
    },
  ];

  const notes = [
    {
      title: "On designing with restraint",
      date: "Aug 2024",
      description: "A reflection on when to remove, not add, in digital storytelling.",
    },
    {
      title: "Color as atmosphere",
      date: "May 2024",
      description: "How warm neutrals and deep greens build emotional calm.",
    },
    {
      title: "The quiet web",
      date: "Jan 2024",
      description: "Designing interfaces that breathe and leave room for pause.",
    },
  ];

  const [projects, setProjects] = useState(fallbackProjects);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({});

  const sendYouTubeCommand = (index: number, command: "playVideo" | "pauseVideo") => {
    const iframe = iframeRefs.current[index];
    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args: [],
      }),
      "*"
    );
  };

  useEffect(() => {
    const loadProjects = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("title,type,year,description,tags,image_path,video_url,sort_order,published")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (error || !data?.length) {
        return;
      }

      const mapped = data.map((project, index) => {
        const fallback = fallbackProjects[index % fallbackProjects.length];
        const normalizedTags = Array.isArray(project.tags)
          ? project.tags
          : typeof project.tags === "string"
            ? [project.tags]
            : fallback.tags;
        const imageUrl = project.image_path
          ? supabase.storage.from("portfolio-images").getPublicUrl(project.image_path).data.publicUrl
          : undefined;
        const videoUrl = project.video_url ? normalizeYouTubeUrl(project.video_url) : undefined;

        return {
          title: project.title,
          type: project.type ?? fallback.type,
          year: project.year ? String(project.year) : fallback.year,
          description: project.description ?? fallback.description,
          tags: normalizedTags,
          color: fallback.color,
          imageUrl,
          videoUrl,
        };
      });

      setProjects(mapped);
    };

    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth animate-fade-in">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-[hsl(var(--accent)/0.25)] blur-[120px]" />
        <div className="absolute top-[30%] left-[-15%] h-96 w-96 rounded-full bg-[hsl(var(--secondary)/0.25)] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[20%] h-80 w-80 rounded-full bg-[hsl(var(--highlight)/0.3)] blur-[120px]" />
      </div>

      <Header />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <section className="pt-12 sm:pt-20 pb-16" id="top">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Lingyi Zhou</p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display leading-tight">
                Designing digital narratives that feel human, textured, and quietly bold.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                I am a multidisciplinary designer crafting immersive web experiences, editorial identities, and
                thoughtful visuals for brands that care about atmosphere and story.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#work"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  View selected work
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-border/80 px-5 py-3 text-sm font-medium text-foreground hover:border-foreground/60 transition-colors"
                >
                  Say hello
                </a>
              </div>
              <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span>Available for collaborations</span>
                <span>Based between cities</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-[0_24px_60px_-40px_hsl(var(--foreground)/0.5)]">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  Currently focusing on
                </div>
                <h2 className="mt-4 text-2xl font-display">Digital atmospheres and editorial-led products.</h2>
                <p className="mt-4 text-sm text-muted-foreground">
                  Recent work spans cultural brands, wellness studios, and boutique hospitality.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl bg-background/70 p-4">
                    <p className="text-muted-foreground">Selected clients</p>
                    <p className="mt-2 font-medium">Muse & Co, Studio Heya, Stillroom</p>
                  </div>
                  <div className="rounded-2xl bg-background/70 p-4">
                    <p className="text-muted-foreground">Expertise</p>
                    <p className="mt-2 font-medium">Direction, UI/UX, visual storytelling</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span className="rounded-full border border-border/70 py-2">Editorial</span>
                <span className="rounded-full border border-border/70 py-2">Product</span>
                <span className="rounded-full border border-border/70 py-2">Photography</span>
              </div>
            </div>
          </div>
        </section>

        <section id="work" className="py-16 scroll-mt-28">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Selected Work</p>
              <h2 className="text-3xl sm:text-4xl font-display mt-3">Projects shaped by texture and story.</h2>
            </div>
            
          </div>

          <div className="mt-10 grid gap-8">
            {projects.map((project, index) => {
              const isHovered = hoveredProject === index;
              const videoSrc = project.videoUrl ? buildYouTubeEmbedSrc(project.videoUrl) : null;

              return (
              <article
                key={project.title}
                onMouseEnter={() => {
                  setHoveredProject(index);
                  sendYouTubeCommand(index, "playVideo");
                }}
                onMouseLeave={() => {
                  setHoveredProject(null);
                  sendYouTubeCommand(index, "pauseVideo");
                }}
                className={`group grid gap-6 rounded-[2rem] border border-border/70 bg-card/80 p-6 transition-transform duration-300 hover:-translate-y-2 animate-slide-up stagger-${index + 1} lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center`}
              >
                <div className="relative h-64 sm:h-72 rounded-[1.5rem] overflow-hidden bg-gradient-to-br">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`h-full w-full bg-gradient-to-br ${project.color}`} />
                  )}
                  {videoSrc && (
                    <iframe
                      ref={(node) => {
                        iframeRefs.current[index] = node;
                      }}
                      className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 ${
                        project.imageUrl ? (isHovered ? "opacity-100" : "opacity-0") : "opacity-100"
                      }`}
                      src={videoSrc}
                      title={`${project.title} video`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    <span>{project.type}</span>
                    <span>{project.year}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-foreground">
                    {project.tags.map((tag) => (
                      <span key={tag} className="rounded-full border border-border/70 px-3 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
            })}
          </div>
        </section>

        <section id="about" className="py-16 scroll-mt-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] items-center">
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">About</p>
              <h2 className="mt-4 text-3xl font-display">A calm, observational approach to design.</h2>
              <p className="mt-4 text-muted-foreground">
                My practice sits between product design and editorial art direction. I care deeply about
                how texture, rhythm, and spatial balance shape the feeling of a page. My goal is to
                create work that feels lived-in rather than manufactured.
              </p>
              <p className="mt-4 text-muted-foreground">
                When I am not designing, I collect photographs, write short essays, and map quiet
                spaces for future stories.
              </p>
            </div>
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-border/70 bg-background/70 p-8">
                <h3 className="text-2xl font-display">Experience</h3>
                <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
                  <li className="flex justify-between gap-4">
                    <span>Independent designer</span>
                    <span>2021 — Now</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>Digital designer, Studio Mellow</span>
                    <span>2019 — 2021</span>
                  </li>
                  <li className="flex justify-between gap-4">
                    <span>Visual researcher, Quiet Lab</span>
                    <span>2017 — 2019</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-[2rem] border border-border/70 bg-background/70 p-6 text-sm text-muted-foreground">
                <p className="uppercase tracking-[0.4em] text-xs">Toolkit</p>
                <p className="mt-3 text-foreground">Figma, Framer, Webflow, Adobe CC, Notion, Miro</p>
              </div>
            </div>
          </div>
        </section>

        <section id="practice" className="py-16 scroll-mt-28">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Practice</p>
              <h2 className="text-3xl sm:text-4xl font-display mt-3">How I shape projects.</h2>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {practices.map((practice) => (
              <div key={practice.title} className="rounded-[2rem] border border-border/70 bg-card/80 p-6">
                <h3 className="text-xl font-display">{practice.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{practice.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="notes" className="py-16 scroll-mt-28">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Notes</p>
              <h2 className="mt-4 text-3xl font-display">Short essays & process reflections.</h2>
              <div className="mt-6 space-y-5">
                {notes.map((note) => (
                  <div key={note.title} className="rounded-[1.5rem] border border-border/60 bg-background/80 p-5">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      <span>{note.date}</span>
                      <span>Note</span>
                    </div>
                    <h3 className="mt-3 text-lg font-display">{note.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{note.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-border/70 bg-background/70 p-6">
                <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Recognition</p>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li>CSS Design Awards — Special Kudos</li>
                  <li>Awwwards — Honorable Mention</li>
                  <li>Site Inspire — Featured</li>
                </ul>
              </div>
              <div className="rounded-[2rem] border border-border/70 bg-background/70 p-6">
                <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Currently reading</p>
                <p className="mt-3 text-lg font-display">Ways of Seeing</p>
                <p className="text-sm text-muted-foreground">John Berger</p>
              </div>
              <div className="rounded-[2rem] border border-border/70 bg-background/70 p-6">
                <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Newsletter</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  A monthly note about design, slow travel, and visual culture. No spam, just field notes.
                </p>
                <form className="mt-4 flex flex-col gap-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full rounded-full border border-border/70 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Join the list
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 scroll-mt-28">
          <div className="rounded-[2.5rem] border border-border/70 bg-card/80 p-10 md:p-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Contact</p>
                <h2 className="mt-4 text-3xl font-display">Let’s build something with feeling.</h2>
                <p className="mt-4 text-muted-foreground max-w-xl">
                  I partner with teams and founders who value narrative, clarity, and tactile digital craft.
                  Share a project brief or just say hello.
                </p>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <a
                  href="mailto:hello@lingyizhou.com"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-foreground hover:border-foreground/60"
                >
                  <Mail className="h-4 w-4" />
                  hello@lingyizhou.com
                </a>
                <a
                  href="https://instagram.com/"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-foreground hover:border-foreground/60"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram
                </a>
                <a
                  href="https://linkedin.com/"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-foreground hover:border-foreground/60"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 text-sm text-muted-foreground flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>© 2025 Lingyi Zhou. Crafted with intention.</p>
          <div className="flex gap-4">
            <a href="#work" className="hover:text-accent">Work</a>
            <a href="#notes" className="hover:text-accent">Notes</a>
            <a href="#contact" className="hover:text-accent">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
