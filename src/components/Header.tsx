import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 py-3 sm:py-4">
      <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-accent/10 via-accent/5 to-transparent pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="flex items-center justify-between rounded-full border border-border/60 bg-background/80 px-4 py-2 backdrop-blur-md shadow-[0_12px_40px_-28px_hsl(var(--foreground)/0.6),0_0_60px_-10px_hsl(var(--accent)/0.3)]">
          <a href="/">
            <p className="text-lg font-display">Lingyi Zhou</p>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#3d-design" className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
              <span className="relative z-10">3d design</span>
            </a>
            <a href="#full-stack" className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
              <span className="relative z-10">Full stack</span>
            </a>
            <a href="#interactive-design" className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
              <span className="relative z-10">interactive design</span>
            </a>
            <a href="#game-dev" className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
              <span className="relative z-10">game Dev</span>
            </a>
            <a href="#about-me" className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
              <span className="relative z-10">About me</span>
            </a>
            <a href="#resume" className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
              <span className="relative z-10">Resume</span>
            </a>
            <a href="#contact" className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
              <span className="relative z-10">Contact</span>
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="md:hidden rounded-full p-2 hover:bg-muted/60 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-border/60 bg-background/90 p-5 backdrop-blur animate-fade-in">
            <nav className="flex flex-col gap-4 text-sm font-medium">
              <a href="#3d-design" onClick={() => setIsMenuOpen(false)} className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
                <span className="relative z-10">3d design</span>
              </a>
              <a href="#full-stack" onClick={() => setIsMenuOpen(false)} className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
                <span className="relative z-10">Full stack</span>
              </a>
              <a href="#interactive-design" onClick={() => setIsMenuOpen(false)} className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
                <span className="relative z-10">interactive design</span>
              </a>
              <a href="#game-dev" onClick={() => setIsMenuOpen(false)} className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
                <span className="relative z-10">game Dev</span>
              </a>
              <a href="#about-me" onClick={() => setIsMenuOpen(false)} className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
                <span className="relative z-10">About me</span>
              </a>
              <a href="#resume" onClick={() => setIsMenuOpen(false)} className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
                <span className="relative z-10">Resume</span>
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="relative px-3 py-2 text-muted-foreground transition-all duration-300 before:absolute before:inset-0 before:bg-accent/10 before:rounded-full before:scale-0 before:transition-transform before:duration-300 hover:before:scale-100 hover:text-accent hover:drop-shadow-[0_0_12px_hsl(var(--accent)/0.6)]">
                <span className="relative z-10">Contact</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
