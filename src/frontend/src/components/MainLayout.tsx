import CenterFeed from "./CenterFeed";
import Header from "./Header";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex-1 max-w-[1280px] mx-auto w-full px-3 py-3 grid grid-cols-1 lg:grid-cols-[220px_1fr_240px] gap-3">
        <aside className="hidden lg:block">
          <LeftSidebar />
        </aside>
        <main>
          <CenterFeed />
        </main>
        <aside className="hidden lg:block">
          <RightSidebar />
        </aside>
      </div>
      <footer className="border-t border-border bg-card mt-2">
        <div className="max-w-[1280px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-3 text-xs text-muted-foreground">
            <button type="button" className="hover:text-foreground">
              About
            </button>
            <button type="button" className="hover:text-foreground">
              Help
            </button>
            <button type="button" className="hover:text-foreground">
              Privacy
            </button>
            <button type="button" className="hover:text-foreground">
              Terms
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
