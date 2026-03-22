import { lazy, Suspense } from "react";
import { Providers } from "@/providers";

const Scene = lazy(() => import("@/components/three/Scene").then((m) => ({ default: m.Scene })));

const features = [
  {
    title: "Structured Pathways",
    body: "Curated sequences that build from fundamentals to mastery.",
  },
  {
    title: "Active Recall",
    body: "Spaced repetition and retrieval practice baked in by design.",
  },
  {
    title: "Deep Connections",
    body: "Link concepts across domains to form a resilient mental model.",
  },
];

export default function App() {
  return (
    <Providers>
      <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">
        {/* 3D canvas — full bleed background */}
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </div>

        {/* Radial vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, #09090b 100%)",
          }}
        />

        {/* Nav */}
        <nav className="relative z-20 flex items-center justify-between px-8 py-6">
          <span className="text-sm font-semibold tracking-widest text-indigo-400 uppercase">
            CF
          </span>
          <div className="flex items-center gap-8 text-sm text-zinc-400">
            <a href="#about" className="transition-colors hover:text-white">
              About
            </a>
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a
              href="#get-started"
              className="rounded-full border border-indigo-500/50 bg-indigo-500/10 px-4 py-1.5 text-indigo-300 transition-all hover:border-indigo-400 hover:bg-indigo-500/20"
            >
              Get started
            </a>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative z-20 flex flex-col items-center justify-center px-6 pt-32 pb-48 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs text-indigo-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            Early access — now building
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            The{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-300 bg-clip-text text-transparent">
              Comprehension
            </span>{" "}
            Framework
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
            A structured system for turning raw information into deep, lasting
            understanding. Built for learners who want more than surface-level knowledge.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#get-started"
              className="rounded-full bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40"
            >
              Start learning
            </a>
            <a
              href="#about"
              className="rounded-full border border-white/10 px-8 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-white/20 hover:text-white"
            >
              Learn more
            </a>
          </div>
        </section>

        {/* Feature strip */}
        <section
          id="features"
          className="relative z-20 border-t border-white/5 bg-white/[0.02] backdrop-blur-sm"
        >
          <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-white/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {features.map((f) => (
              <div key={f.title} className="px-10 py-12">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-400">
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-500">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </Providers>
  );
}
