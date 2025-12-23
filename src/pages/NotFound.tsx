import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground animate-fade-in px-6">
      <div className="max-w-md rounded-[2rem] border border-border/70 bg-card/80 p-10 text-center animate-slide-up">
        <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Lost thread</p>
        <h1 className="mt-4 text-5xl font-display">404</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This page drifted away. Let’s return to the main portfolio.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
        >
          Back to home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
