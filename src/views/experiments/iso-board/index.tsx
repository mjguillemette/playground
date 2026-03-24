import { useState, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import { experiments } from "@/experiments";
import { Board } from "./Board";
import { generateTerrain, type HeightLevel } from "./terrain";

const meta = experiments.find((e) => e.id === "iso-board")!;
const GRID_SIZE = 20;

// ---------------------------------------------------------------------------
// Legend pill
// ---------------------------------------------------------------------------

const LEGEND_ITEMS: { label: string; color: string }[] = [
  { label: "Deep Ocean",    color: "#0b1d30" },
  { label: "Ocean",         color: "#163555" },
  { label: "Shallow Water", color: "#1e5480" },
  { label: "Beach",         color: "#d6c07a" },
  { label: "Plains",        color: "#5c8c3e" },
  { label: "Forest",        color: "#4a7230" },
  { label: "Dense Forest",  color: "#3a5c25" },
  { label: "Mountain",      color: "#7a6655" },
  { label: "Peak",          color: "#eeece8" },
];

// ---------------------------------------------------------------------------
// Main view
// ---------------------------------------------------------------------------

export function IsoBoard() {
  const [terrain,  setTerrain ] = useState<HeightLevel[][]>(() => generateTerrain(GRID_SIZE));
  const [freeMode, setFreeMode] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const seedRef = useRef(0);

  /** Generate a fresh map with a new seed */
  const randomize = useCallback(() => {
    seedRef.current = Math.floor(Math.random() * 99_999);
    setTerrain(generateTerrain(GRID_SIZE, seedRef.current));
  }, []);

  /** F key toggles free-camera mode */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.key === "f" || e.key === "F") && !e.metaKey && !e.ctrlKey) {
        setFreeMode((m) => !m);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative flex h-full flex-col select-none">

      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 px-6 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            All experiments
          </Link>
          <span className="text-zinc-700">/</span>
          <span className="text-xs font-medium text-zinc-300">{meta.title}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {meta.tags.map((tag) => (
            <span key={tag} className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Canvas ──────────────────────────────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">
        <Canvas
          orthographic
          camera={{ position: [20, 20, 20], zoom: 42, near: 0.01, far: 400 }}
          shadows="soft"
          dpr={[1, 2]}
        >
          <Board heightMap={terrain} freeMode={freeMode} />
        </Canvas>

        {/* ── Free-camera mode banner ──── */}
        {freeMode && (
          <div className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2">
            <div className="flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
              Free camera — drag to orbit · scroll to zoom · press F to lock
            </div>
          </div>
        )}

        {/* ── Top-right controls ──────── */}
        <div className="absolute right-4 top-3 flex items-center gap-2">
          {/* Legend toggle */}
          <button
            onClick={() => setShowLegend((s) => !s)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              showLegend
                ? "border-zinc-500/50 bg-zinc-700/50 text-zinc-200"
                : "border-white/10 bg-zinc-900/70 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
            } backdrop-blur-sm`}
          >
            Legend
          </button>

          {/* Free-camera toggle */}
          <button
            onClick={() => setFreeMode((m) => !m)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
              freeMode
                ? "border-indigo-500/50 bg-indigo-500/20 text-indigo-300"
                : "border-white/10 bg-zinc-900/70 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
            } backdrop-blur-sm`}
          >
            {freeMode ? "Lock camera" : "Free camera"}
          </button>

          {/* Randomise */}
          <button
            onClick={randomize}
            className="rounded-md border border-white/10 bg-zinc-900/70 px-3 py-1.5 text-xs font-medium text-zinc-400 backdrop-blur-sm transition-colors hover:border-white/20 hover:text-zinc-200"
          >
            Randomize
          </button>
        </div>

        {/* ── Legend panel ────────────── */}
        {showLegend && (
          <div className="absolute right-4 top-14 rounded-xl border border-white/5 bg-zinc-900/90 p-4 backdrop-blur-sm">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Terrain
            </p>
            <div className="space-y-1.5">
              {LEGEND_ITEMS.map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-sm ring-1 ring-white/10"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs text-zinc-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Bottom-left controls hint ── */}
        <div className="pointer-events-none absolute bottom-4 left-4">
          <div className="flex flex-col gap-1 rounded-lg border border-white/5 bg-zinc-950/70 px-3 py-2 backdrop-blur-sm">
            {[
              ["↑ ↓ ← →",  "Pan"],
              ["Scroll",    "Zoom"],
              ["F",         "Toggle free camera"],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                  {key}
                </kbd>
                <span className="text-[11px] text-zinc-600">{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
