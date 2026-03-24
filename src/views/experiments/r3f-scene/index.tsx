import { Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { experiments } from "@/experiments";

const Scene = lazy(() =>
  import("@/components/three/Scene").then((m) => ({ default: m.Scene }))
);

const meta = experiments.find((e) => e.id === "r3f-scene")!;

export function R3FScene() {
  return (
    <div className="relative flex h-full flex-col">
      {/* Experiment header bar */}
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
            <span
              key={tag}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-zinc-500"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Full-bleed canvas */}
      <div className="relative flex-1 bg-[#09090b]">
        <Suspense fallback={null}>
          <Scene />
        </Suspense>

        {/* Vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, #09090b 100%)",
          }}
        />

        {/* Centered label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-indigo-400/60">
            r3f · three.js
          </p>
          <p className="mt-2 text-[11px] text-zinc-700">
            Particle field · wireframe icosahedron · orbital rings
          </p>
        </div>
      </div>
    </div>
  );
}
