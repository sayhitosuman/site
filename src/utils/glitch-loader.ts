export interface GlitchLoaderOptions {
  /** The text to reveal. Default: 'sayhitosuman' */
  text?: string;
  /** Theme to use for the loader. Defaults to system preference. */
  theme?: "dark" | "light";
  /** Called when the loader finishes and fades out */
  onComplete?: () => void;
  /** ms to hold the fully-revealed text before fading. Default: 900 */
  holdDuration?: number;
  /** Container to mount into. Default: document.body */
  container?: HTMLElement;
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/\\~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function rand(pool: string): string {
  return pool[Math.floor(Math.random() * pool.length)];
}

export function initGlitchLoader(opts: GlitchLoaderOptions = {}): () => void {
  const {
    text = 'sayhitosuman',
    theme,
    onComplete,
    holdDuration = 900,
    container = document.body,
  } = opts;

  const resolvedTheme = theme ?? (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  const background = resolvedTheme === "dark" ? "#080808" : "#f5f5f5";
  const borderColor = resolvedTheme === "dark" ? "#444" : "#ccc";
  const textColor = resolvedTheme === "dark" ? "#e2e2e2" : "#111";
  const subtitleColor = resolvedTheme === "dark" ? "#999" : "#555";

  // ── Overlay ──────────────────────────────────────────────────
  const overlay = document.createElement('div');
  overlay.id = 'glitch-loader-overlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: ${background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    z-index: 9999;
    padding: 28px;
    border: 1px solid ${borderColor};
    transition: opacity 0.55s ease;
  `;

  // Main text display
  const display = document.createElement('div');
  display.style.cssText = `
    font-family: 'Lucida Console', 'Courier New', monospace;
    font-size: clamp(24px, 4vw, 52px);
    letter-spacing: 0.24em;
    font-weight: 800;
    line-height: 1;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
    user-select: none;
    pointer-events: none;
    color: ${textColor};
  `;

  // Subtle subtitle that fades in after reveal
  const sub = document.createElement('div');
  sub.style.cssText = `
    font-family: 'Lucida Console', monospace;
    font-size: clamp(11px, 1.2vw, 14px);
    letter-spacing: 0.35em;
    color: ${subtitleColor};
    margin-top: 12px;
    opacity: 0;
    transition: opacity 0.6s ease;
    user-select: none;
    pointer-events: none;
    text-transform: uppercase;
  `;
  sub.textContent = '[ loading ]';

  const info = document.createElement('div');
  info.style.cssText = `
    font-family: 'Lucida Console', monospace;
    font-size: 12px;
    letter-spacing: 0.24em;
    color: ${subtitleColor};
    text-transform: uppercase;
    opacity: 0.9;
  `;
  info.textContent = `landing · ${new Date().toLocaleDateString()} · cached startup`;

  overlay.appendChild(display);
  overlay.appendChild(sub);
  overlay.appendChild(info);
  container.appendChild(overlay);

  // ── State ────────────────────────────────────────────────────
  const chars = text.split('');
  const RESOLVE_FRAME_START = 6; // frames before first char starts resolving
  const FRAMES_PER_CHAR = 6;     // frames between each char starting to resolve
  const SCRAMBLE_ROUNDS = 10;    // how many random frames before locking

  type CharState = 'noise' | 'scrambling' | 'locked';
  const states: CharState[] = chars.map(() => 'noise');
  const scrambleCount: number[] = chars.map(() => 0);
  const currentChars: string[] = chars.map(() => rand(GLITCH_CHARS));

  let frame = 0;
  let allLocked = false;
  let holdTimer: ReturnType<typeof setTimeout> | null = null;
  let rafId: number;

  // ── Render ───────────────────────────────────────────────────
  function render(): void {
    let html = '';
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === ' ') {
        html += '<span style="display:inline-block;width:0.5em"></span>';
        continue;
      }

      if (states[i] === 'locked') {
        html += `<span style="color:#e2e2e2">${chars[i]}</span>`;
      } else if (states[i] === 'scrambling') {
        const progress = scrambleCount[i] / SCRAMBLE_ROUNDS;
        const r = 251;
        const g = Math.floor(180 + progress * 40);
        const b = Math.floor(20 + progress * 20);
        html += `<span style="color:rgb(${r},${g},${b});font-weight:900">${currentChars[i]}</span>`;
      } else {
        const brightness = Math.floor(Math.random() * 55 + 20);
        html += `<span style="color:rgb(${brightness},${brightness},${brightness})">${currentChars[i]}</span>`;
      }
    }
    display.innerHTML = html;
  }

  // ── Fade out ─────────────────────────────────────────────────
  function fadeOut(): void {
    cancelAnimationFrame(rafId);
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      onComplete?.();
    }, 580);
  }

  // ── Tick ─────────────────────────────────────────────────────
  function tick(): void {
    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === ' ') continue;

      const resolveStartFrame = RESOLVE_FRAME_START + i * FRAMES_PER_CHAR;

      if (states[i] === 'noise') {
        currentChars[i] = rand(GLITCH_CHARS);
        if (frame >= resolveStartFrame) {
          states[i] = 'scrambling';
        }
      } else if (states[i] === 'scrambling') {
        scrambleCount[i]++;
        currentChars[i] = rand(GLITCH_CHARS);
        if (scrambleCount[i] >= SCRAMBLE_ROUNDS) {
          states[i] = 'locked';
          currentChars[i] = chars[i];
        }
      }
    }

    render();
    frame++;

    const nonSpaceLocked = chars.every((c, i) => c === ' ' || states[i] === 'locked');
    if (nonSpaceLocked && !allLocked) {
      allLocked = true;
      sub.style.opacity = '1';
      sub.textContent = '[ ready ]';
      holdTimer = setTimeout(fadeOut, holdDuration);
    }

    if (!allLocked) {
      rafId = requestAnimationFrame(tick);
    }
  }

  setTimeout(() => { rafId = requestAnimationFrame(tick); }, 120);

  return () => {
    cancelAnimationFrame(rafId);
    if (holdTimer) clearTimeout(holdTimer);
    overlay.remove();
  };
}
