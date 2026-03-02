import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const nav = [
  { path: "/", label: "~", sectionId: "greeting" },
  { path: "/projects", label: "projects", sectionId: "projects" },
  { path: "/blogs", label: "blogs", sectionId: "blogs" },
  { path: "/publications", label: "pubs", sectionId: "publications" },
  { path: "/notes", label: "notes", sectionId: "notes" },
  { path: "/brain-dump", label: "brain-dump", sectionId: "brain-dump" },
  { path: "/contact", label: "contact", sectionId: "contact" },
];

function getDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("darkMode");
  if (stored !== null) return stored === "true";
  return false;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState("greeting");
  const [dark, setDark] = useState(getDarkMode);
  const rafRef = useRef<number | null>(null);

  // Handle scrollTo state when navigating back to homepage
  useEffect(() => {
    if (isHome && location.state?.scrollTo) {
      // Small delay to let the page render before scrolling
      const timer = setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
      // Clear the state so it doesn't re-scroll on re-renders
      window.history.replaceState({}, "");
      return () => clearTimeout(timer);
    }
  }, [isHome, location.state]);

  // Scroll to top on route change (skip if scrollTo state is set)
  useEffect(() => {
    if (!location.state?.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  // Apply dark class to <html>
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", String(dark));
  }, [dark]);

  useEffect(() => {
    if (!isHome) {
      setActiveSection("");
      return;
    }

    const getActive = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.3;
      const sectionIds = nav.map((n) => n.sectionId).filter(Boolean);

      // If scrolled to the bottom, highlight the last section
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (atBottom) return sectionIds[sectionIds.length - 1];

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) {
          current = id;
        }
      }
      return current;
    };

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setActiveSection(getActive());
      });
    };

    setActiveSection(getActive());
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHome]);

  function isActive(n: (typeof nav)[0]) {
    if (isHome) return activeSection === n.sectionId;
    return pathname === n.path || pathname.startsWith(n.path + "/");
  }

  return (
    <div className="min-h-screen flex">
      {/* Dark mode toggle — top right */}
      <button
        onClick={() => setDark(!dark)}
        aria-label="Toggle dark mode"
        className="fixed top-6 right-6 z-50 px-2.5 py-1.5 flex items-center justify-center transition-all duration-300 cursor-pointer font-mono text-[11px] tracking-wider uppercase"
        style={{
          background: 'transparent',
          border: `1px solid ${dark ? '#444' : '#ccc'}`,
          color: dark ? '#888' : '#999',
        }}
      >
        {dark ? 'light' : 'dark'}
      </button>

      {/* Left sidebar */}
      <nav className="fixed left-20 top-0 h-full w-36 hidden lg:flex flex-col justify-center gap-2.5 z-50">
        {nav.map((n) => (
          <Link
            key={n.path}
            to={n.path}
            onClick={(e) => {
              if (isHome && n.sectionId) {
                // On homepage: scroll to section
                e.preventDefault();
                const el = document.getElementById(n.sectionId);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              } else if (!isHome && (pathname === n.path || pathname.startsWith(n.path + "/")) && n.path !== "/") {
                // On the same page as the nav item: go back to homepage section
                e.preventDefault();
                navigate("/", { state: { scrollTo: n.sectionId } });
              }
              // Otherwise: default Link navigation to the page
            }}
            className={`text-[13px] tracking-wide font-mono transition-all duration-300 ease-out no-underline font-light ${isActive(n)
              ? `!text-[#f34e0c] underline underline-offset-4 decoration-1 decoration-[#f34e0c] ${isHome || n.path === "/contact" ? "font-light" : "font-normal"}`
              : dark
                ? "!text-[#6db8cc]/70 hover:!text-[#6db8cc] hover:underline underline-offset-4 decoration-[#6db8cc]/30"
                : "!text-[#3a5f73]/70 hover:!text-[#3a5f73] hover:underline underline-offset-4 decoration-[#3a5f73]/30"
              }`}
          >
            /{n.label}
          </Link>
        ))}
      </nav>

      {/* Main content */}
      <main className="w-full max-w-[620px] mx-auto px-6 py-16 lg:py-24">
        {children}

        <footer className="mt-20 text-center">
          <p className="text-sm text-[var(--color-muted)] font-light italic font-[var(--font-serif)]">
            ~end
          </p>
        </footer>
      </main>
    </div>
  );
}
