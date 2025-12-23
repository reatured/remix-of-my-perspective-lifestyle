import { useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 py-3 sm:py-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between rounded-full border border-border/60 bg-background/80 px-4 py-2 backdrop-blur-md shadow-[0_12px_40px_-28px_hsl(var(--foreground)/0.6)]">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              LZ
            </div>
            <div className="hidden sm:block">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">Portfolio</p>
              <p className="text-lg font-display">Lingyi Zhou</p>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#work" className="hover:text-accent transition-colors">Work</a>
            <a href="#about" className="hover:text-accent transition-colors">About</a>
            <a href="#practice" className="hover:text-accent transition-colors">Practice</a>
            <a href="#notes" className="hover:text-accent transition-colors">Notes</a>
            <a href="#contact" className="hover:text-accent transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" />
            </a>
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
              <a href="#work" onClick={() => setIsMenuOpen(false)} className="hover:text-accent transition-colors">
                Work
              </a>
              <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-accent transition-colors">
                About
              </a>
              <a href="#practice" onClick={() => setIsMenuOpen(false)} className="hover:text-accent transition-colors">
                Practice
              </a>
              <a href="#notes" onClick={() => setIsMenuOpen(false)} className="hover:text-accent transition-colors">
                Notes
              </a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-accent transition-colors">
                Contact
              </a>
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-between rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
