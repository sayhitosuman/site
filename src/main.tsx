import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { initGlitchLoader } from "./utils/glitch-loader";
import { preloadAll } from "./data";

const mount = () => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

// Start preloading in background and show loader; when loader completes, mount app.
preloadAll().catch(() => {});

const resolvedTheme = (() => {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem("darkMode");
  if (stored !== null) return stored === "true" ? "dark" : "light";
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
})();

initGlitchLoader({ text: 'sayhitosuman', theme: resolvedTheme, onComplete: mount, holdDuration: 800 });
