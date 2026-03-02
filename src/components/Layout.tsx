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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      {/* Mobile Floating Menu Button - visible only on smaller screens */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Open mobile menu"
        className="fixed bottom-8 right-8 z-50 w-11 h-11 flex items-center justify-center lg:hidden transition-all duration-300 cursor-pointer shadow-lg outline-hidden"
        style={{
          background: dark ? 'rgba(25, 27, 29, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          border: `1px solid ${dark ? '#333' : '#eee'}`,
          color: dark ? '#f34e0c' : '#f34e0c',
          backdropFilter: 'blur(10px)',
          borderRadius: '0px',
        }}
      >
        {isMenuOpen ? (
          <span className="text-xl font-light transform transition-transform duration-300">×</span>
        ) : (
          <div className="flex flex-col gap-[4px] items-center">
            <div className="w-4 h-[1px]" style={{ background: dark ? '#f34e0c' : '#f34e0c' }} />
            <div className="w-4 h-[1px]" style={{ background: dark ? '#f34e0c' : '#f34e0c' }} />
            <div className="w-4 h-[1px]" style={{ background: dark ? '#f34e0c' : '#f34e0c' }} />
          </div>
        )}
      </button>

      {/* Mobile Menu Content */}
      <div
        className={`fixed bottom-24 right-8 z-50 p-6 flex flex-col items-end gap-6 lg:hidden transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] border origin-bottom-right shadow-2xl ${isMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4 pointer-events-none"
          }`}
        style={{
          background: dark ? 'rgba(15, 17, 19, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderColor: dark ? '#333' : '#eee',
          backdropFilter: 'blur(15px)',
          borderRadius: '0px',
        }}
      >
        {nav.map((n) => (
          <Link
            key={n.path}
            to={n.path}
            onClick={(e) => {
              setIsMenuOpen(false);
              if (isHome && n.sectionId) {
                e.preventDefault();
                const el = document.getElementById(n.sectionId);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              } else if (!isHome && (pathname === n.path || pathname.startsWith(n.path + "/")) && n.path !== "/") {
                e.preventDefault();
                navigate("/", { state: { scrollTo: n.sectionId } });
              }
            }}
            className={`text-[13px] tracking-[0.2em] font-mono no-underline uppercase transition-all duration-300 ${isActive(n)
              ? "!text-[#f34e0c] font-medium underline underline-offset-4 decoration-1"
              : dark ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"
              }`}
          >
            {n.label}
          </Link>
        ))}

        <div className="h-[1px] w-full mt-2" style={{ background: dark ? '#222' : '#f0f0f0' }} />

        <button
          onClick={() => {
            setDark(!dark);
            setIsMenuOpen(false);
          }}
          className="text-[10px] font-mono uppercase tracking-[0.3em] font-semibold py-1 px-2 transition-all flex items-center gap-2"
          style={{
            color: dark ? '#fff' : '#000',
            border: `1px solid ${dark ? '#333' : '#eee'}`,
          }}
        >
          {dark ? 'LIGHT MODE' : 'DARK MODE'}
        </button>
      </div>

      {/* Overlay for closing menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/5 lg:hidden backdrop-blur-[1px]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Dark mode toggle — top right */}
      <button
        onClick={() => setDark(!dark)}
        aria-label="Toggle dark mode"
        className="fixed top-6 right-6 z-50 px-2.5 py-1.5 hidden lg:flex items-center justify-center transition-all duration-300 cursor-pointer font-mono text-[11px] tracking-wider uppercase"
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
