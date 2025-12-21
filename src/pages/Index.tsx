import Header from "@/components/Header";
import ArticleCard from "@/components/ArticleCard";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import { articles } from "@/data/articles";
import { Mail, Instagram, Twitter } from "lucide-react";

const Index = () => {
  const featuredArticles = articles.slice(0, 6);
  const wellnessArticles = articles.filter(article => article.category.toLowerCase() === "wellness");
  const travelArticles = articles.filter(article => article.category.toLowerCase() === "travel");

  const authors = [
    {
      name: "Sofia Rodriguez",
      role: "Editor in Chief",
      bio: "Creative writer and mindfulness practitioner with 10+ years of experience in lifestyle journalism.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
    },
    {
      name: "Marcus Chen",
      role: "Senior Writer",
      bio: "Community builder and contemplative writer exploring the intersections of culture and wellness.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    },
    {
      name: "Emma Thompson",
      role: "Wellness Editor",
      bio: "Certified wellness coach and holistic health practitioner dedicated to sustainable self-care.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in scroll-smooth">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <HeroSection />

        {/* Intro Section */}
        <IntroSection />

        {/* Featured Articles Grid */}
        <section id="articles" className="py-12 scroll-mt-24">
          <div className="flex items-center justify-between mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Featured Articles</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div key={article.id} className={`animate-slide-up stagger-${Math.min(index + 1, 6)}`}>
                <ArticleCard {...article} size="small" />
              </div>
            ))}
          </div>
        </section>

        {/* Wellness Section */}
        <section id="wellness" className="py-16 scroll-mt-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Wellness</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Curated articles on mindfulness, self-care, and holistic health practices for a balanced life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wellnessArticles.map((article) => (
              <ArticleCard key={article.id} {...article} size="small" />
            ))}
          </div>
        </section>

        {/* Travel Section */}
        <section id="travel" className="py-16 scroll-mt-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Travel</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Stories of wanderlust and discovery, from hidden gems to transformative journeys.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travelArticles.map((article) => (
              <ArticleCard key={article.id} {...article} size="small" />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-16 scroll-mt-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Perspective began as a simple idea: create a space where thoughtful people could 
                  explore the art of intentional living. We believe that life is not about doing more, 
                  but about doing what matters.
                </p>
                <p>
                  Our mission is to inspire curiosity, foster creativity, and encourage meaningful 
                  connections through stories that resonate with the soul.
                </p>
                <p>
                  We're a small team of writers, photographers, and dreamers united by a shared 
                  passion for exploring life's beautiful complexities.
                </p>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
                alt="Our team" 
                className="w-full h-80 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Authors Section */}
        <section id="authors" className="py-16 scroll-mt-24">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Authors</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Meet the passionate writers behind our stories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {authors.map((author) => (
              <div key={author.name} className="bg-card rounded-2xl p-6 text-center">
                <img
                  src={author.image}
                  alt={author.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-lg">{author.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{author.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{author.bio}</p>
                <div className="flex justify-center gap-3">
                  <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                    <Mail className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="p-2 rounded-full hover:bg-muted transition-colors">
                    <Twitter className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 scroll-mt-24">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Have a story to share or want to collaborate? We'd love to hear from you.
              </p>
              <div className="space-y-4 text-muted-foreground">
                <p><strong className="text-foreground">Email:</strong> hello@perspective.com</p>
                <p><strong className="text-foreground">Location:</strong> San Francisco, CA</p>
              </div>
            </div>
            <div className="bg-card rounded-2xl p-8">
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <textarea
                  placeholder="Your message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <button
                  type="submit"
                  className="w-full px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section id="newsletter" className="my-20 rounded-[2.5rem] bg-card p-12 md:p-16 text-center animate-scale-in scroll-mt-24">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Stay inspired.</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Subscribe to receive our latest articles and insights directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-6 py-4 rounded-full border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              <button className="px-10 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 hover:scale-105 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#wellness" className="hover:text-accent transition-colors">Wellness</a></li>
                <li><a href="#travel" className="hover:text-accent transition-colors">Travel</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-accent transition-colors">Our Story</a></li>
                <li><a href="#authors" className="hover:text-accent transition-colors">Authors</a></li>
                <li><a href="#contact" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#newsletter" className="hover:text-accent transition-colors">Newsletter</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-accent transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2025 Perspective. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
