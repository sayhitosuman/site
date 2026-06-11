import { useEffect, useRef } from "react";

function getTheme(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function createLattice(w: number, h: number): number[][] {
  const lat: number[][] = [];
  for (let y = 0; y < h; y++) {
    const row: number[] = [];
    for (let x = 0; x < w; x++) {
      row.push(Math.random());
    }
    lat.push(row);
  }
  return lat;
}

function valueNoise(
  cols: number,
  rows: number,
  lattice: number[][],
  offsetX: number,
  offsetY: number,
): number[][] {
  const latticeH = lattice.length;
  const latticeW = lattice[0].length;
  const map: number[][] = [];

  for (let y = 0; y < rows; y++) {
    const row: number[] = [];
    const fy = (y / (rows - 1)) * (latticeH - 1) + offsetY;
    const iy =
      ((Math.floor(fy) % latticeH) + latticeH) % latticeH;
    const fracY = fy - Math.floor(fy);
    const sy = fracY * fracY * (3 - 2 * fracY);

    for (let x = 0; x < cols; x++) {
      const fx = (x / (cols - 1)) * (latticeW - 1) + offsetX;
      const ix =
        ((Math.floor(fx) % latticeW) + latticeW) % latticeW;
      const fracX = fx - Math.floor(fx);
      const sx = fracX * fracX * (3 - 2 * fracX);

      const v00 = lattice[iy][ix];
      const v10 = lattice[iy][(ix + 1) % latticeW];
      const v01 = lattice[(iy + 1) % latticeH][ix];
      const v11 = lattice[(iy + 1) % latticeH][(ix + 1) % latticeW];

      const v0 = v00 + (v10 - v00) * sx;
      const v1 = v01 + (v11 - v01) * sx;
      row.push(v0 + (v1 - v0) * sy);
    }
    map.push(row);
  }

  return map;
}

function marchingSquares(
  map: number[][],
  level: number,
  cols: number,
  rows: number,
  out: number[],
) {
  for (let y = 0; y < rows - 1; y++) {
    const row = map[y];
    const nextRow = map[y + 1];
    for (let x = 0; x < cols - 1; x++) {
      const v00 = row[x];
      const v10 = row[x + 1];
      const v01 = nextRow[x];
      const v11 = nextRow[x + 1];

      let code = 0;
      if (v00 >= level) code |= 1;
      if (v10 >= level) code |= 2;
      if (v11 >= level) code |= 4;
      if (v01 >= level) code |= 8;

      if (code === 0 || code === 15) continue;

      const lerp = (a: number, b: number) => {
        const t = (level - a) / (b - a);
        return Number.isFinite(t) ? (t < 0 ? 0 : t > 1 ? 1 : t) : 0.5;
      };

      const tx = lerp(v00, v10);
      const ty = lerp(v10, v11);
      const bx = lerp(v01, v11);
      const ly = lerp(v00, v01);

      const topX = x + tx;
      const topY = y;
      const rightX = x + 1;
      const rightY = y + ty;
      const bottomX = x + bx;
      const bottomY = y + 1;
      const leftX = x;
      const leftY = y + ly;

      switch (code) {
        case 1:
        case 14:
          out.push(topX, topY, leftX, leftY);
          break;
        case 2:
        case 13:
          out.push(topX, topY, rightX, rightY);
          break;
        case 3:
        case 12:
          out.push(leftX, leftY, rightX, rightY);
          break;
        case 4:
        case 11:
          out.push(rightX, rightY, bottomX, bottomY);
          break;
        case 5:
        case 10:
          out.push(topX, topY, bottomX, bottomY);
          out.push(leftX, leftY, rightX, rightY);
          break;
        case 6:
        case 9:
          out.push(topX, topY, bottomX, bottomY);
          break;
        case 7:
        case 8:
          out.push(leftX, leftY, bottomX, bottomY);
          break;
      }
    }
  }
}

function draw(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  theme: "dark" | "light",
  scrollY: number,
  lattice: number[][],
) {
  ctx.clearRect(0, 0, w, h);

  const cellSize = 20;
  const cols = Math.ceil(w / cellSize) + 2;
  const rows = Math.ceil(h / cellSize) + 2;
  const numLevels = 10;
  const offsetX = scrollY * 0.0008;
  const offsetY = scrollY * 0.0015;

  const map = valueNoise(cols, rows, lattice, offsetX, offsetY);
  ctx.lineWidth = 1;

  const segs: number[] = [];

  for (let i = 0; i < numLevels; i++) {
    const level = (i + 0.5) / numLevels;
    segs.length = 0;
    marchingSquares(map, level, cols, rows, segs);

    if (segs.length === 0) continue;

    const hue = (i * 31 + 10) % 360;
    ctx.strokeStyle =
      theme === "dark"
        ? `hsla(${hue}, 18%, 48%, 0.06)`
        : `hsla(${hue}, 15%, 55%, 0.04)`;
    ctx.beginPath();
    for (let j = 0; j < segs.length; j += 4) {
      ctx.moveTo((segs[j] - 1) * cellSize, (segs[j + 1] - 1) * cellSize);
      ctx.lineTo((segs[j + 2] - 1) * cellSize, (segs[j + 3] - 1) * cellSize);
    }
    ctx.stroke();
  }
}

export default function TopoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const latticeRef = useRef<number[][] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!latticeRef.current) {
      latticeRef.current = createLattice(5, 4);
    }
    const lattice = latticeRef.current;

    let theme = getTheme();
    let rafId: number | null = null;
    let scrollY = 0;

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h, theme, scrollY, lattice);
    };

    const scheduleRender = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          render();
        });
      }
    };

    render();

    const onScroll = () => {
      const s = window.scrollY;
      if (Math.abs(s - scrollY) > 2) {
        scrollY = s;
        scheduleRender();
      }
    };

    const onResize = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      scheduleRender();
    };

    const themeObserver = new MutationObserver(() => {
      const newTheme = getTheme();
      if (newTheme !== theme) {
        theme = newTheme;
        scheduleRender();
      }
    });

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
