import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import TopoBackground from "./TopoBackground";


const nav = [
  { path: "/", label: "~", sectionId: "greeting" },
  { path: "/projects", label: "projects", sectionId: "projects" },
  { path: "/blogs", label: "blogs", sectionId: "blogs" },
  { path: "/publications", label: "resources", sectionId: "publications" },
  { path: "/notes", label: "notes", sectionId: "notes" },
  { path: "/brain-dump", label: "brain-dump", sectionId: "brain-dump" },
  { path: "/contact", label: "contact", sectionId: "contact" },
];

function getDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem("darkMode");
  if (stored !== null) return stored === "true";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isHome = pathname === "/";
  const [activeSection, setActiveSection] = useState("greeting");
  const [dark, setDark] = useState(getDarkMode);
  const [showBars, setShowBars] = useState(true);
  const rafRef = useRef<number | null>(null);
  const scrollHideRef = useRef<number | null>(null);

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
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;
      if (atBottom) return sectionIds[sectionIds.length - 1];

      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const offsetTop = rect.top + window.scrollY;
          if (offsetTop <= scrollY) {
            current = id;
          }
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

  // Hide top/bottom bars on scroll down, show on scroll up (mobile only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastY = window.scrollY || 0;
    const onScroll = () => {
      if (scrollHideRef.current) cancelAnimationFrame(scrollHideRef.current);
      scrollHideRef.current = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        // scroll down -> hide; scroll up -> show. Add small hysteresis.
        if (y - lastY > 10 && y > 60) {
          setShowBars(false);
        } else if (lastY - y > 10) {
          setShowBars(true);
        }
        lastY = y;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (scrollHideRef.current) cancelAnimationFrame(scrollHideRef.current);
    };
  }, []);

  function isActive(n: (typeof nav)[0]) {
    if (isHome) return activeSection === n.sectionId;
    return pathname === n.path || pathname.startsWith(n.path + "/");
  }

  return (
    <div className="min-h-screen flex">
      <TopoBackground />
      {/* Top bar (mobile) shown first; bottom bar moved after main content */}

      {/* Top bar: favicon, home link, and dark mode toggle */}
      <nav
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 border-b"
        style={{
          background: dark ? 'rgba(20, 21, 23, 0.95)' : 'rgba(211, 211, 211, 0.95)',
          borderColor: dark ? '#444' : '#ccc',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transform: showBars ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 220ms ease, opacity 220ms ease',
          opacity: showBars ? 1 : 0,
        }}
      >
        <Link to="/" className="flex items-center gap-1 no-underline">
          <span className="text-2xl font-bold" style={{ fontFamily: "'Economica', sans-serif", color: dark ? '#ffffff' : '#000000' }}>
            S
          </span>
          <span className="text-base font-semibold" style={{ fontFamily: "'Economica', sans-serif", color: dark ? '#ffffff' : '#000000', letterSpacing: '-0.03em' }}>
            ayhitosuman
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="px-3 py-1.5 text-xs tracking-widest uppercase font-bold transition-all duration-300"
            style={{
              fontFamily: "'Economica', sans-serif",
              color: dark ? '#ffffff' : '#000000',
            }}
          >
            home
          </Link>
          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle dark mode"
            className="px-3 py-1.5 flex items-center justify-center transition-all duration-300 cursor-pointer text-xs tracking-widest uppercase font-bold"
            style={{
              fontFamily: "'Economica', sans-serif",
              background: dark ? '#333' : '#f0f0f0',
              border: `1.5px solid ${dark ? '#555' : '#999'}`,
              color: dark ? '#ffffff' : '#000000',
            }}
          >
            {dark ? 'light' : 'dark'}
          </button>
        </div>
      </nav>

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
            className={`text-sm tracking-wide font-bold transition-all duration-300 ease-out no-underline ${isActive(n)
              ? `!text-[#f34e0c] underline underline-offset-4 decoration-1.5 decoration-[#f34e0c]`
              : dark
                ? "!text-[#6db8cc]/80 hover:!text-[#6db8cc] hover:underline underline-offset-4 decoration-[#6db8cc]/40"
                : "!text-[#333]/80 hover:!text-[#000] hover:underline underline-offset-4 decoration-[#333]/50"
              }`}
            style={{ fontFamily: "'Economica', sans-serif" }}
          >
            /{n.label}
          </Link>
        ))}
        
        {/* Dark mode toggle for desktop */}
        <button
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
          className="mt-6 px-3 py-2 flex items-center justify-center transition-all duration-300 cursor-pointer text-xs font-bold tracking-widest uppercase"
          style={{
            fontFamily: "'Economica', sans-serif",
            background: dark ? '#333' : '#f0f0f0',
            border: `1.5px solid ${dark ? '#555' : '#999'}`,
            color: dark ? '#ffffff' : '#000000',
          }}
        >
          {dark ? 'light' : 'dark'}
        </button>
      </nav>

      {/* Main content */}
      <main key={pathname} className="w-full max-w-[620px] mx-auto px-6 pt-16 lg:pt-24 pb-24 lg:pb-24 animate-fade-in">
        {children}

        <footer className="mt-20 text-center">
          <p className="text-sm text-[var(--color-muted)] font-light italic font-[var(--font-serif)]">
            ~end
          </p>
        </footer>
      </main>

      {/* Bottom Navigation Bar - mobile only (moved here) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-3 border-t overflow-x-auto gap-1.5"
        style={{
          background: dark ? 'rgba(20, 21, 23, 0.95)' : 'rgba(211, 211, 211, 0.95)',
          borderColor: dark ? '#444' : '#ccc',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transform: showBars ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 220ms ease, opacity 220ms ease',
          opacity: showBars ? 1 : 0,
        }}
      >
        {nav.filter((n) => n.path !== "/").map((n) => (
          <Link
            key={n.path}
            to={n.path}
            onClick={(e) => {
              if (isHome && n.sectionId) {
                e.preventDefault();
                const el = document.getElementById(n.sectionId);
                if (el) el.scrollIntoView({ behavior: "smooth" });
              } else if (!isHome && (pathname === n.path || pathname.startsWith(n.path + "/")) && n.path !== "/") {
                e.preventDefault();
                navigate("/", { state: { scrollTo: n.sectionId } });
              }
            }}
            className={`text-sm font-black tracking-wide transition-all duration-300 no-underline py-2 px-2.5 whitespace-nowrap ${
              isActive(n)
                ? "!text-[#f34e0c]"
                : dark ? "!text-white/70 hover:!text-white" : "!text-[#000] hover:!text-[#000]"
            }`}
            style={{ fontFamily: "'Economica', sans-serif" }}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
