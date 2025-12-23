import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight, Upload } from "lucide-react";

const normalizeYouTubeUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.includes("youtube.com/embed/")) {
    return trimmed;
  }

  const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  const watchMatch = trimmed.match(/v=([a-zA-Z0-9_-]+)/);
  if (watchMatch?.[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch?.[1]) {
    return `https://www.youtube.com/embed/${shortsMatch[1]}`;
  }

  return null;
};

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [year, setYear] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [published, setPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setType("");
    setYear("");
    setDescription("");
    setTags("");
    setSortOrder("0");
    setPublished(true);
    setImageFile(null);
    setVideoUrl("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!title.trim()) {
      setStatus("Please add a project title.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imagePath: string | null = null;
      let embedUrl: string | null = null;

      if (imageFile) {
        const safeName = imageFile.name.replace(/\s+/g, "-").toLowerCase();
        const filePath = `projects/${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("portfolio-images")
          .upload(filePath, imageFile, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        imagePath = filePath;
      }

      if (videoUrl.trim()) {
        embedUrl = normalizeYouTubeUrl(videoUrl);
        if (!embedUrl) {
          setStatus("Please use a valid YouTube link.");
          setIsSubmitting(false);
          return;
        }
      }

      const tagList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      const { error } = await supabase.from("projects").insert({
        title: title.trim(),
        type: type.trim() || null,
        year: year.trim() || null,
        description: description.trim() || null,
        tags: tagList.length ? tagList : null,
        image_path: imagePath,
        video_url: embedUrl,
        sort_order: Number.parseInt(sortOrder, 10) || 0,
        published,
      });

      if (error) {
        throw error;
      }

      setStatus("Project added successfully.");
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add project.";
      setStatus(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground animate-fade-in">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <div className="mb-10 space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Dashboard</p>
          <h1 className="text-3xl sm:text-4xl font-display">Add a new project</h1>
          <p className="text-muted-foreground max-w-2xl">
            Upload images to the public bucket and publish new project introductions to your portfolio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-border/70 bg-card/80 p-8">
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Title</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Project title"
                className="w-full rounded-full border border-border/70 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Type</span>
              <input
                value={type}
                onChange={(event) => setType(event.target.value)}
                placeholder="Digital Experience"
                className="w-full rounded-full border border-border/70 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Year</span>
              <input
                value={year}
                onChange={(event) => setYear(event.target.value)}
                placeholder="2025"
                className="w-full rounded-full border border-border/70 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Sort order</span>
              <input
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                placeholder="0"
                className="w-full rounded-full border border-border/70 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm block">
            <span className="text-muted-foreground">Description</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Short project introduction"
              rows={4}
              className="w-full rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="space-y-2 text-sm block">
            <span className="text-muted-foreground">Tags (comma separated)</span>
            <input
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="Creative direction, UI design"
              className="w-full rounded-full border border-border/70 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <label className="space-y-2 text-sm block">
            <span className="text-muted-foreground">YouTube link (optional)</span>
            <input
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full rounded-full border border-border/70 bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </label>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) => setPublished(event.target.checked)}
                className="h-4 w-4 rounded border-border/70"
              />
              Publish immediately
            </label>

            <label className="inline-flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-sm">
                <Upload className="h-4 w-4" />
                {imageFile ? imageFile.name : "Upload image"}
              </span>
            </label>
          </div>

          {status && <p className="text-sm text-muted-foreground">{status}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Saving..." : "Add project"}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </form>
      </main>
    </div>
  );
};

export default Dashboard;
