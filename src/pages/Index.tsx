import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, Mail, Instagram, Linkedin } from "lucide-react";

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
    <div className="h-screen bg-background text-foreground overflow-hidden animate-fade-in">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-[hsl(var(--accent)/0.25)] blur-[120px]" />
        <div className="absolute top-[30%] left-[-15%] h-96 w-96 rounded-full bg-[hsl(var(--secondary)/0.25)] blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[20%] h-80 w-80 rounded-full bg-[hsl(var(--highlight)/0.3)] blur-[120px]" />
      </div>

      <Header />

      <main className="relative h-[calc(100vh-80px)] overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth flex hide-scrollbar">
        <section className="min-w-full w-screen h-full snap-start flex-shrink-0 overflow-y-auto hide-scrollbar px-4 sm:px-6" id="top">
          <div className="max-w-6xl mx-auto pt-12 sm:pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Skills Navigation */}
            <div className="space-y-3">
              <a
                href="#3d-design"
                className="block relative px-5 py-4 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-2xl before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)] rounded-2xl border border-border/60 bg-card/80"
              >
                <span className="relative z-10 text-lg font-display block mb-2">3D Designer</span>
                <span className="relative z-10 text-sm text-muted-foreground block">Blender, Maya, Cinema4D</span>
              </a>

              <a
                href="#full-stack"
                className="block relative px-5 py-4 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-2xl before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)] rounded-2xl border border-border/60 bg-card/80"
              >
                <span className="relative z-10 text-lg font-display block mb-2">Full Stack Engineer</span>
                <span className="relative z-10 text-sm text-muted-foreground block">React, FastAPI, PostgreSQL</span>
              </a>

              <a
                href="#interactive-design"
                className="block relative px-5 py-4 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-2xl before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)] rounded-2xl border border-border/60 bg-card/80"
              >
                <span className="relative z-10 text-lg font-display block mb-2">XR Developer</span>
                <span className="relative z-10 text-sm text-muted-foreground block">AR/VR, Lens Studio, Unity</span>
              </a>

              <a
                href="#game-dev"
                className="block relative px-5 py-4 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-2xl before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)] rounded-2xl border border-border/60 bg-card/80"
              >
                <span className="relative z-10 text-lg font-display block mb-2">Game Developer</span>
                <span className="relative z-10 text-sm text-muted-foreground block">Unity, Shaders, C#</span>
              </a>

              <a
                href="#about-me"
                className="block relative px-5 py-4 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-2xl before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)] rounded-2xl border border-border/60 bg-card/80"
              >
                <span className="relative z-10 text-lg font-display block mb-2">Graphic Designer</span>
                <span className="relative z-10 text-sm text-muted-foreground block">InDesign, Illustrator</span>
              </a>
            </div>

            {/* Right Column - Portrait & Info */}
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-border/70 bg-card/80 overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Portrait Image</p>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">Experience</p>
                <p className="text-lg font-medium">Ex. AR Engineer @ Snap Inc.</p>
                <p className="text-lg font-medium">Ex. Unity Engineer @ Unity</p>
              </div>

              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground mb-2">Education</p>
                <p className="text-lg font-medium">MFA Design and Technology @ Parsons</p>
                <p className="text-lg font-medium">MA Game Design & Development @ Columbia</p>
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="#3d-design"
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
            </div>
          </div>
          </div>
        </section>

        <section id="3d-design" className="min-w-full w-screen h-full snap-start flex-shrink-0 overflow-y-auto hide-scrollbar px-4 sm:px-6">
          <div className="max-w-6xl mx-auto py-16">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">3D Design</p>
              <h2 className="text-3xl sm:text-4xl font-display mt-3">3D modeling, rendering, and animation.</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-6">
                <h3 className="text-xl font-display mb-3">Skills</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Stylized and realistic modeling and rendering</li>
                  <li>• Character and environment design</li>
                  <li>• Animation and rigging</li>
                  <li>• Procedural modeling and texturing</li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-6">
                <h3 className="text-xl font-display mb-3">Tech Stack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Blender</li>
                  <li>• Maya</li>
                  <li>• Cinema4D</li>
                  <li>• Substance Painter</li>
                </ul>
              </div>
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
          </div>
        </section>

        <section id="full-stack" className="min-w-full w-screen h-full snap-start flex-shrink-0 overflow-y-auto hide-scrollbar px-4 sm:px-6">
          <div className="max-w-6xl mx-auto py-16">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Full Stack</p>
              <h2 className="text-3xl sm:text-4xl font-display mt-3">Full-stack web development.</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-6">
                <h3 className="text-xl font-display mb-3">Skills</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Frontend development with React</li>
                  <li>• Backend API development with FastAPI</li>
                  <li>• Database design and management</li>
                  <li>• RESTful API architecture</li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-6">
                <h3 className="text-xl font-display mb-3">Tech Stack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• React</li>
                  <li>• FastAPI</li>
                  <li>• PostgreSQL</li>
                  <li>• TypeScript</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <p className="text-muted-foreground">Full-stack projects and applications will be showcased here.</p>
            </div>
          </div>
          </div>
        </section>

        <section id="interactive-design" className="min-w-full w-screen h-full snap-start flex-shrink-0 overflow-y-auto hide-scrollbar px-4 sm:px-6">
          <div className="max-w-6xl mx-auto py-16">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">XR Development</p>
              <h2 className="text-3xl sm:text-4xl font-display mt-3">AR and VR experiences.</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-6">
                <h3 className="text-xl font-display mb-3">Skills</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AR filter development for social media</li>
                  <li>• VR application development</li>
                  <li>• Hand tracking and gesture recognition</li>
                  <li>• Spatial computing interfaces</li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-6">
                <h3 className="text-xl font-display mb-3">Tech Stack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Lens Studio (Snapchat)</li>
                  <li>• Effect House (TikTok)</li>
                  <li>• Unity XR</li>
                  <li>• Oculus Quest & Apple Vision Pro</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <p className="text-muted-foreground">XR projects and experiences will be showcased here.</p>
            </div>
          </div>
          </div>
        </section>

        <section id="game-dev" className="min-w-full w-screen h-full snap-start flex-shrink-0 overflow-y-auto hide-scrollbar px-4 sm:px-6">
          <div className="max-w-6xl mx-auto py-16">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Game Dev</p>
              <h2 className="text-3xl sm:text-4xl font-display mt-3">Game development and interactive media.</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-6">
                <h3 className="text-xl font-display mb-3">Skills</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Desktop and mobile game development</li>
                  <li>• Shader programming and visual effects</li>
                  <li>• Game mechanics and systems design</li>
                  <li>• Performance optimization</li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-border/60 bg-card/80 p-6">
                <h3 className="text-xl font-display mb-3">Tech Stack</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Unity Engine</li>
                  <li>• C# Programming</li>
                  <li>• HLSL/ShaderLab</li>
                  <li>• Unity Editor Tools</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <p className="text-muted-foreground">Game development projects will be showcased here.</p>
            </div>
          </div>
          </div>
        </section>

        <section id="about-me" className="min-w-full w-screen h-full snap-start flex-shrink-0 overflow-y-auto hide-scrollbar px-4 sm:px-6">
          <div className="max-w-6xl mx-auto py-16">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">About Me</p>
              <h2 className="text-3xl sm:text-4xl font-display mt-3">Introduction</h2>
            </div>

            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Add your personal introduction here...
              </p>
            </div>
          </div>
          </div>
        </section>

        <section id="resume" className="min-w-full w-screen h-full snap-start flex-shrink-0 overflow-y-auto hide-scrollbar px-4 sm:px-6">
          <div className="max-w-6xl mx-auto py-16">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Resume</p>
              <h1 className="mt-4 text-3xl sm:text-4xl font-display">Richard Lingyi Zhou</h1>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span>+1 (646) 220-9597</span>
                <span>zeroonelatte@gmail.com</span>
                <span>Seattle, WA</span>
                <a href="https://www.linkedin.com/in/lingyizhou/" target="_blank" rel="noopener noreferrer" className="hover:text-accent">LinkedIn</a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent">GitHub</a>
                <a href="#top" className="hover:text-accent">Portfolio</a>
              </div>
            </div>

            {/* Skills */}
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <h2 className="text-2xl font-display mb-6">Skills</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-accent mb-2">API & Integration</p>
                  <p className="text-sm text-muted-foreground">REST API, FastAPI, WebSocket, SDK Development, API Documentation, OAuth/Auth Flows, Latency Optimization</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-accent mb-2">Programming Language</p>
                  <p className="text-sm text-muted-foreground">Python, JavaScript, TypeScript, C#, C++</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-accent mb-2">Full-Stack Development</p>
                  <p className="text-sm text-muted-foreground">React, FastAPI, PostgreSQL, Node.js, AWS, Technical Documentation, Reference Implementations</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-accent mb-2">Real-Time Systems</p>
                  <p className="text-sm text-muted-foreground">WebSocket Streaming, ZMQ, Multi-device Orchestration, Low-latency Data Pipelines</p>
                </div>
              </div>
            </div>

            {/* Professional Experience */}
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <h2 className="text-2xl font-display mb-6">Professional Experience</h2>
              <div className="space-y-8">
                {/* Realhand Inc. */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-display">Software Engineer</h3>
                    <p className="text-sm text-muted-foreground">Realhand Inc. | Seattle, WA | August 2025 - Present</p>
                    <p className="text-xs text-muted-foreground mt-1">API Platform, ML Systems & Developer Tooling | Python, React, Three.js, C#, Unity</p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Built an end-to-end ML data platform for robot ML training, developing CV pipelines with MediaPipe to capture human hand pose demonstrations and synchronized camera observations, producing clean, reusable datasets consumed by training and evaluation workflows.</li>
                    <li>Developed a real-time teleoperation and recording system for robot control and human demonstrations, streaming 21-joint hand pose and head tracking data via ZMQ-based APIs, with orchestration tooling to reliably synchronize 7+ devices per session.</li>
                    <li>Built internal monitoring, inspection, and debugging tools used by engineers and non-technical stakeholders to validate data quality, system health, and integration correctness during live capture and deployment sessions.</li>
                    <li>Designed a unified hand-pose normalization layer mapping 23 heterogeneous robot hand models into a single, API-compatible representation, reducing integration friction and accelerating experimentation and partner onboarding for new VR headsets and robot hands.</li>
                  </ul>
                </div>

                {/* Urban Systems Lab */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-display">Game Developer</h3>
                    <p className="text-sm text-muted-foreground">Urban Systems Lab, New York University | Remote | Feb 2025 - August 2025</p>
                    <p className="text-xs text-muted-foreground mt-1">Educational Simulation Platform | C#, Unity, Blender</p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Developed an Educational Game for sustainable urban planning research, building modular gameplay and data-driven systems.</li>
                    <li>Created and optimized modular 3D map tile assets in Blender for Unity.</li>
                  </ul>
                </div>

                {/* Moviebill */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-display">Game Engine Engineer</h3>
                    <p className="text-sm text-muted-foreground">Moviebill | Los Angeles, CA | Aug 2023 - Aug 2024</p>
                    <p className="text-xs text-muted-foreground mt-1">AR Games System and Platform | C#, Unity, Blender, HLSL, Lens Studio, Effect House</p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Developed internal Unity Editor-based level management tools that enhanced cross-functional collaboration with UI designers, level designers, and backend engineers, featuring drag-and-drop functionality, level creation systems, and integrated difficulty controls that reduced development time for publishing new levels each month.</li>
                    <li>Built interactive AR filter in Effect House and Lens Studio for The Marvels Disney campaign across Snapchat and TikTok platforms, implementing real-time cat-to-Flerken transformation with animated VFX to enhance the movie's social media presence.</li>
                    <li>Implemented front-end gameplay systems in Unity integrating with backend APIs for user data synchronization and real-time interaction, supporting a platform with over 20,000 monthly users.</li>
                    <li>Prototyped VR game interaction systems and shader effects for Apple Vision Pro and Quest 3, including XR inventory management with grab, scale, and physics-based object interaction in VR space.</li>
                  </ul>
                </div>

                {/* Snap Inc. */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-display">AR Engine Engineer Intern</h3>
                    <p className="text-sm text-muted-foreground">Snap Inc. | Mountain View, CA | May 2022 - Aug 2022</p>
                    <p className="text-xs text-muted-foreground mt-1">Lens Studio Official Assets & Documentation | JavaScript, TypeScript, Lens Studio</p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Developed a plugin package for Lens Studio's core procedural mesh library, featuring configurable parameters that enable AR creators to integrate procedural mesh generation in real-time AR hand interactions. The package is published in Lens Studio's asset store.</li>
                    <li>Created developer-facing documentation page on the official Lens Studio documentation site for procedural mesh library, featuring sample projects, setup tutorials, instructional screen recordings, and code examples that guide developers and enhance the potential of the procedural mesh library ecosystem.</li>
                    <li>Designed and developed AR drawing Snapchat filter (200k plays and views in first month), combining procedural mesh with hand tracking, and gesture detection, as an exploration of a new form of AR interaction and as a demo project for procedural mesh library.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <h2 className="text-2xl font-display mb-6">Projects</h2>
              <div className="space-y-8">
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-display">B2B Potential Customer Search Tool</h3>
                    <p className="text-sm text-muted-foreground">Full Stack Developer | June 2025 - July 2025</p>
                    <p className="text-xs text-muted-foreground mt-1">TypeScript, React, Python, FastAPI, Railway</p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Developed automated B2B lead generation platform that discovers companies by location, uses AI to assess product-market fit, and generates personalized cold emails at scale.</li>
                    <li>Built with React frontend (React Router, Material-UI, Tailwind), FastAPI backend, PostgreSQL database, Google Maps API for location search, and Perplexity AI for company analysis.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-display">AR Drawing Snapchat Library</h3>
                    <p className="text-sm text-muted-foreground">Solo Developer | May 2022 - Aug 2022</p>
                    <p className="text-xs text-muted-foreground mt-1">JavaScript, Lens Studio</p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>Built innovative Snapchat AR filter empowering users to create original 3D artwork in AR space rather than pre-made content, achieving 200k plays in first month and demonstrating new paradigm for user-generated AR experiences on social platforms.</li>
                    <li>Interviewed engineers, designers, and creators across teams to identify pain points in using procedural mesh, analyzed archived projects to validate findings, and designed expansion roadmap that improved developer experience.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8">
              <h2 className="text-2xl font-display mb-6">Education</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Parsons School of Design, New York, NY</p>
                  <p className="text-sm text-muted-foreground">MFA in Design and Technology | 2021-2023</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Columbia University, New York, NY</p>
                  <p className="text-sm text-muted-foreground">MA in Design and Development of Digital Games | 2019-2021</p>
                </div>
                <div>
                  <p className="text-sm font-medium">University of California, Davis, Davis, CA</p>
                  <p className="text-sm text-muted-foreground">BS in Agricultural and Environmental Science | 2015-2019</p>
                </div>
              </div>
            </div>

            <a
              href="/resume.pdf"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Download Resume
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          </div>
        </section>

        <section id="contact" className="min-w-full w-screen h-full snap-start flex-shrink-0 overflow-y-auto hide-scrollbar px-4 sm:px-6">
          <div className="max-w-6xl mx-auto py-16">
          <div className="rounded-[2.5rem] border border-border/70 bg-card/80 p-10 md:p-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Contact</p>
                <h2 className="mt-4 text-3xl font-display">Build something with feeling.</h2>
                <p className="mt-4 text-muted-foreground max-w-xl">
                  I partner with teams and founders who value narrative, clarity, and tactile digital craft.
                  Share a project brief or just say hello.
                </p>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <a
                  href="mailto:zeroonelatte@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-foreground hover:border-foreground/60"
                >
                  <Mail className="h-4 w-4" />
                  zeroonelatte@gmail.com
                </a>
                <a
                  href="https://instagram.com/reartured"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-foreground hover:border-foreground/60"
                >
                  <Instagram className="h-4 w-4" />
                  @reartured
                </a>
                <a
                  href="https://www.linkedin.com/in/lingyizhou/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-foreground hover:border-foreground/60"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          </div>
        </section>
      </main>

    </div>
  );
};

export default Index;
